# Analizador de Notas SENA

Este es un prototipo de aplicación web para visualizar y analizar los datos de notas de los aprendices del SENA a partir de un archivo de Excel. La aplicación está construida con HTML, Tailwind CSS y JavaScript, y utiliza las librerías SheetJS (xlsx.js) para el procesamiento de archivos Excel y SweetAlert2 para las notificaciones y modales.

## Características

- **Carga de archivos:** Permite a los usuarios subir un archivo de Excel (.xlsx o .xls) con los datos de los estudiantes.
- **Visualización de datos:** Muestra los datos de los estudiantes en una tabla interactiva.
- **Búsqueda y filtrado:** Permite buscar estudiantes por nombre y filtrar por estado (por ejemplo, "EN FORMACION", "CANCELADO").
- **Detalles del estudiante:** Muestra un modal con información detallada de cada estudiante, incluyendo sus notas y la capacidad de filtrar por guía de aprendizaje (GA).
- **Análisis de datos:** Proporciona un resumen estadístico básico de los datos cargados.
- **Exportación de datos:** Permite descargar los datos procesados en formato JSON.
- **Diseño responsivo:** La interfaz está diseñada para ser utilizada en dispositivos de escritorio y móviles.
- **Filtro de evidencias:** Solo se incluyen en la tabla las evidencias que contienen un identificador de guía de aprendizaje (GA#-).
- **Análisis de nombres de evidencia mejorado:** Se utiliza un método de división de cadenas (split) para analizar los nombres de las evidencias, mejorando la robustez frente a variaciones de formato.

## Posibles Futuras Características

- **Gráficos interactivos:** Implementar gráficos (por ejemplo, con Chart.js) para visualizar las estadísticas de los estudiantes y las notas de una manera más dinámica.
- **Edición de datos:** Permitir la edición de las notas de los estudiantes directamente en la tabla.
- **Persistencia de datos:** Guardar los datos en el almacenamiento local del navegador para que no se pierdan al recargar la página.
- **Soporte para múltiples hojas:** Permitir al usuario seleccionar qué hoja del archivo de Excel desea procesar.
- **Validación de datos:** Implementar una validación más robusta de los datos del archivo de Excel para manejar diferentes formatos y posibles errores.
- **Autenticación de usuarios:** Añadir un sistema de inicio de sesión para proteger el acceso a la aplicación.