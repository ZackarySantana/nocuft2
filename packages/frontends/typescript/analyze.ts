import type {
    HighArgument,
    HighEvent,
    HighEventActionStatement,
    HighExpression,
    HighEventEntityRole,
    HighEventFieldType,
    HighFunction,
    HighProcess,
    HighIntrinsicStatement,
    HighModule,
    HighParameter,
    HighReceiver,
    HighSelectionExpression,
    HighTemplate,
    HighValueParameter,
    FunctionValueType,
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
import { eventBindings } from "./generated/event-bindings.js";
import { entityIntrinsics } from "./generated/entity-intrinsics.js";
import { gameIntrinsics } from "./generated/game-intrinsics.js";
import { controlIntrinsics } from "./generated/control-intrinsics.js";
import { processBindings } from "./generated/process-bindings.js";
import { playerIntrinsics } from "./generated/player-intrinsics.js";
import { selectorBindings } from "./generated/selector-bindings.js";
import { targetGameValues } from "./generated/game-value-bindings.js";

export interface AnalyzeTypeScriptOptions {
    tsconfigPath: string;
    entryFile: string;
    packages?: readonly PackageImport[];
    packageMode?: boolean;
}

export interface PortableFunctionExport {
    name: string;
    parameters: readonly HighParameter[];
}

export interface PackageImport {
    alias: string;
    stubPath: string;
    exports: readonly PortableFunctionExport[];
}

export interface TypeScriptProjectAnalysis {
    module: HighModule;
    sourceFiles: string[];
}

export class TypeScriptAnalysisError extends Error {
    override readonly name = "TypeScriptAnalysisError";

    constructor(message: string, readonly sourceFiles: string[]) {
        super(message);
    }
}

export function analyzeTypeScript(
    options: AnalyzeTypeScriptOptions,
): HighModule {
    return analyzeTypeScriptProject(options).module;
}

export function analyzeTypeScriptProject(
    options: AnalyzeTypeScriptOptions,
): TypeScriptProjectAnalysis {
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
            if (options.packageMode) {
                validatePackageImports(sourceFile);
            }

            const sourceFiles = project.program
                .getSourceFileNames()
                .map((fileName) => resolve(fileName))
                .filter((fileName) => !fileName.endsWith(".d.ts"))
                .filter((fileName) => !fileName.includes("/node_modules/"))
                .toSorted();
            const diagnostics = [
                ...project.program.getProgramDiagnostics(),
                ...project.program.getSyntacticDiagnostics(absoluteEntryFile),
                ...project.program.getBindDiagnostics(absoluteEntryFile),
                ...project.program.getSemanticDiagnostics(absoluteEntryFile),
            ];
            if (diagnostics.length > 0) {
                throw new TypeScriptAnalysisError(
                    formatDiagnostics(diagnostics),
                    sourceFiles,
                );
            }

            const functions = sourceFile.statements.filter(ts.isFunctionDeclaration)
                .filter((statement) => statement.name && statement.body);
            const localFunctions = new Map<number, Callable>();
            for (const declaration of functions) {
                const signature = analyzeFunctionSignature(declaration, project.checker);
                const symbol = declaration.name
                    ? project.checker.getSymbolAtLocation(declaration.name)
                    : undefined;
                if (symbol) {
                    localFunctions.set(symbol.id, {
                        name: signature.name,
                        parameters: signature.parameters,
                    });
                }
            }
            const packageFunctions = createPackageFunctionMap(options.packages ?? []);
            const processRegistrations = new Map<ts.VariableDeclaration, ProcessRegistration>();
            const localProcesses = new Map<number, Callable>();
            const plotVariables = new Map<number, PlotVariableBinding>();
            for (const statement of sourceFile.statements) {
                if (!ts.isVariableStatement(statement)) continue;
                for (const declaration of statement.declarationList.declarations) {
                    const registration = analyzeProcessRegistrationShape(declaration, project.checker);
                    const symbol = ts.isIdentifier(declaration.name)
                        ? project.checker.getSymbolAtLocation(declaration.name)
                        : undefined;
                    if (registration) {
                        processRegistrations.set(declaration, registration);
                    }
                    if (registration && symbol) {
                        localProcesses.set(symbol.id, {
                            name: registration.name,
                            parameters: registration.parameters,
                        });
                    }
                    const variable = analyzePlotVariableDeclaration(declaration, project.checker);
                    if (variable && symbol) plotVariables.set(symbol.id, variable);
                }
            }
            const templates: HighTemplate[] = sourceFile.statements.flatMap<HighTemplate>((statement) => {
                if (ts.isFunctionDeclaration(statement)) {
                    return statement.name && statement.body
                        ? [analyzeFunction(statement, project.checker, localFunctions, packageFunctions, localProcesses, plotVariables)]
                        : [];
                }
                if (ts.isVariableStatement(statement)) {
                    return statement.declarationList.declarations.flatMap<HighTemplate>(
                        (declaration) => {
                            const symbol = ts.isIdentifier(declaration.name)
                                ? project.checker.getSymbolAtLocation(declaration.name)
                                : undefined;
                            if (symbol && plotVariables.has(symbol.id)) return [];
                            const registration = processRegistrations.get(declaration);
                            return registration
                                ? [analyzeProcessRegistration(
                                      registration,
                                      project.checker,
                                      localFunctions,
                                       packageFunctions,
                                       localProcesses,
                                       plotVariables,
                                       isExported(statement),
                                  )]
                                : isExported(statement)
                                  ? [analyzeEventRegistration(
                                      declaration,
                                      project.checker,
                                      localFunctions,
                                       packageFunctions,
                                       localProcesses,
                                       plotVariables,
                                   )]
                                  : [];
                        },
                    );
                }
                return [];
            });

            return {
                module: {
                    kind: "module",
                    templates,
                },
                sourceFiles,
            };
        } finally {
            snapshot.dispose();
        }
    } finally {
        api.close();
    }
}

