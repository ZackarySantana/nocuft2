import type {
    HighArgument,
    HighExpression,
    HighFunction,
    HighIntrinsicStatement,
    HighModule,
} from "@nocuft/dfir";
import { resolve } from "node:path";
import * as ts from "typescript/unstable/ast";
import {
    API,
    SymbolFlags,
    type Checker,
    type Diagnostic,
    type Symbol as TypeScriptSymbol,
} from "typescript/unstable/sync";
import { playerIntrinsics } from "./generated/player-intrinsics.js";

export interface AnalyzeTypeScriptOptions {
    tsconfigPath: string;
    entryFile: string;
}

export function analyzeTypeScript(
    options: AnalyzeTypeScriptOptions,
): HighModule {
    const absoluteEntryFile = resolve(options.entryFile);
    const expectedConfigFile = resolve(options.tsconfigPath);
    const api = new API();

    try {
        const snapshot = api.updateSnapshot({
            openProjects: [expectedConfigFile],
            openFiles: [absoluteEntryFile],
        });
        try {
            const project = snapshot.getProject(expectedConfigFile);
            if (!project) {
                throw new Error(
                    `TypeScript did not load project ${expectedConfigFile}`,
                );
            }

            const sourceFile = project.program.getSourceFile(absoluteEntryFile);
            if (!sourceFile) {
                throw new Error(
                    `Entry file is not part of ${expectedConfigFile}: ${absoluteEntryFile}`,
                );
            }

            const diagnostics = [
                ...project.program.getProgramDiagnostics(),
                ...project.program.getSyntacticDiagnostics(absoluteEntryFile),
                ...project.program.getBindDiagnostics(absoluteEntryFile),
                ...project.program.getSemanticDiagnostics(absoluteEntryFile),
            ];
            if (diagnostics.length > 0) {
                throw new Error(formatDiagnostics(diagnostics));
            }

            const functions = sourceFile.statements.flatMap((statement) => {
                if (!ts.isFunctionDeclaration(statement)) {
                    return [];
                }
                if (!isExported(statement)) {
                    return [];
                }

                return [analyzeFunction(statement, project.checker)];
            });

            return {
                kind: "module",
                functions,
            };
        } finally {
            snapshot.dispose();
        }
    } finally {
        api.close();
    }
}

function formatDiagnostics(diagnostics: readonly Diagnostic[]): string {
    return diagnostics
        .map((diagnostic) => {
            const location =
                diagnostic.fileName === undefined
                    ? ""
                    : `${diagnostic.fileName}:${diagnostic.pos} `;
            return `${location}${diagnostic.text}`;
        })
        .join("\n");
}

