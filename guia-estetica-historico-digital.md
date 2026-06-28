# Guía de diseño: Estética "Archivero que Programa"

Cómo construir una identidad visual coherente que mezcla referencias históricas/archivísticas con la estética del desarrollo de software.

---

## 1. El concepto antes del código

Antes de tocar CSS, define el **eje narrativo** de la identidad visual. En este caso:

> Historia académica en humanidades → trabajo en archivo físico → salto al desarrollo web

Ese recorrido da pie a dos vocabularios visuales que conviven:

| Mundo histórico/archivístico | Mundo digital/código |
|------------------------------|----------------------|
| Pergamino, tinta, oro        | Terminal, monospace, scanlines |
| Signo de sección `§`, florón `❧` | Prefijo `< >`, cursor `_` |
| Letra capitular, colofón     | Paleta oscura, verde terminal |
| Borde de manuscrito, marginalia | Corchetes de esquina, badges |

La clave es que **ninguno de los dos mundos aplasta al otro**. El fondo es digital (oscuro, scanlines), los detalles son archivísticos (oro, serif, sellos).

---

## 2. La paleta: del frío al cálido

### El error habitual
Los portfolios de programadores usan paletas **frías** (azul, gris pizarra, blanco frío). Funciona, pero no diferencia.

### El cambio
Introducir **calidez sin perder profundidad**: sustituir los negros fríos por negros con tinte orgánico, y los blancos puros por tonos pergamino.

```scss
:root {
  /* Antes: frío */
  --bg-dark:   #10141a;
  --text-main: #e7ecef;
  --text-muted: #b6c0c7;

  /* Después: cálido */
  --bg-dark:   #0c0e0b;   /* negro con tinte verde oliva muy sutil */
  --text-main: #e6e0d0;   /* pergamino */
  --text-muted: #9e9278;  /* tinta desgastada */
}
```

### El acento secundario: oro
Añadir un segundo acento dorado (sin eliminar el primario) da profundidad y evoca la hoja de oro de los manuscritos iluminados.

```scss
:root {
  --accent:     #b31d22;              /* carmesí — tinta principal */
  --gold:       #c9a458;              /* oro — hoja de manuscrito  */
  --gold-soft:  rgba(201,164,88,0.42);
  --gold-dim:   rgba(201,164,88,0.16);
}
```

**Regla de uso:**
- Rojo → elementos interactivos (CTAs, hover, foco)
- Oro → elementos estructurales/decorativos (bordes, números, títulos secundarios)
- Verde terminal `#7ec8a0` → detalles de código (sparingly)

---

## 3. Tipografía en tres niveles

Un portfolio con trasfondo humanístico se beneficia de **tres familias con roles distintos**:

```scss
--font-display: 'Fraunces', Georgia, serif;   /* titulares — evoca libros viejos */
--font-body:    'Space Grotesk', sans-serif;  /* cuerpo — moderno, legible       */
--font-mono:    'JetBrains Mono', monospace;  /* detalles técnicos y archivísticos */
```

### Por qué funciona
- **Fraunces** es una serif variable con irregularidades ópticas que evocan la tipografía de plomo sin ser ilegible.
- **Space Grotesk** es geométrica pero con personalidad — no tan aséptica como Inter.
- **JetBrains Mono** conecta con el código, pero también con la tipografía de máquina de escribir de los archivos del siglo XX.

### Dónde usar cada una

| Elemento | Fuente | Por qué |
|----------|--------|---------|
| `h1`, `h2`, `h3` | Fraunces | Autoridad, historia |
| Párrafos, labels | Space Grotesk | Legibilidad moderna |
| Años/fechas, badges, CTAs, numeración | JetBrains Mono | Precisión, archivo, código |
| Nav name | Fraunces (apellido) + Mono (iniciales) | Contraste intencionado |

---

## 4. Texturas CSS sin imágenes

### Scanlines (CRT histórico)
Evocan monitores antiguos sin ser intrusivas. La clave: opacidad muy baja.

```scss
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9000;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.055) 3px,   /* ajusta entre 0.03 y 0.08 */
    rgba(0, 0, 0, 0.055) 4px
  );
}
```

> Si superas 0.1 de opacidad, se vuelve agresivo. Menos es más.

### Viñeta cálida perimetral
Oscurece los bordes, concentra la atención en el centro, da profundidad "de sala oscura":

```scss
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 8999;
  background: radial-gradient(
    ellipse at center,
    transparent 55%,
    rgba(8, 5, 2, 0.45) 100%   /* negro muy cálido */
  );
}
```

---

## 5. El símbolo `§` en los títulos de sección

El **signo de sección** (§) proviene de los manuscritos medievales y el derecho romano. Hoy lo usan los textos legales y académicos para numerar párrafos. En CSS, aplicarlo como pseudo-elemento es trivial:

```scss
.section-title h2::before {
  content: '§ ';
  font-family: var(--font-mono);
  font-size: 0.6em;
  color: var(--gold);
  opacity: 0.75;
  vertical-align: middle;
}
```

El truco está en usar `font-mono` para el símbolo y `font-display` para el texto → el contraste tipográfico hace el trabajo.

---

## 6. La línea separadora de sección: doble regla

En lugar de una línea gruesa sólida, una doble línea fino dorado + fino carmesí evoca las líneas de pauta de los documentos notariales:

```scss
/* Antes */
.title-line {
  height: 3px;
  background: var(--accent);
}

/* Después */
.title-line {
  height: 4px;
  background: transparent;
  border-top: 1px solid var(--gold-soft);
  border-bottom: 1px solid rgba(179, 29, 34, 0.3);
  flex-grow: 1;
}
```

---

## 7. Capitular (drop cap) de manuscrito

El primer párrafo de una sección de texto largo gana peso y dignidad con una letra capitular:

```scss
section p:first-of-type::first-letter {
  font-family: var(--font-display);
  font-size: 3.8rem;
  font-weight: 700;
  float: left;
  line-height: 0.82;
  margin-right: 0.1em;
  margin-top: 0.06em;
  color: var(--accent);
  text-shadow: 1px 1px 0 rgba(201, 164, 88, 0.2); /* sombra dorada muy sutil */
}
```

**Importante:** `float: left` es lo que hace que el texto rodee la letra. El ajuste de `line-height` y `margin-top` requiere tunning manual según la fuente.

> Funciona con `[innerHTML]` de Angular porque `::first-letter` actúa sobre el contenido renderizado, no sobre el HTML en el template.

---

## 8. Marginalia — el borde izquierdo de manuscrito

Los márgenes de los manuscritos medievales servían para anotaciones. Traducido a CSS:

```scss
section p {
  padding-left: 1.2rem;
  border-left: 2px solid var(--gold-dim); /* muy sutil en reposo */
  transition: border-left-color 0.3s ease;

  &:hover {
    border-left-color: var(--gold-soft); /* se ilumina al interactuar */
  }
}
```

---

## 9. Badges de archivo (monospace, rectangular)

Los badges de año o estado deben parecer sellos de archivo, no chips de UI moderna:

```scss
/* Estilo chip moderno — evitar */
.badge {
  border-radius: 999px;
  background: rgba(179, 29, 34, 0.12);
  font-size: 0.72rem;
  color: var(--accent-soft);
}

/* Estilo sello archivístico */
.badge {
  font-family: var(--font-mono);  /* monospace = máquina de escribir */
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 3px;             /* esquinas rectas, no píldora */
  border: 1px solid rgba(201, 164, 88, 0.3);
  color: var(--gold);
  padding: 0.1rem 0.5rem;
}
```

### El cursor parpadeante para registros activos

Un registro "en curso" en un archivo es un documento aún sin cerrar. El cursor `_` lo comunica perfectamente:

```scss
.badge--active::after {
  content: '_';
  animation: cursor-blink 1.1s step-end infinite;
  color: var(--text-code);   /* verde terminal */
  margin-left: 0.15em;
}

@keyframes cursor-blink {
  50% { opacity: 0; }
}
```

---

## 10. Corchetes de esquina en tarjetas

Sustituyen el `border` completo por dos esquinas decorativas, como los **marcos de catálogo de diapositivas** o los **brackets de código**:

```scss
.card {
  border: 1px solid var(--card-border);
  position: relative;          /* necesario para los pseudo-elementos */

  /* Esquina superior izquierda — dorado */
  &::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px;
    width: 14px; height: 14px;
    border-top: 2px solid var(--gold);
    border-left: 2px solid var(--gold);
    border-radius: 2px 0 0 0;
    opacity: 0.5;
    transition: opacity 0.25s ease, width 0.25s ease, height 0.25s ease;
  }

  /* Esquina inferior derecha — carmesí */
  &::after {
    content: '';
    position: absolute;
    bottom: -1px; right: -1px;
    width: 14px; height: 14px;
    border-bottom: 2px solid var(--accent);
    border-right: 2px solid var(--accent);
    border-radius: 0 0 2px 0;
    opacity: 0.4;
    transition: opacity 0.25s ease, width 0.25s ease, height 0.25s ease;
  }

  /* Las esquinas se expanden en hover */
  &:hover {
    &::before { opacity: 0.9; width: 20px; height: 20px; }
    &::after  { opacity: 0.8; width: 20px; height: 20px; }
  }
}
```

> Solo tienes dos pseudo-elementos por elemento. Si necesitas las cuatro esquinas, añade un `<span aria-hidden="true">` dentro.

---

## 11. El separador ornamental con florón