function validatePackageImports(sourceFile: ts.SourceFile): void {
    for (const statement of sourceFile.statements) {
        let specifier: string | undefined;
        if ((ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement))
            && statement.moduleSpecifier && ts.isStringLiteralLikeNode(statement.moduleSpecifier)) {
            specifier = statement.moduleSpecifier.text;
        } else if (ts.isImportEqualsDeclaration(statement)
            && ts.isExternalModuleReference(statement.moduleReference)
            && statement.moduleReference.expression
            && ts.isStringLiteralLikeNode(statement.moduleReference.expression)) {
            specifier = statement.moduleReference.expression.text;
        }
        if (specifier !== undefined && specifier !== "@nocuft/diamondfire") {
            throw unsupported(statement, `package import; only @nocuft/diamondfire is allowed, found ${specifier}`);
        }
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

function isExported(node: ts.FunctionDeclaration | ts.VariableStatement): boolean {
    return (
        node.modifiers?.some(
            (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
        ) ?? false
    );
}

function analyzeFunction(
    declaration: ts.FunctionDeclaration,
    checker: Checker,
    localFunctions: ReadonlyMap<number, Callable>,
    packageFunctions: ReadonlyMap<string, Callable>,
    localProcesses: ReadonlyMap<number, Callable>,
    plotVariables: ReadonlyMap<number, PlotVariableBinding>,
): HighFunction {
    if (!declaration.name || !declaration.body) {
        throw new Error("Exported functions must have a name and body");
    }

    const signature = analyzeFunctionSignature(declaration, checker);
    const parameters = new Map<number, HighValueParameter>();
    let playerTargetSymbol: TypeScriptSymbol | undefined;
    for (const [index, parameter] of declaration.parameters.entries()) {
        const symbol = ts.isIdentifier(parameter.name)
            ? checker.getSymbolAtLocation(parameter.name)
            : undefined;
        const analyzed = signature.parameters[index];
        if (symbol && analyzed?.kind === "value") {
            parameters.set(symbol.id, analyzed);
        } else if (symbol && analyzed?.kind === "target") {
            playerTargetSymbol = symbol;
        }
    }

    const body = analyzeBody(declaration.body, checker, undefined, {}, false, undefined, {
        parameters,
        playerTargetSymbol,
        localFunctions,
        packageFunctions,
        localProcesses,
        plotVariables,
    });

    return {
        kind: "function",
        name: signature.name,
        ...(!isExported(declaration) ? { exported: false } : {}),
        ...(signature.parameters.length > 0 ? { parameters: signature.parameters } : {}),
        body,
    };
}

interface FunctionSignature {
    name: string;
    parameters: HighParameter[];
}

interface Callable {
    name: string;
    parameters: readonly HighParameter[];
}

interface PlotVariableBinding {
    name: string;
    valueType: "number" | "text" | "boolean";
    enumValues?: readonly string[];
}

function analyzePlotVariableDeclaration(
    declaration: ts.VariableDeclaration,
    checker: Checker,
): PlotVariableBinding | undefined {
    if (
        !ts.isIdentifier(declaration.name) ||
        !declaration.initializer ||
        !ts.isCallExpression(declaration.initializer) ||
        !ts.isPropertyAccessExpression(declaration.initializer.expression)
    ) return undefined;
    const call = declaration.initializer;
    const callExpression = call.expression as ts.PropertyAccessExpression;
    const methodNode = callExpression.name;
    const factory = callExpression.expression;
    if (
        !ts.isPropertyAccessExpression(factory) ||
        factory.name.text !== "game" ||
        !ts.isPropertyAccessExpression(factory.expression) ||
        factory.expression.name.text !== "var" ||
        !ts.isIdentifier(factory.expression.expression) ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(factory.expression.expression),
            "plot",
            "/plot.d.ts",
            checker,
        )
    ) return undefined;
    const method = methodNode.text;
    if (
        !["string", "number", "boolean", "enum"].includes(method) ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(methodNode),
            method,
            "/variables/variables.d.ts",
            checker,
        )
    ) {
        throw unsupported(call, "plot game variable factory");
    }
    if (
        call.arguments.length < (method === "enum" ? 2 : 1) ||
        call.arguments.some((argument) => !ts.isStringLiteralLikeNode(argument))
    ) {
        throw unsupported(call, "explicitly named plot game variable");
    }
    if (method !== "enum" && call.arguments.length !== 1) {
        throw unsupported(call, "plot game variable factory arguments");
    }
    const name = stringLiteralText(call.arguments[0]);
    if (!name) throw unsupported(call.arguments[0], "non-empty plot variable name");
    const enumValues = method === "enum"
        ? call.arguments.slice(1).map(stringLiteralText)
        : undefined;
    if (enumValues && (enumValues.some((value) => !value) || new Set(enumValues).size !== enumValues.length)) {
        throw unsupported(call, "unique non-empty enum values");
    }
    return {
        name,
        valueType: method === "number" ? "number" : method === "boolean" ? "boolean" : "text",
        ...(enumValues ? { enumValues } : {}),
    };
}

function stringLiteralText(expression: ts.Expression): string {
    if (!ts.isStringLiteralLikeNode(expression)) {
        throw unsupported(expression, "string literal");
    }
    return expression.text;
}

interface ProcessRegistration {
    name: string;
    callback: ts.ArrowFunction | ts.FunctionExpression;
    parameters: HighValueParameter[];
    options?: Record<string, string>;
}

function analyzeFunctionSignature(
    declaration: ts.FunctionDeclaration,
    checker: Checker,
): FunctionSignature {
    if (!declaration.name || !declaration.body) {
        throw new Error("Functions must have a name and body");
    }
    if (declaration.type?.kind !== ts.SyntaxKind.VoidKeyword) {
        throw unsupported(declaration, "explicit void function return type");
    }
    const parameters: HighParameter[] = [];
    let hasPlayerTarget = false;
    for (const parameter of declaration.parameters) {
        if (!ts.isIdentifier(parameter.name) || parameter.questionToken || parameter.dotDotDotToken || parameter.initializer) {
            throw unsupported(parameter, "required named function parameter");
        }
        if (isPlayerTargetType(parameter.type, checker)) {
            if (hasPlayerTarget) {
                throw unsupported(parameter, "single PlayerTarget parameter");
            }
            hasPlayerTarget = true;
            parameters.push({ kind: "target", name: parameter.name.text, target: "player" });
            continue;
        }
        const type = functionValueTypeNode(parameter.type, checker);
        if (!type) {
            throw unsupported(parameter, "supported Nocuft value parameter");
        }
        parameters.push({ kind: "value", name: parameter.name.text, type });
    }
    if (parameters.filter((parameter) => parameter.kind === "value").length > 26) {
        throw unsupported(declaration, "at most 26 value parameters");
    }
    return { name: declaration.name.text, parameters };
}

function functionValueTypeNode(
    node: ts.TypeNode | undefined,
    checker: Checker,
): FunctionValueType | undefined {
    switch (node?.kind) {
        case ts.SyntaxKind.StringKeyword: return "text";
        case ts.SyntaxKind.NumberKeyword: return "number";
        case ts.SyntaxKind.BooleanKeyword: return "boolean";
    }
    if (!node || !ts.isTypeReferenceNode(node) || !ts.isIdentifier(node.typeName)) return undefined;
    const symbol = checker.getSymbolAtLocation(node.typeName);
    if (isSdkSymbol(symbol, "ComponentInput", "/values/index.d.ts", checker)) return "component";
    if (isSdkSymbol(symbol, "Location", "/values/index.d.ts", checker)) return "location";
    if (isSdkSymbol(symbol, "Item", "/values/index.d.ts", checker)) return "item";
    if (isSdkSymbol(symbol, "SoundInput", "/generated/sounds.d.ts", checker)) return "sound";
    if (isSdkSymbol(symbol, "AnyValueInput", "/values/index.d.ts", checker)) return "any";
    return undefined;
}

function isPlayerTargetType(node: ts.TypeNode | undefined, checker: Checker): boolean {
    return !!node && ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)
        && isSdkSymbol(checker.getSymbolAtLocation(node.typeName), "PlayerTarget", "/players.d.ts", checker);
}

