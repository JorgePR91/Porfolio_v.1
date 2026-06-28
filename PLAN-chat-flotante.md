# Plan de trabajo — Chat flotante (escritorio) + botón bajo el hero (móvil)

> **Naturaleza de este documento:** es un **plan/spec**, no código. Describe
> *qué* hay que hacer, *por qué*, *para qué* y *por qué no* otras opciones.
> Las tareas las ejecutas **tú**; la IA solo explica y, si lo pides
> explícitamente para un paso concreto, entrega código acotado a ese paso
> (Reglas 1–3 de `CLAUDE.md`).
>
> **Marca el progreso** con las casillas `[ ]` → `[x]`.

---

## 1. Objetivo

Cambiar cómo se muestra el chatbot del portfolio:

- **Escritorio:** un **botón flotante arriba de la pantalla** (fixed, siempre
  visible). Al pulsarlo, la conversación aparece como un **recuadro superpuesto
  (overlay/modal)** sobre el resto de la página. **Solo se cierra con la "X".**
- **Móvil:** ese overlay flotante **no** se usa. En su lugar, un **botón situado
  debajo del hero** (`<header id="app-header">`) que ofrece el chatbot.

### Estado actual (punto de partida)
- `src/app/chat/chat-widget.*` → la conversación ya funciona, pero se renderiza
  **inline** entre `<app-contact>` y `<app-footer>` (ver `app.html` línea 11).
- `src/app/button-up/button-up.ts` → ya es el **patrón de referencia** del
  proyecto para un botón flotante con guardas de SSR. Lo imitaremos.
- El proyecto usa **SSR en Vercel** e **i18n** (`TranslatePipe`, `langService`).

---

## 2. Decisiones (RESUELTAS — 2026-06-26)

- **D1 — Botón móvil al pulsarse → ✅ Misma conversación a PANTALLA COMPLETA.**
  El overlay ocupa el 100% en móvil; se reaprovecha el mismo panel que en
  escritorio. (Una sola implementación; mejor para teclear en móvil.)

- **D2 — Cierre con `Escape` además de la X → ✅ SÍ.**
  La **X** es el único botón de cierre *visible*; además, `Escape` cierra por
  accesibilidad (teclado/lectores de pantalla). El **backdrop NO cierra**, para
  respetar tu requisito de *"solo finaliza con la X"*.

- **D3 — Posición del botón flotante de escritorio → ✅ Arriba a la DERECHA.**
  Para no chocar con el `nav` (logo/GitHub/idiomas).

---

## 3. Arquitectura propuesta (visión general)

La idea es **separar tres responsabilidades** que hoy están mezcladas:

1. **El estado "abierto/cerrado"** del chat (un único dato compartido).
2. **Los disparadores** (triggers): el botón flotante de escritorio y el botón
   bajo el hero en móvil. Ambos hacen lo mismo: *abrir*.
3. **El panel de conversación** (lo que ya tienes en `chat-widget`), que ahora
   vivirá dentro de un **overlay** en lugar de inline.

**Por qué separarlo así:** un solo "interruptor" evita estados contradictorios
(p. ej. dos botones con ideas distintas de si está abierto). Los triggers se
muestran/ocultan por **CSS según el tamaño de pantalla**, no duplicando lógica.

**Por qué no** meter todo dentro del componente actual sin separar: acabarías con
condicionales `if móvil / if escritorio` repartidos por la plantilla y el TS,
difíciles de mantener.

### ¿Dónde guardar el estado "abierto/cerrado"?
- **Recomendado:** un **servicio pequeño** (p. ej. `ChatUiService`) con una
  `signal` `isOpen` y métodos `open()` / `close()` / `toggle()`.
- **Por qué:** los dos triggers y el panel viven en sitios distintos del árbol;
  un servicio inyectable es el punto neutral que todos comparten.
- **Por qué no** un `@Input/@Output` o pasar el estado de padre a hijo: el botón
  del hero y el botón flotante están en ramas separadas del DOM; "subir" el
  estado hasta un ancestro común complicaría `app.html` sin ganar nada.

---

## 4. Tareas

### Bloque A — Preparación y estado compartido

