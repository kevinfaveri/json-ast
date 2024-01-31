module.exports = {
  "*.{js,ts}": ["eslint --fix", "prettier --write"],
  "*.{json,yml,yaml,md,graphql}": ["prettier --write"],
};
