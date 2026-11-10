# Estado del proyecto: Octalysis Students

**Última actualización:** 10 de noviembre de 2026  
**Versión actual:** `2.3.6`  
**Repositorio:** `https://github.com/chepechavez/octalysis-students` (rama `main`)  
**Referencia base:** `https://github.com/chepechavez/octalysis-game`  
**Propósito de este documento:** servir como bitácora viva de estado arquitectónico, cambios realizados y pasos opcionales pendientes para continuar el desarrollo sin fricciones desde cualquiera de los equipos de trabajo del autor.

---

## 1. Resumen ejecutivo del estado actual

La plataforma **Octalysis Students (`v2.3.6`)** se encuentra **100 % funcional, conectada al backend maestro de Google Apps Script (`MASTER_WEBHOOK_URL`), verificada sin errores y lista para proyección en aula y uso estudiantil multi-dispositivo**. En las iteraciones del 10 de noviembre de 2026 (`v2.3.2` a `v2.3.6`) se optimizó la experiencia de usuario (UX) aplicando principios de prevención de errores, legibilidad y reducción de ruido cognitivo: se implementó la visibilidad contextual inteligente del botón de profesor (oculto para alumnos comunes, activo con 1 clic para docentes autenticados), la confirmación preventiva al pulsar «Cambiar sala» (protegiendo el avance no enviado del estudiante), el banner de retorno de emergencia en la pantalla de bienvenida, la limpieza de etiquetas redundantes en las 24 tarjetas del catálogo secuencial (eliminando 48 píldoras repetitivas), la clarificación pedagógica con ejemplos concretos en la tarjeta de comodines (CD8), la corrección integral de contrastes en el botón de permanencia del modal de salida bajo el tema claro, y la integración de fundamentación pedagógica interactiva de los ejes motivacionales (sombrero blanco vs. negro y motivación intrínseca vs. extrínseca) en el panel docente, accesible mediante clics en el cuadrante 2D, etiquetas de los ejes y tarjetas KPI.

---

## 2. Ajustes implementados en la iteración 2 (`v2.1.0`)

### 1) Corrección definitiva del PIN personalizado y persistencia entre navegadores y dispositivos
- **Causa raíz corregida:** en la `v2.0.0`, la configuración de una sala nueva solo vivía en `localStorage` del navegador creador y apuntaba a una URL Firebase de marcador de posición (`404`), haciendo que al abrir el enlace en otra pestaña limpia o navegador se cargara el objeto por defecto con PIN `1234`. Además, el campo de creación traía `value="1234"` prellenado y `window.location.origin` fallaba bajo `file://`.
- **Solución implementada:**
  - Implementación nativa de `SHA-256` (`sha256Hex` + `hashRoomPin(roomCode, pin)`) sin depender de `crypto.subtle` (compatible tanto con `https://` en GitHub Pages como con `file://` local).
  - Enlace y código QR autodescriptivos y firmados (`?sala=OCTA-XXX&cfg=<base64url>` y opcionalmente `&wh=<scriptId>`): transportan nombre del curso, banderas de cédula/correo y el resumen criptográfico truncado del PIN (`pinHash`), permitiendo validar el PIN real del docente en cualquier dispositivo incluso sin caché local.
  - Eliminación total del respaldo `1234` en salas creadas por docentes (`1234` queda restringido exclusivamente a la sala demostrativa `OCTA-DEMO`).
  - Creación del backend real multi-sala en [`google-apps-script/Code.gs`](google-apps-script/Code.gs) con pestañas automáticas `Salas` y `Respuestas`, bloqueo concurrente (`LockService`), deduplicación por sesión estudiantil y borrado autenticado por `pinHash`.

### 2) Doble confirmación obligatoria del PIN del docente
- Se eliminó el valor prellenado `1234` en el modal **Crear nueva sala de clase**.
- Se añadió el campo **Confirmar PIN** con indicador visual en tiempo real (`validatePinMatch`) y botón **Mostrar / ocultar PIN**, bloqueando el envío si ambos campos no coinciden exactamente.
- Se implementó el modal completo **Configurar sala actual** (`openRoomSettingsModal`), que antes estaba referenciado pero pendiente, incluyendo cambio opcional de PIN con doble confirmación y botón para vaciar respuestas de la sala.

