#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ -z "${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}" ]]; then
  echo "Configura ANDROID_HOME con la ruta de tu SDK de Android (Android Studio)." >&2
  exit 1
fi
if ! command -v javac >/dev/null 2>&1; then
  echo "Instala el JDK completo y configura JAVA_HOME. Un JRE sin javac no permite compilar." >&2
  exit 1
fi
if [[ -n "${OPENAI_API_KEY:-}${MSS_API_KEY_FILE:-}" ]]; then
  node scripts/embed-key.cjs
fi
npm run typecheck
npm run lint
npm test
node scripts/prepare-android-deps.cjs
npx expo prebuild --platform android --no-install
cd android
./gradlew :app:assembleRelease -PreactNativeArchitectures=arm64-v8a --no-daemon --max-workers=2
mkdir -p ../release
cp app/build/outputs/apk/release/app-release.apk ../release/MySecretStory.apk
printf '\nAPK: release/MySecretStory.apk\n'
