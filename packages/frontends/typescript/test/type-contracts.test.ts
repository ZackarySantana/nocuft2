import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { API } from "typescript/unstable/sync";

const fixture = (file: string) => fileURLToPath(
    new URL(`./fixtures/type-contracts/${file}`, import.meta.url),
);

function typeErrors(file: string): string[] {
    const configFile = fixture("tsconfig.json");
    const entryFile = fixture(file);
    const api = new API();
    try {
        const snapshot = api.updateSnapshot({
            openProjects: [configFile],
            openFiles: [entryFile],
        });
        try {
            const project = snapshot.getProject(configFile);
            if (!project) throw new Error(`TypeScript did not load project ${configFile}`);
            return project.program
                .getSemanticDiagnostics(entryFile)
                .map((diagnostic) => diagnostic.text);
        } finally {
            snapshot.dispose();
        }
    } finally {
        api.close();
    }
}

test("declares collection constructors that reject unsupported source forms", () => {
    assert.deepEqual(typeErrors("collections.ts"), []);
});
