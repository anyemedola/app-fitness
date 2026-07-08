const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Let Metro see workspace packages (packages/ui, packages/theme, ...). pnpm keeps nested
// deps inside node_modules/.pnpm/<pkg>/node_modules rather than hoisting them, so hierarchical
// lookup must stay enabled (disabling it, as classic Yarn/NPM hoisted-monorepo configs do,
// makes those nested packages unresolvable) and symlinks must be followed.
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.unstable_enableSymlinks = true;

// The Firebase JS SDK (used via `firebase/auth`, not `@react-native-firebase`) is
// incompatible with Metro's package-exports resolution — it throws "Component auth has
// not been registered yet" at runtime. This is Expo's own documented workaround:
// https://docs.expo.dev/guides/using-firebase/
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