Un elemento visual que cierra una sección sin usar `<hr>`. El florón `❧` es un símbolo tipográfico histórico:

```html
<div class="ornament-rule" aria-hidden="true">
  <span class="ornament-rule__line"></span>
  <span class="ornament-rule__glyph">❧</span>
  <span class="ornament-rule__line"></span>
</div>
```

```scss
.ornament-rule {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.ornament-rule__line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--gold-soft) 30%,
    rgba(179, 29, 34, 0.4) 70%,
    transparent
  );
}

.ornament-rule__glyph {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--gold);
  opacity: 0.6;
}
```

Otros símbolos útiles de este tipo: `✦` `⁂` `※` `❦` `☙`

---

## 12. Formularios como documentos

Los campos de un formulario de contacto pueden parecer líneas de un impreso oficial:

```scss
/* Quitar todo el borde, dejar solo la línea inferior */
input {
  border: none;
  border-bottom: 1px solid rgba(201, 164, 88, 0.25);
  border-radius: 0;
  background: transparent;
  padding: 0.65rem 0.2rem;

  &:focus {
    outline: none;
    border-bottom-color: var(--gold);
  }
}

/* Los labels en monospace uppercase — como campos de formulario oficial */
label {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gold);
}
```

El textarea mantiene bordes completos (contiene texto largo, necesita delimitación), pero los inputs de una línea son más elegantes sin ellos.

---

## 13. El colofón del footer

Los manuscritos medievales terminaban con el **colofón**: el escriba anotaba cuándo y dónde terminó de copiar el texto. La fórmula clásica era `Explicit` (del latín: "aquí termina").

```scss
footer::before {
  content: '— Explicit —';
  display: block;
  font-family: var(--font-display);
  font-size: 0.72rem;
  color: var(--gold);
  opacity: 0.35;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
  text-align: center;
}
```

Es el detalle más pequeño del portfolio, pero el más honesto: cierra el documento como se hacía hace 700 años.

---

## 14. Numeración archivística en listas

Las listas de habilidades ganan carácter si los bullets son números de catálogo en monospace:

```scss
ul {
  list-style: none;
  counter-reset: catalog-item;

  li {
    counter-increment: catalog-item;
    display: flex;
    align-items: baseline;
    gap: 0.7rem;

    &::before {
      content: counter(catalog-item, decimal-leading-zero) '.';
      /* decimal-leading-zero → 01. 02. 03. en lugar de 1. 2. 3. */
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--gold);
      opacity: 0.55;
      min-width: 2rem;
      text-align: right;
    }
  }
}
```

`decimal-leading-zero` da el `01.` en lugar de `1.` — ese detalle es todo.

---

## 15. El prefijo de terminal en el título principal

Para conectar explícitamente el mundo del código con la identidad de "programador":

```scss
h1::before {
  content: '< ';
  font-family: var(--font-mono);
  font-size: 0.55em;
  color: var(--text-code);   /* verde terminal */
  opacity: 0.75;
  vertical-align: middle;
  letter-spacing: -0.02em;
}
```

Es sutil porque el tamaño es pequeño (0.55em) y la opacidad está rebajada. Si lo hicieras grande y brillante, sería un disfraz. Así es una referencia.

---

## 16. Resumen: la jerarquía de decisiones

Cuando diseñas una identidad visual con dos registros (histórico + digital), el orden de decisiones es:

1. **Define el eje narrativo** → ¿qué historia cuenta esta persona?
2. **Elige la paleta emocional** → ¿qué sensación debe dar? (cálido/frío, orgánico/sintético)
3. **Asigna roles tipográficos** → display / body / mono
4. **Diseña la textura global** → fondo, scanlines, viñeta (son los primeros que ve el ojo)
5. **Implementa los marcadores de sección** → `§`, líneas dobles, ornamentos
6. **Cuida los microdetalles** → cursor parpadeante, corchetes de esquina, colofón

Los microdetalles son lo que convierte un portfolio bonito en uno **memorable**. Nadie los nota conscientemente. Todos los recuerdan.

---

## Herramientas y referencias

- **Símbolos tipográficos históricos**: `§` `¶` `❧` `☙` `⁂` `✦` `※` `❦` — todos en Unicode, ninguno requiere imagen
- **Google Fonts para esta estética**: Fraunces · Lora · Cormorant Garamond · IM Fell English / Space Grotesk · DM Sans · Plus Jakarta Sans / JetBrains Mono · Fira Code · IBM Plex Mono
- **Paletas de referencia**: busca "manuscript dark palette", "parchment dark mode", "sepia terminal"
- **CSS counters**: MDN — `counter-reset`, `counter-increment`, `counter()` con `decimal-leading-zero`
- **`::first-letter`**: funciona sobre contenido renderizado, incluyendo `innerHTML` de Angular/React
