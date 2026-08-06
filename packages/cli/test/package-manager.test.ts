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
        name: "test",
        language: "typescript",
        entry: "plot.ts",
        module: "app.test",
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
import type { AnyValueInput, ComponentInput, Item, Location, PlayerTarget, SoundInput } from "nocuft";
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
    assert.deepEqual(installed.artifact.functions.map((item) => item.name), ["greet"]);
    const manifest = JSON.parse(await readFile(join(root, "nocuft", "mathx", "package.dfir.json"), "utf8"));
    assert.equal(manifest.format, "nocuft-package");
    assert.deepEqual(manifest.functions[0].parameters.map((entry: { kind: string }) => entry.kind), [
        "value", "value", "target", "value", "value", "value", "value", "value", "value",
    ]);
    assert.deepEqual(
        manifest.functions[0].parameters
            .filter((entry: { kind: string }) => entry.kind === "value")
            .map((entry: { type: string }) => entry.type),
        ["text", "component", "number", "boolean", "location", "item", "sound", "any"],
    );
    const lock = JSON.parse(await readFile(join(root, "nocuft.lock.json"), "utf8"));
    assert.deepEqual(Object.keys(lock.packages.mathx).toSorted(), [
        "artifactSha256", "language", "resolvedSource", "source", "sourceSha256", "toolchain",
    ]);
    await writeFile(join(root, "plot.ts"), `
import { item, location, players, sound } from "nocuft";
import { greet } from "./nocuft/mathx/index.js";
export function hello(): void {
    greet("hi", "component", players.all(), 2, true, location(1, 2, 3), item("stone"), "entity.player.levelup", sound("entity.player.levelup"));
}
`);
    const build = await buildProject({ entryPath: join(root, "plot.ts") });
    assert.equal(build.ok, true, build.ok ? undefined : build.diagnostics.map((item) => item.message).join("\n"));
    if (build.ok) {
        assert.deepEqual(build.templates.map((template) => template.name), ["hello", "mathx_relay", "mathx_greet"]);
        assert.deepEqual(build.templates.map((template) => template.origin), [
            { kind: "host" },
            { kind: "package", alias: "mathx" },
            { kind: "package", alias: "mathx" },
        ]);
        assert.equal(build.templates[0].template.blocks[2]?.block, "call_func");
        assert.equal(build.templates[0].template.blocks[2]?.data, "mathx_greet");
        assert.equal(build.templates[0].template.blocks[2]?.target, "Selection");
        assert.deepEqual(
            build.templates[2].template.blocks[0]?.args.items.slice(0, 8).map((entry) => entry.item.data.type),
            ["txt", "comp", "num", "num", "loc", "item", "snd", "any"],
        );
    }
});

test("rejects a host template that collides with a linked package template", async (t) => {
    const root = await project();
    t.after(() => rm(root, { recursive: true, force: true }));
    await installPackage(root, "mathx", "./mathx.ts");
    await writeFile(join(root, "plot.ts"), `
import { players } from "nocuft";
export function mathx_relay(): void { players.all().sendMessage("collide"); }
`);
    const build = await buildProject({ entryPath: join(root, "plot.ts") });
    assert.equal(build.ok, false);
    if (!build.ok) {
        assert.equal(build.diagnostics[0].code, "package.link_conflict");
        assert.match(build.diagnostics[0].message, /mathx_relay/u);
    }
});

test("verification fails closed when a vendored file changes", async (t) => {
    const root = await project();
    t.after(() => rm(root, { recursive: true, force: true }));
    await installPackage(root, "mathx", "./mathx.ts");
    const artifactPath = join(root, "nocuft", "mathx", "package.dfir.json");
    const artifactText = await readFile(artifactPath, "utf8");
    await writeFile(artifactPath, artifactText.replace("\"greet\"", "\"greeting\""));
    await assert.rejects(loadVerifiedPackages(root), /artifact digest/u);
    await writeFile(artifactPath, artifactText);
    await writeFile(join(root, "nocuft", "mathx", "src", "source.ts"), "changed\n");
    await assert.rejects(loadVerifiedPackages(root), /source digest/u);
});

test("regenerates the declaration facade from the verified artifact", async (t) => {
    const root = await project();
    t.after(() => rm(root, { recursive: true, force: true }));
    const installed = await installPackage(root, "mathx", "./mathx.ts");
    const facade = await readFile(installed.facadePath, "utf8");
    assert.match(facade, /^export declare function greet\(/mu);
    assert.doesNotMatch(facade, /packageFunction/u);
    await writeFile(installed.facadePath, "export declare function greet(): void;\n");
    await loadVerifiedPackages(root);
    assert.equal(await readFile(installed.facadePath, "utf8"), facade);
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
        /only nocuft is allowed/u,
    );
});

