import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import net from "node:net";
import path from "node:path";

/**
 * Whether a Nocuft client is already listening, which means a game has the jar
 * open.
 *
 * Minecraft reads classes out of the jar lazily and keeps it open for the
 * whole session, so replacing it under a running game leaves that session
 * reading a file that no longer matches what it already loaded. Windows would
 * refuse the write, but a write through WSL does not honour the lock, and the
 * result is every later request failing on a corrupt zip entry rather than
 * anything that points at the cause.
 */
function clientIsRunning(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: "127.0.0.1", port });
    const finish = (running) => {
      socket.destroy();
      resolve(running);
    };
    socket.setTimeout(700);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

/**
 * Copies the built mod into a launcher's mods folder.
 *
 * The folder is chosen once and remembered, because it differs per machine and
 * per launcher and nothing in the repository should assume one.
 */
const clientRoot = fileURLToPath(new URL("..", import.meta.url));
const libs = path.join(clientRoot, "mod", "build", "libs");
const savedTarget = path.join(clientRoot, ".mods-dir");
const JAR = /^nocuft-client-.*\.jar$/u;

function usage() {
  return `Usage:
  npm run mod:install [-- options]

Options:
  --dir <path>   Mods folder to install into
  --save         Remember --dir for next time, in packages/client/.mods-dir
  --force        Install even though a game is running
  -h, --help     Show this help

Without --dir the folder comes from NOCUFT_MODS_DIR, then packages/client/.mods-dir,
then whichever launcher folder is found, if exactly one is.
`;
}

/** Roaming application data, whether run from Windows or from WSL. */
async function roamingDirs() {
  if (process.platform === "win32") {
    return process.env.APPDATA === undefined ? [] : [process.env.APPDATA];
  }
  const users = "/mnt/c/Users";
  if (!existsSync(users)) {
    return [];
  }
  const found = [];
  for (const user of await readdir(users)) {
    const roaming = path.join(users, user, "AppData", "Roaming");
    if (existsSync(roaming)) {
      found.push(roaming);
    }
  }
  return found;
}

/** Every mods folder a launcher on this machine already has. */
async function candidates() {
  const found = [];
  for (const roaming of await roamingDirs()) {
    const profiles = path.join(roaming, "ModrinthApp", "profiles");
    if (existsSync(profiles)) {
      for (const profile of await readdir(profiles)) {
        const mods = path.join(profiles, profile, "mods");
        if (existsSync(mods)) {
          found.push(mods);
        }
      }
    }
    const vanilla = path.join(roaming, ".minecraft", "mods");
    if (existsSync(vanilla)) {
      found.push(vanilla);
    }
  }
  return found;
}

async function saved() {
  if (!existsSync(savedTarget)) {
    return undefined;
  }
  const text = (await readFile(savedTarget, "utf8")).trim();
  return text.length === 0 ? undefined : text;
}

async function resolveTarget(requested) {
  if (requested !== undefined) {
    return requested;
  }
  if (process.env.NOCUFT_MODS_DIR !== undefined && process.env.NOCUFT_MODS_DIR.length > 0) {
    return process.env.NOCUFT_MODS_DIR;
  }
  const remembered = await saved();
  if (remembered !== undefined) {
    return remembered;
  }

  const found = await candidates();
  if (found.length === 1) {
    return found[0];
  }
  if (found.length === 0) {
    throw new Error(
      "No mods folder was found. Pass --dir <path> to name one, and --save to remember it.",
    );
  }
  throw new Error(
    `More than one mods folder was found, so none was chosen:\n`
    + found.map((entry) => `  ${entry}`).join("\n")
    + "\n\nPass --dir <path> --save to pick one.",
  );
}

const args = process.argv.slice(2);
if (args.includes("-h") || args.includes("--help")) {
  process.stdout.write(usage());
  process.exit(0);
}
const dirFlag = args.indexOf("--dir");
if (dirFlag >= 0 && args[dirFlag + 1] === undefined) {
  process.stderr.write("--dir needs a path.\n\n" + usage());
  process.exit(2);
}
const requested = dirFlag >= 0 ? args[dirFlag + 1] : undefined;

const target = await resolveTarget(requested);
if (args.includes("--save")) {
  await writeFile(savedTarget, `${target}\n`, "utf8");
  process.stdout.write(`Remembered ${target} in packages/client/.mods-dir\n`);
}

if (!args.includes("--force") && await clientIsRunning(31380)) {
  process.stderr.write(
    "A Nocuft client is already listening, so a game has this jar open.\n"
    + "Replacing it now would corrupt that session: Minecraft loads classes out\n"
    + "of the jar as it needs them, and the ones it has not read yet would come\n"
    + "from a file that no longer matches. Close Minecraft and run this again.\n"
    + "\nPass --force to install anyway, and restart the game afterwards.\n",
  );
  process.exit(1);
}

if (!existsSync(libs)) {
  throw new Error(`${libs} is missing. Run npm run mod:build first.`);
}
const built = (await readdir(libs)).filter((name) => JAR.test(name)).sort();
if (built.length !== 1) {
  throw new Error(
    built.length === 0
      ? `No mod jar in ${libs}. Run npm run mod:build first.`
      : `Expected one mod jar in ${libs}, found ${built.join(", ")}.`,
  );
}
const jar = built[0];

await mkdir(target, { recursive: true });

// Fabric refuses to load two copies of one mod, so an older version left in
// place would stop the new one rather than be replaced by it.
for (const name of await readdir(target)) {
  if (JAR.test(name) && name !== jar) {
    await rm(path.join(target, name));
    process.stdout.write(`Removed the older ${name}\n`);
  }
}

await copyFile(path.join(libs, jar), path.join(target, jar));
process.stdout.write(`Installed ${jar} into ${target}\n`);

// The mod declares Fabric API as a hard dependency, so without it the game
// starts and the mod simply is not there, which is a confusing way to find out.
const installed = await readdir(target);
if (!installed.some((name) => name.startsWith("fabric-api"))) {
  process.stdout.write(
    "\nWarning: no fabric-api jar is in that folder. Nocuft depends on it and\n"
    + "will not load without it. Install Fabric API for this Minecraft version.\n",
  );
}
