import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import type { EmittedTemplate } from "@nocuft/compiler";

export interface BundleTemplate {
    id: string;
    kind: EmittedTemplate["kind"];
    name: string;
    sha256: string;
    encoding: "diamondfire-template-gzip-base64";
    compressedBytes: number;
    uncompressedBytes: number;
    data: string;
}

export interface DeploymentBundle {
    format: "diamondfire-deployment";
    version: 0;
    protocolVersion: 0;
    compiler: { name: "nocuft"; version: string };
    project: { id: string; module: string };
    capabilities: string[];
    templates: BundleTemplate[];
}

export interface BuildBundleOptions {
    projectId: string;
    module: string;
    compilerVersion?: string;
    templates: readonly EmittedTemplate[];
}

export function buildBundle(options: BuildBundleOptions): DeploymentBundle {
    const templates = options.templates.map((template) =>
        bundleTemplate(options.module, template),
    );
    const ids = templates.map(({ id }) => id);
    if (new Set(ids).size !== ids.length) {
        throw new Error("Compiled templates must have unique names.");
    }
    return {
        format: "diamondfire-deployment",
        version: 0,
        protocolVersion: 0,
        compiler: {
            name: "nocuft",
            version: options.compilerVersion ?? "0.1.0",
        },
        project: { id: options.projectId, module: options.module },
        capabilities: [],
        templates,
    };
}

function bundleTemplate(
    module: string,
    template: EmittedTemplate,
): BundleTemplate {
    const json = canonicalJson(template.template);
    const compressed = gzipSync(json, { level: 9 });
    return {
        id: `${module}/${template.name}`,
        kind: template.kind,
        name: template.nativeName,
        sha256: createHash("sha256").update(json, "utf8").digest("hex"),
        encoding: "diamondfire-template-gzip-base64",
        compressedBytes: compressed.byteLength,
        uncompressedBytes: Buffer.byteLength(json, "utf8"),
        data: compressed.toString("base64"),
    };
}

export function canonicalJson(value: unknown): string {
    return JSON.stringify(canonicalValue(value));
}

function canonicalValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(canonicalValue);
    }
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value)
                .toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
                .map(([key, entry]) => [key, canonicalValue(entry)]),
        );
    }
    return value;
}

export function bundleDigest(bundle: DeploymentBundle): string {
    const lines = bundle.templates
        .map((template) => `${template.sha256}\n`)
        .toSorted()
        .join("");
    return createHash("sha256").update(lines, "utf8").digest("hex");
}
