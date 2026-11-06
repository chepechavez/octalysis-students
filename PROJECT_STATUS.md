# Estado del proyecto: Octalysis Students

**Última actualización:** 5 de noviembre de 2026  
**Versión actual:** `2.2.0`  
**Repositorio:** `https://github.com/chepechavez/octalysis-students` (rama `main`)  
**Referencia base:** `https://github.com/chepechavez/octalysis-game`  
**Propósito de este documento:** servir como bitácora viva de estado arquitectónico, cambios realizados y pasos opcionales pendientes para continuar el desarrollo sin fricciones desde cualquiera de los equipos de trabajo del autor.

---

## 1. Resumen ejecutivo del estado actual

La plataforma **Octalysis Students** se encuentra **100 % funcional, verificada con pruebas automatizadas extremo a extremo (Chrome Headless CDP) y lista para uso en aula**. En esta segunda iteración se resolvieron los 6 ajustes pedagógicos, gráficos, ortográficos y de seguridad solicitados tras la primera prueba de campo.

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
| [`index.html`](index.html) | ✅ Completo y verificado | Aplicación SPA completa (`v2.1.1`) para estudiantes y docentes |
| [`google-apps-script/Code.gs`](google-apps-script/Code.gs) | ✅ Nuevo y listo para desplegar | Backend multi-sala para Google Sheets (`Salas` y `Respuestas`) |
| [`README.md`](README.md) | ✅ Actualizado | Documentación de uso pedagógico, despliegue en GitHub Pages y Apps Script |
| [`PROJECT_STATUS.md`](PROJECT_STATUS.md) | ✅ Actualizado | Bitácora técnica viva para continuidad entre equipos |

---

## 4. Paso opcional pendiente para el administrador (configuración de 1 minuto)

La validación de PIN personalizado, la configuración de la sala, el catálogo sin sesgos, los gráficos y las exportaciones ya funcionan de inmediato gracias a la firma `&cfg=` en la URL y a la opción **Usar mi propio Google Sheet**.

Para activar además el **Modo rápido** centralizado entre múltiples dispositivos sin que cada profesor cree su propia hoja:
1. Crea un Google Sheet vacío en tu Google Drive (ej. `Octalysis Students - Base Maestra`).
2. Ve a **Extensiones > Apps Script**, pega el código de [`google-apps-script/Code.gs`](google-apps-script/Code.gs) y publícalo como **Aplicación web** (*Ejecutar como: Yo* / *Quién tiene acceso: Cualquier persona*).
3. Pega la URL `/exec` resultante dentro de `const MASTER_WEBHOOK_URL = "";` en [`index.html`](index.html) (línea `2213`), haz commit y sube a `main`.

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
