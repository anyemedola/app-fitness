module.exports = {
  eslint: {
    base: require.resolve("./eslint/base.js"),
    reactNative: require.resolve("./eslint/react-native.js"),
    node: require.resolve("./eslint/node.js"),
  },
  prettier: require.resolve("./prettier.config.js"),
};
