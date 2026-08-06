import { spawnSync } from "node:child_process";

const buildWorkspaces = [
    "nocuft",
    "@nocuft/dfir",
    "@nocuft/compiler",
    "@nocuft/frontend-typescript",
    "@nocuft/deployment",
    "@nocuft/client",
    "@nocuft/cli",
];

const testWorkspaces = [
    "@nocuft/generator",
    "@nocuft/dfir",
    "@nocuft/frontend-typescript",
    "@nocuft/compiler",
    "@nocuft/deployment",
    "@nocuft/client",
    "@nocuft/cli",
];

const command = process.argv[2];
if (command === "build") {
    runWorkspaces("run", "build", buildWorkspaces);
    run("npm", ["run", "assemble", "--workspace=nocuft"]);
} else if (command === "test") {
    run("npm", ["run", "build", "--workspace=@nocuft/client"]);
    runWorkspaces("test", undefined, testWorkspaces);
} else {
    console.error("Usage: node scripts/workspace.mjs <build|test>");
    process.exit(2);
}

function runWorkspaces(npmCommand, script, workspaces) {
    for (const workspace of workspaces) {
        const args = [npmCommand];
        if (script !== undefined) {
            args.push(script);
        }
        args.push(`--workspace=${workspace}`);
        run("npm", args);
    }
}

function run(executable, args) {
    const result = spawnSync(executable, args, { stdio: "inherit", shell: false });
    if (result.error !== undefined) {
        throw result.error;
    }
    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}
