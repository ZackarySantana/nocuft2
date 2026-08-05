import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
    createPackageArtifacts,
    lowerHighModule,
    parsePackageExports,
    parsePackageIr,
    type PackageExportsManifest,
    type PackageExportParameter,
    type PackageIrArtifact,
} from "@nocuft/compiler";
import { analyzeTypeScriptProject } from "@nocuft/frontend-typescript";
import { findTsconfig } from "./build-project.js";
import { fetchPackageSource } from "./package-fetch.js";
import {
    createPackageStore,
    PACKAGE_DIRECTORY,
    readJson,
    type InstalledPackage,
    validPackageAlias,
} from "./package-store.js";

export const PACKAGE_TOOLCHAIN = "nocuft-cli@0.1.0;package-ir@1;package-exports@1";

export interface LoadedPackage {
    entry: InstalledPackage;
    artifact: PackageIrArtifact;
    exports: PackageExportsManifest;
    paths: string[];
}

export async function installPackage(
    projectRoot: string,
    alias: string,
    source: string,
    options: { replace?: boolean; baseDirectory?: string; sourceLabel?: string } = {},
): Promise<InstalledPackage> {
    if (!validPackageAlias(alias)) {
        throw new Error("Package names must be 1 to 16 lowercase letters or digits, start with a letter, and not be reserved");
    }
    const store = createPackageStore(projectRoot);
    const installed = await store.load();
    const previous = installed.find((entry) => entry.alias === alias);
    if (previous && !options.replace) {
        throw new Error(`Package ${JSON.stringify(alias)} is already installed. Use package update ${alias}.`);
    }
    const fetched = await fetchPackageSource(source, options.baseDirectory ?? projectRoot);
    if (!new URL(fetched.resolvedSource).pathname.toLowerCase().endsWith(".ts")) {
        throw new Error("Package sources must be a single .ts file");
    }
    const sourceText = new TextDecoder("utf-8", { fatal: true }).decode(fetched.bytes);

    const packageRoot = join(projectRoot, PACKAGE_DIRECTORY);
    const staging = join(packageRoot, `stage-${alias}-${randomUUID()}`);
    const sourcePath = join(staging, "src", "source.ts");
    await mkdir(dirname(sourcePath), { recursive: true });
    try {
        await writeFile(sourcePath, sourceText, "utf8");
        const analysis = analyzeTypeScriptProject({
            entryFile: sourcePath,
            tsconfigPath: await findTsconfig(projectRoot),
            packageMode: true,
        });
        const generated = createPackageArtifacts(alias, lowerHighModule(analysis.module));
        const artifactText = json(generated.artifact);
        const exportsText = json(generated.exports);
        const stubText = renderTypeScriptStub(alias, generated.exports);
        await writeFile(join(staging, "module.dfir.json"), artifactText, "utf8");
        await writeFile(join(staging, "exports.json"), exportsText, "utf8");
        await writeFile(join(staging, "index.ts"), stubText, "utf8");

        const entry: InstalledPackage = {
            alias,
            source: options.sourceLabel ?? source,
            resolvedSource: fetched.resolvedSource,
            language: "typescript",
            sourceSha256: digest(fetched.bytes),
            artifactSha256: digest(artifactText),
            exportsSha256: digest(exportsText),
            stubSha256: digest(stubText),
            toolchain: PACKAGE_TOOLCHAIN,
            exports: generated.exports.functions.map((item) => item.name),
        };
        const finalPath = join(packageRoot, alias);
        const backup = join(packageRoot, `.backup-${alias}-${randomUUID()}`);
        if (previous) await rename(finalPath, backup);
        try {
            await rename(staging, finalPath);
            await store.save([...installed.filter((item) => item.alias !== alias), entry]);
        } catch (error: unknown) {
            await rm(finalPath, { recursive: true, force: true });
            if (previous) await rename(backup, finalPath);
            throw error;
        }
        if (previous) await rm(backup, { recursive: true, force: true });
        return entry;
    } finally {
        await rm(staging, { recursive: true, force: true });
    }
}

