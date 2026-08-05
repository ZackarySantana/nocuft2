import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildProject } from "../build-project.js";
import { installPackage, loadVerifiedPackages } from "../package-manager.js";

async function project(): Promise<string> {
    const root = await mkdtemp(join(dirname(fileURLToPath(import.meta.url)), ".package-"));
    await writeFile(join(root, "nocuft.json"), JSON.stringify({
        format: "nocuft-project",
        version: 1,
        id: "4c026963-a287-4e18-a86c-747d86e3a917",
    }));
    await writeFile(join(root, "tsconfig.json"), JSON.stringify({
        compilerOptions: {
            target: "ESNext",
            module: "ESNext",
            moduleResolution: "Bundler",
            strict: true,
            noEmit: true,
            skipLibCheck: true,
        },
        include: ["**/*.ts"],
    }));
    await writeFile(join(root, "mathx.ts"), `
import type { AnyValueInput, ComponentInput, Item, Location, PlayerTarget, SoundInput } from "@nocuft/diamondfire";
function relay(player: PlayerTarget, message: string): void { player.sendMessage(message); }
export function greet(
    message: string,
    component: ComponentInput,
    player: PlayerTarget,
    count: number,
    loud: boolean,
    where: Location,
    itemValue: Item,
    soundValue: SoundInput,
    anything: AnyValueInput,
): void {
    relay(player, message);
    player.sendMessage(component, count, loud, anything);
    player.teleport(where);
    player.setCursorItem(itemValue);
    player.playSound([soundValue]);
}
`);
    return root;
}

test("vendors TypeScript, emits a portable manifest, and links offline", async (t) => {
    const root = await project();
    t.after(() => rm(root, { recursive: true, force: true }));
    const installed = await installPackage(root, "mathx", "./mathx.ts");
    assert.deepEqual(installed.exports, ["greet"]);
    const manifest = JSON.parse(await readFile(join(root, "nocuft", "mathx", "exports.json"), "utf8"));
    assert.equal(manifest.format, "nocuft-package-exports");
    assert.deepEqual(manifest.functions[0].parameters.map((entry: { kind: string }) => entry.kind), [
        "value", "value", "target", "value", "value", "value", "value", "value", "value",
    ]);
    assert.deepEqual(
        manifest.functions[0].parameters
            .filter((entry: { kind: string }) => entry.kind === "value")
            .map((entry: { type: string }) => entry.type),
        ["text", "component", "number", "boolean", "location", "item", "sound", "any"],
    );
    await writeFile(join(root, "plot.ts"), `
import { item, location, players, sound } from "@nocuft/diamondfire";
import { greet } from "./nocuft/mathx/index.js";
export function hello(): void {
    greet("hi", "component", players.all(), 2, true, location(1, 2, 3), item("stone"), "entity.player.levelup", sound("entity.player.levelup"));
}
`);
    const build = await buildProject({ entryPath: join(root, "plot.ts") });
    assert.equal(build.ok, true);
    if (build.ok) {
        assert.deepEqual(build.templates.map((template) => template.name), ["hello", "mathx_relay", "mathx_greet"]);
        assert.equal(build.templates[0].template.blocks[2]?.block, "call_func");
        assert.equal(build.templates[0].template.blocks[2]?.data, "mathx_greet");
        assert.equal(build.templates[0].template.blocks[2]?.target, "Selection");
        assert.deepEqual(
            build.templates[2].template.blocks[0]?.args.items.slice(0, 8).map((entry) => entry.item.data.type),
            ["txt", "comp", "num", "num", "loc", "item", "snd", "any"],
        );
    }
});

test("verification fails closed when a vendored file changes", async (t) => {
    const root = await project();
    t.after(() => rm(root, { recursive: true, force: true }));
    await installPackage(root, "mathx", "./mathx.ts");
    await writeFile(join(root, "nocuft", "mathx", "index.ts"), "changed\n");
    await assert.rejects(loadVerifiedPackages(root), /stub digest/u);
});

test("package source cannot depend on another module", async (t) => {
    const root = await project();
    t.after(() => rm(root, { recursive: true, force: true }));
    await writeFile(join(root, "mathx.ts"), `
import { helper } from "./helper.js";
export function greet(): void { helper(); }
`);
    await writeFile(join(root, "helper.ts"), "export function helper(): void {}\n");
    await assert.rejects(
        installPackage(root, "mathx", "./mathx.ts"),
        /only @nocuft\/diamondfire is allowed/u,
    );
});

test("rejects ambiguous function contracts", async (t) => {
    const root = await project();
    t.after(() => rm(root, { recursive: true, force: true }));
    const cases = [
        {
            source: `
import type { PlayerTarget } from "@nocuft/diamondfire";
export function greet(first: PlayerTarget, second: PlayerTarget): void {}
`,
            message: /single PlayerTarget parameter/u,
        },
        {
            source: "export function greet(message?: string): void {}\n",
            message: /required named function parameter/u,
        },
        {
            source: "export function greet(value: Date): void {}\n",
            message: /supported Nocuft value parameter/u,
        },
    ];
    for (const entry of cases) {
        await writeFile(join(root, "mathx.ts"), entry.source);
        await assert.rejects(installPackage(root, "mathx", "./mathx.ts"), entry.message);
    }
});
