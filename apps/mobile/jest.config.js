// See packages/ui/jest.config.js for why this whitelist needs the "(?:.*/)?" prefix under pnpm.
const transformModules = [
  "react-native[a-zA-Z0-9_-]*",
  "@react-native[a-zA-Z0-9_/-]*",
  "expo[a-zA-Z0-9_-]*",
  "@expo[a-zA-Z0-9_/-]*",
  "unimodules[a-zA-Z0-9_-]*",
  "@unimodules[a-zA-Z0-9_/-]*",
  "@react-navigation[a-zA-Z0-9_/-]*",
].join("|");

module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@react-native-async-storage/async-storage$":
      "@react-native-async-storage/async-storage/jest/async-storage-mock",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [`node_modules/(?!(?:.*/)?(?:${transformModules})(?:/|$))`],
  testMatch: ["**/__tests__/**/*.test.tsx", "**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
