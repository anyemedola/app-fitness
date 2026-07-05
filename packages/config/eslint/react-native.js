/** ESLint config for the Expo / React Native app. */
module.exports = {
  extends: [require.resolve("./base.js"), "plugin:react/recommended", "plugin:react-hooks/recommended"],
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
  env: { browser: true },
  settings: {
    react: { version: "detect" },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
};
