# Log de Desarrollo - Portafolio Profesional

Este archivo registra los hitos, errores encontrados y soluciones aplicadas durante el desarrollo.

## [2026-05-10] - Inicialización del Proyecto
- **Hito:** Entorno configurado.
- **Acciones:** `npm init`, `git init`, creación de `.gitignore`.
- **Arquitectura:** Definida estructura base (src, public, logs, etc.).
- **Servidor:** Express instalado y configurado con ES Modules. Rutas inicializadas en `src/routes`.
- **Validación:** Sintaxis verificada con `node --check`.

## [2026-05-10] - Corrección de Configuración
- **Error encontrado:** `SyntaxError: Cannot use import statement outside a module`.
- **Causa:** El archivo `package.json` mantenía `"type": "commonjs"` por error tras la inicialización.
- **Solución:** Se actualizó `package.json` a `"type": "module"`.

## [2026-05-11] - Servidor Preparado para el Frontend
- **Cambio:** El servidor ahora expone `public/` como contenido estático y sirve `index.html` como respaldo para rutas de frontend.
- **Cambio:** Se agregaron scripts `start`, `dev` y `check` para ejecutar y validar la app.
- **Validación:** Se corrigió la codificación de los archivos tocados para conservar acentos y caracteres en UTF-8.

## [2026-05-11] - Normalización del Registro
- **Hito:** Limpieza documental del log de desarrollo.
- **Acciones:** Se normalizó este archivo a UTF-8 en español y se revisó `.gitignore` junto con `src/app.js` para mantener la documentación alineada con el estado real del proyecto.
- **Resultado:** El registro quedó conciso, legible y consistente con el servidor actual.
