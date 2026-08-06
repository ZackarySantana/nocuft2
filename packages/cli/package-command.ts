import { createHash } from "node:crypto";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import type { PackageArtifact } from "@nocuft/compiler";
import type { CliIo } from "./cli.js";
import { fetchPackageSource } from "./package-fetch.js";
import { installPackage, loadVerifiedPackages } from "./package-manager.js";
import { createPackageStore, PACKAGE_DIRECTORY } from "./package-store.js";
import { renderTextTable } from "./text-table.js";

export type PackageCommand =
    | { verb: "install"; alias: string; source: string }
    | { verb: "uninstall"; aliases: string[] }
    | { verb: "list" }
    | { verb: "show"; alias: string }
    | { verb: "verify" }
    | { verb: "outdated" }
    | { verb: "update"; aliases: string[] };

export async function runPackageCommand(command: PackageCommand, projectRoot: string, io: CliIo): Promise<number> {
    const store = createPackageStore(projectRoot);
    switch (command.verb) {
        case "install": {
            const { entry, artifact } = await installPackage(projectRoot, command.alias, command.source, { baseDirectory: process.cwd() });
            io.stdout(`Installed ${entry.alias} from ${entry.source} into ${PACKAGE_DIRECTORY}/${entry.alias}.\n`);
            io.stdout(`Exports: ${exportNames(artifact)}\n`);
            return 0;
        }
        case "list": {
            const loaded = await loadVerifiedPackages(projectRoot);
            if (loaded.length === 0) {
                io.stdout("No vendored packages.\n");
                return 0;
            }
            io.stdout(renderTextTable(["NAME", "LANGUAGE", "EXPORTS"], loaded.map((pkg) => [
                pkg.entry.alias,
                pkg.entry.language,
                exportNames(pkg.artifact),
            ])));
            return 0;
        }
        case "show": {
            const loaded = (await loadVerifiedPackages(projectRoot)).find((item) => item.entry.alias === command.alias);
            if (!loaded) throw new Error(`Package ${JSON.stringify(command.alias)} is not installed`);
            const entry = loaded.entry;
            io.stdout(`Name:      ${entry.alias}\nSource:    ${entry.source}\nResolved:  ${entry.resolvedSource}\nLanguage:  ${entry.language}\nDirectory: ${PACKAGE_DIRECTORY}/${entry.alias}\nSource SHA:   ${entry.sourceSha256}\nArtifact SHA: ${entry.artifactSha256}\nToolchain: ${entry.toolchain}\nExports:   ${exportNames(loaded.artifact)}\n`);
            return 0;
        }
        case "verify": {
            const loaded = await loadVerifiedPackages(projectRoot);
            if (loaded.length === 0) io.stdout("No vendored packages.\n");
            else io.stdout(renderTextTable(["STATUS", "NAME"], loaded.map((pkg) => ["ok", pkg.entry.alias])));
            return 0;
        }
        case "uninstall": {
            const entries = await store.load();
            const installed = new Set(entries.map((entry) => entry.alias));
            const missing = command.aliases.filter((alias) => !installed.has(alias));
            if (missing.length) throw new Error(`Packages are not installed: ${missing.join(", ")}`);
            for (const alias of command.aliases) await rm(join(projectRoot, PACKAGE_DIRECTORY, alias), { recursive: true, force: true });
            const removed = new Set(command.aliases);
            await store.save(entries.filter((entry) => !removed.has(entry.alias)));
            io.stdout(`Uninstalled ${command.aliases.join(", ")}.\n`);
            return 0;
        }
        case "outdated": {
            const entries = await store.load();
            if (entries.length === 0) {
                io.stdout("No vendored packages.\n");
                return 0;
            }
            let outdated = 0;
            const rows: string[][] = [];
            for (const entry of entries) {
                const fetched = await fetchPackageSource(entry.resolvedSource, projectRoot);
                const changed = digest(fetched.bytes) !== entry.sourceSha256;
                if (changed) outdated += 1;
                rows.push([changed ? "outdated" : "current", entry.alias, changed ? entry.source : ""]);
            }
            io.stdout(renderTextTable(["STATUS", "NAME", "SOURCE"], rows));
            if (outdated > 0) io.stdout(`\nRun "nocuft package update" to reinstall ${outdated === 1 ? "it" : "them"}.\n`);
            return 0;
        }
        case "update": {
            const entries = await store.load();
            const targets = command.aliases.length === 0
                ? entries
                : command.aliases.map((alias) => entries.find((entry) => entry.alias === alias));
            if (targets.some((entry) => !entry)) throw new Error("One or more requested packages are not installed");
            if (targets.length === 0) io.stdout("No vendored packages.\n");
            for (const entry of targets) {
                if (!entry) continue;
                await installPackage(projectRoot, entry.alias, entry.resolvedSource, {
                    replace: true,
                    sourceLabel: entry.source,
                });
                io.stdout(`Updated ${entry.alias}.\n`);
            }
            return 0;
        }
    }
}

function exportNames(artifact: PackageArtifact): string {
    return artifact.functions.map((item) => item.name).join(", ");
}

function digest(bytes: Uint8Array): string {
    return createHash("sha256").update(bytes).digest("hex");
}
