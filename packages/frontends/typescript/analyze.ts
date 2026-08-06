import type {
    HighArgument,
    HighEvent,
    HighEventActionStatement,
    HighExpression,
    HighEventEntityRole,
    HighEventFieldType,
    HighDictionaryGetDeclaration,
    HighFunction,
    HighProcess,
    HighIntrinsicStatement,
    HighModule,
    HighParameter,
    HighReceiver,
    HighSelectionExpression,
    HighTemplate,
    HighValueParameter,
    DictionaryValueType,
    ListValueType,
    ValueType,
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
import { itemTransformBindings } from "./generated/item-transform-bindings.js";
import { structuralBindings } from "./generated/structural-bindings.js";

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
    synthesizedTemplateNames: string[];
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
            rejectUserFunctionSpreads(sourceFile, project.checker);
            rejectInvalidDictionaryConstructors(sourceFile, project.checker);

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
            const synthesis: SynthesisContext = {
                functions: [],
                occupiedNames: new Set(
                    sourceFile.statements.flatMap((statement) => {
                        if (ts.isFunctionDeclaration(statement) && statement.name) {
                            return [statement.name.text];
                        }
                        if (ts.isVariableStatement(statement)) {
                            return statement.declarationList.declarations.flatMap((declaration) =>
                                ts.isIdentifier(declaration.name) ? [declaration.name.text] : [],
                            );
                        }
                        return [];
                    }),
                ),
                nextHelper: 1,
            };
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
            const variables = new Map<number, StoredVariableBinding>();
            const projectSources = new Set(sourceFiles);
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
                    const variable = analyzeStoredVariableDeclaration(declaration, project.checker);
                    if (variable && symbol) variables.set(symbol.id, variable);
                }
            }
            const pendingFunctions: Array<{
                declaration: ts.FunctionDeclaration;
                callable: Callable;
            }> = [];
            const resolveFunction = (symbol: TypeScriptSymbol): Callable | undefined => {
                const existing = localFunctions.get(symbol.id);
                if (existing) return existing;
                const declaration = symbol.declarations
                    ?.map((candidate) => candidate.resolve())
                    .find((candidate): candidate is ts.FunctionDeclaration =>
                        candidate !== undefined
                        && ts.isFunctionDeclaration(candidate)
                        && candidate.name !== undefined
                        && candidate.body !== undefined
                        && ts.isSourceFile(candidate.parent)
                        && projectSources.has(resolve(candidate.getSourceFile().fileName)),
                    );
                if (!declaration) return undefined;
                const signature = analyzeFunctionSignature(declaration, project.checker);
                const callable = {
                    name: allocateHelperName(synthesis, "imported"),
                    parameters: signature.parameters,
                };
                localFunctions.set(symbol.id, callable);
                pendingFunctions.push({ declaration, callable });
                return callable;
            };
            const templates: HighTemplate[] = sourceFile.statements.flatMap<HighTemplate>((statement) => {
                if (ts.isFunctionDeclaration(statement)) {
                    return statement.name && statement.body
                        ? [analyzeFunction(statement, project.checker, localFunctions, resolveFunction, packageFunctions, localProcesses, variables, synthesis)]
                        : [];
                }
                if (ts.isVariableStatement(statement)) {
                    return statement.declarationList.declarations.flatMap<HighTemplate>(
                        (declaration) => {
                            const symbol = ts.isIdentifier(declaration.name)
                                ? project.checker.getSymbolAtLocation(declaration.name)
                                : undefined;
                            if (symbol && variables.has(symbol.id)) return [];
                            const registration = processRegistrations.get(declaration);
                            return registration
                                ? [analyzeProcessRegistration(
                                      registration,
                                      project.checker,
                                      localFunctions,
                                      resolveFunction,
                                       packageFunctions,
                                       localProcesses,
                                       variables,
                                       synthesis,
                                       isExported(statement),
                                  )]
                                : isExported(statement)
                                  ? [analyzeEventRegistration(
                                      declaration,
                                      project.checker,
                                      localFunctions,
                                      resolveFunction,
                                       packageFunctions,
                                       localProcesses,
                                       variables,
                                       synthesis,
                                   )]
                                  : [];
                        },
                    );
                }
                return [];
            });
            const importedFunctions: HighFunction[] = [];
            for (let index = 0; index < pendingFunctions.length; index += 1) {
                const pending = pendingFunctions[index];
                importedFunctions.push(analyzeFunction(
                    pending.declaration,
                    project.checker,
                    localFunctions,
                    resolveFunction,
                    packageFunctions,
                    localProcesses,
                    variables,
                    synthesis,
                    pending.callable.name,
                    false,
                ));
            }
            const importedPaths = [...new Set(pendingFunctions.map(({ declaration }) =>
                resolve(declaration.getSourceFile().fileName)))];
            const importedDiagnostics = importedPaths.flatMap((path) => [
                ...project.program.getSyntacticDiagnostics(path),
                ...project.program.getBindDiagnostics(path),
                ...project.program.getSemanticDiagnostics(path),
            ]);
            if (importedDiagnostics.length > 0) {
                throw new TypeScriptAnalysisError(
                    formatDiagnostics(importedDiagnostics),
                    sourceFiles,
                );
            }

            return {
                module: {
                    kind: "module",
                    templates: [...templates, ...importedFunctions, ...synthesis.functions],
                },
                sourceFiles,
                synthesizedTemplateNames: synthesis.functions.map(({ name }) => name),
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
        if (specifier !== undefined && specifier !== "nocuft") {
            throw unsupported(statement, `package import; only nocuft is allowed, found ${specifier}`);
        }
    }
}

function rejectUserFunctionSpreads(sourceFile: ts.SourceFile, checker: Checker): void {
    const visit = (node: ts.Node): void => {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
            const symbol = resolveAliasedSymbol(checker.getSymbolAtLocation(node.expression), checker);
            const userFunction = symbol !== undefined
                && (symbol.flags & SymbolFlags.Function) !== 0
                && symbol.declarations?.some((declaration) =>
                    !resolve(declaration.path).replaceAll("\\", "/").includes("/node_modules/")) === true;
            if (userFunction) {
                const spread = node.arguments.find(ts.isSpreadElement);
                if (spread) {
                    throw unsupported(
                        spread,
                        "dynamic List spread in a user function call; pass rest arguments explicitly",
                    );
                }
            }
        }
        node.forEachChild(visit);
    };
    visit(sourceFile);
}

function rejectInvalidDictionaryConstructors(sourceFile: ts.SourceFile, checker: Checker): void {
    const visit = (node: ts.Node): void => {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) &&
            isSdkSymbol(checker.getSymbolAtLocation(node.expression), "dictionary", "/values/index.d.ts", checker)) {
            const form = dictionaryConstructorForm(node);
            if (form.kind === "invalid") throw unsupported(node, form.reason);
        }
        node.forEachChild(visit);
    };
    visit(sourceFile);
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
    resolveFunction: (symbol: TypeScriptSymbol) => Callable | undefined,
    packageFunctions: ReadonlyMap<string, Callable>,
    localProcesses: ReadonlyMap<number, Callable>,
    variables: ReadonlyMap<number, StoredVariableBinding>,
    synthesis: SynthesisContext,
    name?: string,
    exported = isExported(declaration),
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
        templateKind: "function",
        parameters,
        playerTargetSymbol,
        localFunctions,
        resolveFunction,
        packageFunctions,
        localProcesses,
        variables,
        synthesis,
    });

    return {
        kind: "function",
        name: name ?? signature.name,
        ...(!exported ? { exported: false } : {}),
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

interface SynthesisContext {
    functions: HighFunction[];
    occupiedNames: Set<string>;
    nextHelper: number;
}

function allocateHelperName(context: SynthesisContext, purpose: string): string {
    let name: string;
    do {
        name = `__nocuft_${purpose}_${context.nextHelper++}`;
    } while (context.occupiedNames.has(name));
    context.occupiedNames.add(name);
    return name;
}

interface StoredVariableBinding {
    owner: "plot" | "player";
    name: string;
    scope: "unsaved" | "saved";
    valueType: ValueType;
    enumValues?: readonly string[];
}

function storedVariableBinding(
    symbol: TypeScriptSymbol | undefined,
    checker: Checker,
    variables: ReadonlyMap<number, StoredVariableBinding>,
): StoredVariableBinding | undefined {
    const resolved = resolveAliasedSymbol(symbol, checker);
    if (!resolved) return undefined;
    const registered = variables.get(resolved.id);
    if (registered) return registered;
    const declaration = resolved.valueDeclaration?.resolve();
    return declaration && ts.isVariableDeclaration(declaration)
        ? analyzeStoredVariableDeclaration(declaration, checker)
        : undefined;
}

function analyzeStoredVariableDeclaration(
    declaration: ts.VariableDeclaration,
    checker: Checker,
): StoredVariableBinding | undefined {
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
        !["game", "saved"].includes(factory.name.text) ||
        !ts.isPropertyAccessExpression(factory.expression) ||
        factory.expression.name.text !== "var" ||
        !ts.isIdentifier(factory.expression.expression)
    ) return undefined;
    const root = factory.expression.expression;
    const owner = isSdkSymbol(checker.getSymbolAtLocation(root), "plot", "/plot.d.ts", checker)
        ? "plot"
        : isSdkSymbol(checker.getSymbolAtLocation(root), "players", "/players.d.ts", checker)
          ? "player"
          : undefined;
    if (!owner) return undefined;
    const method = methodNode.text;
    if (
        !["string", "number", "boolean", "list", "dictionary", "enum"].includes(method) ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(methodNode),
            method,
            "/variables/variables.d.ts",
            checker,
        )
    ) {
        throw unsupported(call, `${owner} variable factory`);
    }
    if (
        call.arguments.length < (method === "enum" ? 2 : 1) ||
        call.arguments.some((argument) => !ts.isStringLiteralLikeNode(argument))
    ) {
        throw unsupported(call, "explicitly named stored variable");
    }
    if (method !== "enum" && call.arguments.length !== 1) {
        throw unsupported(call, "stored variable factory arguments");
    }
    const name = stringLiteralText(call.arguments[0]);
    if (!name) throw unsupported(call.arguments[0], "non-empty plot variable name");
    if (name.startsWith("%uuid ")) {
        throw unsupported(call.arguments[0], "stored variable name not beginning with reserved %uuid prefix");
    }
    const enumValues = method === "enum"
        ? call.arguments.slice(1).map(stringLiteralText)
        : undefined;
    if (enumValues && (enumValues.some((value) => !value) || new Set(enumValues).size !== enumValues.length)) {
        throw unsupported(call, "unique non-empty enum values");
    }
    const listType = method === "list"
        ? listValueTypeArgument(call.typeArguments?.[0], checker)
        : undefined;
    if (method === "list" && !listType) {
        throw unsupported(call, "typed stored list variable");
    }
    const dictionaryType = method === "dictionary"
        ? dictionaryValueTypeArgument(call.typeArguments?.[0], checker)
        : undefined;
    if (method === "dictionary" && !dictionaryType) {
        throw unsupported(call, "typed stored dictionary variable");
    }
    return {
        owner,
        name,
        scope: factory.name.text === "saved" ? "saved" : "unsaved",
        valueType: listType ?? dictionaryType ?? (method === "number" ? "number" : method === "boolean" ? "boolean" : "text"),
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
    let hasRest = false;
    for (const [index, parameter] of declaration.parameters.entries()) {
        if (!ts.isIdentifier(parameter.name) || parameter.questionToken || parameter.initializer) {
            throw unsupported(parameter, "required named function parameter");
        }
        if (parameter.dotDotDotToken) {
            if (hasRest || index !== declaration.parameters.length - 1) {
                throw unsupported(parameter, "single final rest parameter");
            }
            const elementType = restElementTypeNode(parameter.type, checker);
            if (!elementType) throw unsupported(parameter, "portable Nocuft rest parameter array");
            hasRest = true;
            parameters.push({
                kind: "value",
                name: parameter.name.text,
                type: { kind: "list", elementType },
                rest: true,
            });
            continue;
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

function restElementTypeNode(
    node: ts.TypeNode | undefined,
    checker: Checker,
): ValueType | undefined {
    if (!node || !ts.isArrayTypeNode(node)) return undefined;
    return portableArrayElementTypeNode(node.elementType, checker);
}

function portableArrayElementTypeNode(
    node: ts.TypeNode,
    checker: Checker,
): ValueType | undefined {
    if (ts.isArrayTypeNode(node)) {
        const elementType = portableArrayElementTypeNode(node.elementType, checker);
        return elementType ? { kind: "list", elementType } : undefined;
    }
    return functionValueTypeNode(node, checker);
}

function functionValueTypeNode(
    node: ts.TypeNode | undefined,
    checker: Checker,
): ValueType | undefined {
    switch (node?.kind) {
        case ts.SyntaxKind.StringKeyword: return "text";
        case ts.SyntaxKind.NumberKeyword: return "number";
        case ts.SyntaxKind.BooleanKeyword: return "boolean";
    }
    if (!node || !ts.isTypeReferenceNode(node) || !ts.isIdentifier(node.typeName)) return undefined;
    const symbol = checker.getSymbolAtLocation(node.typeName);
    if (isSdkSymbol(symbol, "List", "/values/index.d.ts", checker)) {
        return listValueTypeArgument(node.typeArguments?.[0], checker);
    }
    if (isSdkSymbol(symbol, "Dictionary", "/values/index.d.ts", checker)) {
        return dictionaryValueTypeArgument(node.typeArguments?.[0], checker);
    }
    if (isSdkSymbol(symbol, "ComponentInput", "/values/index.d.ts", checker)) return "component";
    if (isSdkSymbol(symbol, "Location", "/values/index.d.ts", checker)) return "location";
    if (isSdkSymbol(symbol, "Item", "/values/index.d.ts", checker)) return "item";
    if (isSdkSymbol(symbol, "SoundInput", "/generated/sounds.d.ts", checker)) return "sound";
    if (isSdkSymbol(symbol, "AnyValueInput", "/values/index.d.ts", checker)) return "any";
    return undefined;
}

function listValueTypeArgument(
    node: ts.TypeNode | undefined,
    checker: Checker,
): ListValueType | undefined {
    if (!node) return { kind: "list", elementType: "any" };
    const elementType = functionValueTypeNode(node, checker);
    return elementType ? { kind: "list", elementType } : undefined;
}

function dictionaryValueTypeArgument(
    node: ts.TypeNode | undefined,
    checker: Checker,
): DictionaryValueType | undefined {
    if (!node) return undefined;
    const valueType = functionValueTypeNode(node, checker);
    return valueType ? { kind: "dictionary", valueType } : undefined;
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
    resolveFunction: (symbol: TypeScriptSymbol) => Callable | undefined,
    packageFunctions: ReadonlyMap<string, Callable>,
    localProcesses: ReadonlyMap<number, Callable>,
    variables: ReadonlyMap<number, StoredVariableBinding>,
    synthesis: SynthesisContext,
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
                templateKind: "process",
                parameters,
                localFunctions,
                resolveFunction,
                packageFunctions,
                localProcesses,
                variables,
                synthesis,
            },
        ),
    };
}

