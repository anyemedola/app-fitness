/** ESLint config for the Node.js backend. */
module.exports = {
  extends: [require.resolve("./base.js")],
  env: { node: true, jest: true },
};