function isExported(node: ts.FunctionDeclaration): boolean {
    return (
        node.modifiers?.some(
            (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
        ) ?? false
    );
}

function analyzeFunction(
    declaration: ts.FunctionDeclaration,
    checker: Checker,
): HighFunction {
    if (!declaration.name || !declaration.body) {
        throw new Error("Exported functions must have a name and body");
    }

    const body = declaration.body.statements.map((statement) => {
        if (
            !ts.isExpressionStatement(statement) ||
            !ts.isCallExpression(statement.expression)
        ) {
            throw unsupported(statement, "function statement");
        }

        return analyzeIntrinsicCall(statement.expression, checker);
    });

    return {
        kind: "function",
        name: declaration.name.text,
        body,
    };
}

function analyzeIntrinsicCall(
    call: ts.CallExpression,
    checker: Checker,
): HighIntrinsicStatement {
    if (!ts.isPropertyAccessExpression(call.expression)) {
        throw unsupported(call, "intrinsic call");
    }

    const methodNode = call.expression.name;
    const method = methodNode.text;
    const binding = playerIntrinsics[method as keyof typeof playerIntrinsics];

    if (
        !binding ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(methodNode),
            method,
            "/generated/player-actions.d.ts",
            checker,
        )
    ) {
        throw unsupported(call, "player intrinsic");
    }

    analyzeAllPlayersReceiver(call.expression.expression, checker);

    const argumentsByName: Record<string, HighArgument> = {};
    for (const parameter of binding.parameters) {
        if (parameter.kind === "rest") {
            const expressions = call.arguments
                .slice(parameter.sourceIndex)
                .map((argument) =>
                    analyzeExpression(argument, parameter.types, checker),
                );
            if (expressions.length < parameter.minimumLength) {
                throw new Error(
                    `Expected at least ${parameter.minimumLength} arguments for ${parameter.input} in ${method}`,
                );
            }
            argumentsByName[parameter.input] = expressions;
            continue;
        }

        const argument = call.arguments[parameter.sourceIndex];
        if (!argument || isUndefined(argument, checker)) {
            if (!parameter.optional) {
                throw new Error(
                    `Missing required argument ${parameter.input} for ${method}`,
                );
            }
            continue;
        }

        if (parameter.kind === "array") {
            if (!ts.isArrayLiteralExpression(argument)) {
                throw unsupported(argument, "array literal argument");
            }
            const expressions = argument.elements.map((element) => {
                if (ts.isSpreadElement(element)) {
                    throw unsupported(element, "array element");
                }
                return analyzeExpression(element, parameter.types, checker);
            });
            if (expressions.length < parameter.minimumLength) {
                throw new Error(
                    `Expected at least ${parameter.minimumLength} values for ${parameter.input} in ${method}`,
                );
            }
            argumentsByName[parameter.input] = expressions;
            continue;
        }

        argumentsByName[parameter.input] = analyzeExpression(
            argument,
            parameter.types,
            checker,
        );
    }

    const intrinsicOptions =
        "optionsIndex" in binding
            ? analyzeOptions(call, binding, checker)
            : undefined;

    return {
        kind: "intrinsic",
        operation: binding.operation,
        receiver: {
            kind: "player_selection",
            selection: "all",
        },
        arguments: argumentsByName,
        ...(intrinsicOptions === undefined
            ? {}
            : { options: intrinsicOptions }),
    };
}

function analyzeAllPlayersReceiver(
    expression: ts.Expression,
    checker: Checker,
): void {
    if (
        !ts.isCallExpression(expression) ||
        !ts.isPropertyAccessExpression(expression.expression) ||
        expression.expression.name.text !== "all" ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(expression.expression.name),
            "all",
            "/players.d.ts",
            checker,
        )
    ) {
        throw unsupported(expression, "all-player receiver");
    }
}

function isSdkSymbol(
    symbol: TypeScriptSymbol | undefined,
    expectedName: string,
    declarationSuffix: string,
    checker: Checker,
): boolean {
    const resolved = resolveAliasedSymbol(symbol, checker);
    return (
        resolved?.name === expectedName &&
        (resolved.declarations?.some((declaration) =>
            declaration.path.replaceAll("\\", "/").endsWith(declarationSuffix),
        ) ??
            false)
    );
}

function resolveAliasedSymbol(
    symbol: TypeScriptSymbol | undefined,
    checker: Checker,
): TypeScriptSymbol | undefined {
    if (!symbol) {
        return undefined;
    }

    return (symbol.flags & SymbolFlags.Alias) !== 0
        ? checker.getAliasedSymbol(symbol)
        : symbol;
}