- [x] **A1. Crear el servicio de estado de UI del chat** (`ChatUiService`).
  - **Qué:** un servicio con `isOpen` (signal booleano) y `open/close/toggle`.
  - **Para qué:** que botones y panel compartan un único origen de verdad.
  - **Por qué ahora:** todo lo demás depende de este interruptor; es el cimiento.

- [x] **A2. Decidir guardas de SSR.**
  - **Qué:** cualquier acceso a `document`/`window`/`body` debe ir protegido con
    `isPlatformBrowser(PLATFORM_ID)`, igual que en `button-up.ts`.
  - **Por qué:** el sitio se renderiza en servidor (Vercel SSR); tocar el DOM en
    servidor rompe el build/render. Es la causa nº1 de fallos en este proyecto.

### Bloque B — El panel de conversación dentro de un overlay

- [x] **B1. Sacar el chat de su posición inline.**
  - **Qué:** quitar `<app-chat-widget>` de su sitio actual en `app.html`
    (línea 11, entre `contact` y `footer`).
  - **Por qué:** ya no es contenido del flujo de la página; pasa a ser una capa
    superpuesta que se monta aparte.

- [x] **B2. Envolver la conversación en un overlay (modal).**
  - **Qué:** el `chat-widget` se renderiza solo cuando `isOpen` es verdadero,
    dentro de un contenedor a pantalla (fondo oscuro + recuadro centrado en
    escritorio; recuadro a pantalla completa en móvil — ver D1).
  - **Para qué:** cumplir *"se sobrepone a la pantalla"*.
  - **Por qué un overlay y no mostrar/ocultar el bloque inline:** un overlay se
    posiciona sobre todo (`position: fixed` + `z-index` alto) y no desplaza el
    contenido; el inline empujaría la maquetación.

- [x] **B3. Botón "X" de cierre dentro del overlay.**
  - **Qué:** una X en la esquina del recuadro que llama a `close()`.
  - **Por qué:** es el único cierre visible que pediste.
  - **Nota:** si fondo-oscuro (backdrop) cierra al hacer clic fuera, eso
    contradiría *"solo con la X"*. **Recomiendo que el backdrop NO cierre**, para
    respetar tu requisito. (Decisión D2 relacionada.)

- [x] **B4. Bloquear el scroll del fondo mientras el overlay está abierto.**
  - **Qué:** al abrir, fijar el `body` (sin scroll); al cerrar, restaurarlo.
    Con guarda SSR (Bloque A2).
  - **Para qué:** que la página de detrás no se mueva al usar el chat.
  - **Por qué no dejarlo:** sin esto, en móvil sobre todo, el fondo "se cuela" y
    da sensación de error.

- [x] **B5. Accesibilidad mínima del modal.** *(ARIA + foco entra/vuelve + `Escape`. Trampa de foco: pendiente/opcional.)*
  - **Qué:** `role="dialog"`, `aria-modal="true"`, etiqueta accesible (vía
    `TranslatePipe`), foco que entra al abrir y **vuelve al botón** al cerrar, y
    `Escape` para cerrar (según D2).
  - **Para qué:** que sea usable con teclado y lector de pantalla.
  - **Por qué importa aquí:** un modal mal hecho deja el foco "perdido" detrás.

### Bloque C — Disparadores (triggers)

- [x] **C1. Botón flotante de escritorio (arriba).** *(hecho; posición final: arriba-derecha bajo el nav, `top: 4.5rem`. Estilo visual fino → D2.)*
  - **Qué:** un botón `position: fixed` arriba (derecha, según D3), siempre
    visible, que hace `open()`. Patrón visual/SSR como `button-up`.
  - **Para qué:** *"un botón posicionado arriba, en modo flotante"*.
  - **Por qué fixed y no dentro del nav:** debe seguir visible al hacer scroll y
    no competir por el espacio del `nav` (logo, GitHub, idiomas).
  - **z-index:** por encima del contenido y del `nav`, y el **overlay por encima
    del botón** (al abrir, el botón queda detrás del modal). Definir la escala de
    `z-index` para no pelearse con `button-up`.

