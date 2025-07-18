# 📊 Analizador de Notas SENA 🚀

¡Bienvenido al Analizador de Notas SENA! Esta es una herramienta web intuitiva y potente diseñada para facilitar la visualización y el análisis de los datos de notas de los aprendices del SENA directamente desde archivos de Excel. Olvídate de las hojas de cálculo abrumadoras y sumérgete en una experiencia de usuario fluida y organizada.

## 📋 Tabla de Contenidos

- [✨ Características Destacadas](#-características-destacadas)
- [🛠️ Tecnologías Utilizadas](#%EF%B8%8F-tecnologías-utilizadas)
- [⚙️ Instalación](#%EF%B8%8F-instalación)
- [🚀 Cómo Usar](#-cómo-usar)
- [💡 Posibles Mejoras Futuras](#-posibles-mejoras-futuras)
- [✍️ Autor](#%EF%B8%8F-autor)
- [🤝 Contribución](#-contribución)

## ✨ Características Destacadas

Este analizador viene cargado con funcionalidades que te harán la vida más fácil:

-   **📤 Carga de Archivos Excel:** Sube tus archivos `.xlsx` o `.xls` con un solo clic.
-   **👀 Visualización Interactiva:** Explora los datos de los estudiantes en una tabla clara y dinámica.
-   **🔍 Búsqueda y Filtrado Avanzado:** Encuentra rápidamente a cualquier estudiante por nombre o filtra por su estado (ej. "EN FORMACION", "CANCELADO").
-   **📊 Análisis Rápido:** Obtén un resumen estadístico básico del rendimiento de los estudiantes.
-   **📝 Detalles de Notas:** Accede a un modal detallado con todas las notas de cada estudiante, con opciones de filtrado por tipo de evidencia, guía de aprendizaje, materia, grupo y actividad.
-   **⚙️ Configuración Flexible:** Ajusta las filas y columnas de donde se extraen los datos del Excel, ideal para archivos con formatos variados.
-   **📥 Importar Datos JSON:** Carga datos de estudiantes desde un archivo JSON previamente exportado, perfecto para continuar trabajando o compartir información.
-   **📤 Exportar Datos JSON:** Guarda todos los datos procesados en un archivo JSON para su uso posterior o para realizar copias de seguridad.
-   **📱 Diseño Responsivo:** Disfruta de una experiencia óptima tanto en dispositivos de escritorio como móviles.
-   **🎯 Filtrado Inteligente de Evidencias:** Solo se incluyen las evidencias que contienen un identificador de guía de aprendizaje (ej. `GA#-...`), asegurando la relevancia de los datos.
-   **🧠 Análisis Mejorado de Nombres de Evidencia:** Un sistema robusto que analiza los nombres de las evidencias, extrayendo información clave como tipo, descripción y códigos de guía, sin importar el orden o la presencia de caracteres extra.

## 🛠️ Tecnologías Utilizadas

Este proyecto ha sido construido con las siguientes tecnologías:

-   **HTML5:** Estructura base de la aplicación.
-   **Tailwind CSS:** Framework CSS para un diseño rápido y responsivo.
-   **JavaScript (Vanilla JS):** Lógica principal y manipulación del DOM.
-   **SheetJS (xlsx.js):** Para el procesamiento eficiente de archivos Excel.
-   **SweetAlert2:** Para notificaciones y modales interactivos y atractivos.

## ⚙️ Instalación

¡Empezar es muy sencillo!

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/FeithNoir/NotasSENA.git
    ```
2.  **Navega al directorio del proyecto:**
    ```bash
    cd NotasSENA
    ```
3.  **Abre `index.html`:** Simplemente abre el archivo `index.html` en tu navegador web preferido. ¡No se requiere servidor local!

## 🚀 Cómo Usar

1.  **Carga tu archivo:** Haz clic en "Subir Archivo" y selecciona tu archivo de Excel con los datos de los aprendices.
2.  **Explora los datos:** La tabla se llenará automáticamente con la información de los estudiantes.
3.  **Busca y filtra:** Utiliza la barra de búsqueda y el selector de estado para refinar la lista de estudiantes.
4.  **Detalles:** Haz clic en cualquier fila de la tabla para ver un modal con las notas detalladas del estudiante y opciones de filtrado.
5.  **Configura:** Si tu archivo de Excel no sigue el formato predeterminado, usa el botón "Configuración" en la barra lateral para ajustar las filas y columnas de búsqueda.
6.  **Importa/Exporta:** Utiliza los botones "Importar Datos" y "Exportar Datos" para cargar o guardar los datos en formato JSON.
7.  **Ayuda:** Si tienes dudas, el botón "Ayuda" te proporcionará una guía rápida sobre las funcionalidades de la aplicación.

## 💡 Posibles Mejoras Futuras

Estamos siempre pensando en cómo mejorar. Aquí algunas ideas para el futuro:

-   **📈 Gráficos Interactivos:** Integrar librerías como Chart.js para visualizar estadísticas de estudiantes y notas de forma más dinámica.
-   **✏️ Edición de Datos:** Permitir la edición directa de las notas de los estudiantes en la interfaz.
-   **💾 Persistencia de Datos:** Guardar los datos en el almacenamiento local del navegador para que no se pierdan al recargar la página.
-   **📂 Soporte Multi-Hoja:** Permitir al usuario seleccionar qué hoja del archivo de Excel desea procesar.
-   **🛡️ Validación de Datos:** Implementar una validación más robusta para manejar diferentes formatos y errores en los datos del Excel.
-   **🔑 Autenticación de Usuarios:** Añadir un sistema de inicio de sesión para proteger el acceso a la aplicación.
-   **⚛️ Migración a Angular:** La estructura del código ya está organizada en componentes para facilitar una futura migración a un framework moderno como Angular, lo que permitirá un desarrollo más escalable y mantenible.

## ✍️ Autor

Desarrollado con ❤️ por [FeithNoir](https://github.com/FeithNoir)

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar este proyecto, no dudes en abrir un *issue* o enviar un *pull request*. ¡Tu ayuda es valiosa!
