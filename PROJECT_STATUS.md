# Estado del Proyecto: Octalysis Students

**Última actualización:** 31 de Octubre de 2026  
**Repositorio:** `chepechavez/octalysis-students`  
**Referencia base:** `chepechavez/octalysis-game`  
**Objetivo principal:** Transformar el taller/simulador de Octalysis (originalmente creado para capacitación docente sobre reglas de funcionamiento de cursos) en una herramienta web accesible donde diferentes profesores puedan aplicar instrumentos con sus estudiantes en línea y exportar diagnósticos/resultados agregados e individuales en PDF, CSV o Excel, sin necesidad de clonar repositorios ni configurar entornos técnicos.

---

## 1. Resumen de la Revisión del Proyecto Base (`octalysis-game`)
El proyecto base original consistía en una SPA autocontenida de taller para docentes con catálogo de 24 mecánicas, selección de hasta 6 mecánicas, prueba de adivinanza de Core Drives y envío a un webhook único de Google Apps Script.

---

## 2. Decisiones Arquitectónicas y Pedagógicas Consolidadas

### A. Dinámica Pedagógica y Flujo del Estudiante (Completada ✅)
- **Propósito:** Sondeo exploratorio no vinculante para descubrir qué mueve a los estudiantes, evitando comprometer al docente con reglas que no pueda implementar.
- **Flujo en 3 Fases:**
  1. **Exploración:** Catálogo de 24 mecánicas adaptadas al lenguaje del estudiante con filtros por Core Drive / Sombrero / Motivación. Selección de hasta 6 reglas.
  2. **Priorización Top 1-3:** El estudiante indica su "Regla de Oro" (Prioridad 1) y sus Prioridades 2 y 3.
  3. **Diagnóstico individual inmediato:** Canvas Radar 8D interactivo, barras de balance (Sombrero Blanco/Negro e Intrínseca/Extrínseca), arquetipo y consejos de autorregulación.

### B. Identificación y Privacidad del Estudiante (Completada ✅)
- Al crear una sala, el docente decide qué datos solicita:
  - **Modo Informal/Lúdico:** Solo nombre o apodo.
  - **Modo Institucional:** Checkbox para solicitar obligatoriamente **Número de Cédula / Documento de Identidad** y **Correo/Usuario Institucional** (ej. `@uao.edu.co`).
  - Estos campos se exportan en las columnas del archivo Excel y CSV.

### C. Catálogo de Mecánicas y Reglas del Curso (Completada ✅)
- 24 mecánicas estructuradas (3 por cada Core Drive) redactadas en tono empático y aplicativo para estudiantes.
- Clasificación psicopedagógica rigurosa (CD1-CD8, Sombreros, Motivación).

### D. Sistema de Reportes y Exportación en el Navegador (Completada ✅)
- **Excel (.xlsx) vía SheetJS:** Con 2 hojas:
  - *Hoja 1 ("Resumen del Grupo"):* Encabezado, totales, promedios de CD1 a CD8 y balances.
  - *Hoja 2 ("Respuestas Individuales"):* Fecha, Nombre, Cédula, Correo, Prioridades 1-3, las 6 reglas elegidas, vectores CD1-CD8 y porcentajes.
- **PDF Ejecutivo vía jsPDF:** Documento formal con membrete, métricas, captura del Radar Colectivo 8D y preguntas disparadoras de debate.
- **CSV Plano:** Codificado con UTF-8 BOM (`\uFEFF`) y delimitador punto y coma para apertura perfecta en Excel en español.

### E. Seguridad y Control de Acceso Docente (Completada ✅)
- Acceso al dashboard docente protegido mediante PIN de 4 dígitos (configurable por el docente) o parámetro secreto en URL (`?pin=...`).
- Código QR generado dinámicamente para proyectar en el salón de clases.

### F. Arquitectura Técnica y Sincronización Dual (Completada ✅)
- **Ruta 1 (Por Defecto - Nube en tiempo real):** Sincronización automática multi-sala basada en códigos alfanuméricos legibles (ej. `OCTA-492`) con respaldo en `localStorage`.
- **Ruta 2 (Google Sheets Propio):** Opción para que el docente ingrese su propio webhook de Apps Script si desea respaldar las respuestas en su Google Drive personal.

---

## 3. Estado de Componentes

| Componente | Estado | Notas |
| :--- | :--- | :--- |
| **Documento de Estatus (`PROJECT_STATUS.md`)** | ✅ Actualizado | Registro vivo para alternar entre equipos de trabajo |
| **Catálogo de 24 mecánicas estudiantiles** | ✅ Implementado | Redacción cercana y categorización matemática completa |
| **Flujo del Estudiante (Selección + Priorización Top 1-3)** | ✅ Implementado | Bandeja superior fija, filtros y drawer de priorización |
| **Diagnóstico individual interactivo** | ✅ Implementado | Radar 8D en Canvas con clics informativos y arquetipos |
| **Módulo de Creación de Salas y Código QR** | ✅ Implementado | Creación en 10s, QR proyectable y configuración de PIN |
| **Teacher Dashboard en Vivo** | ✅ Implementado | KPIs, Radar grupal, Cuadrante 2D de dispersión y debate |
| **Motor de Exportación a Excel (.xlsx)** | ✅ Implementado | 2 hojas estructuradas (Resumen y Detalle individual) |
| **Motor de Exportación a PDF Ejecutivo** | ✅ Implementado | Membrete, gráficos vectoriales capturados y conclusiones |
| **Motor de Exportación a CSV** | ✅ Implementado | UTF-8 BOM compatible con Excel y software estadístico |
| **Documentación y Guía de Despliegue (`README.md`)** | ✅ Actualizado | Instrucciones para profesores y activación en GitHub Pages |

---

## 4. Registro de Cambios Recientes
- **2026-10-31:**
  - Creación de la aplicación completa `index.html` (SPA responsive con tema oscuro tecno-pedagógico).
  - Implementación de los 3 motores de exportación (`.xlsx`, `.pdf`, `.csv`).
  - Creación del sistema de gestión de salas con PIN y generación de QR.
  - Implementación de los gráficos interactivos en Canvas (Radar 8D y Cuadrante 2D).
  - Actualización de `README.md` con guía de uso pedagógico y despliegue en GitHub Pages.
  - Verificación de integridad de archivos y preparación para commit en Git.