function createPackageFunctionMap(packages: readonly PackageImport[]): Map<string, Callable> {
    const result = new Map<string, Callable>();
    for (const pkg of packages) {
        const stub = resolve(pkg.stubPath).replaceAll("\\", "/");
        for (const entry of pkg.exports) {
            result.set(`${stub}\0${entry.name}`, {
                name: `${pkg.alias}_${entry.name}`,
                parameters: entry.parameters,
            });
        }
    }
    return result;
}

function analyzeProcessRegistrationShape(
    declaration: ts.VariableDeclaration,
    checker: Checker,
): ProcessRegistration | undefined {
    if (
        !ts.isIdentifier(declaration.name) ||
        !declaration.initializer ||
        !ts.isCallExpression(declaration.initializer) ||
        !ts.isPropertyAccessExpression(declaration.initializer.expression) ||
        !ts.isIdentifier(declaration.initializer.expression.expression)
    ) {
        return undefined;
    }
    const call = declaration.initializer;
    const expression = call.expression as ts.PropertyAccessExpression;
    const root = expression.expression;
    const methodNode = expression.name;
    const method = methodNode.text;
    if (
        !isSdkSymbol(checker.getSymbolAtLocation(root), "process", "/process.d.ts", checker) ||
        !["create", "createWith"].includes(method) ||
        !isSdkSymbol(checker.getSymbolAtLocation(methodNode), method, "/process.d.ts", checker)
    ) {
        return undefined;
    }
    const configured = method === "createWith";
    const callback = call.arguments[configured ? 1 : 0];
    if (
        (!ts.isArrowFunction(callback) && !ts.isFunctionExpression(callback)) ||
        !ts.isBlock(callback.body) ||
        call.arguments.length !== (configured ? 2 : 1)
    ) {
        throw unsupported(call, "process registration");
    }
    const parameters = analyzeProcessParameters(callback.parameters, checker);
    return {
        name: declaration.name.text,
        callback,
        parameters,
        ...(configured
            ? {
                  options: analyzeOptions(
                      call,
                      { ...processBindings.declaration, optionsIndex: 0 },
                      checker,
                  ),
              }
            : {}),
    };
}

function analyzeProcessParameters(
    parameters: ts.NodeArray<ts.ParameterDeclaration>,
    checker: Checker,
): HighValueParameter[] {
    const result: HighValueParameter[] = [];
    for (const parameter of parameters) {
        if (!ts.isIdentifier(parameter.name) || parameter.questionToken || parameter.dotDotDotToken || parameter.initializer) {
            throw unsupported(parameter, "required named process parameter");
        }
        const type = functionValueTypeNode(parameter.type, checker);
        if (!type) {
            throw unsupported(parameter, "supported Nocuft process parameter");
        }
        result.push({ kind: "value", name: parameter.name.text, type });
    }
    if (result.length > 25) {
        throw unsupported(parameters[25], "at most 25 process parameters");
    }
    return result;
}

function analyzeProcessRegistration(
    registration: ProcessRegistration,
    checker: Checker,
    localFunctions: ReadonlyMap<number, Callable>,
    packageFunctions: ReadonlyMap<string, Callable>,
    localProcesses: ReadonlyMap<number, Callable>,
    plotVariables: ReadonlyMap<number, PlotVariableBinding>,
    exported: boolean,
): HighProcess {
    const parameters = new Map<number, HighValueParameter>();
    registration.callback.parameters.forEach((parameter, index) => {
        const symbol = ts.isIdentifier(parameter.name)
            ? checker.getSymbolAtLocation(parameter.name)
            : undefined;
        if (symbol) parameters.set(symbol.id, registration.parameters[index]);
    });
    return {
        kind: "process",
        name: registration.name,
        ...(!exported ? { exported: false } : {}),
        parameters: registration.parameters,
        ...(registration.options ? { options: registration.options } : {}),
        body: analyzeBody(
            registration.callback.body as ts.Block,
            checker,
            undefined,
            {},
            false,
            undefined,
            {
                parameters,
                localFunctions,
                packageFunctions,
                localProcesses,
                plotVariables,
            },
        ),
    };
}

function analyzeEventRegistration(
    declaration: ts.VariableDeclaration,
    checker: Checker,
    localFunctions: ReadonlyMap<number, Callable>,
    packageFunctions: ReadonlyMap<string, Callable>,
    localProcesses: ReadonlyMap<number, Callable>,
    plotVariables: ReadonlyMap<number, PlotVariableBinding>,
): HighEvent {
    if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
        throw unsupported(declaration, "event registration");
    }
    const call = declaration.initializer;
    if (
        !ts.isCallExpression(call) ||
        !ts.isPropertyAccessExpression(call.expression) ||
        !ts.isPropertyAccessExpression(call.expression.expression)
    ) {
        throw unsupported(declaration, "event registration");
    }

    const groupNode = call.expression.expression.name;
    const methodNode = call.expression.name;
    const key = `${groupNode.text}.${methodNode.text}`;
    const binding = eventBindings[key as keyof typeof eventBindings];
    if (
        !binding ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(groupNode),
            groupNode.text,
            "/events.d.ts",
            checker,
        ) ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(methodNode),
            methodNode.text,
            "/events.d.ts",
            checker,
        )
    ) {
        throw unsupported(declaration, "event registration");
    }
    const root = call.expression.expression.expression;
    if (
        !ts.isIdentifier(root) ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(root),
            "events",
            "/events.d.ts",
            checker,
        )
    ) {
        throw unsupported(declaration, "event registration");
    }
    if (call.arguments.length !== 1) {
        throw unsupported(call, "event registration arguments");
    }
    const callback = call.arguments[0];
    if (
        (!ts.isArrowFunction(callback) && !ts.isFunctionExpression(callback)) ||
        !ts.isBlock(callback.body)
    ) {
        throw unsupported(callback, "event callback");
    }

    let eventParameter: TypeScriptSymbol | undefined;
    if (binding.callbackParameter === "none") {
        if (callback.parameters.length !== 0) {
            throw unsupported(callback, "event callback parameters");
        }
    } else {
        if (
            callback.parameters.length !== 1 ||
            !ts.isIdentifier(callback.parameters[0].name)
        ) {
            throw unsupported(callback, "event callback parameters");
        }
        eventParameter = checker.getSymbolAtLocation(callback.parameters[0].name);
    }

    const expressionContext = eventParameter
        ? {
              eventId: binding.id,
              parameter: eventParameter,
              fields: Object.fromEntries(
                  binding.fields.map((field) => [
                      field.name,
                      { type: field.type, native: field.native },
                  ]),
              ),
          }
        : undefined;
    const entityRoles = Object.fromEntries(
        binding.entityRoles.map((role) => [
            role.name,
            {
                role: role.native.toLowerCase() as HighEventEntityRole,
                type: role.type,
            },
        ]),
    );
    return {
        kind: "event",
        name: declaration.name.text,
        event: binding.id,
        body: analyzeBody(
            callback.body,
            checker,
            eventParameter,
            entityRoles,
            binding.cancellable,
            expressionContext,
            {
                parameters: new Map(),
                localFunctions,
                packageFunctions,
                localProcesses,
                plotVariables,
                eventParameter,
                eventEntityRoles: entityRoles,
                eventContext: expressionContext,
            },
        ),
    };
}

