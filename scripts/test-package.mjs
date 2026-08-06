import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const temporary = await mkdtemp(join(tmpdir(), "nocuft-package-"));
const packed = join(temporary, "packed");
const consumer = join(temporary, "consumer");

try {
    await mkdir(packed);
    await mkdir(consumer);
    const pack = run("npm", [
        "pack",
        "--ignore-scripts",
        "--json",
        "--pack-destination",
        packed,
        "--workspace=nocuft",
    ]);
    const report = JSON.parse(pack.stdout);
    const filename = report[0]?.filename;
    if (typeof filename !== "string") throw new Error("npm pack did not report a tarball");
    const tarball = join(packed, filename);

    await writeFile(join(consumer, "package.json"), `${JSON.stringify({
        private: true,
        type: "module",
        devDependencies: {
            nocuft: `file:${tarball}`,
        },
    }, undefined, 2)}\n`);
    await writeFile(join(consumer, "tsconfig.json"), `${JSON.stringify({
        compilerOptions: {
            target: "ESNext",
            module: "ESNext",
            moduleResolution: "Bundler",
            strict: true,
            noEmit: true,
        },
        include: ["plot.ts"],
    }, undefined, 2)}\n`);
    await writeFile(join(consumer, "plot.ts"), [
        'import { players } from "nocuft";',
        "",
        "export function hello(): void {",
        '    players.all().sendMessage("Hello");',
        "}",
        "",
    ].join("\n"));

    run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], consumer);
    const environment = {
        ...process.env,
        XDG_CONFIG_HOME: join(temporary, "config"),
    };
    const nocuft = join(
        consumer,
        "node_modules",
        ".bin",
        process.platform === "win32" ? "nocuft.cmd" : "nocuft",
    );
    run(nocuft, ["--help"], consumer, environment);
    run(process.execPath, [join(consumer, "node_modules", "typescript", "bin", "tsc")], consumer, environment);
    run(nocuft, [
        "init",
        "hello",
        join(consumer, "plot.ts"),
    ], consumer, environment);
    console.log(`Package smoke test passed for ${filename}.`);
} finally {
    await rm(temporary, { recursive: true, force: true });
}

function run(executable, args, cwd = process.cwd(), env = process.env) {
    const result = spawnSync(executable, args, { cwd, env, encoding: "utf8" });
    if (result.error !== undefined) throw result.error;
    if (result.status !== 0) {
        throw new Error([
            `${executable} ${args.join(" ")} failed with status ${result.status}`,
            result.stdout,
            result.stderr,
        ].filter(Boolean).join("\n"));
    }
    return result;
}