function analyzeEventRegistration(
    declaration: ts.VariableDeclaration,
    checker: Checker,
    localFunctions: ReadonlyMap<number, Callable>,
    resolveFunction: (symbol: TypeScriptSymbol) => Callable | undefined,
    packageFunctions: ReadonlyMap<string, Callable>,
    localProcesses: ReadonlyMap<number, Callable>,
    variables: ReadonlyMap<number, StoredVariableBinding>,
    synthesis: SynthesisContext,
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
                templateKind: "event",
                parameters: new Map(),
                localFunctions,
                resolveFunction,
                packageFunctions,
                localProcesses,
                variables,
                synthesis,
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
    statementsOverride?: readonly ts.Statement[],
): import("@nocuft/dfir").HighStatement[] {
    const lineVariables = functionContext?.lineVariables ?? new Map();
    const lineVariableNames = functionContext?.lineVariableNames ?? new Map();
    const selectionSnapshots = functionContext?.selectionSnapshots ?? new Map();
    if (functionContext && (!functionContext.lineVariables || !functionContext.lineVariableNames || !functionContext.selectionSnapshots)) {
        functionContext = { ...functionContext, lineVariables, lineVariableNames, selectionSnapshots };
    }
    if (!functionContext) throw new Error("Missing template analysis context");
    const statements = statementsOverride ?? body.statements;
    return statements.flatMap<import("@nocuft/dfir").HighStatement>((statement) => {
        if (ts.isIfStatement(statement)) {
            const condition = analyzeCondition(
                statement.expression,
                checker,
                eventParameter,
                eventContext,
                functionContext,
            );
            if (!ts.isBlock(statement.thenStatement)) {
                throw unsupported(statement.thenStatement, "if block");
            }
            if (statement.elseStatement && !ts.isBlock(statement.elseStatement)) {
                throw unsupported(statement.elseStatement, "else block");
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
                ...(statement.elseStatement
                    ? {
                          elseBody: analyzeBody(
                              statement.elseStatement as ts.Block,
                              checker,
                              eventParameter,
                              eventEntityRoles,
                              cancellable,
                              eventContext,
                              functionContext,
                          ),
                      }
                    : {}),
            };
        }
        if (ts.isForStatement(statement)) {
            if (
                !statement.initializer ||
                !ts.isVariableDeclarationList(statement.initializer) ||
                !(statement.initializer.flags & ts.NodeFlags.Let) ||
                statement.initializer.declarations.length !== 1 ||
                !statement.condition ||
                !statement.incrementor ||
                !ts.isBlock(statement.statement)
            ) throw unsupported(statement, "canonical numeric for loop");
            const declaration = statement.initializer.declarations[0];
            if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
                throw unsupported(declaration, "initialized for-loop variable");
            }
            const variable = registerLineVariable(declaration.name, "number", checker, functionContext);
            const initializer = {
                kind: "declare_line_variable" as const,
                name: variable.name,
                valueType: "number" as const,
                initializer: analyzeExpression(
                    declaration.initializer,
                    ["number"],
                    checker,
                    new Set(),
                    eventContext,
                    functionContext,
                ),
            };
            const condition = analyzeCondition(
                statement.condition,
                checker,
                eventParameter,
                eventContext,
                functionContext,
            );
            if (
                condition.kind !== "comparison" ||
                condition.left.kind !== "line_variable" ||
                condition.left.name !== variable.name
            ) throw unsupported(statement.condition, "for-loop induction comparison");
            const update = analyzeLineVariableMutation(
                statement.incrementor,
                checker,
                eventContext,
                functionContext,
            );
            if (!update || update.variable.name !== variable.name) {
                throw unsupported(statement.incrementor, "for-loop induction update");
            }
            return {
                kind: "loop",
                form: "for",
                initializer,
                condition,
                update,
                body: analyzeBody(
                    statement.statement,
                    checker,
                    eventParameter,
                    eventEntityRoles,
                    cancellable,
                    eventContext,
                    { ...functionContext, loopDepth: (functionContext.loopDepth ?? 0) + 1 },
                ),
            };
        }
        if (ts.isForOfStatement(statement)) {
            if (
                !ts.isVariableDeclarationList(statement.initializer) ||
                !(statement.initializer.flags & (ts.NodeFlags.Let | ts.NodeFlags.Const)) ||
                statement.initializer.declarations.length !== 1 ||
                !ts.isBlock(statement.statement)
            ) throw unsupported(statement, "for-of collection loop");
            const declaration = statement.initializer.declarations[0];
            const iterableType = expressionValueType(statement.expression, checker, functionContext);
            if (!iterableType || typeof iterableType === "string" || declaration.initializer) {
                throw unsupported(statement, "for-of collection loop");
            }
            if (isDictionaryValueType(iterableType)) {
                if (!ts.isArrayBindingPattern(declaration.name) || declaration.name.elements.length !== 2 ||
                    declaration.name.elements.some((element) => !ts.isBindingElement(element) ||
                        element.dotDotDotToken || element.initializer || !element.name || !ts.isIdentifier(element.name))) {
                    throw unsupported(declaration.name, "dictionary [key, value] binding");
                }
                const keyVariable = registerLineVariable(
                    declaration.name.elements[0].name as ts.Identifier, "text", checker, functionContext,
                );
                const valueVariable = registerLineVariable(
                    declaration.name.elements[1].name as ts.Identifier,
                    iterableType.valueType,
                    checker,
                    functionContext,
                );
                return {
                    kind: "for_each_dictionary",
                    keyVariable: keyVariable as typeof keyVariable & { valueType: "text" },
                    valueVariable,
                    dictionary: analyzeExpression(
                        statement.expression, [iterableType], checker, new Set(), eventContext, functionContext,
                    ),
                    body: analyzeBody(
                        statement.statement, checker, eventParameter, eventEntityRoles, cancellable,
                        eventContext, { ...functionContext, loopDepth: (functionContext.loopDepth ?? 0) + 1 },
                    ),
                };
            }
            if (!ts.isIdentifier(declaration.name)) throw unsupported(declaration.name, "list loop variable");
            const variable = registerLineVariable(
                declaration.name,
                iterableType.elementType,
                checker,
                functionContext,
            );
            return {
                kind: "for_each",
                variable,
                iterable: analyzeExpression(
                    statement.expression,
                    [iterableType],
                    checker,
                    new Set(),
                    eventContext,
                    functionContext,
                ),
                body: analyzeBody(
                    statement.statement,
                    checker,
                    eventParameter,
                    eventEntityRoles,
                    cancellable,
                    eventContext,
                    { ...functionContext, loopDepth: (functionContext.loopDepth ?? 0) + 1 },
                ),
            };
        }
        if (ts.isWhileStatement(statement) || ts.isDoStatement(statement)) {
            if (!ts.isBlock(statement.statement)) {
                throw unsupported(statement.statement, "loop block");
            }
            return {
                kind: "loop",
                form: ts.isWhileStatement(statement) ? "while" : "do_while",
                condition: analyzeCondition(
                    statement.expression,
                    checker,
                    eventParameter,
                    eventContext,
                    functionContext,
                ),
                body: analyzeBody(
                    statement.statement,
                    checker,
                    eventParameter,
                    eventEntityRoles,
                    cancellable,
                    eventContext,
                    { ...functionContext, loopDepth: (functionContext.loopDepth ?? 0) + 1 },
                ),
            };
        }
        if (ts.isBreakStatement(statement) || ts.isContinueStatement(statement)) {
            if (statement.label || (functionContext.loopDepth ?? 0) === 0) {
                throw unsupported(statement, "loop control outside a loop");
            }
            return {
                kind: "loop_control",
                control: ts.isBreakStatement(statement) ? "break" : "continue",
            };
        }
        if (ts.isReturnStatement(statement)) {
            if (statement.expression) throw unsupported(statement, "value-less return");
            return { kind: "return", context: functionContext.templateKind };
        }
        if (ts.isVariableStatement(statement)) {
            const snapshot = analyzeSelectionSnapshotDeclaration(
                statement,
                checker,
                functionContext,
            );
            if (snapshot !== undefined) return snapshot;
            if (statement.declarationList.declarations.length !== 1) {
                throw unsupported(statement, "line variable declaration");
            }
            const declaration = statement.declarationList.declarations[0];
            const dictionaryGet = analyzeDictionaryGetDeclaration(
                statement,
                checker,
                eventContext,
                functionContext,
            );
            if (dictionaryGet !== undefined) return dictionaryGet;
            const explicit =
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
                declaration.initializer.arguments.length !== 1;
            const factory = explicit
                ? undefined
                : (declaration.initializer as ts.CallExpression).expression;
            const factoryName = factory && ts.isPropertyAccessExpression(factory)
                ? factory.name.text
                : undefined;
            let valueType: ValueType | undefined = factoryName === "location"
                ? "location"
                : factoryName === "number"
                  ? "number"
                  : factoryName === "string"
                    ? "text"
                    : factoryName === "boolean"
                      ? "boolean"
                      : factoryName === "item"
                        ? "item"
                        : factoryName === "list"
                          ? expressionValueType(
                              (declaration.initializer as ts.CallExpression).arguments[0],
                              checker,
                              functionContext,
                          )
                        : factoryName === "dictionary"
                          ? expressionValueType(
                              (declaration.initializer as ts.CallExpression).arguments[0],
                              checker,
                              functionContext,
                          )
                       : undefined;
            let initializer = !explicit
                ? (declaration.initializer as ts.CallExpression).arguments[0]
                : declaration.initializer;
            if (!valueType) {
                if (!(statement.declarationList.flags & ts.NodeFlags.Let) ||
                    !ts.isIdentifier(declaration.name) || !declaration.initializer) {
                    throw unsupported(statement, "initialized mutable scalar line variable");
                }
                valueType = expressionValueType(declaration.initializer, checker, functionContext);
                initializer = declaration.initializer;
            }
            if (!valueType && initializer && ts.isObjectLiteralExpression(initializer)) {
                throw unsupported(initializer, "dictionary(...) constructor; arbitrary objects are not runtime values");
            }
            if (!valueType || !initializer || !ts.isIdentifier(declaration.name)) {
                throw unsupported(statement, "line variable declaration");
            }
            const variable = registerLineVariable(declaration.name, valueType, checker, functionContext);
            return {
                kind: "declare_line_variable",
                name: variable.name,
                valueType,
                initializer: analyzeExpression(
                    initializer,
                    [valueType],
                    checker,
                    new Set(),
                    eventContext,
                    functionContext,
                ),
            };
        }
        if (!ts.isExpressionStatement(statement)) {
            throw unsupported(statement, "function statement");
        }
        const lineMutation = analyzeLineVariableMutation(
            statement.expression,
            checker,
            eventContext,
            functionContext,
        );
        if (lineMutation) return lineMutation;
        if (!ts.isCallExpression(statement.expression)) {
            throw unsupported(statement, "function statement");
        }
        const statementCall = statement.expression;
        const statementMethod = ts.isPropertyAccessExpression(statementCall.expression)
            ? statementCall.expression
            : undefined;
        if (
            statementMethod &&
            Object.values(itemTransformBindings).some(
                (binding) => binding.method === statementMethod.name.text,
            ) &&
            isSdkSymbol(
                checker.getSymbolAtLocation(statementMethod.name),
                statementMethod.name.text,
                "/values/index.d.ts",
                checker,
            )
        ) {
            throw unsupported(statement, "assigned item transformation result");
        }
        const discarded = collectionExpression(statementCall, checker, functionContext);
        if (discarded?.form === "method" && discarded.transformation && discarded.sdkMember) {
            throw unsupported(
                statement,
                `assigned ${discarded.receiverType.kind} transformation result`,
            );
        }
        const playerVariableSet = analyzePlayerVariableSetCall(
            statement.expression,
            checker,
            functionContext,
            eventContext,
        );
        if (playerVariableSet) return playerVariableSet;
        const variableMutation = analyzeStoredVariableMutation(
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

function analyzeSelectionSnapshotDeclaration(
    statement: ts.VariableStatement,
    checker: Checker,
    context: FunctionContext,
): import("@nocuft/dfir").HighSelectionSnapshotDeclaration[] | undefined {
    if (statement.declarationList.declarations.length !== 1) return undefined;
    const declaration = statement.declarationList.declarations[0];
    if (!declaration.initializer) return undefined;

    const alias = ts.isIdentifier(declaration.initializer)
        ? snapshotBinding(declaration.initializer, checker, context)
        : undefined;
    const selection = alias
        ? undefined
        : analyzeSelectionExpression(declaration.initializer, checker, context.eventContext, context);
    if (!alias && (!selection || selection.resultType !== "player")) return undefined;
    if (!(statement.declarationList.flags & ts.NodeFlags.Const) || !ts.isIdentifier(declaration.name)) {
        throw unsupported(statement, "const player selection snapshot declaration");
    }
    const symbol = checker.getSymbolAtLocation(declaration.name);
    if (!symbol) throw unsupported(declaration.name, "player selection snapshot binding");
    if (alias) {
        context.selectionSnapshots?.set(symbol.id, alias);
        return [];
    }
    const cardinality = selectionCardinality(declaration.initializer, checker, context);
    const names = context.lineVariableNames as Map<string, number>;
    const baseName = `__nocuft_selection_${declaration.name.text}`;
    const name = allocateLineName(baseName, names);
    const binding: SelectionSnapshotBinding = {
        name,
        sizeName: allocateLineName(`${baseName}_count`, names),
        resultType: "player",
        cardinality,
    };
    context.selectionSnapshots?.set(symbol.id, binding);
    return [{
        kind: "declare_selection_snapshot",
        ...binding,
        initializer: selection as HighSelectionExpression,
    }];
}

function selectionCardinality(
    expression: ts.Expression,
    checker: Checker,
    context: FunctionContext,
): "many" | "at_most_one" {
    if (ts.isIdentifier(expression)) {
        return snapshotBinding(expression, checker, context)?.cardinality ?? "many";
    }
    if (!ts.isCallExpression(expression) || !ts.isPropertyAccessExpression(expression.expression)) {
        return "many";
    }
    const method = expression.expression.name.text;
    if (method === "one") return "at_most_one";
    const base = selectionCardinality(expression.expression.expression, checker, context);
    if (method === "where") return base;
    if (["random", "nearest", "nearestWith", "farthest", "farthestWith"].includes(method)) {
        const count = expression.arguments.at(-1);
        return count && ts.isNumericLiteral(count) && Number(count.text) <= 1
            ? "at_most_one"
            : base === "at_most_one" ? base : "many";
    }
    return "many";
}

function analyzeDictionaryGetDeclaration(
    statement: ts.VariableStatement,
    checker: Checker,
    eventContext: EventExpressionContext | undefined,
    functionContext: FunctionContext,
): HighDictionaryGetDeclaration | undefined {
    const declaration = statement.declarationList.declarations[0];
    const initializer = declaration.initializer;
    if (!initializer || !ts.isCallExpression(initializer) ||
        !ts.isPropertyAccessExpression(initializer.expression) ||
        initializer.expression.name.text !== "get" ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(initializer.expression.name), "get", "/values/index.d.ts", checker,
        )) return undefined;
    const dictionaryType = expressionValueType(initializer.expression.expression, checker, functionContext);
    if (!dictionaryType || !isDictionaryValueType(dictionaryType)) return undefined;
    if (!(statement.declarationList.flags & (ts.NodeFlags.Let | ts.NodeFlags.Const)) ||
        !ts.isArrayBindingPattern(declaration.name) || declaration.name.elements.length !== 2 ||
        declaration.name.elements.some((element) => !ts.isBindingElement(element) ||
            element.dotDotDotToken || element.initializer || !element.name || !ts.isIdentifier(element.name))) {
        throw unsupported(declaration.name, "dictionary [value, found] binding");
    }
    if (initializer.arguments.length !== 1) throw unsupported(initializer, "dictionary get key");
    const key = analyzeExpression(
        initializer.arguments[0], ["text"], checker, new Set(), eventContext, functionContext,
    );
    const dictionary = analyzeExpression(
        initializer.expression.expression, [dictionaryType], checker, new Set(), eventContext, functionContext,
    );
    const valueVariable = registerLineVariable(
        declaration.name.elements[0].name as ts.Identifier, dictionaryType.valueType, checker, functionContext,
    );
    const foundVariable = registerLineVariable(
        declaration.name.elements[1].name as ts.Identifier, "boolean", checker, functionContext,
    );
    return {
        kind: "declare_dictionary_get",
        valueVariable,
        foundVariable: foundVariable as typeof foundVariable & { valueType: "boolean" },
        dictionary,
        key,
    };
}

function registerLineVariable(
    identifier: ts.Identifier,
    valueType: ValueType,
    checker: Checker,
    context: FunctionContext,
): import("@nocuft/dfir").HighLineVariableExpression {
    const symbol = checker.getSymbolAtLocation(identifier);
    if (!symbol) throw unsupported(identifier, "line variable");
    const names = context.lineVariableNames as Map<string, number>;
    const baseName = `__nocuft_line_${identifier.text}`;
    const name = allocateLineName(baseName, names);
    context.lineVariables?.set(
        symbol.id,
        { name, sourceName: identifier.text, valueType },
    );
    return { kind: "line_variable", name, valueType };
}

function allocateLineName(baseName: string, names: Map<string, number>): string {
    const occurrence = (names.get(baseName) ?? 0) + 1;
    names.set(baseName, occurrence);
    return occurrence === 1 ? baseName : `${baseName}_${occurrence}`;
}

function analyzeCondition(
    expression: ts.Expression,
    checker: Checker,
    eventParameter?: TypeScriptSymbol,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): import("@nocuft/dfir").HighCondition {
    if (ts.isParenthesizedExpression(expression)) {
        return analyzeCondition(
            expression.expression,
            checker,
            eventParameter,
            eventContext,
            functionContext,
        );
    }
    if (
        ts.isPrefixUnaryExpression(expression) &&
        expression.operator === ts.SyntaxKind.ExclamationToken
    ) {
        return {
            kind: "logical",
            operator: "not",
            operands: [analyzeCondition(
                expression.operand,
                checker,
                eventParameter,
                eventContext,
                functionContext,
            )],
        };
    }
    if (
        ts.isBinaryExpression(expression) &&
        (expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
            expression.operatorToken.kind === ts.SyntaxKind.BarBarToken)
    ) {
        return {
            kind: "logical",
            operator: expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
                ? "and"
                : "or",
            operands: [
                analyzeCondition(expression.left, checker, eventParameter, eventContext, functionContext),
                analyzeCondition(expression.right, checker, eventParameter, eventContext, functionContext),
            ],
        };
    }
    if (ts.isCallExpression(expression) && expression.arguments.length === 1 &&
        ts.isPropertyAccessExpression(expression.expression) && expression.expression.name.text === "has" &&
        isSdkSymbol(checker.getSymbolAtLocation(expression.expression.name), "has", "/values/index.d.ts", checker)) {
        const dictionaryType = expressionValueType(expression.expression.expression, checker, functionContext);
        if (!dictionaryType || !isDictionaryValueType(dictionaryType)) {
            throw unsupported(expression.expression.expression, "dictionary has receiver");
        }
        return {
            kind: "dictionary_has_key",
            dictionary: analyzeExpression(
                expression.expression.expression, [dictionaryType], checker, new Set(), eventContext, functionContext,
            ),
            key: analyzeExpression(expression.arguments[0], ["text"], checker, new Set(), eventContext, functionContext),
        };
    }
    if (
        eventParameter &&
        ts.isBinaryExpression(expression) &&
        expression.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken
    ) {
        try {
            return analyzeHeldItemCondition(
                expression,
                checker,
                eventParameter,
                eventContext,
                functionContext,
            );
        } catch {
            // Continue with the portable comparison forms.
        }
    }
    if (ts.isBinaryExpression(expression)) {
        const action = comparisonAction(expression.operatorToken.kind);
        if (action) {
            if (!(action in structuralBindings.ifVariable)) {
                throw new Error(`Missing generated If Variable action ${action}`);
            }
            const binding = structuralBindings.ifVariable[
                action as keyof typeof structuralBindings.ifVariable
            ];
            return {
                kind: "comparison",
                action,
                left: analyzeExpression(
                    expression.left,
                    binding.inputs[0].acceptedTypes,
                    checker,
                    new Set(),
                    eventContext,
                    functionContext,
                ),
                right: analyzeExpression(
                    expression.right,
                    binding.inputs[1].acceptedTypes,
                    checker,
                    new Set(),
                    eventContext,
                    functionContext,
                ),
            };
        }
    }
    return {
        kind: "boolean_condition",
        value: analyzeExpression(
            expression,
            ["boolean"],
            checker,
            new Set(),
            eventContext,
            functionContext,
        ),
    };
}

function comparisonAction(kind: ts.SyntaxKind): string | undefined {
    switch (kind) {
        case ts.SyntaxKind.EqualsEqualsEqualsToken: return "=";
        case ts.SyntaxKind.ExclamationEqualsEqualsToken: return "!=";
        case ts.SyntaxKind.LessThanToken: return "<";
        case ts.SyntaxKind.LessThanEqualsToken: return "<=";
        case ts.SyntaxKind.GreaterThanToken: return ">";
        case ts.SyntaxKind.GreaterThanEqualsToken: return ">=";
        default: return undefined;
    }
}

function analyzeLineVariableMutation(
    expression: ts.Expression,
    checker: Checker,
    eventContext?: EventExpressionContext,
    context?: FunctionContext,
): import("@nocuft/dfir").HighSetVariableStatement | undefined {
    if (!context) return undefined;
    let identifier: ts.Identifier | undefined;
    let operation: string | undefined;
    let right: ts.Expression | undefined;
    if (ts.isBinaryExpression(expression) && ts.isIdentifier(expression.left)) {
        identifier = expression.left;
        right = expression.right;
        switch (expression.operatorToken.kind) {
            case ts.SyntaxKind.EqualsToken: operation = "="; break;
            case ts.SyntaxKind.PlusEqualsToken: operation = "+="; break;
            case ts.SyntaxKind.MinusEqualsToken: operation = "-="; break;
            case ts.SyntaxKind.AsteriskEqualsToken: operation = "x"; break;
            case ts.SyntaxKind.SlashEqualsToken: operation = "/"; break;
            case ts.SyntaxKind.PercentEqualsToken: operation = "%"; break;
            case ts.SyntaxKind.AsteriskAsteriskEqualsToken: operation = "Exponent"; break;
            default: return undefined;
        }
    } else if (
        (ts.isPrefixUnaryExpression(expression) || ts.isPostfixUnaryExpression(expression)) &&
        ts.isIdentifier(expression.operand) &&
        (expression.operator === ts.SyntaxKind.PlusPlusToken ||
            expression.operator === ts.SyntaxKind.MinusMinusToken)
    ) {
        identifier = expression.operand;
        operation = expression.operator === ts.SyntaxKind.PlusPlusToken ? "+=" : "-=";
    } else {
        return undefined;
    }
    const symbol = checker.getSymbolAtLocation(identifier);
    const binding = symbol ? context.lineVariables?.get(symbol.id) : undefined;
    if (!binding) return undefined;
    if (operation !== "=" && binding.valueType !== "number") {
        throw unsupported(expression, "numeric line variable mutation");
    }
    const variable = {
        kind: "line_variable" as const,
        name: binding.name,
        valueType: binding.valueType,
    };
    if (operation === "+=" || operation === "-=") {
        if (!(operation in structuralBindings.setVariable)) {
            throw new Error(`Missing generated Set Variable action ${operation}`);
        }
        return {
            kind: "set_variable",
            variable,
            operation,
            value: right
                ? analyzeExpression(right, ["number"], checker, new Set(), eventContext, context)
                : { kind: "number", value: 1 },
        };
    }
    const analyzed = analyzeExpression(
        right as ts.Expression,
        [binding.valueType],
        checker,
        new Set(),
        eventContext,
        context,
    );
    return operation === "="
        ? { kind: "set_variable", variable, value: analyzed }
        : {
              kind: "set_variable",
              variable,
              value: {
                  kind: "arithmetic",
                  operation,
                  operands: [variable, analyzed],
              },
          };
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
    const item = analyzeItem(
        expression.right,
        checker,
        new Set(),
        eventContext,
        functionContext,
    );
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

function analyzeStoredVariableMutation(
    call: ts.CallExpression,
    checker: Checker,
    context?: FunctionContext,
    eventContext?: EventExpressionContext,
): import("@nocuft/dfir").HighSetVariableStatement | import("@nocuft/dfir").HighClearVariableStatement | import("@nocuft/dfir").HighFunctionCallStatement | undefined {
    if (
        !context ||
        !ts.isPropertyAccessExpression(call.expression) ||
        !ts.isIdentifier(call.expression.expression)
    ) return undefined;
    const variable = storedVariableBinding(
        checker.getSymbolAtLocation(call.expression.expression),
        checker,
        context.variables,
    );
    if (!variable) return undefined;
    const method = call.expression.name.text;
    if (method === "clearAll") {
        throw unsupported(call, "player variable clearAll until native purge semantics are verified");
    }
    if (variable.owner === "player" && call.arguments.length === 0) {
        throw unsupported(call, "player variable target");
    }
    const receiver = variable.owner === "player"
        ? analyzePlayerArgument(call.arguments[0], checker, context)
        : undefined;
    if (receiver?.kind === "selection") {
        const clear = method === "clear" && call.arguments.length === 1;
        const set = method === "set" && call.arguments.length === 2;
        if (!clear && !set) throw unsupported(call, "stored variable mutation");
        const value = set ? analyzeExpression(
            call.arguments[1],
            [variable.valueType],
            checker,
            new Set(),
            eventContext,
            context,
        ) : undefined;
        if (value && variable.enumValues &&
            (value.kind !== "string" || !variable.enumValues.includes(value.value))) {
            throw unsupported(call.arguments[1], "declared enum value");
        }
        const helperName = allocateHelperName(
            context.synthesis,
            clear ? "clear_player_variable" : "set_player_variable",
        );
        context.synthesis.functions.push({
            kind: "function",
            name: helperName,
            exported: false,
            parameters: [
                ...(value ? [{ kind: "value" as const, name: "value", type: variable.valueType }] : []),
                { kind: "target", name: "player", target: "player" },
            ],
            body: [value ? {
                kind: "set_variable",
                variable: {
                    kind: "player_variable",
                    name: variable.name,
                    scope: variable.scope,
                    valueType: variable.valueType,
                    receiver: "current_player",
                },
                value: { kind: "parameter", name: "value", valueType: variable.valueType },
            } : {
                kind: "clear_variable",
                variable: {
                    kind: "player_variable",
                    name: variable.name,
                    scope: variable.scope,
                    valueType: variable.valueType,
                    receiver: "current_player",
                },
            }],
        });
        return {
            kind: "call_function",
            function: helperName,
            arguments: value ? [value] : [],
            receiver,
        };
    }
    const reference = variable.owner === "player" ? {
        kind: "player_variable" as const,
        name: variable.name,
        scope: variable.scope,
        valueType: variable.valueType,
        receiver: "current_player" as const,
    } : {
        kind: "plot_variable" as const,
        name: variable.name,
        scope: variable.scope,
        valueType: variable.valueType,
    };
    const valueIndex = variable.owner === "player" ? 1 : 0;
    const expectedCount = variable.owner === "player" ? 1 : 0;
    if (method === "clear" && call.arguments.length === expectedCount) {
        return { kind: "clear_variable", variable: reference };
    }
    if (method !== "set" || call.arguments.length !== valueIndex + 1) {
        throw unsupported(call, "stored variable mutation");
    }
    const value = analyzeExpression(
        call.arguments[valueIndex],
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
        throw unsupported(call.arguments[valueIndex], "declared enum value");
    }
    return { kind: "set_variable", variable: reference, value };
}

function analyzePlayerVariableSetCall(
    call: ts.CallExpression,
    checker: Checker,
    context?: FunctionContext,
    eventContext?: EventExpressionContext,
): import("@nocuft/dfir").HighSetVariableStatement | import("@nocuft/dfir").HighFunctionCallStatement | undefined {
    if (
        !context ||
        call.arguments.length !== 2 ||
        !ts.isPropertyAccessExpression(call.expression) ||
        call.expression.name.text !== "set" ||
        !ts.isIdentifier(call.arguments[0])
    ) return undefined;
    const variable = storedVariableBinding(
        checker.getSymbolAtLocation(call.arguments[0]),
        checker,
        context.variables,
    );
    if (!variable || variable.owner !== "player") return undefined;
    if (!isSdkSymbol(checker.getSymbolAtLocation(call.expression.name), "set", "/players.d.ts", checker)) {
        throw unsupported(call, "player variable selection mutation");
    }
    const receiver = analyzePlayerArgument(call.expression.expression, checker, context);
    const value = analyzeExpression(
        call.arguments[1],
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
        throw unsupported(call.arguments[1], "declared enum value");
    }
    if (receiver.kind === "selection") {
        const helperName = allocateHelperName(context.synthesis, "set_player_variable");
        context.synthesis.functions.push({
            kind: "function",
            name: helperName,
            exported: false,
            parameters: [
                { kind: "value", name: "value", type: variable.valueType },
                { kind: "target", name: "player", target: "player" },
            ],
            body: [{
                kind: "set_variable",
                variable: {
                    kind: "player_variable",
                    name: variable.name,
                    scope: variable.scope,
                    valueType: variable.valueType,
                    receiver: "current_player",
                },
                value: {
                    kind: "parameter",
                    name: "value",
                    valueType: variable.valueType,
                },
            }],
        });
        return {
            kind: "call_function",
            function: helperName,
            arguments: [value],
            receiver,
        };
    }
    return {
        kind: "set_variable",
        variable: {
            kind: "player_variable",
            name: variable.name,
            scope: variable.scope,
            valueType: variable.valueType,
            receiver: "current_player",
        },
        value,
    };
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
            const values = analyzePluralArguments(
                call.arguments.slice(parameter.sourceIndex),
                parameter.types,
                checker,
                eventContext,
                functionContext,
                parameter.minimumLength,
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

function analyzePluralArguments(
    arguments_: readonly ts.Expression[],
    elementTypes: readonly string[],
    checker: Checker,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
    minimumLength = 0,
): HighExpression[] {
    return arguments_.map((argument) => {
        if (ts.isSpreadElement(argument)) {
            if (minimumLength > 0) {
                throw unsupported(
                    argument,
                    `runtime List spread for a native input requiring at least ${minimumLength} value; nonempty length cannot be proven`,
                );
            }
            return analyzeExpression(
                argument.expression,
                elementTypes.map((elementType) => ({
                    kind: "list" as const,
                    elementType: elementType as ValueType,
                })),
                checker,
                new Set<number>(),
                eventContext,
                functionContext,
            );
        }
        return analyzeExpression(
            argument,
            elementTypes,
            checker,
            new Set<number>(),
            eventContext,
            functionContext,
        );
    });
}

interface FunctionContext {
    templateKind: "function" | "process" | "event";
    parameters: ReadonlyMap<number, HighValueParameter>;
    playerTargetSymbol?: TypeScriptSymbol;
    localFunctions: ReadonlyMap<number, Callable>;
    resolveFunction: (symbol: TypeScriptSymbol) => Callable | undefined;
    packageFunctions: ReadonlyMap<string, Callable>;
    localProcesses: ReadonlyMap<number, Callable>;
    eventParameter?: TypeScriptSymbol;
    eventEntityRoles?: EventEntityRoles;
    eventContext?: EventExpressionContext;
    variables: ReadonlyMap<number, StoredVariableBinding>;
    synthesis: SynthesisContext;
    lineVariables?: Map<number, {
        name: string;
        sourceName: string;
        valueType: ValueType;
    }>; 
    lineVariableNames?: Map<string, number>;
    selectionSnapshots?: Map<number, SelectionSnapshotBinding>;
    loopDepth?: number;
}

interface SelectionSnapshotBinding {
    name: string;
    sizeName: string;
    resultType: "player";
    cardinality: "many" | "at_most_one";
}

function snapshotBinding(
    identifier: ts.Identifier,
    checker: Checker,
    context?: FunctionContext,
): SelectionSnapshotBinding | undefined {
    const symbol = checker.getSymbolAtLocation(identifier);
    return symbol ? context?.selectionSnapshots?.get(symbol.id) : undefined;
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
        callable = context.resolveFunction(symbol);
    }
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
    const restIndex = callable.parameters.findIndex((parameter) =>
        parameter.kind === "value" && parameter.rest === true);
    const required = restIndex < 0 ? callable.parameters.length : restIndex;
    if (call.arguments.length < required || (restIndex < 0 && call.arguments.length !== required)) {
        throw new Error(restIndex < 0
            ? `Function ${callable.name} expects ${required} arguments`
            : `Function ${callable.name} expects at least ${required} arguments`);
    }
    if (call.arguments.some(ts.isSpreadElement)) {
        const spread = call.arguments.find(ts.isSpreadElement) as ts.SpreadElement;
        throw unsupported(spread, "dynamic List spread in a user function call; pass rest arguments explicitly");
    }
    let receiver: HighReceiver | undefined;
    const args: HighExpression[] = [];
    callable.parameters.forEach((parameter, index) => {
        const argument = call.arguments[index];
        if (parameter.kind === "target") {
            receiver = analyzePlayerArgument(argument, checker, context);
        } else if (parameter.rest === true) {
            for (const restArgument of call.arguments.slice(index)) {
                args.push(analyzeExpression(
                    restArgument,
                    [parameter.type.elementType],
                    checker,
                    new Set<number>(),
                    context.eventContext,
                    context,
                ));
            }
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

    if (
        (binding.operation === "control.skip" || binding.operation === "control.stop_repeat") &&
        (functionContext?.loopDepth ?? 0) === 0
    ) {
        throw unsupported(call, "repeat control outside a loop");
    }
    if (
        (binding.operation === "control.return" || binding.operation === "control.return_ntimes") &&
        functionContext?.templateKind !== "function"
    ) {
        throw unsupported(call, "function return control outside a function");
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
            const expressions = analyzePluralArguments(
                call.arguments.slice(parameter.sourceIndex),
                parameter.types,
                checker,
                eventContext,
                functionContext,
                parameter.minimumLength,
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
    if (ts.isIdentifier(expression)) {
        const snapshot = snapshotBinding(expression, checker, functionContext);
        return snapshot ? {
            kind: "selection",
            resultType: "player",
            source: { kind: "selection_snapshot", ...snapshot },
            filters: [],
        } : undefined;
    }
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
    if (method === "where") {
        if (
            base.resultType !== "player" ||
            !functionContext ||
            expression.arguments.length !== 2 ||
            !ts.isIdentifier(expression.arguments[0]) ||
            !isSdkSymbol(
                checker.getSymbolAtLocation(expression.expression.name),
                method,
                "/players.d.ts",
                checker,
            )
        ) {
            throw unsupported(expression, "player variable selection filter");
        }
        const variable = storedVariableBinding(
            checker.getSymbolAtLocation(expression.arguments[0]),
            checker,
            functionContext.variables,
        );
        if (!variable || variable.owner !== "player") {
            throw unsupported(expression.arguments[0], "player variable selection filter");
        }
        const value = analyzeExpression(
            expression.arguments[1],
            [variable.valueType],
            checker,
            new Set(),
            eventContext,
            functionContext,
        );
        if (
            variable.enumValues &&
            (value.kind !== "string" || !variable.enumValues.includes(value.value))
        ) {
            throw unsupported(expression.arguments[1], "declared enum value");
        }
        return {
            ...base,
            filters: [...base.filters, {
                operation: "select.FilterCondition",
                arguments: [
                    {
                        kind: "player_variable",
                        name: variable.name,
                        scope: variable.scope,
                        valueType: variable.valueType,
                        receiver: "selection",
                    },
                    value,
                ],
            }],
        };
    }
    if (method === "one") {
        if (
            base.resultType !== "player" ||
            expression.arguments.length !== 0 ||
            !isSdkSymbol(
                checker.getSymbolAtLocation(expression.expression.name),
                method,
                "/players.d.ts",
                checker,
            )
        ) {
            throw unsupported(expression, "single player selection");
        }
        return {
            ...base,
            filters: [...base.filters, {
                operation: "select.FilterRandom",
                arguments: [{ kind: "number", value: 1 }],
            }],
        };
    }
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

type ExpectedValueType = ValueType | string;

function sameValueType(left: ValueType, right: ValueType): boolean {
    if (typeof left === "string" || typeof right === "string") return left === right;
    if (left.kind !== right.kind) return false;
    return left.kind === "list"
        ? sameValueType(left.elementType, (right as ListValueType).elementType)
        : sameValueType(left.valueType, (right as DictionaryValueType).valueType);
}

function valueTypeAssignable(source: ValueType, target: ValueType): boolean {
    if (target === "any") return true;
    if (typeof source === "string" || typeof target === "string") {
        return source === target || (target === "component" && typeof source === "string" &&
            ["text", "number", "boolean"].includes(source));
    }
    if (source.kind !== target.kind) return false;
    return source.kind === "list"
        ? valueTypeAssignable(source.elementType, (target as ListValueType).elementType)
        : valueTypeAssignable(source.valueType, (target as DictionaryValueType).valueType);
}

function isListValueType(type: ValueType): type is ListValueType {
    return typeof type !== "string" && type.kind === "list";
}

function isDictionaryValueType(type: ValueType): type is DictionaryValueType {
    return typeof type !== "string" && type.kind === "dictionary";
}

interface CollectionOperation<T extends ListValueType | DictionaryValueType> {
    method: string;
    transformation: boolean;
    resultType: (receiverType: T) => ValueType;
}

const listOperations: readonly CollectionOperation<ListValueType>[] = [
    { method: "with", transformation: true, resultType: (receiverType) => receiverType },
    { method: "appended", transformation: true, resultType: (receiverType) => receiverType },
    { method: "concatenated", transformation: true, resultType: (receiverType) => receiverType },
    { method: "slice", transformation: true, resultType: (receiverType) => receiverType },
];

const dictionaryOperations: readonly CollectionOperation<DictionaryValueType>[] = [
    { method: "with", transformation: true, resultType: (receiverType) => receiverType },
    { method: "without", transformation: true, resultType: (receiverType) => receiverType },
    { method: "merged", transformation: true, resultType: (receiverType) => receiverType },
    { method: "keys", transformation: false, resultType: () => ({ kind: "list", elementType: "text" }) },
    {
        method: "values",
        transformation: false,
        resultType: (receiverType) => ({ kind: "list", elementType: receiverType.valueType }),
    },
];

type CollectionExpression =
    | {
          form: "index";
          receiver: ts.Expression;
          receiverType: ListValueType;
          index: ts.Expression;
          resultType: ValueType;
      }
    | {
          form: "length" | "size";
          receiver: ts.Expression;
          receiverType: ListValueType | DictionaryValueType;
          resultType: "number";
          sdkMember: boolean;
      }
    | {
          form: "method";
          method: string;
          receiver: ts.Expression;
          receiverType: ListValueType | DictionaryValueType;
          transformation: boolean;
          arguments: readonly ts.Expression[];
          resultType: ValueType;
          sdkMember: boolean;
      };

function collectionExpression(
    expression: ts.Expression,
    checker: Checker,
    context?: FunctionContext,
): CollectionExpression | undefined {
    if (ts.isElementAccessExpression(expression)) {
        const receiverType = expressionValueType(expression.expression, checker, context);
        if (!receiverType || !isListValueType(receiverType) || !expression.argumentExpression) return undefined;
        return {
            form: "index",
            receiver: expression.expression,
            receiverType,
            index: expression.argumentExpression,
            resultType: receiverType.elementType,
        };
    }
    if (ts.isPropertyAccessExpression(expression) &&
        (expression.name.text === "length" || expression.name.text === "size")) {
        const member = expression.name.text;
        const receiverType = expressionValueType(expression.expression, checker, context);
        if (!receiverType || typeof receiverType === "string") return undefined;
        if (member === "length" ? !isListValueType(receiverType) : !isDictionaryValueType(receiverType)) {
            return undefined;
        }
        return {
            form: member === "length" ? "length" : "size",
            receiver: expression.expression,
            receiverType,
            resultType: "number",
            sdkMember: isSdkSymbol(
                checker.getSymbolAtLocation(expression.name), member, "/values/index.d.ts", checker,
            ),
        };
    }
    if (!ts.isCallExpression(expression) || !ts.isPropertyAccessExpression(expression.expression)) return undefined;
    const method = expression.expression.name.text;
    const receiver = expression.expression.expression;
    const receiverType = expressionValueType(receiver, checker, context);
    if (!receiverType || typeof receiverType === "string") return undefined;
    const operation = isListValueType(receiverType)
        ? listOperations.find((candidate) => candidate.method === method)
        : dictionaryOperations.find((candidate) => candidate.method === method);
    if (!operation) return undefined;
    return {
        form: "method",
        method,
        receiver,
        receiverType,
        transformation: operation.transformation,
        arguments: expression.arguments,
        resultType: isListValueType(receiverType)
            ? (operation as CollectionOperation<ListValueType>).resultType(receiverType)
            : (operation as CollectionOperation<DictionaryValueType>).resultType(receiverType),
        sdkMember: isSdkSymbol(
            checker.getSymbolAtLocation(expression.expression.name), method, "/values/index.d.ts", checker,
        ),
    };
}

type DictionaryConstructorForm =
    | { kind: "empty" }
    | { kind: "entries"; entries: readonly { key: string; value: ts.Expression }[] }
    | { kind: "invalid"; reason: string };

function dictionaryConstructorForm(call: ts.CallExpression): DictionaryConstructorForm {
    if (call.arguments.length === 0) {
        return call.typeArguments?.length === 1
            ? { kind: "empty" }
            : { kind: "invalid", reason: "explicitly typed empty dictionary" };
    }
    const entries = call.arguments[0];
    if (call.arguments.length !== 1 || !ts.isObjectLiteralExpression(entries)) {
        return { kind: "invalid", reason: "inline dictionary object constructor" };
    }
    return {
        kind: "entries",
        entries: entries.properties.map((property) => {
            if (!ts.isPropertyAssignment(property) || ts.isComputedPropertyName(property.name)) {
                throw unsupported(
                    property,
                    "plain dictionary property (no spreads, computed names, methods, or accessors)",
                );
            }
            const key = getPropertyName(property.name);
            if (key === undefined) throw unsupported(property.name, "string dictionary key");
            return { key, value: property.initializer };
        }),
    };
}

function expressionValueType(
    expression: ts.Expression,
    checker: Checker,
    context?: FunctionContext,
): ValueType | undefined {
    if (ts.isParenthesizedExpression(expression)) {
        return expressionValueType(expression.expression, checker, context);
    }
    if (ts.isIdentifier(expression) && context) {
        const symbol = checker.getSymbolAtLocation(expression);
        const line = symbol ? context.lineVariables?.get(symbol.id) : undefined;
        if (line) return line.valueType;
        const parameter = symbol ? context.parameters.get(symbol.id) : undefined;
        if (parameter) return parameter.type;
    }
    if (ts.isStringLiteralLikeNode(expression) || ts.isTemplateExpression(expression)) return "text";
    if (analyzeNumber(expression) !== undefined) return "number";
    if (expression.kind === ts.SyntaxKind.TrueKeyword || expression.kind === ts.SyntaxKind.FalseKeyword) return "boolean";
    if (ts.isCallExpression(expression)) {
        if (ts.isIdentifier(expression.expression)) {
            const symbol = checker.getSymbolAtLocation(expression.expression);
            if (isSdkSymbol(symbol, "list", "/values/index.d.ts", checker)) {
                const explicit = expression.typeArguments?.[0];
                if (explicit) return listValueTypeArgument(explicit, checker);
                const elementTypes = expression.arguments.map((argument) =>
                    expressionValueType(argument, checker, context));
                if (elementTypes.length === 0 || !elementTypes[0] ||
                    elementTypes.some((type) => !type || !sameValueType(type, elementTypes[0] as ValueType))) {
                    return undefined;
                }
                return { kind: "list", elementType: elementTypes[0] };
            }
            if (isSdkSymbol(symbol, "dictionary", "/values/index.d.ts", checker)) {
                const explicit = dictionaryValueTypeArgument(expression.typeArguments?.[0], checker);
                if (explicit) return explicit;
                const form = dictionaryConstructorForm(expression);
                if (form.kind !== "entries" || form.entries.length === 0) return undefined;
                const valueTypes = form.entries.map((entry) =>
                    expressionValueType(entry.value, checker, context));
                if (!valueTypes[0] || valueTypes.some((type) => !type ||
                    !sameValueType(type, valueTypes[0] as ValueType))) {
                    throw unsupported(expression, "dictionary with one recursive value type (use any for unions)");
                }
                return { kind: "dictionary", valueType: valueTypes[0] };
            }
        }
        if (ts.isPropertyAccessExpression(expression.expression)) {
            const property = expression.expression;
            const gameValue = Object.values(targetGameValues).find((candidate) =>
                candidate.method === property.name.text);
            if (gameValue && expression.arguments.length === 0 && isSdkSymbol(
                checker.getSymbolAtLocation(property.name),
                gameValue.method,
                "/generated/player-values.d.ts",
                checker,
            )) return gameValue.valueType;
            if (expression.expression.name.text === "get" && ts.isIdentifier(expression.expression.expression) && context) {
                const variable = storedVariableBinding(
                    checker.getSymbolAtLocation(expression.expression.expression),
                    checker,
                    context.variables,
                );
                if (variable) return variable.valueType;
            }
        }
    }
    const access = collectionExpression(expression, checker, context);
    if (access) return access.resultType;
    const constant = resolveConstantInitializer(expression, checker, new Set());
    return constant ? expressionValueType(constant, checker, context) : undefined;
}

function analyzeExpression(
    expression: ts.Expression,
    expectedTypes: readonly ExpectedValueType[],
    checker: Checker,
    resolving = new Set<number>(),
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighExpression {
    if (ts.isParenthesizedExpression(expression)) {
        return analyzeExpression(
            expression.expression,
            expectedTypes,
            checker,
            resolving,
            eventContext,
            functionContext,
        );
    }
    const listExpression = analyzeListExpression(
        expression,
        expectedTypes,
        checker,
        resolving,
        eventContext,
        functionContext,
    );
    if (listExpression) return listExpression;
    const dictionaryExpression = analyzeDictionaryExpression(
        expression, expectedTypes, checker, resolving, eventContext, functionContext,
    );
    if (dictionaryExpression) return dictionaryExpression;
    if (expectedTypes.some((type) => type === "number" || type === "component" || type === "any")) {
        const arithmetic = analyzeArithmeticExpression(
            expression,
            checker,
            resolving,
            eventContext,
            functionContext,
        );
        if (arithmetic) return arithmetic;
    }
    if (
        ts.isTemplateExpression(expression) &&
        expectedTypes.some((type) => type === "text" || type === "component" || type === "any")
    ) {
        const parts: HighExpression[] = [];
        if (expression.head.text.length > 0) {
            parts.push({ kind: "string", value: expression.head.text });
        }
        for (const span of expression.templateSpans) {
            parts.push(analyzeExpression(
                span.expression,
                ["any"],
                checker,
                new Set(resolving),
                eventContext,
                functionContext,
            ));
            if (span.literal.text.length > 0) {
                parts.push({ kind: "string", value: span.literal.text });
            }
        }
        return { kind: "string_template", parts };
    }
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
        } catch (error) {
            if (error instanceof Error && error.message.includes("runtime List spread")) throw error;
            // Try the next value kind accepted by this native input.
        }
    }

    throw unsupported(expression, `${expectedTypes.map(valueTypeName).join(" or ")} expression`);
}

function valueTypeName(type: ExpectedValueType): string {
    return typeof type === "string" ? type : type.kind === "list"
        ? `List<${valueTypeName(type.elementType)}>`
        : `Dictionary<${valueTypeName(type.valueType)}>`;
}

function analyzeListExpression(
    expression: ts.Expression,
    expectedTypes: readonly ExpectedValueType[],
    checker: Checker,
    resolving: Set<number>,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighExpression | undefined {
    if (ts.isArrayLiteralExpression(expression)) {
        const expectedList = expectedTypes.find((type): type is ListValueType =>
            typeof type !== "string" && type.kind === "list");
        if (!expectedList || expression.elements.some(ts.isSpreadElement)) return undefined;
        return {
            kind: "list",
            elements: expression.elements.map((element) => analyzeExpression(
                element,
                [expectedList.elementType],
                checker,
                new Set(resolving),
                eventContext,
                functionContext,
            )),
            valueType: expectedList,
        };
    }
    const inferred = expressionValueType(expression, checker, functionContext);
    if (!inferred) return undefined;
    if (isListValueType(inferred)) {
        const stored = analyzeStoredVariableRead(expression, inferred, checker, functionContext);
        if (stored && isPortableExpressionTypeAccepted(inferred, expectedTypes)) return stored;
    }

    const collection = collectionExpression(expression, checker, functionContext);
    if (collection?.form === "length") {
        if (!isPortableExpressionTypeAccepted(collection.resultType, expectedTypes) || !collection.sdkMember) {
            return undefined;
        }
        return {
            kind: "list_length",
            list: analyzeExpression(collection.receiver, [collection.receiverType], checker, new Set(resolving), eventContext, functionContext),
        };
    }
    if (collection?.form === "index") {
        if (!isPortableExpressionTypeAccepted(collection.resultType, expectedTypes)) return undefined;
        assertValidLiteralListBound(collection.index, "list index");
        return {
            kind: "list_index",
            list: analyzeExpression(collection.receiver, [collection.receiverType], checker, new Set(resolving), eventContext, functionContext),
            index: analyzeExpression(collection.index, ["number"], checker, new Set(resolving), eventContext, functionContext),
            valueType: collection.receiverType.elementType,
        };
    }
    if (ts.isCallExpression(expression) && ts.isIdentifier(expression.expression) &&
        isSdkSymbol(checker.getSymbolAtLocation(expression.expression), "list", "/values/index.d.ts", checker)) {
        if (!isListValueType(inferred) || !isPortableExpressionTypeAccepted(inferred, expectedTypes)) return undefined;
        if (expression.arguments.length === 0 && !expression.typeArguments?.[0] &&
            !expectedTypes.some((type) => typeof type !== "string" && type.kind === "list")) {
            throw unsupported(expression, "typed empty list");
        }
        return {
            kind: "list",
            elements: expression.arguments.map((argument) => analyzeExpression(
                argument,
                [inferred.elementType],
                checker,
                new Set(resolving),
                eventContext,
                functionContext,
            )),
            valueType: inferred,
        };
    }
    if (collection?.form === "method" && isListValueType(collection.receiverType)) {
        const listType = collection.receiverType;
        const args = collection.arguments;
        if (!collection.sdkMember || !isPortableExpressionTypeAccepted(listType, expectedTypes)) return undefined;
        const receiver = analyzeExpression(
            collection.receiver,
            [listType],
            checker,
            new Set(resolving),
            eventContext,
            functionContext,
        );
        if (collection.method === "with") {
            if (args.length !== 2) throw unsupported(expression, "list with arguments");
            assertValidLiteralListBound(args[0], "list index");
            return {
                kind: "list_with",
                list: receiver,
                index: analyzeExpression(args[0], ["number"], checker, new Set(resolving), eventContext, functionContext),
                value: analyzeExpression(args[1], [listType.elementType], checker, new Set(resolving), eventContext, functionContext),
                valueType: listType,
            };
        }
        if (collection.method === "appended") {
            return {
                kind: "list_append",
                list: receiver,
                values: args.map((argument) => analyzeExpression(
                    argument, [listType.elementType], checker, new Set(resolving), eventContext, functionContext,
                )),
                valueType: listType,
            };
        }
        if (collection.method === "concatenated") {
            return {
                kind: "list_concat",
                list: receiver,
                lists: args.map((argument) => analyzeExpression(
                    argument, [listType], checker, new Set(resolving), eventContext, functionContext,
                )),
                valueType: listType,
            };
        }
        if (args.length > 2) throw unsupported(expression, "list slice arguments");
        if (args[0] && !isUndefined(args[0], checker)) {
            assertValidLiteralListBound(args[0], "list slice bound");
        }
        if (args[1] && !isUndefined(args[1], checker)) {
            assertValidLiteralListBound(args[1], "list slice bound");
        }
        return {
            kind: "list_slice",
            list: receiver,
            start: args[0] && !isUndefined(args[0], checker)
                ? analyzeExpression(
                    args[0], ["number"], checker, new Set(resolving), eventContext, functionContext,
                )
                : undefined,
            end: args[1] && !isUndefined(args[1], checker)
                ? analyzeExpression(
                    args[1], ["number"], checker, new Set(resolving), eventContext, functionContext,
                )
                : undefined,
            valueType: listType,
        };
    }
    return undefined;
}

function analyzeDictionaryExpression(
    expression: ts.Expression,
    expectedTypes: readonly ExpectedValueType[],
    checker: Checker,
    resolving: Set<number>,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighExpression | undefined {
    const inferred = expressionValueType(expression, checker, functionContext);
    if (inferred && isDictionaryValueType(inferred)) {
        const stored = analyzeStoredVariableRead(expression, inferred, checker, functionContext);
        if (stored && isPortableExpressionTypeAccepted(inferred, expectedTypes)) return stored;
    }
    if (ts.isObjectLiteralExpression(expression)) {
        throw unsupported(expression, "dictionary(...) constructor; arbitrary objects are not runtime values");
    }
    if (ts.isCallExpression(expression) && ts.isIdentifier(expression.expression) &&
        isSdkSymbol(checker.getSymbolAtLocation(expression.expression), "dictionary", "/values/index.d.ts", checker)) {
        if (!inferred || !isDictionaryValueType(inferred) || !isPortableExpressionTypeAccepted(inferred, expectedTypes)) {
            throw unsupported(expression, "dictionary with one recursive value type (use any for unions)");
        }
        const form = dictionaryConstructorForm(expression);
        if (form.kind === "invalid") throw unsupported(expression, form.reason);
        if (form.kind === "empty") return { kind: "dictionary", entries: [], valueType: inferred };
        const entries = form.entries.map((entry) => ({
            key: { kind: "string" as const, value: entry.key },
            value: analyzeExpression(
                entry.value, [inferred.valueType], checker, new Set(resolving), eventContext, functionContext,
            ),
        }));
        return { kind: "dictionary", entries, valueType: inferred };
    }
    const collection = collectionExpression(expression, checker, functionContext);
    if (collection?.form === "size") {
        if (!isPortableExpressionTypeAccepted(collection.resultType, expectedTypes) || !collection.sdkMember) {
            return undefined;
        }
        return {
            kind: "dictionary_size",
            dictionary: analyzeExpression(
                collection.receiver, [collection.receiverType], checker, new Set(resolving), eventContext, functionContext,
            ),
        };
    }
    if (collection?.form !== "method" || !isDictionaryValueType(collection.receiverType) ||
        !collection.sdkMember) return undefined;
    const dictionaryType = collection.receiverType;
    const args = collection.arguments;
    const dictionary = analyzeExpression(
        collection.receiver, [dictionaryType], checker, new Set(resolving), eventContext, functionContext,
    );
    const key = (argument: ts.Expression) => analyzeExpression(
        argument, ["text"], checker, new Set(resolving), eventContext, functionContext,
    );
    if (collection.method === "keys") {
        if (args.length !== 0 || !isPortableExpressionTypeAccepted(collection.resultType, expectedTypes)) return undefined;
        return { kind: "dictionary_keys", dictionary };
    }
    if (collection.method === "values") {
        if (args.length !== 0 || !isPortableExpressionTypeAccepted(collection.resultType, expectedTypes)) return undefined;
        return { kind: "dictionary_values", dictionary, valueType: collection.resultType as ListValueType };
    }
    if (!isPortableExpressionTypeAccepted(dictionaryType, expectedTypes)) return undefined;
    if (collection.method === "with") {
        if (args.length !== 2) throw unsupported(expression, "dictionary with arguments");
        return {
            kind: "dictionary_with",
            dictionary,
            key: key(args[0]),
            value: analyzeExpression(
                args[1], [dictionaryType.valueType], checker, new Set(resolving), eventContext, functionContext,
            ),
            valueType: dictionaryType,
        };
    }
    if (collection.method === "without") {
        if (args.length !== 1) throw unsupported(expression, "dictionary without arguments");
        return { kind: "dictionary_without", dictionary, key: key(args[0]), valueType: dictionaryType };
    }
    if (args.length !== 1) throw unsupported(expression, "dictionary merged argument");
    return {
        kind: "dictionary_merged",
        dictionary,
        dictionaries: args.map((argument) => analyzeExpression(
            argument, [dictionaryType], checker, new Set(resolving), eventContext, functionContext,
        )),
        valueType: dictionaryType,
    };
}

function analyzeArithmeticExpression(
    expression: ts.Expression,
    checker: Checker,
    resolving: Set<number>,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): import("@nocuft/dfir").HighArithmeticExpression | undefined {
    if (
        ts.isPrefixUnaryExpression(expression) &&
        (expression.operator === ts.SyntaxKind.PlusToken ||
            expression.operator === ts.SyntaxKind.MinusToken) &&
        !ts.isNumericLiteral(expression.operand)
    ) {
        const operand = analyzeExpression(
            expression.operand,
            ["number"],
            checker,
            new Set(resolving),
            eventContext,
            functionContext,
        );
        return expression.operator === ts.SyntaxKind.PlusToken
            ? { kind: "arithmetic", operation: "+", operands: [operand] }
            : {
                  kind: "arithmetic",
                  operation: "-",
                  operands: [{ kind: "number", value: 0 }, operand],
              };
    }
    if (!ts.isBinaryExpression(expression)) return undefined;
    const operation = (() => {
        switch (expression.operatorToken.kind) {
            case ts.SyntaxKind.PlusToken: return "+";
            case ts.SyntaxKind.MinusToken: return "-";
            case ts.SyntaxKind.AsteriskToken: return "x";
            case ts.SyntaxKind.SlashToken: return "/";
            case ts.SyntaxKind.PercentToken: return "%";
            case ts.SyntaxKind.AsteriskAsteriskToken: return "Exponent";
            default: return undefined;
        }
    })();
    if (!operation) return undefined;
    if (!(operation in structuralBindings.setVariable)) {
        throw new Error(`Missing generated Set Variable action ${operation}`);
    }
    return {
        kind: "arithmetic",
        operation,
        operands: [expression.left, expression.right].map((operand) =>
            analyzeExpression(
                operand,
                ["number"],
                checker,
                new Set(resolving),
                eventContext,
                functionContext,
            ),
        ),
    };
}

function analyzeExpressionAsType(
    expression: ts.Expression,
    expectedType: ExpectedValueType,
    checker: Checker,
    resolving = new Set<number>(),
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighExpression {
    const gameValue = analyzeTargetGameValueExpression(
        expression,
        expectedType,
        checker,
        eventContext,
        functionContext,
    );
    if (gameValue) return gameValue;
    if (typeof expectedType !== "string") throw unsupported(expression, `${valueTypeName(expectedType)} expression`);
    const selectionCount = analyzeSelectionCountExpression(
        expression,
        expectedType,
        checker,
        eventContext,
        functionContext,
    );
    if (selectionCount) return selectionCount;
    const storedVariable = analyzeStoredVariableRead(
        expression,
        expectedType,
        checker,
        functionContext,
    );
    if (storedVariable) return storedVariable;
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
            return analyzeItem(
                expression,
                checker,
                resolving,
                eventContext,
                functionContext,
            );
    }

    throw unsupported(expression, `${expectedType} expression`);
}

function analyzeSelectionCountExpression(
    expression: ts.Expression,
    expectedType: string,
    checker: Checker,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): import("@nocuft/dfir").HighSelectionCountExpression | undefined {
    if (
        !ts.isCallExpression(expression) ||
        expression.arguments.length !== 0 ||
        !ts.isPropertyAccessExpression(expression.expression) ||
        expression.expression.name.text !== "count" ||
        !isPortableExpressionTypeAccepted("number", [expectedType]) ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(expression.expression.name),
            "count",
            "/players.d.ts",
            checker,
        )
    ) return undefined;
    const selection = analyzeSelectionExpression(
        expression.expression.expression,
        checker,
        eventContext,
        functionContext,
    );
    if (!selection || selection.resultType !== "player") {
        throw unsupported(expression.expression.expression, "player selection count receiver");
    }
    return { kind: "selection_count", selection };
}

function analyzeStoredVariableRead(
    expression: ts.Expression,
    expectedType: ExpectedValueType,
    checker: Checker,
    context?: FunctionContext,
): import("@nocuft/dfir").HighPlotVariableExpression | import("@nocuft/dfir").HighPlayerVariableExpression | undefined {
    if (
        !context ||
        !ts.isCallExpression(expression) ||
        !ts.isPropertyAccessExpression(expression.expression) ||
        expression.expression.name.text !== "get" ||
        !ts.isIdentifier(expression.expression.expression)
    ) return undefined;
    const variable = storedVariableBinding(
        checker.getSymbolAtLocation(expression.expression.expression),
        checker,
        context.variables,
    );
    if (!variable) return undefined;
    const expectedCount = variable.owner === "player" ? 1 : 0;
    if (expression.arguments.length !== expectedCount) {
        throw unsupported(expression, "stored variable read arguments");
    }
    if (!isPortableExpressionTypeAccepted(variable.valueType, [expectedType])) {
        throw unsupported(expression, `${valueTypeName(expectedType)} stored variable`);
    }
    if (variable.owner === "player") {
        const receiver = analyzePlayerArgument(expression.arguments[0], checker, context);
        if (receiver.kind === "selection") {
            const snapshot = receiver.value.filters.length === 0 &&
                "kind" in receiver.value.source &&
                receiver.value.source.kind === "selection_snapshot"
                ? receiver.value.source
                : undefined;
            if (!snapshot || snapshot.cardinality !== "at_most_one") {
                throw unsupported(expression.arguments[0], "at-most-one player snapshot variable target");
            }
            return {
                kind: "player_variable",
                name: variable.name,
                scope: variable.scope,
                valueType: variable.valueType,
                receiver: snapshot,
            };
        }
        return {
            kind: "player_variable",
            name: variable.name,
            scope: variable.scope,
            valueType: variable.valueType,
            receiver: "current_player",
        };
    }
    return {
        kind: "plot_variable",
        name: variable.name,
        scope: variable.scope,
        valueType: variable.valueType,
    };
}

function analyzeTargetGameValueExpression(
    expression: ts.Expression,
    expectedType: ExpectedValueType,
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
        !isPortableExpressionTypeAccepted(binding.valueType, [expectedType]) ||
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
    const snapshot = ts.isIdentifier(receiver)
        ? snapshotBinding(receiver, checker, functionContext)
        : undefined;
    if (snapshot?.cardinality === "many") {
        throw unsupported(receiver, "at-most-one player snapshot game value receiver");
    }
    if (!eventPlayer && !functionPlayer && !snapshot) return undefined;
    return {
        kind: "game_value",
        value: binding.id,
        valueType: binding.valueType,
        receiver: snapshot ? { kind: "selection_snapshot", ...snapshot } : "current_player",
    };
}

function isPortableExpressionTypeAccepted(
    type: ValueType,
    expected: readonly ExpectedValueType[],
): boolean {
    return expected.some((candidate) => {
        if (candidate === "any") return true;
        if (typeof type !== "string" || typeof candidate !== "string") {
            return typeof type !== "string" && typeof candidate !== "string" && valueTypeAssignable(type, candidate);
        }
        return candidate === type ||
            (candidate === "component" && ["text", "number", "boolean"].includes(type));
    });
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

function assertValidLiteralListBound(expression: ts.Expression, description: string): void {
    const value = analyzeNumber(expression);
    if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
        throw unsupported(expression, `non-negative integer literal ${description}`);
    }
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
    resolving: Set<number>,
    eventContext?: EventExpressionContext,
    functionContext?: FunctionContext,
): HighExpression {
    if (
        ts.isCallExpression(expression) &&
        ts.isIdentifier(expression.expression) &&
        isSdkSymbol(
            checker.getSymbolAtLocation(expression.expression),
            "itemSnapshot",
            "/values/index.d.ts",
            checker,
        ) &&
        expression.arguments.length === 1 &&
        ts.isStringLiteralLikeNode(expression.arguments[0])
    ) {
        return { kind: "item_snapshot", snbt: expression.arguments[0].text };
    }
    if (
        ts.isCallExpression(expression) &&
        ts.isPropertyAccessExpression(expression.expression)
    ) {
        const method = expression.expression.name.text;
        const binding = Object.values(itemTransformBindings).find(
            (candidate) => candidate.method === method,
        );
        if (
            binding &&
            isSdkSymbol(
                checker.getSymbolAtLocation(expression.expression.name),
                method,
                "/values/index.d.ts",
                checker,
            )
        ) {
            const receiver = analyzeExpression(
                expression.expression.expression,
                ["item"],
                checker,
                new Set(resolving),
                eventContext,
                functionContext,
            );
            const arguments_: HighExpression[] = [];
            let sourceIndex = 0;
            for (const input of binding.inputs) {
                if (input.cardinality === "plural") {
                    const values = expression.arguments.slice(sourceIndex);
                    if (values.length < input.minimumLength) {
                        throw unsupported(expression, `${method} item transform arguments`);
                    }
                    arguments_.push(...analyzePluralArguments(
                        values,
                        input.acceptedTypes,
                        checker,
                        eventContext,
                        functionContext,
                        input.minimumLength,
                    ));
                    sourceIndex = expression.arguments.length;
                    continue;
                }
                const argument = expression.arguments[sourceIndex++];
                if (!argument) throw unsupported(expression, `${method} item transform arguments`);
                arguments_.push(analyzeExpression(
                    argument,
                    input.acceptedTypes,
                    checker,
                    new Set(resolving),
                    eventContext,
                    functionContext,
                ));
            }
            if (sourceIndex !== expression.arguments.length) {
                throw unsupported(expression, `${method} item transform arguments`);
            }
            return {
                kind: "item_transform",
                operation: binding.id,
                receiver,
                arguments: arguments_,
            };
        }
    }
    if (
        !ts.isCallExpression(expression) ||
        !ts.isIdentifier(expression.expression) ||
        !isSdkSymbol(
            checker.getSymbolAtLocation(expression.expression),
            "item",
            "/values/index.d.ts",
            checker,
        ) ||
        expression.arguments.length < 1 ||
        expression.arguments.length > 2
    ) {
        throw unsupported(expression, "item expression");
    }

    const material = analyzeExpression(
        expression.arguments[0],
        ["text"],
        checker,
        new Set(resolving),
        eventContext,
        functionContext,
    );
    let count: HighExpression = { kind: "number", value: 1 };
    const options = expression.arguments[1];
    if (options) {
        if (!ts.isObjectLiteralExpression(options)) {
            throw unsupported(options, "item options object");
        }
        let foundCount = false;
        for (const property of options.properties) {
            let initializer: ts.Expression;
            let propertyName: string | undefined;
            if (ts.isPropertyAssignment(property)) {
                propertyName = getPropertyName(property.name);
                initializer = property.initializer;
            } else if (ts.isShorthandPropertyAssignment(property)) {
                if (!ts.isIdentifier(property.name)) {
                    throw unsupported(property, "item count option");
                }
                propertyName = property.name.text;
                initializer = property.name;
            } else {
                throw unsupported(property, "item count option");
            }
            if (propertyName !== "count" || foundCount) {
                throw unsupported(property, "item count option");
            }
            foundCount = true;
            const shorthandParameter = ts.isShorthandPropertyAssignment(property)
                ? [...(functionContext?.parameters.values() ?? [])].find(
                    (parameter) => parameter.name === propertyName && parameter.type === "number",
                )
                : undefined;
            const shorthandLine = ts.isShorthandPropertyAssignment(property)
                ? [...(functionContext?.lineVariables?.values() ?? [])].findLast(
                    (variable) => variable.sourceName === propertyName && variable.valueType === "number",
                )
                : undefined;
            count = shorthandParameter
                ? { kind: "parameter", name: shorthandParameter.name, valueType: "number" }
                : shorthandLine
                  ? { kind: "line_variable", name: shorthandLine.name, valueType: "number" }
                : analyzeExpression(
                    initializer,
                    ["number"],
                    checker,
                    new Set(resolving),
                    eventContext,
                    functionContext,
                );
        }
    }

    if (count.kind === "number" && (!Number.isFinite(count.value) || !Number.isInteger(count.value) || count.value < 1)) {
        throw unsupported(options ?? expression, "positive integer item count");
    }

    return material.kind === "string" && count.kind === "number" ? {
        kind: "item",
        id: material.value,
        count: count.value,
    } : {
        kind: "item_constructor",
        material,
        count,
    };
}

function resolveConstantInitializer(
    expression: ts.Expression,
    checker: Checker,
    resolving: Set<number>,
): ts.Expression | undefined {
    if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
        const propertyName = ts.isPropertyAccessExpression(expression)
            ? expression.name.text
            : expression.argumentExpression && ts.isStringLiteralLikeNode(expression.argumentExpression)
                ? expression.argumentExpression.text
                : undefined;
        const initializer = resolveConstantInitializer(expression.expression, checker, resolving);
        const object = initializer && unwrapExpression(initializer);
        if (propertyName !== undefined && object && ts.isObjectLiteralExpression(object)) {
            const property = object.properties.find((candidate): candidate is ts.PropertyAssignment =>
                ts.isPropertyAssignment(candidate) && getPropertyName(candidate.name) === propertyName);
            if (property) return property.initializer;
        }
    }
    const symbol = resolveAliasedSymbol(ts.isIdentifier(expression)
        ? checker.getSymbolAtLocation(expression)
        : ts.isPropertyAccessExpression(expression)
            ? checker.getSymbolAtLocation(expression.name)
            : ts.isElementAccessExpression(expression)
                ? checker.getSymbolAtLocation(expression)
                : undefined, checker);
    if (!symbol || resolving.has(symbol.id)) {
        return undefined;
    }
    const declaration = symbol.valueDeclaration?.resolve();
    if (declaration && ts.isPropertyAssignment(declaration)) {
        resolving.add(symbol.id);
        return declaration.initializer;
    }
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

function unwrapExpression(expression: ts.Expression): ts.Expression {
    let current = expression;
    while (ts.isAsExpression(current) || ts.isSatisfiesExpression(current)
        || ts.isParenthesizedExpression(current)) {
        current = current.expression;
    }
    return current;
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

    return new TypeScriptAnalysisError(
        `Unsupported ${expected} at ${source.fileName}:${position.line + 1}:${position.character + 1}`,
        [resolve(source.fileName)],
    );
}