export async function loadVerifiedPackages(projectRoot: string): Promise<LoadedPackage[]> {
    const entries = await createPackageStore(projectRoot).load();
    return await Promise.all(entries.map(async (entry) => {
        const root = join(projectRoot, PACKAGE_DIRECTORY, entry.alias);
        const paths = [
            join(root, "src", "source.ts"),
            join(root, "module.dfir.json"),
            join(root, "exports.json"),
            join(root, "index.ts"),
        ];
        const [source, artifactBytes, exportBytes, stub] = await Promise.all(paths.map((path) => readFile(path)));
        compareDigest(entry.alias, "source", source, entry.sourceSha256);
        compareDigest(entry.alias, "artifact", artifactBytes, entry.artifactSha256);
        compareDigest(entry.alias, "exports", exportBytes, entry.exportsSha256);
        compareDigest(entry.alias, "stub", stub, entry.stubSha256);
        if (entry.toolchain !== PACKAGE_TOOLCHAIN) {
            throw new Error(`Package ${entry.alias} uses incompatible toolchain ${entry.toolchain}`);
        }
        const artifact = parsePackageIr(await readJson(paths[1]));
        const exports = parsePackageExports(await readJson(paths[2]));
        if (artifact.alias !== entry.alias || exports.alias !== entry.alias
            || exports.functions.map((item) => item.name).join("\0") !== entry.exports.join("\0")) {
            throw new Error(`Package ${entry.alias} artifact, exports, and lockfile disagree`);
        }
        const artifactFunctions = new Set(artifact.module.templates.map((template) => template.name));
        if (exports.functions.some((item) => !artifactFunctions.has(item.nativeName))) {
            throw new Error(`Package ${entry.alias} exports a function missing from its artifact`);
        }
        for (const exported of exports.functions) {
            const template = artifact.module.templates.find((candidate) => candidate.kind === "function" && candidate.name === exported.nativeName);
            if (!template || template.kind !== "function"
                || JSON.stringify(template.parameters ?? []) !== JSON.stringify(exported.parameters)) {
                throw new Error(`Package ${entry.alias} export signature disagrees with its artifact`);
            }
        }
        if (new TextDecoder().decode(stub) !== renderTypeScriptStub(entry.alias, exports)) {
            throw new Error(`Package ${entry.alias} stub disagrees with exports.json`);
        }
        return { entry, artifact, exports, paths };
    }));
}

export function renderTypeScriptStub(alias: string, manifest: PackageExportsManifest): string {
    const importedTypes = new Set<string>();
    for (const entry of manifest.functions) {
        for (const parameter of entry.parameters) {
            const type = parameter.kind === "target"
                ? "PlayerTarget"
                : sourceType(parameter.type);
            if (type !== "string" && type !== "number" && type !== "boolean") {
                importedTypes.add(type);
            }
        }
    }
    const imports = [...importedTypes].toSorted().map((type) => `type ${type}`);
    const lines = [
        "// Generated by nocuft. Do not edit.",
        `import { ${["packageFunction", ...imports].join(", ")} } from \"@nocuft/diamondfire\";`,
        "",
    ];
    for (const entry of manifest.functions) {
        const parameters = entry.parameters.map((parameter) =>
            `${parameter.name}: ${parameter.kind === "target" ? "PlayerTarget" : sourceType(parameter.type)}`,
        );
        lines.push(`export function ${entry.name}(${parameters.join(", ")}): void {`);
        for (const parameter of parameters.map((value) => value.split(":", 1)[0])) {
            lines.push(`    void ${parameter};`);
        }
        lines.push(`    return packageFunction(${JSON.stringify(alias)}, ${JSON.stringify(entry.name)});`);
        lines.push("}", "");
    }
    return `${lines.join("\n").trimEnd()}\n`;
}

function sourceType(
    type: Extract<PackageExportParameter, { kind: "value" }>["type"],
): string {
    switch (type) {
        case "text": return "string";
        case "number": return "number";
        case "boolean": return "boolean";
        case "component": return "ComponentInput";
        case "location": return "Location";
        case "item": return "Item";
        case "sound": return "SoundInput";
        case "any": return "AnyValueInput";
    }
}

function json(value: unknown): string {
    return `${JSON.stringify(value, undefined, 2)}\n`;
}

function digest(value: Uint8Array | string): string {
    return createHash("sha256").update(value).digest("hex");
}

function compareDigest(alias: string, label: string, value: Uint8Array, expected: string): void {
    if (digest(value) !== expected) throw new Error(`Package ${alias} ${label} digest does not match nocuft.lock.json`);
}
