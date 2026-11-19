const fs = require('node:fs');
const path = require('node:path');
// safe-area-context solo usa Spotless al compilar su propio repositorio.
// Evita resolver el formateador de desarrollo cuando se consume como dependencia.
// No cambia código nativo, comprobaciones de la app ni dependencias de ejecución.
const file = path.resolve(__dirname, '../node_modules/react-native-safe-area-context/android/build.gradle');
const before = '        classpath("com.diffplug.spotless:spotless-plugin-gradle:8.1.0")';
const after = '        if (project == rootProject) classpath("com.diffplug.spotless:spotless-plugin-gradle:8.1.0")';
const text = fs.readFileSync(file, 'utf8');
if (!text.includes(after)) {
if (!text.includes(before)) throw new Error('El build.gradle de safe-area-context ha cambiado; revisar antes de aplicar el ajuste de compilación.');
fs.writeFileSync(file, text.replace(before, after));
console.log('Spotless limitado al repositorio de desarrollo de safe-area-context.');
}

let updated = fs.readFileSync(file, 'utf8');
for (const dependency of ['classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version")', 'classpath("com.android.tools.build:gradle:9.2.1")']) {
 updated = updated.replace('        ' + dependency, '        if (project == rootProject) ' + dependency);
}
fs.writeFileSync(file, updated);
