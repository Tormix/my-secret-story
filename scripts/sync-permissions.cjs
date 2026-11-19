// Reapply Expo config to an existing generated project without replacing its signing key.
const { AndroidConfig } = require('@expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');
const config = require('../app.json').expo;
const { clean } = require('../plugins/with-minimal-permissions.cjs');
(async () => {
  const manifestPath = path.join(__dirname, '../android/app/src/main/AndroidManifest.xml');
  const manifest = await AndroidConfig.Manifest.readAndroidManifestAsync(manifestPath);
  await AndroidConfig.Manifest.writeAndroidManifestAsync(manifestPath, clean(manifest, config.android.blockedPermissions));
  const gradlePath = path.join(__dirname, '../android/app/build.gradle');
  const gradle = fs.readFileSync(gradlePath, 'utf8');
  fs.writeFileSync(gradlePath, AndroidConfig.Version.setVersionCode(config, AndroidConfig.Version.setVersionName(config, gradle)));
})();