function analyzeBody(
    body: ts.Block,
    checker: Checker,
    eventParameter?: TypeScriptSymbol,
    eventEntityRoles: EventEntityRoles = {},
    cancellable = false,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): import("@nocuft/dfir").HighStatement[] {
    const lineVariables = functionContext?.lineVariables ?? new Map();
    const lineVariableNames = functionContext?.lineVariableNames ?? new Map();
    if (functionContext && (!functionContext.lineVariables || !functionContext.lineVariableNames)) {
        functionContext = { ...functionContext, lineVariables, lineVariableNames };
    }
    return body.statements.map((statement) => {
        if (ts.isIfStatement(statement)) {
            if (!eventParameter || statement.elseStatement) {
                throw unsupported(statement, "if statement");
            }
            const condition = analyzeHeldItemCondition(
                statement.expression,
                checker,
                eventParameter,
                eventContext,
                functionContext,
            );
            if (!ts.isBlock(statement.thenStatement)) {
                throw unsupported(statement.thenStatement, "if block");
            }
            return {
                kind: "if",
                condition,
                body: analyzeBody(
                    statement.thenStatement,
                    checker,
                    eventParameter,
                    eventEntityRoles,
                    cancellable,
                    eventContext,
                    functionContext,
                ),
            };
        }
        if (ts.isVariableStatement(statement)) {
            if (statement.declarationList.declarations.length !== 1) {
                throw unsupported(statement, "line variable declaration");
            }
            const declaration = statement.declarationList.declarations[0];
            if (
                !ts.isIdentifier(declaration.name) ||
                !declaration.initializer ||
                !ts.isCallExpression(declaration.initializer) ||
                !ts.isPropertyAccessExpression(declaration.initializer.expression) ||
                !ts.isIdentifier(declaration.initializer.expression.expression) ||
                !isSdkSymbol(
                    checker.getSymbolAtLocation(declaration.initializer.expression.expression),
                    "line",
                    "/line.d.ts",
                    checker,
                ) ||
                declaration.initializer.arguments.length !== 1
            ) {
                throw unsupported(statement, "line location declaration");
            }
            const factory = declaration.initializer.expression.name.text;
            const valueType = factory === "location"
                ? "location"
                : factory === "number"
                  ? "number"
                  : factory === "string"
                    ? "text"
                    : factory === "boolean"
                      ? "boolean"
                      : undefined;
            if (!valueType) throw unsupported(statement, "line variable factory");
            const symbol = checker.getSymbolAtLocation(declaration.name);
            if (!symbol) throw unsupported(declaration.name, "line variable");
            const baseName = `__nocuft_line_${declaration.name.text}`;
            const occurrence = (lineVariableNames.get(baseName) ?? 0) + 1;
            lineVariableNames.set(baseName, occurrence);
            const name = occurrence === 1 ? baseName : `${baseName}_${occurrence}`;
            lineVariables.set(symbol.id, { name, valueType });
            return {
                kind: "declare_line_variable",
                name,
                valueType,
                initializer: analyzeExpression(
                    declaration.initializer.arguments[0],
                    [valueType],
                    checker,
                    new Set(),
                    eventContext,
                    functionContext,
                ),
            };
        }
        if (
            !ts.isExpressionStatement(statement) ||
            !ts.isCallExpression(statement.expression)
        ) {
            throw unsupported(statement, "function statement");
        }
        const variableMutation = analyzePlotVariableMutation(
            statement.expression,
            checker,
            functionContext,
            eventContext,
        );
        if (variableMutation) return variableMutation;
        if (
            ts.isPropertyAccessExpression(statement.expression.expression) &&
            ts.isIdentifier(statement.expression.expression.expression)
        ) {
            const symbol = checker.getSymbolAtLocation(statement.expression.expression.expression);
            const variable = symbol ? lineVariables.get(symbol.id) : undefined;
            const method = statement.expression.expression.name.text;
            if (variable?.valueType === "location") {
                const mutation = analyzeLineLocationMutation(
                    method,
                    statement.expression,
                    variable.name,
                    checker,
                    eventContext,
                    functionContext,
                );
                if (mutation) return mutation;
            }
        }
        if (
            eventParameter &&
            ts.isPropertyAccessExpression(statement.expression.expression) &&
            statement.expression.expression.name.text === "cancel" &&
            ts.isIdentifier(statement.expression.expression.expression) &&
            checker.getSymbolAtLocation(
                statement.expression.expression.expression,
            ) === eventParameter
        ) {
            if (!cancellable || statement.expression.arguments.length !== 0) {
                throw unsupported(statement.expression, "event cancellation");
            }
            return { kind: "event_action", operation: "cancel", arguments: {} };
        }
        const eventAction = analyzeEventMutatorCall(
            statement.expression,
            checker,
            eventParameter,
            eventContext,
            functionContext,
        );
        if (eventAction) {
            return eventAction;
        }
        const processStart = analyzeProcessStartCall(
            statement.expression,
            checker,
            functionContext,
        );
        if (processStart) {
            return processStart;
        }
        const functionCall = analyzeFunctionCall(statement.expression, checker, functionContext);
        if (functionCall) {
            return functionCall;
        }
        return analyzeIntrinsicCall(
            statement.expression,
            checker,
            eventParameter,
            eventEntityRoles,
            eventContext,
            functionContext,
        );
    });
}

function analyzeHeldItemCondition(
    expression: ts.Expression,
    checker: Checker,
    eventParameter: TypeScriptSymbol,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): import("@nocuft/dfir").HighHeldItemCondition {
    if (
        !ts.isBinaryExpression(expression) ||
        expression.operatorToken.kind !== ts.SyntaxKind.EqualsEqualsEqualsToken
    ) {
        throw unsupported(expression, "held item condition");
    }
    const left = analyzeTargetGameValueExpression(
        expression.left,
        "item",
        checker,
        eventContext,
        functionContext,
    );
    if (
        !left ||
        left.value !== "target.main_hand_item" ||
        left.receiver !== "current_player"
    ) {
        throw unsupported(expression.left, "main hand item condition");
    }
    const item = analyzeItem(expression.right, checker);
    if (item.kind !== "item") {
        throw unsupported(expression.right, "item condition value");
    }
    return {
        kind: "held_item",
        receiver: "current_player",
        hand: "main",
        item,
    };
}

