# 🐶 API K Tienda / Adoptme - Entrega Final Backend III

Este es el proyecto final para el curso de Backend III de Coderhouse. Se implementó una API RESTful con una arquitectura completa en Node.js, documentada, testeada y contenerizada, enfocada en la gestión de usuarios, mascotas, productos y adopciones.

## 🚀 Características Principales y Tecnologías
- **Arquitectura:** Diseño por capas (Router, Controller, DAO, Model).
- **Backend:** Node.js, Express.js.
- **Base de Datos:** MongoDB (Atlas), Mongoose.
- **Testing:** Tests funcionales automatizados con Mocha, Chai y Supertest.
- **Documentación:** Interfaz gráfica interactiva con Swagger (OpenAPI).
- **Deploy y Contenedores:** Proyecto Dockerizado y alojado en DockerHub.

---

## 🐳 Imagen de Docker (DockerHub)

La imagen oficial de este proyecto está disponible públicamente, cumpliendo con los requisitos de contenerización.
🔗 **Link a DockerHub:** [https://hub.docker.com/r/juanfuentesproducer/proyecto-backend-3](https://hub.docker.com/r/juanfuentesproducer/proyecto-backend-3)

### ¿Cómo ejecutar el contenedor localmente?
1. Asegúrate de tener Docker instalado e iniciado en tu sistema.
2. Ejecuta el siguiente comando en tu terminal:
   docker run -p 8080:8080 juanfuentesproducer/proyecto-backend-3:1.0.0
3. La aplicación estará corriendo en `http://localhost:8080`.

---

## 📚 Documentación de la API (Swagger)

Se documentó el módulo de Usuarios utilizando Swagger para facilitar la visualización y prueba de los endpoints directamente desde el navegador.

**Para acceder a la documentación:**
1. Levanta el proyecto localmente (con Docker o con `npm run dev`).
2. Abre tu navegador e ingresa a:
   👉 `http://localhost:8080/apidocs`

---

## 🧪 Tests Funcionales

Se desarrollaron tests funcionales para cubrir todos los endpoints del router de adopciones (`adoption.router.js`), verificando casos de éxito (200) y manejo de errores (404).

**Para ejecutar los tests localmente:**
1. Abre una terminal y levanta el servidor de desarrollo (`npm run dev`).
2. Abre una **segunda terminal** en la raíz del proyecto y ejecuta:
   npm test
*Verás en la consola los checks verdes validando el funcionamiento de los endpoints.*

---

## ⚙️ Instalación Local (Sin Docker)
Si el evaluador desea clonar y correr el proyecto de forma tradicional:
1. Clonar el repositorio: `git clone <tu-enlace-de-github>`
2. Instalar dependencias: `npm install`
3. Crear un archivo `.env` en la raíz con las variables necesarias (ej. `MONGO_URL`).
4. Iniciar el servidor: `npm run dev`

---
*Desarrollado por Juan Fuentes - Estudiante de Coderhouse*