function analyzeOptions(
    call: ts.CallExpression,
    binding: (typeof playerIntrinsics)[keyof typeof playerIntrinsics] & {
        optionsIndex: number;
        optionTags: Record<
            string,
            {
                tag: string;
                kind: "boolean" | "string";
                values: Readonly<Record<string, string>>;
            }
        >;
    },
    checker: Checker,
): Record<string, string> {
    const expression = call.arguments[binding.optionsIndex];
    if (!expression || !ts.isObjectLiteralExpression(expression)) {
        throw unsupported(expression ?? call, "intrinsic options object");
    }

    const options: Record<string, string> = {};
    const seen = new Set<string>();
    for (const property of expression.properties) {
        if (!ts.isPropertyAssignment(property)) {
            throw unsupported(property, "intrinsic option");
        }

        const name = getPropertyName(property.name);
        if (!name || seen.has(name)) {
            throw unsupported(property, "intrinsic option name");
        }
        seen.add(name);

        const optionBinding = binding.optionTags[name];
        if (!optionBinding) {
            throw new Error(`Unknown intrinsic option ${name}`);
        }
        if (isUndefined(property.initializer, checker)) {
            continue;
        }

        let sourceValue: string;
        if (optionBinding.kind === "boolean") {
            if (
                property.initializer.kind !== ts.SyntaxKind.TrueKeyword &&
                property.initializer.kind !== ts.SyntaxKind.FalseKeyword
            ) {
                throw unsupported(property.initializer, "boolean option");
            }
            sourceValue =
                property.initializer.kind === ts.SyntaxKind.TrueKeyword
                    ? "true"
                    : "false";
        } else {
            if (!ts.isStringLiteralLikeNode(property.initializer)) {
                throw unsupported(property.initializer, "string option");
            }
            sourceValue = property.initializer.text;
        }

        const canonicalValue = optionBinding.values[sourceValue];
        if (!canonicalValue) {
            throw new Error(`Unknown value ${sourceValue} for option ${name}`);
        }
        options[optionBinding.tag] = canonicalValue;
    }

    return options;
}

function getPropertyName(name: ts.PropertyName): string | undefined {
    if (ts.isIdentifier(name) || ts.isStringLiteralLikeNode(name)) {
        return name.text;
    }
    return undefined;
}

function analyzeExpression(
    expression: ts.Expression,
    expectedTypes: readonly string[],
    checker: Checker,
    resolving = new Set<number>(),
): HighExpression {
    for (const expectedType of expectedTypes) {
        try {
            return analyzeExpressionAsType(
                expression,
                expectedType,
                checker,
                resolving,
            );
        } catch {
            // Try the next value kind accepted by this native input.
        }
    }

    throw unsupported(expression, `${expectedTypes.join(" or ")} expression`);
}

function analyzeExpressionAsType(
    expression: ts.Expression,
    expectedType: string,
    checker: Checker,
    resolving = new Set<number>(),
): HighExpression {
    const nestedResolving = new Set(resolving);
    const constant = resolveConstantInitializer(
        expression,
        checker,
        nestedResolving,
    );
    if (constant) {
        return analyzeExpression(
            constant,
            [expectedType],
            checker,
            nestedResolving,
        );
    }

    switch (expectedType) {
        case "any":
            if (
                ts.isCallExpression(expression) &&
                ts.isIdentifier(expression.expression) &&
                isSdkSymbol(
                    checker.getSymbolAtLocation(expression.expression),
                    "sound",
                    "/values/index.d.ts",
                    checker,
                ) &&
                expression.arguments.length === 1 &&
                ts.isStringLiteralLikeNode(expression.arguments[0])
            ) {
                return {
                    kind: "sound",
                    value: expression.arguments[0].text,
                };
            }
            return analyzeExpression(
                expression,
                ["component", "location", "item"],
                checker,
                resolving,
            );
        case "text":
            if (ts.isStringLiteralLikeNode(expression)) {
                return { kind: "string", value: expression.text };
            }
            break;
        case "number": {
            const value = analyzeNumber(expression);
            if (value !== undefined) {
                return { kind: "number", value };
            }
            break;
        }
        case "component": {
            if (ts.isStringLiteralLikeNode(expression)) {
                return { kind: "string", value: expression.text };
            }
            const value = analyzeNumber(expression);
            if (value !== undefined) {
                return { kind: "number", value };
            }
            if (
                expression.kind === ts.SyntaxKind.TrueKeyword ||
                expression.kind === ts.SyntaxKind.FalseKeyword
            ) {
                return {
                    kind: "boolean",
                    value: expression.kind === ts.SyntaxKind.TrueKeyword,
                };
            }
            break;
        }
        case "sound":
            if (ts.isStringLiteralLikeNode(expression)) {
                return { kind: "sound", value: expression.text };
            }
            break;
        case "location":
            return analyzeLocation(expression, checker, resolving);
        case "item":
            return analyzeItem(expression, checker);
    }

    throw unsupported(expression, `${expectedType} expression`);
}