### 3) Catálogo inicial sin sesgos teóricos y revelación secuencial posterior (24 tarjetas)
- **Fase 1 (catálogo inicial):** las 24 tarjetas se mezclan aleatoriamente al iniciar y muestran únicamente título y descripción cotidiana. Se eliminaron las píldoras de `CD1`–`CD8`, sombrero blanco/negro, motivación intrínseca/extrínseca y los filtros teóricos superiores, reemplazándolos por un buscador por palabra clave y el botón **🎲 Mezclar orden**.
- **Base matemática uniforme:** se exige elegir **exactamente 6 reglas** en la fase 1, seguidas en la fase 2 por **prioridad 1 (obligatoria)** y **prioridades 2 y 3 (opcionales)** (también sin mostrar `CDx` en las listas desplegables).
- **Fase 3 (orden de devolución al estudiante):** al confirmar, se ocultan el catálogo inicial y su bandeja flotante para mostrar limpia y secuencialmente:
  1. **Su propia red octagonal** (`CD1` a `CD8`).
  2. **Sus ejes de equilibrio motivacional** (sombrero blanco vs. negro e intrínseca vs. extrínseca).
  3. **Su estrategia de aprendizaje y recomendaciones de autorregulación**.
  4. **Sección desplegable opcional al final:** botón `📚 Explorar la información completa de las 24 tarjetas ordenadas por Core Drive (CD1 a CD8)`, que despliega los 8 bloques en orden secuencial con toda su clasificación teórica y medallas en las reglas elegidas y priorizadas por el estudiante.

### 4) Indicadores claros de clic en la red octagonal y en los ejes de equilibrio
- Llamado explícito encima del octágono estudiantil indicando que las 8 etiquetas y vértices son clicables, cursor interactivo (`pointer`) y efecto visual de resalte al pasar el cursor (`hover`) sobre las etiquetas exteriores del Canvas (abriendo el modal explicativo de cada Core Drive al hacer clic). Se eliminó la fila redundante de botones inferiores para mantener una interfaz limpia y centrada en el gráfico.
- Botones interactivos `ℹ️ ¿Qué diferencia hay entre sombrero blanco y negro?` e `ℹ️ ¿Qué diferencia hay entre intrínseca y extrínseca?` junto con etiquetas subrayadas clicables en las barras de equilibrio, que abren el nuevo modal comparativo `#modalAxisExplanation`.

### 5) Geometría oficial del octágono Octalysis
- Se sincronizó la distribución espacial de `drawOctagonRadar()` con la geometría oficial de Yu-kai Chou (idéntica a la validada en `octalysis-game`):
  - Arriba (sombrero blanco): `CD2` (`-135°`), `CD1` (`-90°`), `CD3` (`-45°`).
  - Centro izquierda / derecha: `CD4` (`180°`, motivación extrínseca) y `CD5` (`0°`, motivación intrínseca).
  - Abajo (sombrero negro): `CD6` (`+135°`), `CD8` (`+90°`), `CD7` (`+45°`).
- Soporte de alta densidad de píxeles (`devicePixelRatio`) para nitidez en pantallas Retina/móviles y contraste reforzado al exportar el radar al reporte PDF.

### 6) Ortografía y normas del español para estudiantes latinoamericanos
- Revisión integral de encabezados, subtítulos, botones, modales, las 24 tarjetas, ejes, concordancia singular/plural (`1 estudiante registrado`, `1 voto`, `1 mención`) y columnas de exportación Excel/PDF/CSV aplicando mayúscula inicial únicamente en la primera palabra y en nombres propios o términos técnicos consolidados (*Octalysis*, *Core Drive*, `CD1`–`CD8`, *Excel*, *PDF*, *CSV*, *Google Sheet*).
- Corrección adicional en la exportación Excel (`exportDataToExcel`): la hoja *Resumen del grupo* ahora toma los promedios colectivos reales de `computeGroupMetrics()` en lugar de leer valores individuales del DOM estudiantil.

---