- [x] **C2. Botón "abrir chat" bajo el hero (móvil).**
  - **Qué:** un botón en el flujo normal, **justo debajo de `<app-header>`**
    (hero), que también hace `open()`.
  - **Para qué:** *"en móvil… un botón que se sitúe debajo del hero"*.
  - **Dónde colocarlo:** en `app.html`, entre `<app-header>` y `<app-about-me>`.

- [x] **C3. Mostrar/ocultar cada trigger por tamaño de pantalla (solo CSS).** *(breakpoint 900px; ojo: el botón del hero requiere `#content > #chat-hero-btn` por la especificidad de la encapsulación de Angular.)*
  - **Qué:** el botón flotante se ve **solo en escritorio**; el botón bajo el
    hero **solo en móvil**. Con media queries; **sin** detección por JS.
  - **Por qué CSS y no JS:** evita parpadeos en SSR/hidratación y no necesita
    leer el tamaño de ventana en el servidor (que no existe). Más simple y robusto.
  - **Por qué no `*ngIf` con ancho de ventana:** obligaría a leer `window` (rompe
    SSR) y a recalcular en cada *resize*.

### Bloque D — i18n, estilo y verificación

- [x] **D1. Textos traducibles.**
  - **Qué:** añadir claves de i18n para: etiqueta del botón flotante, etiqueta
    del botón del hero, `aria-label` del modal y de la "X".
  - **Por qué:** el resto del sitio ya usa `TranslatePipe`; mantener coherencia
    (ES/VAL/EN según `langs`).

- [x] **D2. Estilos del overlay y botones.**
  - **Qué:** recuadro centrado con ancho máximo en escritorio (el `.chat` actual
    ya tiene `max-width: 420px`); a pantalla completa en móvil; backdrop; X.
  - **Por qué reaprovechar `chat-widget.scss`:** ya define la conversación; solo
    añadimos la capa de overlay alrededor.

- [x] **D3. Verificación manual.**
  - Escritorio: botón arriba visible → abre overlay → scroll de fondo bloqueado →
    cierra **solo con X** (y `Escape` si D2) → foco vuelve al botón.
  - Móvil (DevTools responsive): **no** aparece el botón flotante; aparece el
    botón **bajo el hero**; al pulsar, chat a pantalla completa (D1=a).
  - SSR: `npm run build` / render sin errores de `document`/`window`.

---

## 5. Ficheros que se tocarán (previsión)

| Fichero | Cambio previsto |
|---|---|
| `src/app/services/chat-ui-service.ts` *(nuevo)* | Estado `isOpen` + open/close/toggle |
| `src/app/chat/chat-widget.html` / `.scss` | Envolver en overlay + X + a11y |
| `src/app/chat/chat-widget.ts` | Inyectar `ChatUiService`; cerrar/abrir |
| `src/app/app.html` | Quitar chat inline; añadir trigger flotante y trigger bajo hero |
| `src/app/app.ts` | Importar nuevos componentes/triggers si se crean aparte |
| Ficheros de i18n | Claves nuevas (botones, aria) |

> Posible refactor: separar los **triggers** en componentes propios
> (`chat-trigger-float`, `chat-trigger-hero`) o mantenerlos como markup simple en
> `app.html`. **Recomendado:** markup simple si solo llaman a `open()`; crear
> componentes solo si crecen en lógica.

---

## 6. Orden sugerido de ejecución

1. **A1 + A2** (estado + guardas) → cimiento.
2. **B1 → B5** (overlay funcionando con la X).
3. **C1 → C3** (los dos botones y su visibilidad por CSS).
4. **D1 → D3** (i18n, estilos finales, verificación).

**Por qué este orden:** cada bloque deja algo *probable* antes de pasar al
siguiente; si algo falla, sabes en qué capa está.

---

## 7. Cómo pediremos el código (recordatorio de método)

Según `CLAUDE.md`:
1. Para cada tarea, primero **explicación / pseudocódigo**.
2. La IA **no escribe código** hasta que lo autorices para **ese paso concreto**.
3. El código entregado se **limita a ese prompt**; el siguiente vuelve a
   explicación, salvo que pidas seguir con código.

> **Siguiente paso sugerido:** confirma **D1, D2 y D3** (sección 2). Con eso
> fijado, empezamos por **A1** (el servicio de estado): te explico el diseño y,
> si lo pides, te paso el código acotado.
