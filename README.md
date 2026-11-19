# My Secret Story

Demo 1.4.9 de novelas románticas interactivas para Android. El proyecto usa Expo SDK 58, React Native, Expo Router y TypeScript.

Incluye diez historias, ficha de protagonista, portada opcional con foto, generación de capítulos y una biblioteca local con progreso de lectura.

## Desarrollo

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run start
```

Para exportar el bundle Android ejecuta `npm run export:android`. Para compilar un APK desde las fuentes, configura el JDK y el SDK de Android y ejecuta `npm run build:android`.

La demo permite configurar una clave propia en **Ajustes**. Las llamadas de generación consumen saldo y la foto se envía cuando autorizas usarla para la portada. Consulta [la guía de integración con el backend](docs/BACKEND_INTEGRATION.md) para preparar el paso a un servicio de servidor.