function analyzeEventMutatorCall(
    call: ts.CallExpression,
    checker: Checker,
    eventParameter?: TypeScriptSymbol,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighEventActionStatement | undefined {
    if (
        !eventParameter ||
        !eventContext ||
        !ts.isPropertyAccessExpression(call.expression) ||
        !ts.isIdentifier(call.expression.expression) ||
        checker.getSymbolAtLocation(call.expression.expression) !== eventParameter
    ) {
        return undefined;
    }
    const binding = eventBindings[
        eventContext.eventId as keyof typeof eventBindings
    ];
    const method = call.expression.name.text;
    const mutator = (binding.mutators as Readonly<Record<string, {
        operation: string;
        parameters: readonly {
            sourceIndex: number;
            input: string;
            types: readonly string[];
            kind: "value" | "array" | "rest";
            optional: boolean;
            minimumLength: number;
        }[];
    }>>)[method];
    if (!mutator) {
        return undefined;
    }
    if (
        !isSdkSymbol(
            checker.getSymbolAtLocation(call.expression.name),
            method,
            "/events.d.ts",
            checker,
        )
    ) {
        throw unsupported(call, "event mutator");
    }
    return {
        kind: "event_action",
        operation: mutator.operation,
        arguments: analyzeBoundArguments(
            call,
            mutator.parameters,
            checker,
            eventContext,
            method,
            functionContext,
        ),
    };
}

function analyzeLineLocationMutation(
    method: string,
    call: ts.CallExpression,
    name: string,
    checker: Checker,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): import("@nocuft/dfir").HighLineLocationShift | undefined {
    const definitions = {
        shift: { operation: "axes", types: ["number", "number", "number"], minimum: 3 },
        shiftDirection: { operation: "direction", types: ["number", "number", "number"], minimum: 0 },
        shiftAxis: { operation: "axis", types: ["text", "number"], minimum: 2 },
        shiftToward: { operation: "toward", types: ["location", "number"], minimum: 1 },
        setCoordinate: { operation: "coordinate", types: ["text", "number"], minimum: 2 },
        face: { operation: "face", types: ["location", "text"], minimum: 1 },
    } as const;
    const definition = definitions[method as keyof typeof definitions];
    if (!definition) return undefined;
    if (
        !isSdkSymbol(
            checker.getSymbolAtLocation(
                (call.expression as ts.PropertyAccessExpression).name,
            ),
            method,
            "/line.d.ts",
            checker,
        ) ||
        call.arguments.length < definition.minimum ||
        call.arguments.length > definition.types.length
    ) throw unsupported(call, "line location mutation");
    const options: Record<string, string> = {};
    const valueArguments = [...call.arguments];
    if (method === "shiftAxis" || method === "setCoordinate") {
        const option = valueArguments.shift();
        if (!option || !ts.isStringLiteralLikeNode(option)) throw unsupported(call, "line location option");
        if (method === "shiftAxis") {
            if (!["x", "y", "z"].includes(option.text)) throw unsupported(option, "line location axis");
            options.axis = option.text;
        }
        if (method === "setCoordinate") {
            if (!["x", "y", "z", "pitch", "yaw"].includes(option.text)) {
                throw unsupported(option, "line location coordinate");
            }
            options.coordinate = option.text;
        }
    }
    if (method === "face" && valueArguments.length === 2) {
        const direction = valueArguments.pop();
        if (!direction || !ts.isStringLiteralLikeNode(direction)) throw unsupported(call, "face direction");
        if (!["toward", "away"].includes(direction.text)) throw unsupported(direction, "face direction");
        options.direction = direction.text;
    }
    const offset = method === "shiftAxis" || method === "setCoordinate" ? 1 : 0;
    const types = definition.types.slice(offset);
    return {
        kind: "shift_line_location",
        name,
        operation: definition.operation,
        arguments: valueArguments.map((argument, index) =>
            analyzeExpression(argument, [types[index]], checker, new Set(), eventContext, functionContext),
        ),
        ...(Object.keys(options).length ? { options } : {}),
    };
}

function analyzePlotVariableMutation(
    call: ts.CallExpression,
    checker: Checker,
    context?: FunctionContext,
    eventContext?: EventExpressionContext,
): import("@nocuft/dfir").HighSetVariableStatement | import("@nocuft/dfir").HighClearVariableStatement | undefined {
    if (
        !context ||
        !ts.isPropertyAccessExpression(call.expression) ||
        !ts.isIdentifier(call.expression.expression)
    ) return undefined;
    const symbol = checker.getSymbolAtLocation(call.expression.expression);
    const variable = symbol ? context.plotVariables.get(symbol.id) : undefined;
    if (!variable) return undefined;
    const method = call.expression.name.text;
    const reference = {
        kind: "plot_variable" as const,
        name: variable.name,
        scope: "unsaved" as const,
        valueType: variable.valueType,
    };
    if (method === "clear" && call.arguments.length === 0) {
        return { kind: "clear_variable", variable: reference };
    }
    if (method !== "set" || call.arguments.length !== 1) {
        throw unsupported(call, "plot variable mutation");
    }
    const value = analyzeExpression(
        call.arguments[0],
        [variable.valueType],
        checker,
        new Set(),
        eventContext,
        context,
    );
    if (
        variable.enumValues &&
        (value.kind !== "string" || !variable.enumValues.includes(value.value))
    ) {
        throw unsupported(call.arguments[0], "declared enum value");
    }
    return { kind: "set_variable", variable: reference, value };
}

function analyzeBoundArguments(
    call: ts.CallExpression,
    parameters: readonly {
        sourceIndex: number;
        input: string;
        types: readonly string[];
        kind: "value" | "array" | "rest";
        optional: boolean;
        minimumLength: number;
    }[],
    checker: Checker,
    eventContext: EventExpressionContext | undefined,
    method: string,
    functionContext?: FunctionContext,
): Record<string, HighArgument> {
    const result: Record<string, HighArgument> = {};
    let consumed = 0;
    for (const parameter of parameters) {
        if (parameter.kind === "rest") {
            const values = call.arguments
                .slice(parameter.sourceIndex)
                .map((argument) =>
                    analyzeExpression(
                        argument,
                        parameter.types,
                        checker,
                        new Set<number>(),
                        eventContext,
                        functionContext,
                    ),
                );
            if (values.length < parameter.minimumLength) {
                throw new Error(`Expected at least ${parameter.minimumLength} arguments for ${parameter.input} in ${method}`);
            }
            result[parameter.input] = values;
            consumed = call.arguments.length;
            continue;
        }
        const argument = call.arguments[parameter.sourceIndex];
        if (!argument || isUndefined(argument, checker)) {
            if (!parameter.optional) {
                throw new Error(`Missing required argument ${parameter.input} for ${method}`);
            }
            continue;
        }
        consumed = Math.max(consumed, parameter.sourceIndex + 1);
        if (parameter.kind === "array") {
            if (!ts.isArrayLiteralExpression(argument)) {
                throw unsupported(argument, "array literal argument");
            }
            const values = argument.elements.map((element) => {
                if (ts.isSpreadElement(element)) {
                    throw unsupported(element, "array element");
                }
                return analyzeExpression(
                    element,
                    parameter.types,
                    checker,
                    new Set<number>(),
                    eventContext,
                    functionContext,
                );
            });
            if (values.length < parameter.minimumLength) {
                throw new Error(
                    `Expected at least ${parameter.minimumLength} values for ${parameter.input} in ${method}`,
                );
            }
            result[parameter.input] = values;
        } else {
            result[parameter.input] = analyzeExpression(
                argument,
                parameter.types,
                checker,
                new Set<number>(),
                eventContext,
                functionContext,
            );
        }
    }
    if (call.arguments.length > consumed) {
        throw unsupported(call.arguments[consumed], `extra argument for ${method}`);
    }
    return result;
}

interface FunctionContext {
    parameters: ReadonlyMap<number, HighValueParameter>;
    playerTargetSymbol?: TypeScriptSymbol;
    localFunctions: ReadonlyMap<number, Callable>;
    packageFunctions: ReadonlyMap<string, Callable>;
    localProcesses: ReadonlyMap<number, Callable>;
    eventParameter?: TypeScriptSymbol;
    eventEntityRoles?: EventEntityRoles;
    eventContext?: EventExpressionContext;
    plotVariables: ReadonlyMap<number, PlotVariableBinding>;
    lineVariables?: Map<number, {
        name: string;
        valueType: "location" | "number" | "text" | "boolean";
    }>;
    lineVariableNames?: Map<string, number>;
}

function analyzeFunctionCall(
    call: ts.CallExpression,
    checker: Checker,
    context?: FunctionContext,
): import("@nocuft/dfir").HighFunctionCallStatement | undefined {
    if (!context || !ts.isIdentifier(call.expression)) {
        return undefined;
    }
    const symbol = resolveAliasedSymbol(checker.getSymbolAtLocation(call.expression), checker);
    if (!symbol) {
        return undefined;
    }
    let callable = context.localFunctions.get(symbol.id);
    if (!callable) {
        const declaration = symbol.declarations?.[0];
        if (declaration) {
            callable = context.packageFunctions.get(
                `${resolve(declaration.path).replaceAll("\\", "/")}\0${symbol.name}`,
            );
        }
    }
    if (!callable) {
        return undefined;
    }
    if (call.arguments.length !== callable.parameters.length) {
        throw new Error(`Function ${callable.name} expects ${callable.parameters.length} arguments`);
    }
    let receiver: HighReceiver | undefined;
    const args: HighExpression[] = [];
    callable.parameters.forEach((parameter, index) => {
        const argument = call.arguments[index];
        if (parameter.kind === "target") {
            receiver = analyzePlayerArgument(argument, checker, context);
        } else {
            args.push(analyzeExpression(
                argument,
                [parameter.type],
                checker,
                new Set<number>(),
                context.eventContext,
                context,
            ));
        }
    });
    return {
        kind: "call_function",
        function: callable.name,
        arguments: args,
        ...(receiver ? { receiver } : {}),
    };
}

function analyzeProcessStartCall(
    call: ts.CallExpression,
    checker: Checker,
    context?: FunctionContext,
): import("@nocuft/dfir").HighStartProcessStatement | undefined {
    if (
        !context ||
        !ts.isPropertyAccessExpression(call.expression) ||
        !ts.isIdentifier(call.expression.expression)
    ) {
        return undefined;
    }
    const receiverSymbol = resolveAliasedSymbol(
        checker.getSymbolAtLocation(call.expression.expression),
        checker,
    );
    const process = receiverSymbol
        ? context.localProcesses.get(receiverSymbol.id)
        : undefined;
    if (!process) return undefined;

    const methodNode = call.expression.name;
    const method = methodNode.text;
    if (
        !["start", "startWith"].includes(method) ||
        !isSdkSymbol(checker.getSymbolAtLocation(methodNode), method, "/process.d.ts", checker)
    ) {
        throw unsupported(call, "process start");
    }
    const configured = method === "startWith";
    const offset = configured ? 1 : 0;
    if (call.arguments.length !== process.parameters.length + offset) {
        throw new Error(`Process ${process.name} expects ${process.parameters.length} arguments`);
    }
    const arguments_: HighExpression[] = [];
    process.parameters.forEach((parameter, index) => {
        if (parameter.kind !== "value") {
            throw new Error(`Process ${process.name} has an unsupported target parameter`);
        }
        arguments_.push(analyzeExpression(
            call.arguments[index + offset],
            [parameter.type],
            checker,
            new Set<number>(),
            context.eventContext,
            context,
        ));
    });
    return {
        kind: "start_process",
        process: process.name,
        arguments: arguments_,
        ...(configured
            ? {
                  options: analyzeOptions(
                      call,
                      { ...processBindings.start, optionsIndex: 0 },
                      checker,
                  ),
              }
            : {}),
    };
}

function analyzePlayerArgument(
    expression: ts.Expression,
    checker: Checker,
    context: FunctionContext,
): HighReceiver {
    if (ts.isIdentifier(expression) && checker.getSymbolAtLocation(expression)?.id === context.playerTargetSymbol?.id) {
        return { kind: "current_player" };
    }
    return analyzeReceiver(
        expression,
        "player",
        checker,
        context.eventParameter,
        context.eventEntityRoles,
        context.playerTargetSymbol,
        context.eventContext,
        context,
    );
}

function analyzeIntrinsicCall(
    call: ts.CallExpression,
    checker: Checker,
    eventParameter?: TypeScriptSymbol,
    eventEntityRoles: EventEntityRoles = {},
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighIntrinsicStatement {
    if (!ts.isPropertyAccessExpression(call.expression)) {
        throw unsupported(call, "intrinsic call");
    }

    const methodNode = call.expression.name;
    const method = methodNode.text;
    const playerBinding =
        playerIntrinsics[method as keyof typeof playerIntrinsics];
    const entityBinding =
        entityIntrinsics[method as keyof typeof entityIntrinsics];
    const gameBinding = gameIntrinsics[method as keyof typeof gameIntrinsics];
    const controlBinding = controlIntrinsics[method as keyof typeof controlIntrinsics];
    const methodSymbol = checker.getSymbolAtLocation(methodNode);
    const binding =
        playerBinding &&
        isSdkSymbol(
            methodSymbol,
            method,
            "/generated/player-actions.d.ts",
            checker,
        )
            ? playerBinding
            : entityBinding &&
                isSdkSymbol(
                    methodSymbol,
                    method,
                    "/generated/entity-actions.d.ts",
                    checker,
                )
              ? entityBinding
              : gameBinding &&
                  isSdkSymbol(
                      methodSymbol,
                      method,
                      "/generated/game-actions.d.ts",
                      checker,
                  )
                ? gameBinding
                : controlBinding &&
                    isSdkSymbol(
                        methodSymbol,
                        method,
                        "/generated/control-actions.d.ts",
                        checker,
                    )
                  ? controlBinding
              : undefined;

    if (!binding) {
        throw unsupported(call, "action intrinsic");
    }

    const receiver = analyzeReceiver(
        call.expression.expression,
        binding.receiver,
        checker,
        eventParameter,
        eventEntityRoles,
        functionContext?.playerTargetSymbol,
        eventContext,
        functionContext,
    );

    const argumentsByName: Record<string, HighArgument> = {};
    for (const parameter of binding.parameters) {
        if (parameter.kind === "rest") {
            const expressions = call.arguments
                .slice(parameter.sourceIndex)
                .map((argument) =>
                    analyzeExpression(
                        argument,
                        parameter.types,
                        checker,
                        new Set<number>(),
                        eventContext,
                        functionContext,
                    ),
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
                return analyzeExpression(
                    element,
                    parameter.types,
                    checker,
                    new Set<number>(),
                    eventContext,
                    functionContext,
                );
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
            new Set<number>(),
            eventContext,
            functionContext,
        );
    }

    const intrinsicOptions =
        "optionsIndex" in binding
            ? analyzeOptions(call, binding, checker)
            : undefined;

    return {
        kind: "intrinsic",
        operation: binding.operation,
        receiver,
        arguments: argumentsByName,
        ...(intrinsicOptions === undefined
            ? {}
            : { options: intrinsicOptions }),
    };
}

function analyzeReceiver(
    expression: ts.Expression,
    expectedReceiver: "player" | "entity" | "game" | "control",
    checker: Checker,
    eventParameter?: TypeScriptSymbol,
    eventEntityRoles: EventEntityRoles = {},
    playerTargetSymbol?: TypeScriptSymbol,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighIntrinsicStatement["receiver"] {
    if (
        expectedReceiver === "control" &&
        ts.isIdentifier(expression) &&
        isSdkSymbol(
            checker.getSymbolAtLocation(expression),
            "control",
            "/control.d.ts",
            checker,
        )
    ) {
        return { kind: "control" };
    }
    if (
        expectedReceiver === "game" &&
        ts.isIdentifier(expression) &&
        isSdkSymbol(
            checker.getSymbolAtLocation(expression),
            "game",
            "/game.d.ts",
            checker,
        )
    ) {
        return { kind: "game" };
    }
    if (
        expectedReceiver === "player" &&
        playerTargetSymbol &&
        ts.isIdentifier(expression) &&
        checker.getSymbolAtLocation(expression)?.id === playerTargetSymbol.id
    ) {
        return { kind: "current_player" };
    }
    const selection = analyzeSelectionExpression(
        expression,
        checker,
        eventContext,
        functionContext,
    );
    if (selection) {
        if (selection.resultType !== expectedReceiver) {
            throw unsupported(expression, `${expectedReceiver} selection`);
        }
        return { kind: "selection", value: selection };
    }
    if (
        eventParameter &&
        ts.isPropertyAccessExpression(expression) &&
        expression.name.text === "player" &&
        ts.isIdentifier(expression.expression) &&
        checker.getSymbolAtLocation(expression.expression) === eventParameter
    ) {
        return { kind: "current_player" };
    }
    if (
        eventParameter &&
        ts.isPropertyAccessExpression(expression) &&
        ts.isIdentifier(expression.expression) &&
        checker.getSymbolAtLocation(expression.expression) === eventParameter
    ) {
        const role = eventEntityRoles[expression.name.text];
        if (role && role.type === expectedReceiver) {
            return {
                kind: "selection",
                value: {
                    kind: "selection",
                    resultType: role.type,
                    source: {
                        operation: "select.EventTarget",
                        arguments: [],
                        options: { eventTarget: role.role },
                    },
                    filters: [],
                },
            };
        }
    }
    throw unsupported(expression, `${expectedReceiver} receiver`);
}

function analyzeSelectionExpression(
    expression: ts.Expression,
    checker: Checker,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighSelectionExpression | undefined {
    if (
        !ts.isCallExpression(expression) ||
        !ts.isPropertyAccessExpression(expression.expression)
    ) {
        return undefined;
    }
    const method = expression.expression.name.text;
    const receiver = expression.expression.expression;
    const owner = ts.isIdentifier(receiver) && receiver.text === "players"
        ? "players"
        : ts.isIdentifier(receiver) && receiver.text === "entities"
          ? "entities"
          : undefined;
    if (owner) {
        const bindingMethod = method.endsWith("With")
            ? method.slice(0, -"With".length)
            : method;
        const binding = Object.values(selectorBindings).find(
            (candidate) =>
                candidate.kind === "source" &&
                candidate.owner === owner &&
                candidate.method === bindingMethod,
        );
        if (
            !binding ||
            !isSdkSymbol(
                checker.getSymbolAtLocation(expression.expression.name),
                method,
                `/${owner}.d.ts`,
                checker,
            )
        ) {
            return undefined;
        }
        return {
            kind: "selection",
            resultType: binding.resultType,
            source: analyzeSelectorCall(expression, binding, checker, method.endsWith("With"), eventContext, functionContext),
            filters: [],
        };
    }
    const base = analyzeSelectionExpression(receiver, checker, eventContext, functionContext);
    if (!base) return undefined;
    const isRandom = method === "random";
    const isDistance = ["nearest", "nearestWith", "farthest", "farthestWith"].includes(method);
    if (
        (!isRandom && !isDistance) ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(expression.expression.name),
            method,
            base.resultType === "player" ? "/players.d.ts" : "/entities.d.ts",
            checker,
        )
    ) {
        return undefined;
    }
    const binding = selectorBindings[
        (isRandom ? "select.FilterRandom" : "select.FilterDistance") as keyof typeof selectorBindings
    ];
    const selector = analyzeSelectorCall(expression, binding, checker, method.endsWith("With"), eventContext, functionContext);
    if (method.startsWith("farthest")) {
        selector.options = {
            ...(selector.options ?? {}),
            compareMode: "farthest",
        };
    }
    return { ...base, filters: [...base.filters, selector] };
}

function analyzeSelectorCall(
    call: ts.CallExpression,
    binding: (typeof selectorBindings)[keyof typeof selectorBindings],
    checker: Checker,
    hasOptions: boolean,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): import("@nocuft/dfir").HighSelector {
    const args = [...call.arguments];
    const options: Record<string, string> = {};
    if (hasOptions) {
        const object = args.shift();
        if (!object || !ts.isObjectLiteralExpression(object)) {
            throw unsupported(call, "selector options");
        }
        const availableOptions = new Set(
            binding.native.tags.map((tag) => selectorOptionId(tag.name)),
        );
        const seen = new Set<string>();
        for (const property of object.properties) {
            if (!ts.isPropertyAssignment(property)) {
                throw unsupported(property, "selector option");
            }
            const name = getPropertyName(property.name);
            if (!name || seen.has(name) || !availableOptions.has(name)) {
                throw unsupported(property, "selector option");
            }
            seen.add(name);
            if (isUndefined(property.initializer, checker)) {
                continue;
            }
            if (
                property.initializer.kind !== ts.SyntaxKind.TrueKeyword &&
                property.initializer.kind !== ts.SyntaxKind.FalseKeyword
            ) {
                throw unsupported(property.initializer, "boolean selector option");
            }
            options[name] = property.initializer.kind === ts.SyntaxKind.TrueKeyword
                ? "true"
                : "false";
        }
    }
    const expressions = args.flatMap((argument, index) => {
        if (isUndefined(argument, checker)) {
            return [];
        }
        const metadata = binding.native.arguments[Math.min(index, binding.native.arguments.length - 1)];
        if (!metadata) {
            throw unsupported(argument, "selector argument");
        }
        return [analyzeExpression(
            argument,
            [metadata.type],
            checker,
            new Set(),
            eventContext,
            functionContext,
        )];
    });
    return { operation: binding.id, arguments: expressions, ...(Object.keys(options).length ? { options } : {}) };
}

function selectorOptionId(name: string): string {
    return name === "Ignore Y-Axis"
        ? "ignoreYAxis"
        : name === "Ignore Formatting"
          ? "ignoreFormatting"
          : name === "Compare Mode"
            ? "compareMode"
            : name === "Event Target"
              ? "eventTarget"
              : name;
}

type EventEntityRoles = Readonly<
    Record<string, { role: HighEventEntityRole; type: "player" | "entity" }>
>;

interface EventExpressionContext {
    eventId: string;
    parameter: TypeScriptSymbol;
    fields: Readonly<Record<string, { type: HighEventFieldType; native: string }>>;
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
    binding: ((typeof playerIntrinsics)[keyof typeof playerIntrinsics] |
        (typeof entityIntrinsics)[keyof typeof entityIntrinsics] |
        (typeof gameIntrinsics)[keyof typeof gameIntrinsics] |
        (typeof controlIntrinsics)[keyof typeof controlIntrinsics] |
        (typeof processBindings)[keyof typeof processBindings]) & {
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
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighExpression {
    if (ts.isIdentifier(expression) && functionContext) {
        const symbol = checker.getSymbolAtLocation(expression);
        const lineVariable = symbol
            ? functionContext.lineVariables?.get(symbol.id)
            : undefined;
        if (
            lineVariable &&
            isPortableExpressionTypeAccepted(lineVariable.valueType, expectedTypes)
        ) {
            return {
                kind: "line_variable",
                name: lineVariable.name,
                valueType: lineVariable.valueType,
            };
        }
        const parameter = symbol ? functionContext.parameters.get(symbol.id) : undefined;
        if (parameter && isPortableExpressionTypeAccepted(parameter.type, expectedTypes)) {
            return { kind: "parameter", name: parameter.name, valueType: parameter.type };
        }
    }
    for (const expectedType of expectedTypes) {
        try {
            return analyzeExpressionAsType(
                expression,
                expectedType,
                checker,
                resolving,
                eventContext,
                functionContext,
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
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighExpression {
    const plotVariable = analyzePlotVariableRead(
        expression,
        expectedType,
        checker,
        functionContext,
    );
    if (plotVariable) return plotVariable;
    const gameValue = analyzeTargetGameValueExpression(
        expression,
        expectedType,
        checker,
        eventContext,
        functionContext,
    );
    if (gameValue) return gameValue;
    const eventField = analyzeEventFieldExpression(
        expression,
        expectedType,
        checker,
        eventContext,
    );
    if (eventField) {
        return eventField;
    }
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
            eventContext,
            functionContext,
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
                eventContext,
                functionContext,
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
        case "boolean":
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

function analyzePlotVariableRead(
    expression: ts.Expression,
    expectedType: string,
    checker: Checker,
    context?: FunctionContext,
): import("@nocuft/dfir").HighPlotVariableExpression | undefined {
    if (
        !context ||
        !ts.isCallExpression(expression) ||
        expression.arguments.length !== 0 ||
        !ts.isPropertyAccessExpression(expression.expression) ||
        expression.expression.name.text !== "get" ||
        !ts.isIdentifier(expression.expression.expression)
    ) return undefined;
    const symbol = checker.getSymbolAtLocation(expression.expression.expression);
    const variable = symbol ? context.plotVariables.get(symbol.id) : undefined;
    if (!variable) return undefined;
    if (!isPortableExpressionTypeAccepted(variable.valueType, [expectedType])) {
        throw unsupported(expression, `${expectedType} plot variable`);
    }
    return {
        kind: "plot_variable",
        name: variable.name,
        scope: "unsaved",
        valueType: variable.valueType,
    };
}

function analyzeTargetGameValueExpression(
    expression: ts.Expression,
    expectedType: string,
    checker: Checker,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): import("@nocuft/dfir").HighGameValueExpression | undefined {
    if (
        !ts.isCallExpression(expression) ||
        expression.arguments.length !== 0 ||
        !ts.isPropertyAccessExpression(expression.expression)
    ) return undefined;
    const method = expression.expression.name.text;
    const binding = Object.values(targetGameValues).find(
        (candidate) => candidate.method === method,
    );
    if (
        !binding ||
        (binding.valueType !== expectedType && expectedType !== "any") ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(expression.expression.name),
            method,
            "/generated/player-values.d.ts",
            checker,
        )
    ) return undefined;
    const receiver = expression.expression.expression;
    const eventPlayer =
        eventContext &&
        ts.isPropertyAccessExpression(receiver) &&
        receiver.name.text === "player" &&
        ts.isIdentifier(receiver.expression) &&
        checker.getSymbolAtLocation(receiver.expression) === eventContext.parameter;
    const functionPlayer =
        functionContext?.playerTargetSymbol &&
        ts.isIdentifier(receiver) &&
        checker.getSymbolAtLocation(receiver)?.id === functionContext.playerTargetSymbol.id;
    if (!eventPlayer && !functionPlayer) return undefined;
    return {
        kind: "game_value",
        value: binding.id,
        valueType: binding.valueType,
        receiver: "current_player",
    };
}

function isPortableExpressionTypeAccepted(type: FunctionValueType, expected: readonly string[]): boolean {
    return expected.includes("any") || expected.includes(type)
        || (expected.includes("component") && ["text", "number", "boolean"].includes(type));
}

function analyzeEventFieldExpression(
    expression: ts.Expression,
    expectedType: string,
    checker: Checker,
    context?: EventExpressionContext,
): HighExpression | undefined {
    if (
        !context ||
        !ts.isPropertyAccessExpression(expression) ||
        !ts.isIdentifier(expression.expression) ||
        checker.getSymbolAtLocation(expression.expression) !== context.parameter
    ) {
        return undefined;
    }
    const field = context.fields[expression.name.text];
    if (!field) {
        return undefined;
    }
    if (!isEventFieldTypeAccepted(field.type, expectedType)) {
        throw new Error(
            `Event field ${expression.name.text} has native type ${field.type}; expected ${expectedType}`,
        );
    }
    return {
        kind: "event_field",
        event: context.eventId,
        field: expression.name.text,
        valueType: field.type,
    };
}

function isEventFieldTypeAccepted(
    fieldType: HighEventFieldType,
    expectedType: string,
): boolean {
    return (
        expectedType === "any" ||
        fieldType === expectedType ||
        (expectedType === "component" &&
            (fieldType === "text" || fieldType === "number"))
    );
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
