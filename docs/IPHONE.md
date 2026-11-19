# Instalar My Secret Story en iPhone

Estado: código adaptado, proyecto generado y bundle iOS exportado. La compilación nativa Swift y la firma todavía no se han realizado.

## Opción 1: tu Mac y Xcode, cuenta Apple gratuita

1. Instala Xcode, ábrelo y acepta sus componentes. Añade tu cuenta en Xcode → Settings → Accounts.
2. Extrae el proyecto, abre Terminal dentro de MySecretStory y ejecuta `npm ci`.
3. Conecta el iPhone al Mac y acepta Confiar. Activa Modo de desarrollador en Ajustes → Privacidad y seguridad si lo solicita.
4. Ejecuta `npx expo prebuild --platform ios` (instala dependencias nativas CocoaPods en macOS).
5. Abre el archivo `.xcworkspace` de la carpeta `ios`. En Signing & Capabilities elige tu Personal Team y firma automática. Si Apple exige un identificador distinto, cambia `expo.ios.bundleIdentifier` en app.json y regenera, sin editar los archivos generados como fuente permanente.
6. Selecciona el iPhone y pulsa Run. Para uso independiente de Metro, configura el esquema en Release.
7. La firma gratuita caduca a los 7 días; necesitarás recompilar y reinstalar. No desinstales para renovar si quieres conservar los datos.

## Opción 2: distribución entre los socios

Requiere cuenta Apple Developer y cuenta Expo para EAS. El login y firma se realizan en los canales oficiales, no compartiendo contraseñas en el chat.

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest device:create
npx eas-cli@latest build --platform ios --profile ios-preview
```

El perfil `ios-preview` usa distribución interna para dispositivos registrados. Para TestFlight usa `ios-testflight` y configura App Store Connect; no hay subida ni publicación automática en esta entrega. El perfil `ios-simulator` sirve exclusivamente para simulador, no para instalar en un iPhone.

## Prueba necesaria antes de darla por válida

- Login oficial: preflight, navegador, callback 127.0.0.1, retorno a la app, validación JWT y selección del modelo. Probar cancelación y tiempo límite.
- Validar RS256 y ES256 con firmas correctas, alteradas y claves no coincidentes en el módulo Swift compilado.
- Crear novela con detalles de vida y elegir opciones con el teclado abierto.
- Leer hasta las decisiones: no debe rebotar; salir y recuperar capítulo y posición.
- Generar/cancelar/reintentar sin perder capítulos terminados. Medir tiempos reales con la cuenta Plus.
- Importar y recortar foto, exportar PNG y compartir con la hoja nativa.
- Cerrar y abrir, leer sin conexión lo ya guardado, cambiar orientación y tamaño del texto.

Fuentes: https://developer.apple.com/help/account/basics/about-your-developer-account ; https://docs.expo.dev/build/internal-distribution/ ; https://docs.expo.dev/guides/ios-developer-mode/ ; https://developers.openai.com/siwc/token-sharing-open-source/sign-in