### 7) Guía integrada y copiado con 1 clic para «Usar mi propio Google Sheet»
- **Asistencia contextual docente:** al seleccionar *Usar mi propio Google Sheet* en el modal de crear sala o al configurar una sala existente, se despliega una tarjeta de ayuda con acceso directo al nuevo modal `#modalCustomSheetGuide`.
- **Tutorial de 4 pasos con cero fricción:** incluye enlace directo para abrir una hoja nueva en blanco (`sheets.new`), explicaciones claras y advertencia destacada sobre el permiso crucial (`Cualquier persona`).
- **Copiado seguro sin dependencias externas:** botón de copiado inmediato al portapapeles (`copyAppsScriptCode`), enlace de descarga de `Code.gs` y visor interactivo desplegable del código fuente (369 líneas) embebido en `<script type="text/plain" id="tplAppsScriptCode">`, garantizando funcionamiento tanto en web (GitHub Pages) como sin conexión / localmente (`file://`).
- **Manejo inteligente de modales superpuestos:** la tecla `Escape` cierra primero la guía manteniendo intactos los datos de la sala que el profesor estaba digitando.

---

## 3. Estado de archivos del repositorio

| Archivo | Estado | Descripción |
| :--- | :--- | :--- |
| [`index.html`](index.html) | ✅ Completo y verificado | Aplicación SPA completa (`v2.3.0`) con flujo de bienvenida, tema claro/oscuro y `MASTER_WEBHOOK_URL` activo |
| [`google-apps-script/Code.gs`](google-apps-script/Code.gs) | ✅ Actualizado (`v2.3.0`) | Backend multi-sala para Google Sheets (`Salas` y `Respuestas`) con búsqueda por nombre/código y validación de duplicados |
| [`README.md`](README.md) | ✅ Actualizado | Documentación de uso pedagógico, despliegue en GitHub Pages y Apps Script |
| [`PROJECT_STATUS.md`](PROJECT_STATUS.md) | ✅ Actualizado | Bitácora técnica viva para continuidad entre equipos |

---

## 4. Sincronización maestra en la nube (`MASTER_WEBHOOK_URL`)

- **Estado:** ✅ **Configurada y activa** en [`index.html`](index.html) (`const MASTER_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwwy2VY46pqlMKBpdpdqN4fwRh1B9JA1Nfq4e64vW8Kw_VD3ZiqYRo9craxWi99NP7E/exec";`).
- **Compatibilidad retroactiva:** el frontend mantiene simultáneamente un registro de índice en la fila `OCTA-INDEX` de la pestaña `Salas`, por lo que la búsqueda de salas por nombre y la validación de nombres duplicados funcionan de inmediato tanto con la implementación actual del webhook como al actualizar el código de Apps Script a `v2.3.0`.

---

## 5. Instrucciones rápidas al cambiar de computador

```bash
# 1. Al sentarte en otro equipo, descarga siempre la última versión:
git pull origin main

# 2. Revisa este archivo (PROJECT_STATUS.md) para confirmar estado y pendientes.

# 3. Al terminar ajustes en ese equipo, respalda los cambios:
git add .
git commit -m "Descripción breve del ajuste realizado"
git push origin main
```

---

## 6. Historial de cambios