test("rejects ambiguous function contracts", async (t) => {
    const root = await project();
    t.after(() => rm(root, { recursive: true, force: true }));
    const cases = [
        {
            source: `
import type { PlayerTarget } from "nocuft";
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

test("installs and calls a package with fixed nested lists and recursive rest values", async (t) => {
    const root = await project();
    t.after(() => rm(root, { recursive: true, force: true }));
    await writeFile(join(root, "lists.ts"), `
import type { List } from "nocuft";
export function consume(matrix: List<List<number>>, ...rows: List<number>[]): void {
    for (const row of rows) {
    }
}
`);
    await installPackage(root, "lists", "./lists.ts");
    const facade = await readFile(join(root, "nocuft", "lists", "index.d.ts"), "utf8");
    assert.match(facade, /matrix: List<List<number>>/u);
    assert.match(facade, /\.\.\.rows: List<number>\[\]/u);
    const manifest = JSON.parse(await readFile(join(root, "nocuft", "lists", "package.dfir.json"), "utf8"));
    assert.equal(manifest.version, 2);
    assert.equal(manifest.functions[0].parameters[1].rest, true);
    assert.deepEqual(manifest.functions[0].parameters[1].type, {
        kind: "list",
        elementType: { kind: "list", elementType: "number" },
    });

    await writeFile(join(root, "plot.ts"), `
import { list, type List } from "nocuft";
import { consume } from "./nocuft/lists/index.js";
export function callLists(): void {
    let matrix = list<List<number>>(list<number>(1));
    consume(matrix, list<number>(2), list<number>(3));
}
`);
    const build = await buildProject({ entryPath: join(root, "plot.ts") });
    assert.equal(build.ok, true, build.ok ? undefined : build.diagnostics.map((item) => item.message).join("\n"));
    if (!build.ok) return;
    const host = build.templates.find((template) => template.name === "callLists");
    const packaged = build.templates.find((template) => template.name === "lists_consume");
    assert.ok(host && packaged);
    const call = host.template.blocks.find((block) => block.block === "call_func");
    assert.equal(call?.data, "lists_consume");
    assert.deepEqual(call?.args.items.map((item) => item.slot), [0, 1, 2]);
    assert.deepEqual(packaged.template.blocks[0].args.items.slice(0, 2).map((entry) => entry.item.data), [
        { name: "matrix", optional: false, plural: false, type: "list" },
        { name: "rows", optional: false, plural: true, type: "list" },
    ]);
});

test("installs and calls a package with fixed and rest nested dictionaries", async (t) => {
    const root = await project();
    t.after(() => rm(root, { recursive: true, force: true }));
    await writeFile(join(root, "dicts.ts"), `
import type { Dictionary, Item, List } from "nocuft";
export function consume(
    entries: Dictionary<List<Item>>,
    ...others: Dictionary<List<Item>>[]
): void {
    let current = entries;
    let [primary, found] = current.get("primary");
    current = current.with("copy", primary);
    current = current.merged(others[0]);
    let keys = current.keys();
}
`);
    await installPackage(root, "dicts", "./dicts.ts");
    const facade = await readFile(join(root, "nocuft", "dicts", "index.d.ts"), "utf8");
    assert.match(facade, /import \{ type Dictionary, type Item, type List \} from "nocuft";/u);
    assert.match(facade, /entries: Dictionary<List<Item>>/u);
    assert.match(facade, /\.\.\.others: Dictionary<List<Item>>\[\]/u);
    const manifest = JSON.parse(await readFile(join(root, "nocuft", "dicts", "package.dfir.json"), "utf8"));
    assert.equal(manifest.version, 2);
    assert.deepEqual(manifest.functions[0].parameters[0].type, {
        kind: "dictionary",
        valueType: { kind: "list", elementType: "item" },
    });
    assert.deepEqual(manifest.functions[0].parameters[1].type, {
        kind: "list",
        elementType: { kind: "dictionary", valueType: { kind: "list", elementType: "item" } },
    });

    await writeFile(join(root, "plot.ts"), `
import { dictionary, item, list, type Item } from "nocuft";
import { consume } from "./nocuft/dicts/index.js";
export function callDictionaries(): void {
    let entries = dictionary({ primary: list<Item>(item("stone")), copy: list<Item>(item("dirt")) });
    let others = dictionary({ primary: list<Item>(item("grass_block")), copy: list<Item>(item("sand")) });
    consume(entries, others);
}
`);
    const build = await buildProject({ entryPath: join(root, "plot.ts") });
    assert.equal(build.ok, true, build.ok ? undefined : build.diagnostics.map((item) => item.message).join("\n"));
    if (!build.ok) return;
    const host = build.templates.find((template) => template.name === "callDictionaries");
    const packaged = build.templates.find((template) => template.name === "dicts_consume");
    assert.ok(host && packaged);
    assert.equal(host.template.blocks.find((block) => block.block === "call_func")?.data, "dicts_consume");
    assert.deepEqual(packaged.template.blocks[0].args.items.slice(0, 2).map((entry) => entry.item.data), [
        { name: "entries", optional: false, plural: false, type: "dict" },
        { name: "others", optional: false, plural: true, type: "dict" },
    ]);
    assert.ok(packaged.template.blocks.some((block) => block.action === "SetDictValue"));
    assert.ok(packaged.template.blocks.some((block) => block.action === "AppendDict"));
});
