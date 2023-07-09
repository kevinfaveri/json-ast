module.exports = {
  "*.{js,ts}": ["eslint --fix", "prettier --write", "git add"],
  "*.{json,yml,yaml,md,graphql}": ["prettier --write", "git add"],
};
