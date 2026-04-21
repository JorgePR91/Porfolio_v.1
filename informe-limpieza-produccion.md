# Informe técnico de limpieza previa a producción

**Proyecto:** portfolio-20.1.5-app  
**Arquitectura objetivo:** Frontend estático en GitHub Pages + Backend serverless en Vercel + Resend para correo  
**Restricción operativa:** no modificar código, solo documentar qué sobra y qué bloquea producción

## Resumen ejecutivo

Después de revisar el workspace, hay dos grupos de elementos que conviene distinguir con claridad:

1. Código sobrante o legado que puede eliminarse para reducir ruido, peso del repositorio y confusión operativa.
2. Problemas funcionales en el flujo de contacto que no son solo “sobrantes”, sino bloqueantes para producción si no se corrigen.

La parte más importante es el formulario de contacto: hoy el frontend y el backend no hablan el mismo contrato, y además hay restos de Firebase que ya no encajan con la arquitectura descrita. El CORS estricto está bien orientado y debe conservarse con origen explícito, no comodines.

## Qué sobra del proyecto

### 1. Backups completos dentro del workspace

Existe una copia completa de una versión previa bajo [porfolio-20.1.5-app/backups/ui-refresh-20260413-212925](porfolio-20.1.5-app/backups/ui-refresh-20260413-212925). Esa carpeta contiene duplicados de componentes, servicios y plantillas de la app actual. Para producción no aporta valor y sí añade ruido, peso y riesgo de confusión al mantener el proyecto.

Motivo para considerarlo sobrante:
- Duplica el código fuente activo.
- Puede inducir a editar la versión equivocada.
- Complica búsquedas y revisiones.

### 2. Bloque Firebase heredado

Hay una estructura completa de Firebase Functions que no encaja con el stack descrito en tu informe de arquitectura:

