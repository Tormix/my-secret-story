const { withAndroidManifest } = require("@expo/config-plugins");
function clean(manifest, blockedPermissions) {
  manifest.manifest["uses-permission"] ||= [];
  const entries = manifest.manifest["uses-permission"];
  for (const name of blockedPermissions || []) {
    const permission = entries.find((item) => item.$["android:name"] === name);
    if (permission) permission.$["tools:node"] = "remove";
    else entries.push({ $: { "android:name": name, "tools:node": "remove" } });
  }
  return manifest;
}
module.exports = (config) =>
  withAndroidManifest(config, (mod) => {
    mod.modResults = clean(mod.modResults, mod.android?.blockedPermissions);
    return mod;
  });
module.exports.clean = clean;
