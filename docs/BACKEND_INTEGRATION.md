# Integración futura de backend y frontend

Este repositorio contiene la app Expo/React Native (frontend). Antes de conectarla a un backend:
1. Crear un repositorio independiente para el backend y definir el contrato HTTP/API (OpenAPI).
2. Configurar la URL del backend por entorno (desarrollo, staging, producción).
3. Mantener las claves de OpenAI, pagos y otras credenciales exclusivamente en el servidor.
4. Implementar autenticación, autorización, límites de uso y almacenamiento seguro de historias.
5. Adaptar las llamadas de generación de texto e imágenes para pasar por el backend.
6. Añadir pruebas de integración y despliegue automatizado antes de producción.

No se ha conectado ni desplegado un backend con este paquete.
