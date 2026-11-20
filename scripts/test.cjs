const { spawnSync } = require("node:child_process");

// Mocha imports .ts files before falling back to ts-node's CommonJS loader.
// On newer Node versions, disable native stripping so ts-node also typechecks.
const stripTypesFlag = [
  "--no-strip-types",
  "--no-experimental-strip-types"
].find((flag) => process.allowedNodeEnvironmentFlags.has(flag));
const nodeOptions = stripTypesFlag ? [stripTypesFlag] : [];

const result = spawnSync(
  process.execPath,
  [
    ...nodeOptions,
    require.resolve("mocha/bin/mocha"),
    "-r",
    "ts-node/register",
    "test/**/*.ts",
    ...process.argv.slice(2)
  ],
  { stdio: "inherit" }
);

if (result.error) throw result.error;
if (result.signal) process.kill(process.pid, result.signal);
process.exit(result.status === null ? 1 : result.status);
