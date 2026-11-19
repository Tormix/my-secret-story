const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");
module.exports = defineConfig([
  expo,
  {
    ignores: [
      "android/**",
      "dist*/**",
      "captures/**",
      "modules/**",
      "docs/**",
      "scripts/**",
      "tests/**",
    ],
  },
]);