function analyzeNumber(expression: ts.Expression): number | undefined {
    let value: number | undefined;
    if (ts.isNumericLiteral(expression)) {
        value = Number(expression.text);
    } else if (
        ts.isPrefixUnaryExpression(expression) &&
        ts.isNumericLiteral(expression.operand) &&
        (expression.operator === ts.SyntaxKind.MinusToken ||
            expression.operator === ts.SyntaxKind.PlusToken)
    ) {
        const magnitude = Number(expression.operand.text);
        value =
            expression.operator === ts.SyntaxKind.MinusToken
                ? -magnitude
                : magnitude;
    }

    return value !== undefined && Number.isFinite(value) ? value : undefined;
}

function analyzeLocation(
    expression: ts.Expression,
    checker: Checker,
    resolving: Set<number>,
): HighExpression {
    if (
        !ts.isCallExpression(expression) ||
        !ts.isIdentifier(expression.expression) ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(expression.expression),
            "location",
            "/values/index.d.ts",
            checker,
        ) ||
        expression.arguments.length !== 3
    ) {
        throw unsupported(expression, "location expression");
    }

    const coordinates = expression.arguments.map((argument) => {
        const analyzed = analyzeExpression(
            argument,
            ["number"],
            checker,
            resolving,
        );
        if (analyzed.kind !== "number") {
            throw unsupported(argument, "location coordinate");
        }
        return analyzed.value;
    });

    return {
        kind: "location",
        x: coordinates[0],
        y: coordinates[1],
        z: coordinates[2],
    };
}

function analyzeItem(
    expression: ts.Expression,
    checker: Checker,
): HighExpression {
    if (
        !ts.isCallExpression(expression) ||
        !ts.isIdentifier(expression.expression) ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(expression.expression),
            "item",
            "/values/index.d.ts",
            checker,
        ) ||
        expression.arguments.length !== 1 ||
        !ts.isStringLiteralLikeNode(expression.arguments[0])
    ) {
        throw unsupported(expression, "item expression");
    }

    return {
        kind: "item",
        id: expression.arguments[0].text,
    };
}

function resolveConstantInitializer(
    expression: ts.Expression,
    checker: Checker,
    resolving: Set<number>,
): ts.Expression | undefined {
    if (!ts.isIdentifier(expression)) {
        return undefined;
    }

    const symbol = checker.getSymbolAtLocation(expression);
    if (!symbol || resolving.has(symbol.id)) {
        return undefined;
    }
    const declaration = symbol.valueDeclaration?.resolve();
    if (
        !declaration ||
        !ts.isVariableDeclaration(declaration) ||
        !declaration.initializer ||
        !ts.isVariableDeclarationList(declaration.parent) ||
        (declaration.parent.flags & ts.NodeFlags.Const) === 0
    ) {
        return undefined;
    }

    resolving.add(symbol.id);
    return declaration.initializer;
}

function isUndefined(expression: ts.Expression, checker: Checker): boolean {
    if (!ts.isIdentifier(expression)) {
        return false;
    }
    const symbol = checker.getSymbolAtLocation(expression);
    return symbol ? checker.isUndefinedSymbol(symbol) : false;
}

function unsupported(node: ts.Node, expected: string): Error {
    const source = node.getSourceFile();
    const position = source.getLineAndCharacterOfPosition(
        node.getStart(source),
    );

    return new Error(
        `Unsupported ${expected} at ${source.fileName}:${position.line + 1}:${position.character + 1}`,
    );
}
