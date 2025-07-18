# Plan de Desarrollo: Analizador de Notas SENA

1.  **Estructura del Proyecto:**
    *   Crearé un archivo `index.html` como punto de entrada.
    *   Una carpeta `src` que contendrá el código JavaScript (`src/main.js`).
    *   Un archivo `css/style.css` donde se generarán los estilos de Tailwind CSS.

2.  **Diseño e Interfaz (UI/UX):**
    *   Desarrollaré una interfaz minimalista con un **tema oscuro**, utilizando **Tailwind CSS** para un diseño *mobile-first* y totalmente responsivo.
    *   La pantalla inicial consistirá en un único botón para cargar el archivo Excel.
    *   Una vez cargado el archivo, la interfaz cambiará a un layout de 3 componentes principales: un *header*, un *sidebar* con acciones y el *área de contenido* principal, además de un *footer*.

3.  **Funcionalidad Principal:**
    *   **Carga y Procesamiento de Datos:**
        *   Integraré la librería **SheetJS (xlsx.js)** para leer y procesar los datos del archivo Excel directamente en el navegador.
        *   El script interpretará la estructura del archivo, separando las "Evidencias" de los "RAPS" y organizará la información de los estudiantes en una estructura de datos (JSON) fácil de manejar.
    *   **Visualización de Datos:**
        *   Mostraré los estudiantes en una tabla dinámica en el área de contenido.
        *   Implementaré filtros para la tabla: un menú desplegable para filtrar por **estado del estudiante** y un campo de texto para buscar por **nombre**.
    *   **Acciones y Análisis:**
        *   **Modal de Detalles:** Cada fila de estudiante tendrá un icono de lupa (de **Font Awesome**) que, al hacer clic, abrirá un modal (usando **SweetAlert2**) con la información detallada del estudiante, incluyendo:
            *   Lista de evidencias aprobadas y pendientes.
            *   Un filtro dentro del modal para ver las evidencias por **Guía de Aprendizaje (GA)**.
        *   **Acciones del Sidebar:**
            *   **Subir otro archivo:** Permitirá recargar la página con un nuevo archivo.
            *   **Análisis de estudiantes:** Mostrará estadísticas básicas (aún por definir).
            *   **Guardar Datos:** Permitirá descargar los datos procesados en un archivo `.json`.

4.  **Entrega Final:**
    *   Una vez que el prototipo sea funcional, crearé el archivo `readme.md` con la descripción del proyecto, instrucciones de uso y una lista de posibles mejoras a futuro.
