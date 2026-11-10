# ⬡ Octalysis Students
> **Plataforma web de sondeo motivacional y cocreación de acuerdos de clase basada en el modelo Octalysis.**

![Versión](https://img.shields.io/badge/versión-2.3.4-cyan.svg)
![Licencia](https://img.shields.io/badge/licencia-MIT-purple.svg)
![Despliegue](https://img.shields.io/badge/GitHub%20Pages-listo-emerald.svg)

---

## 📌 ¿Qué es Octalysis Students?

**Octalysis Students** es una evolución del taller docente de Octalysis, diseñada para que **cualquier profesor pueda aplicarla directamente con sus estudiantes** en el aula de clase o de forma asíncrona, **sin necesidad de clonar repositorios, instalar programas ni configurar servidores**.

Permite explorar qué impulsos psicológicos y reglas de funcionamiento motivan a los estudiantes sin sesgos teóricos previos, facilitando la negociación informada de acuerdos pedagógicos para el semestre.

---

## ✨ Características principales

### 🛡️ Usabilidad contextual y prevención de errores en aula (`v2.3.2` – `v2.3.4`)
1. **Conmutador de roles inteligente (Smart Toggle):** el botón `👨‍🏫 Profesor` se oculta automáticamente para alumnos no autenticados (evitando distracciones y solicitudes de PIN en clase), pero permanece visible para el docente que ya inició sesión, permitiéndole alternar al instante entre la proyección del grupo y la experiencia estudiantil con 1 solo clic.
2. **Prevención de salidas accidentales:** confirmación preventiva al hacer clic en `🚪 Cambiar sala` o sobre el logotipo, alertando explícitamente si el estudiante tiene reglas seleccionadas sin enviar para proteger su progreso.
3. **Banner de salvavidas en bienvenida:** si alguien sale por descuido al menú principal, una barra superior le permite regresar de inmediato a su sala abierta con todas sus selecciones preservadas.
4. **Catálogo secuencial limpio sin redundancias (`v2.3.3`):** eliminación de las 48 píldoras repetitivas de sombrero y motivación en las 24 tarjetas del acordeón final; la clasificación teórica se muestra en la cabecera del Core Drive y las tarjetas individuales destacan con protagonismo absoluto las medallas de votación del alumno (`🥇`, `🥈`, `🥉`, `✓`).
5. **Claridad pedagógica en mecánicas de aula (`v2.3.4`):** incorporación de ejemplos cotidianos y aplicados en la descripción de las tarjetas (como los comodines con fecha de caducidad: prórroga de 48 horas sin penalización, reintento de actividad o descarte de la nota más baja), garantizando comprensión inmediata y sin ambigüedades en el aula.

### 🎨 Rediseño visual del flujo de bienvenida y acceso (`v2.3.1`)
1. **Selección inicial de perfil estilizada:** tarjetas interactivas de alto impacto visual para elegir entre **🎒 Soy estudiante** y **👨‍🏫 Soy profesor**, con micro-interacciones hover, íconos luminosos y viñetas pedagógicas de características clave.
2. **Acceso de estudiante centrado y salas recientes:** buscador estilizado con foco activo, tarjeta de asistencia contextual para códigos QR y enlaces directos, junto con chips de acceso rápido a salas visitadas recientemente guardadas en el navegador.
3. **Portal docente simétrico en 3 columnas:** distribución equilibrada para **👀 Ver sala demo (`OCTA-DEMO`)**, **🔓 Entrar a mi sala** y **✨ Crear sala nueva**, con visualizador/ocultador interactivo de PIN (`👁️`/`🙈`) y cuadro de advertencias de seguridad unificado.
4. **Prevención de parpadeo de tema (Anti-FOUC):** carga síncrona inmediata en `<head>` para garantizar que la transición entre tema claro y oscuro sea instantánea sin saltos cromáticos.

### 📱 Diseño 100 % responsivo y adaptabilidad multi-pantalla
- **Móviles (desde 320px):** cabecera compacta con auto-ocultación de etiquetas de texto secundarias, rejilla fluida para las 24 tarjetas del catálogo, bandeja de selección flotante que pasa a flujo natural (`relative`) para no obstruir la lectura, botones de exportación a ancho completo (`100%`) y modales con salto de línea seguro.
- **Gráficos vectoriales auto-escalables:** el octágono analítico (`drawOctagonRadar`) y el cuadrante de dispersión 2D (`drawClassQuadrant`) recalculan dinámicamente sus dimensiones lógicas y físicas (Canvas responsive con soporte HiDPI/Retina) sin desbordamiento horizontal.
- **Tablets y portátiles:** disposición en cuadrículas fluidas de 2 columnas con navegación lateral y barras de balance motivacional proporcionales.
- **Tableros digitales y videobeams:** modo claro en blanco puro (`#ffffff`) con contraste tipográfico reforzado para legibilidad óptima en aulas iluminadas.

### ☀️ Tema claro de alto contraste para tableros digitales y proyectores
- Incluye el botón **☀️ Tema claro / 🌙 Tema oscuro** en la barra superior (con el tema oscuro como predeterminado y persistencia en el navegador).
- El **tema claro en blanco (`#ffffff`)** y el **contraste reforzado en Canvas** (red octagonal `CD1`–`CD8` y cuadrante 2D) permiten proyectar la herramienta en salones de clase iluminados y tableros digitales sin necesidad de apagar las luces.

### 🎒 Para los estudiantes (móvil y escritorio)
- **Catálogo inicial imparcial y mezclado al azar:** las 24 dinámicas del curso se presentan únicamente con su título y descripción cotidiana (sin mostrar etiquetas de *Core Drive*, sombrero blanco o negro ni tipo de motivación) para evitar sesgos de deseabilidad social. Incluye buscador por palabra clave y botón **🎲 Mezclar orden**.
- **Selección exacta de 6 reglas:** todos los participantes completan una base matemática idéntica de 6 preferencias antes de priorizar.
- **Priorización sin etiquetas teóricas:** el estudiante indica su **prioridad 1 (regla de oro, obligatoria)** y opcionalmente sus **prioridades 2 y 3**.
- **Devolución psicopedagógica interactiva inmediata:**
  1. **Red octagonal oficial (CD1 a CD8):** diagrama fiel a la geometría oficial de Yu-kai Chou con etiquetas y vértices interactivos clicables para explorar de qué trata cada *Core Drive*.
  2. **Ejes de equilibrio motivacional clicables:** barras comparativas con modales explicativos sobre la diferencia entre **sombrero blanco y sombrero negro** y entre **motivación intrínseca y motivación extrínseca**.
  3. **Estrategia de aprendizaje y autorregulación:** recomendaciones prácticas personalizadas según el perfil resultante.
  4. **Revelación opcional de las 24 tarjetas por *Core Drive*:** acordeón desplegable con las 24 reglas ordenadas secuencialmente de `CD1` a `CD8`, mostrando su clasificación teórica completa y resaltando las elecciones y prioridades del estudiante.
  5. **Exportación individual del perfil (imagen PNG y PDF):** cada estudiante puede descargar su propio perfil psicopedagógico en alta resolución (`.png`) o como documento ejecutivo (`.pdf`) con su red octagonal, ejes motivacionales, estrategia de autorregulación y sus 6 reglas priorizadas.

### 👨‍🏫 Para el docente (panel en vivo y exportaciones)
- **Creación de salas en segundos con confirmación de PIN:** código alfanumérico único (ej. `OCTA-798`), validación de doble escritura del PIN (4 a 6 caracteres), generación de enlace firmado (`&cfg=`) y **código QR proyectable**.
- **Seguridad criptográfica del PIN:** el PIN nunca viaja en texto plano; se deriva mediante `SHA-256` (`hashRoomPin`) y funciona en cualquier navegador o dispositivo sin caer en claves predeterminadas (la clave `1234` aplica únicamente a la sala demostrativa `OCTA-DEMO`).
- **Configuración de datos institucionales:** casillas opcionales para solicitar **número de cédula o documento de identidad** y **correo o usuario institucional** (ej. `@uao.edu.co`).
- **Panel analítico colectivo en tiempo real:**
  - Red Octalysis colectiva del curso (`CD1` a `CD8`) con geometría oficial.
  - Cuadrante 2D de dispersión motivacional del grupo.
  - Ranking ponderado de reglas priorizadas y disparadores automatizados de debate pedagógico.
  - Gestión de sala en vivo (cambio de PIN confirmado, edición de campos y botón para vaciar respuestas de la sala tras exportar).
- **Motores de exportación directa en el navegador:**
  - 📊 **Excel estructurado (`.xlsx`):** con 2 hojas (*Resumen del grupo* con promedios colectivos reales y *Respuestas individuales* detalladas).
  - 📑 **PDF ejecutivo:** con membrete, métricas clave, gráfico octagonal capturado en alto contraste y preguntas de debate.
  - 📁 **CSV plano:** codificado en UTF-8 con BOM (`\uFEFF`) y separador `;` para apertura directa en Excel en español o software estadístico (R, Python, SPSS).

---

## 🛠️ Arquitectura de sincronización en la nube (Google Apps Script)

El repositorio incluye el backend multi-sala listo para copiar y pegar en [`google-apps-script/Code.gs`](google-apps-script/Code.gs), el cual soporta dos modalidades:

### 1. Modo rápido (hoja maestra del proyecto)
Pensado para que cualquier profesor invitado cree su sala sin tocar hojas de cálculo:
1. Crea un Google Sheet vacío en tu cuenta administradora y abre **Extensiones > Apps Script**.
2. Pega el contenido íntegro de [`google-apps-script/Code.gs`](google-apps-script/Code.gs) y guarda.
3. Haz clic en **Implementar > Nueva implementación > Aplicación web**.
4. Configura **Ejecutar como:** *Yo* y **Quién tiene acceso:** *Cualquier persona*.
5. Copia la URL generada (terminada en `/exec`) y pégala en la constante `MASTER_WEBHOOK_URL` de [`index.html`](index.html) (línea 2213).

### 2. Usar mi propio Google Sheet (privacidad total por docente)
Si un profesor prefiere que los datos de sus estudiantes viajen **100 % directo a su propio Google Drive**:
1. Crea un Google Sheet personal, pega [`google-apps-script/Code.gs`](google-apps-script/Code.gs) en **Extensiones > Apps Script** y publícalo como **Aplicación web** (*Cualquier persona*).
2. Al crear la sala en la página, elige **Usar mi propio Google Sheet** y pega su URL `/exec`.
3. La plataforma incrusta automáticamente el identificador del script (`&wh=`) en el enlace y en el código QR de los estudiantes para que todas las respuestas lleguen exclusivamente a su hoja.

---

## 🚀 Despliegue en GitHub Pages

1. Ve a la configuración del repositorio en GitHub: `Settings` > `Pages`.
2. En **Build and deployment** > **Source**, selecciona `Deploy from a branch`.
3. Selecciona la rama `main` y la carpeta `/ (root)` y pulsa **Save**.

---

## 📖 Marco teórico: distribución oficial de los 8 *Core Drives*

- **CD1 (arriba · sombrero blanco):** significado épico y vocación.
- **CD2 (arriba-izquierda · sombrero blanco / extrínseca):** desarrollo y logro.
- **CD3 (arriba-derecha · sombrero blanco / intrínseca):** empoderamiento de la creatividad y retroalimentación.
- **CD4 (centro-izquierda · extrínseca):** propiedad y posesión.
- **CD5 (centro-derecha · intrínseca):** influencia social y afinidad.
- **CD6 (abajo-izquierda · sombrero negro / extrínseca):** escasez e impaciencia.
- **CD7 (abajo-derecha · sombrero negro / intrínseca):** impredecibilidad y curiosidad.
- **CD8 (abajo · sombrero negro):** pérdida y evitación.

---

## 📄 Licencia

Distribuido bajo la licencia MIT para comunidades académicas, docentes y estudiantes interesados en el diseño pedagógico motivacional.