- **2026-11-10 (`v2.3.6`):**
  - **Fundamentación pedagógica interactiva de ejes motivacionales en la vista docente:**
    - **Cuadrante 2D de perfiles de aula:** se incorporaron botones explicativos `.btn-axis-info` en la cabecera del contenedor (`ℹ️ Sombrero blanco vs. negro` e `ℹ️ Intrínseca vs. extrínseca`), así como una barra de leyendas de equilibrio motivacional bajo el canvas, invocando [`openAxisInfoModal('hats')`](index.html#L7054) y [`openAxisInfoModal('motivation')`](index.html#L7084).
    - **Etiquetas clicables:** se transformaron los descriptores de los ejes en elementos interactivos `.clickable-concept` con colores semánticos (`var(--white-hat)`, `var(--black-hat)`, `var(--extrinsic)`, `var(--intrinsic)`).
    - **Interactividad sobre el Canvas 2D (`drawClassQuadrant`):** se implementó detección de clics y eventos de ratón (`mousemove`/`click`) con cursor interactivo (`pointer`) directamente en los extremos y etiquetas de los ejes (`Sombrero blanco`, `Sombrero negro`, `Intrínseca`, `Extrínseca`).
    - **Tarjetas KPI superiores clicables:** las tarjetas *«Tendencia de sombrero»* y *«Balance motivacional»* del resumen docente ahora incluyen el estilo interactivo `.kpi-card.clickable` con píldora `ℹ️ Info`, permitiendo al docente abrir la fundamentación teórica desde cualquier sección del panel de control.

- **2026-11-10 (`v2.3.5`):**
  - **Corrección de contraste y visibilidad en tema claro para el modal de salida (`#modalConfirmExitRoom`):**
    - Se resolvió el error visual donde el texto del botón principal `🛡️ Permanecer en la sala` era invisible en tema claro (texto blanco sobre fondo transparente contra la tarjeta modal blanca).
    - La causa raíz residía en una sobreescritura inline que invocaba una variable no declarada (`background: var(--primary); color: #fff;`).
    - Se retiró la sobreescritura inline para permitir que aplique limpiamente la clase nativa `.form-submit-btn` (degradado azul `#0284c7` a `#0369a1` con texto blanco `#ffffff`, garantizando contraste WCAG AAA en ambos temas) y se declararon formalmente las variables `--primary: #0284c7;` y `--text-color: var(--text-heading);` en `:root` y en `html[data-theme="light"]`.

- **2026-11-10 (`v2.3.4`):**
  - **Clarificación pedagógica de la regla 23 (CD8: Comodines con fecha de caducidad):**
    - Se integraron ejemplos concretos y cotidianos entre paréntesis en la descripción de la tarjeta: *(ej. prórroga de 48 horas sin penalización, reintentar una actividad corta o sustituir la nota más baja)*.
    - Esta adición hace inmediatamente tangible para el estudiante de qué trata un pase de flexibilidad, elimina la ambigüedad conceptual en el aula y refuerza por qué pertenece a *Pérdida y evitación (CD8)*: el comodín ya le pertenece como escudo preventivo, y la fecha de corte crea la necesidad de administrarlo para no perderlo.

- **2026-11-10 (`v2.3.3`):**
  - **Eliminación de etiquetas redundantes en el catálogo secuencial (`renderFullCatalogSequential`):**
    - Se retiraron las píldoras repetitivas de sombrero (`Sombrero blanco` / `negro`) y motivación (`Intrínseca` / `Extrínseca`) de cada una de las 24 tarjetas del acordeón desplegable.
    - Como las 3 reglas de cada bloque ya pertenecen al mismo Core Drive y su clasificación teórica se declara claramente en la cabecera del bloque, se eliminaron 48 etiquetas innecesarias.
    - Las tarjetas no elegidas quedan con una presentación tipográfica limpia y espaciosa, mientras que las reglas seleccionadas por el estudiante destacan con protagonismo visual absoluto mediante sus medallas: `🥇 Tu prioridad 1 (regla de oro)`, `🥈 Tu prioridad 2`, `🥉 Tu prioridad 3` o `✓ Elegida entre tus 6 reglas`.

- **2026-11-10 (`v2.3.2`):**
  - **Visibilidad condicional inteligente del botón de profesor (`updateRoleNavVisibility`):**
    - En la vista de estudiante, el botón `👨‍🏫 Profesor` de la cabecera ahora permanece oculto si el usuario es un estudiante no autenticado en esa sala, eliminando distracciones, clics curiosos hacia el modal de PIN y saturación de la barra superior en pantallas móviles.
    - Si el docente ya ingresó su PIN en la sesión actual (`isTeacherAuthenticatedForCurrentRoom()`) o se encuentra en `OCTA-DEMO`, el botón `👨‍🏫 Profesor` se mantiene visible y activo, permitiéndole alternar en vivo entre la vista estudiantil y el panel de control docente con 1 solo clic y sin volver a escribir el PIN.
    - Se agregó un enlace no invasivo en el pie de página de la vista de estudiante (*«¿Eres el docente de esta sala? Acceder al panel con PIN»*) para docentes que ingresen por descuido desde el enlace o código QR compartido a los alumnos.
  - **Prevención de salidas accidentales y protección del progreso estudiantil (`#modalConfirmExitRoom`):**
    - Intercepción del botón `🚪 Cambiar sala` y del clic sobre el logotipo de la aplicación con confirmación preventiva cuando hay una sala activa.
    - Si un estudiante tiene reglas seleccionadas (`selectedMechanics.length > 0`) y no las ha enviado, se muestra una alerta visual destacada indicando que las selecciones sin enviar se perderían.
    - El foco inicial del modal se posiciona en el botón seguro `🛡️ Permanecer en la sala` (cerrable con Esc o ✕ sin alterar el estado).
  - **Banner de retorno de emergencia en la pantalla de bienvenida (`#welcomeReturnActiveRoomBanner`):**
    - Si un usuario confirma la salida o llega a la pantalla de bienvenida por error, se despliega una barra contextual superior destacada (*«¿Saliste por error? Tu sesión en la sala sigue disponible»*) con botón de 1 clic `← Volver a la sala`.
    - Al pulsar el retorno, el usuario vuelve de inmediato a la sala y rol previos preservando sus selecciones intactas en memoria sin reiniciar el sondeo.

- **2026-11-09 (`v2.3.1`):**
  - **Rediseño estético y unificación visual del flujo de bienvenida (`#viewWelcome`):**
    - Corrección integral de la discrepancia de nombres entre clases CSS y marcado HTML (contenedores, tarjetas de rol, opciones docentes e indicadores).
    - **Paso 1 (Selección de rol):** tarjetas interactivas de rol (`Soy estudiante` y `Soy profesor`) con micro-interacciones hover, íconos iluminados, viñetas explicativas de características (`🎯 6 reglas`, `🕸️ Octágono`, `📊 Tablero vivo`, `🧭 Cuadrante 2D`) y botones CTA estilizados.
    - **Paso 2A (Acceso estudiante):** diseño centrado en tarjeta enmarcada, campo de búsqueda con foco radiante, tarjeta de asistencia contextual para códigos QR y enlaces directos, y contenedor de chips interactivos para salas recientes.
    - **Paso 2B (Portal docente):** reestructuración en cuadrícula balanceada de 3 columnas de altura uniforme (`👀 Ver sala demo`, `🔓 Entrar a mi sala`, `✨ Crear sala nueva`), lista de beneficios con viñetas de verificación, botón para alternar visibilidad de PIN (`👁️`/`🙈`) y cuadro de advertencia de seguridad unificado.
    - **Prevención de parpadeo de tema (FOUC):** script síncrono ultra-rápido en `<head>` para cargar de inmediato el tema guardado en `localStorage` o solicitado vía URL (`?tema=claro` / `?tema=oscuro`), asegurando contrastes idénticos en tableros digitales y pantallas de alta densidad.
    - **Optimización responsiva móvil (`360px` a `768px`):** adaptación fluida de tarjetas, botón de tema con modo icono compacto en pantallas angostas y eliminación de cualquier desbordamiento horizontal.

- **2026-11-09 (`v2.3.0`):**
  - **Nuevo flujo de entrada paso a paso (`#viewWelcome`):**
    1. Pantalla inicial limpia que pregunta primero si el usuario es **🎒 Soy estudiante** o **👨‍🏫 Soy profesor** cuando se ingresa sin parámetro `?sala=`.
    2. Paso para **estudiantes** con búsqueda por **nombre de la sala/asignatura**, **código (`OCTA-XXX`)** o enlace completo, incluyendo lista de desambiguación si coinciden varias salas.
    3. **Entrada directa por enlace o QR (`?sala=...`):** los estudiantes que abren el enlace compartido por su docente omiten la pantalla de bienvenida y llegan directo a la sala de su curso.
    4. **Portal del profesor con 3 opciones:** **👀 Ver sala demo (`OCTA-DEMO`)**, **🔓 Entrar a mi sala** (ingresando nombre/código + PIN) y **✨ Crear sala nueva**.
  - **Prevención de nombres duplicados y resguardo del PIN docente:** validación al crear sala para evitar que dos salas se llamen igual (sugiriendo agregar el grupo o semestre, ej. *«Narrativa digital G1»*), nota de advertencia de alta visibilidad en el formulario de creación y cuadro de credenciales en el modal QR con botones para **copiar datos de acceso** o **descargar recordatorio (`.txt`)**.
  - **Selector de tema Claro / Oscuro y mejora de contrastes para tableros digitales:** se mantiene el tema oscuro como predeterminado (con contraste mejorado en textos secundarios y bordes) y se añade el botón **☀️ Tema claro / 🌙 Tema oscuro** en el encabezado, activando una paleta sobre fondo blanco (`#ffffff`) con textos oscuros (`#0f172a`) y redibujado automático de los gráficos Canvas (`drawOctagonRadar` y `drawClassQuadrant`) para máxima legibilidad en proyectores y tableros digitales con el salón iluminado.
  - **Auditoría y corrección de errores:** conexión de `MASTER_WEBHOOK_URL`, inclusión del campo de nombre/código de sala en `#modalTeacherPin`, limpieza de estado estudiantil en memoria al cambiar de sala (`resetStudentSurveyStateForRoom`) y eliminación de colores `#fff` fijos en estilos en línea.
- **2026-11-05 (`v2.2.0`):**
  - **Validación y optimización responsiva móvil (`320px` a `768px`):** bandeja de selección fluida en móviles (sin bloquear el área de lectura), ajuste dinámico de radio y contención de etiquetas `CD1`–`CD8` en `drawOctagonRadar()` para evitar recortes laterales en pantallas pequeñas, escalado exacto de coordenadas táctiles y adaptación de cuadrículas, tablas y modales.
  - **Exportación individual para el estudiante (`.png` y `.pdf`):** incorporación de `exportStudentProfileImage()` (lienzo de alta densidad `2x`) y `exportStudentProfilePDF()` (`jsPDF` A4) en la sección de devolución del estudiante.
  - **Flujo unificado de acceso docente y creación de sala:** se retiró el botón suelto `✨ Crear sala` del encabezado estudiantil y se integró el **Portal de acceso docente** dentro de `👨‍🏫 Profesor` (`#modalTeacherPin`), permitiendo tanto desbloquear la sala actual con PIN (o acceso en 1 clic a `OCTA-DEMO`) como **crear una nueva sala y definir el PIN**, además del botón `✨ Crear nueva sala` en la barra superior del panel docente.
  - **Visibilidad inmediata de pestañas en Google Sheets (`Code.gs`):** `ensureSheets_()` inserta ahora la pestaña `Respuestas` en la primera posición (`índice 0`) con encabezado destacado para que el docente visualice los registros sin quedarse en `Hoja 1`, y `fetchCloudRoomAndSubmissions()` preserva respuestas locales recientes en tránsito.
- **2026-11-03 (`v2.1.1`):**
  - Simplificación de la red octagonal individual: eliminación de la fila redundante de botones inferiores (`CD1 · Significado` a `CD8 · Evitación`) y limpieza de estilos CSS, manteniendo la interactividad directamente en las 8 etiquetas periféricas y vértices del octágono en Canvas.
  - Corrección de renderizado en el cuadrante 2D: reemplazo del operador `|| 50` por `Number.isFinite(...)` en el cálculo de coordenadas y color de nodo para evitar que valores válidos de `0%` (sombrero blanco o intrínseca) colapsen falsamente al punto medio (`50%`) y se pinten en cian.
- **2026-11-02 (`v2.1.0`):**
  - Solución integral al bug del PIN personalizado (`SHA-256` por sala, firma `&cfg=` en URL/QR, eliminación del respaldo `1234` fuera de `OCTA-DEMO` y creación de `google-apps-script/Code.gs`).
  - Confirmación obligatoria de PIN al crear sala y nuevo modal completo de configuración de sala activa.
  - Catálogo inicial imparcial mezclado al azar (sin etiquetas teóricas), selección exacta de 6 reglas y revelación secuencial opcional de las 24 tarjetas (`CD1` a `CD8`) al final de la devolución al estudiante.
  - Red octagonal con la distribución oficial de Octalysis, llamados explícitos de clic, píldoras interactivas y modal comparativo para sombrero blanco/negro y motivación intrínseca/extrínseca.
  - Aplicación rigurosa de ortografía española en toda la interfaz y en los motores de exportación Excel, PDF y CSV.
  - Verificación estática y pruebas E2E automatizadas en Chrome Headless sin errores.
- **2026-10-31 (`v2.0.0`):**
  - Creación inicial de `Octalysis Students` con flujo estudiante/docente, generación de QR y exportaciones a Excel (`.xlsx`), PDF y CSV.