- [porfolio-20.1.5-app/functions/src/index.ts](porfolio-20.1.5-app/functions/src/index.ts#L1)
- [porfolio-20.1.5-app/functions/package.json](porfolio-20.1.5-app/functions/package.json#L1)
- [porfolio-20.1.5-app/firebase.json](porfolio-20.1.5-app/firebase.json#L1)
- [porfolio-20.1.5-app/.firebaserc](porfolio-20.1.5-app/.firebaserc#L1)

Ese bloque apunta a un flujo anterior con `firebase-functions` y `nodemailer`, que ya no responde al diseño actual con Vercel + Resend. Si la migración es definitiva, este bloque es candidato claro a limpieza.

### 3. Componente huérfano de usuarios

El componente [porfolio-20.1.5-app/src/app/usuaris/usuaris.ts](porfolio-20.1.5-app/src/app/usuaris/usuaris.ts#L1) no aparece en las rutas activas definidas en [porfolio-20.1.5-app/src/app/app.routes.ts](porfolio-20.1.5-app/src/app/app.routes.ts#L1). Tampoco está importado por [porfolio-20.1.5-app/src/app/app.ts](porfolio-20.1.5-app/src/app/app.ts#L1).

Eso lo convierte en código muerto desde el punto de vista de la app visible. Si no forma parte de una funcionalidad futura, sobra en producción.

### 4. Plantillas externas fuera de la app activa

En la carpeta [Template](Template) hay una plantilla HTML/CSS separada del proyecto Angular activo:

- [Template/template.html](Template/template.html#L1)
- [Template/styles.css](Template/styles.css#L1)

Si esa carpeta se usa solo como referencia visual o prototipo, no debería entrar en el despliegue final de la app pública.

### 5. Artefactos locales que no deben publicarse

También aparecen carpetas que normalmente no deben viajar al repositorio de producción:

- [porfolio-20.1.5-app/dist](porfolio-20.1.5-app/dist)
- [porfolio-20.1.5-app/.angular](porfolio-20.1.5-app/.angular)
- [porfolio-20.1.5-app/node_modules](porfolio-20.1.5-app/node_modules)

Estas carpetas son propias del entorno local o de build y no aportan valor en un despliegue limpio.

### 6. Archivo suelto en la raíz del workspace

Existe un archivo llamado [Nuevo documento de texto.txt](Nuevo%20documento%20de%20texto.txt) en la raíz del workspace. Si no tiene un uso operativo claro, también sobra en un entorno listo para producción.

## Problemas que no son solo “sobrantes”, sino bloqueantes

### 1. Endpoint de contacto inconsistente

El frontend está enviando la solicitud de contacto a [porfolio-20.1.5-app/src/app/services/contact-service.ts](porfolio-20.1.5-app/src/app/services/contact-service.ts#L38), pero la ruta usada es `/send`.

Eso no coincide con la arquitectura definida en tu documentación, donde el endpoint esperado es:

`https://[nombre-proyecto].vercel.app/api/contact`

Consecuencia:
- el formulario puede fallar por 404 o por una ruta incorrecta,
- el contrato real entre frontend y backend queda desalineado,
- la integración no queda preparada para el despliegue final en Vercel.

### 2. Variables de entorno de producción no preparadas

En [porfolio-20.1.5-app/src/environments/environment.prod.ts](porfolio-20.1.5-app/src/environments/environment.prod.ts#L1) el valor de `apiUrl` apunta a un placeholder (`yourdomain.com/api`).

Eso no es una URL utilizable en producción y debe considerarse un bloqueo hasta que se sustituya por la URL final de Vercel.

### 3. Contrato de datos incoherente entre frontend y backend

El frontend envía campos en catalán en [porfolio-20.1.5-app/src/app/contact/contact.ts](porfolio-20.1.5-app/src/app/contact/contact.ts#L1): `nom`, `correu`, `text`, `telefon`.

Sin embargo, la función serverless en [porfolio-20.1.5-app/api/contact.js](porfolio-20.1.5-app/api/contact.js#L1) desestructura `name`, `email`, `message` y luego construye el correo usando variables distintas que no existen en ese contexto.

Consecuencia directa:
- el handler puede lanzar errores en runtime,
- el mensaje no se construye correctamente,
- la respuesta al usuario puede ser 500 aunque la UI parezca correcta.

### 4. Contrato de respuesta incoherente

El frontend espera una respuesta con forma parecida a:
- `success: boolean`
- `message: string`

Pero el backend devuelve estructuras distintas en [porfolio-20.1.5-app/api/contact.js](porfolio-20.1.5-app/api/contact.js#L33).

Esto no siempre rompe la app por completo gracias a tus fallbacks, pero sí deja el flujo débil y confuso para mantenimiento y depuración.

## CORS y seguridad del contacto

Aquí la base está bien orientada: el archivo [porfolio-20.1.5-app/api/contact.js](porfolio-20.1.5-app/api/contact.js#L8) configura un origen explícito para GitHub Pages, no un comodín global.

Eso es lo correcto para tu caso porque:
- evita abrir el endpoint a orígenes no autorizados,
- preserva la separación frontend/backend,
- mantiene la API Key fuera del navegador.

Recomendación conceptual:
- mantener CORS estricto,
- conservar la clave `RESEND_API_KEY` solo en variables de entorno de Vercel,
- no trasladar la lógica de envío al cliente.

## SSR y dependencias que pueden sobrar si el frontend será estático

Si el despliegue definitivo es GitHub Pages como sitio estático, parte del soporte SSR puede ser prescindible:

- [porfolio-20.1.5-app/src/server.ts](porfolio-20.1.5-app/src/server.ts#L1)
- [porfolio-20.1.5-app/src/main.server.ts](porfolio-20.1.5-app/src/main.server.ts#L1)
- [porfolio-20.1.5-app/src/app/app.config.server.ts](porfolio-20.1.5-app/src/app/app.config.server.ts#L1)
- [porfolio-20.1.5-app/src/app/app.routes.server.ts](porfolio-20.1.5-app/src/app/app.routes.server.ts#L1)

Y en [porfolio-20.1.5-app/package.json](porfolio-20.1.5-app/package.json#L1) aparecen dependencias como `@angular/ssr` y `express` que solo tienen sentido si vas a mantener ese modo de entrega.

No lo marco como error inmediato, porque puede ser una decisión arquitectónica consciente. Pero si el objetivo es solo GitHub Pages, ese bloque probablemente sobra.

## Recomendación de limpieza por prioridad

### Prioridad alta
- Corregir el contrato del contacto entre frontend y Vercel.
- Sustituir el `apiUrl` de producción por la URL real.
- Alinear los nombres de campos entre el formulario y `api/contact.js`.
- Mantener CORS estricto con un origen explícito.

### Prioridad media
- Eliminar la carpeta de backups del workspace.
- Retirar el bloque Firebase si ya no se usará.
- Revisar si el componente `usuaris` forma parte de la app final o es código muerto.

### Prioridad baja
- Eliminar plantilla externa si solo era prototipo.
- Limpiar artefactos locales como `dist`, `.angular` y `node_modules` del repositorio.
- Revisar si el soporte SSR sigue siendo necesario.

## Conclusión

Para una subida a producción limpia, el mayor problema no es solo el código sobrante, sino la falta de alineación entre frontend, backend serverless y contrato del formulario.

Si tu objetivo final es exactamente el que describiste, la base correcta es:
- frontend estático en GitHub Pages,
- backend en Vercel,
- Resend como proveedor de correo,
- CORS estricto con origen explícito,
- secreto solo en variables de entorno.

Lo que sobra con más claridad es el legado de Firebase, los backups, el componente `usuaris` si no se usa, y las plantillas externas. Lo que bloquea producción es el endpoint y el contrato del contacto.
