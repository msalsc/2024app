module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["@event-app/eslint-config-custom"],
  ignorePatterns: ["dist", "node_modules", ".next", ".cache"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
