¡Hola colegui! Tengo un archivo excel que se ve más o menos así:

							"EVIDENCIAS
"										RAPS				
	APRENDICES						1	1	1	1	1	1	1	1	1	1	1	1	1		1
	NOMBRES	APELLIDOS	TIPO DE DOCUMENTO 	NUMERO DE DOCUMENTO 	EVIDENCIAS NO APROBADOS	ESTADO	"Evidencia de conocimiento: 
Infografía sobre la Teoría General de Sistemas. GA1-220501092-AA1-EV01.

"	"Evidencia de conocimiento: 
Identificación de procesos organizacionales. GA1-220501092-AA1-EV02.
"	"Evidencia de producto: 
Mapa de procesos del software a construir. GA1-220501092-AA1-EV03."	"Evidencia de conocimiento:
Mapa mental sobre ingeniería de requisitos. GA1-220501092-AA2-EV01

"	"Evidencias de desempeño: 
Foro temático. Fuentes de requisitos. GA1-220501092-AA2-EV02"	"Evidencias de conocimiento: 
Taller sobre metodologías de desarrollo de software. GA1-220501093-AA1-EV01.

"	"Evidencias de conocimiento: 
Infografía sobre metodologías de desarrollo de software. GA1-220501093-AA1-EV02.

"	"Evidencia de producto:
Mapa conceptual - Software y servicios de internet. Relacionar correctamente los tipos de software y servicios de internet. GA1-220501046-AA1-EV01"	"Evidencia de conocimiento:
Taller. Utilización de las herramientas de Ofimática. Realizar un taller práctico con las herramientas ofimáticas. GA1-220501046-AA2-EV01"	"Evidencia de desempeño:
Informe mejora de productos y procesos con la incorporación de TIC. GA1-220501046-AA3-EV01"	"
220501092-01. Caracterizar los procesos de la organización de acuerdo con el software a construir."	220501046-01. Alistar herramientas de Tecnologías de la Información y la Comunicación (TIC), de acuerdo con las necesidades de procesamiento de información y comunicación.	"220501046-02. Aplicar funcionalidades de herramientas y servicios TIC, de acuerdo con manuales de uso, procedimientos establecidos y buenas prácticas.
"	220501046-03. Evaluar los resultados, de acuerdo con los requerimientos.	220501046-04. Optimizar los resultados, de acuerdo con la verificación.
1	ALEJANDRO	CASTAÑO QUINTERO 	1053858595cc	1053858595cc	79	CANCELADO	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A
2	ALEXANDER	RUIZ ACOSTA 	1038112055cc	1038112055cc	101	CANCELADO	-	-	-	-	-	-	-	-	-	-	D	D	D	D	D
3	ANTHONI	CARDONA GONZALEZ 	1035975138ti	1035975138ti	2	EN FORMACION	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A
4	ANYELA NATALY	RUIZ FERNANDEZ 	1022374477cc	1022374477cc	33	EN FORMACION	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A
5	ARNOLD GEOVANNIS	BENJUMEA RAMOS 	1063722453cc	1063722453cc	1	EN FORMACION	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A
6	CRISTIAN ANTONIO	MUÑOZ MUÑOZ 	1061687028cc	1061687028cc	10	EN FORMACION	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A
7	DANIEL	GUEVARA MARIN 	1094945760cc	1094945760cc	2	EN FORMACION	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A
8	DANIEL STEVEN	RAMIREZ CERVERA 	1026550276cc	1026550276cc	43	CANCELADO	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A
9	DANIELA KATHERIN	MUÑOZ DELGADO 	1083814952cc	1083814952cc	101	CANCELADO	-	-	-	-	-	-	-	-	-	-	D	D	D	D	D
10	DANY DANIEL	PAEZ CASTRO 	1067904681cc	1067904681cc	20	EN FORMACION	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A
11	DEIDER LUIS	SANTERO SUAREZ 	1022419743cc	1022419743cc	71	RETIRO VOLUNTARIO	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A
12	HAIBER MAURICIO	PANTOJA PANTOJA 	1023011875cc	1023011875cc	18	EN FORMACION	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A
13	HUGO FERNANDO	COLMENARES CRISTANCHO 	1098764608cc	1098764608cc	10	EN FORMACION	A	A	A	A	A	A	A	A	A	A	A	A	A	A	A

El excel va hasta la fila JI. Después del estado siguen las notas de los estudiantes, que es donde se va a centrar el proyecto pero solo tomando las actividades que en la fila 1 se definan como "Evidencias" dejando de lado las actividades que se definan como "RAPS" (en la fila 1 estás celdas están combinadas para abarcar las actividades).

Me gustaría que me ayudarás a crear un prototipo en html, tailwind y js donde cumpla con las siguientes carácteristicas:

-La página tendrá un diseño minimalista y responsive para pc/laptos, tablets y móviles con enfoque de "mobile first", usando las clases de tailwind para esto, con un color principal de tipo "tema oscuro" y uno secundario.
-El prototipo deberá usar SweetAlert2 para los mensajes al usuario y las alertas.
-Si no hay un archivo cargado, lo que se mostrará es un botón estilizado que me permita subir un archivo de excel.
-Una vez haya un archivo cargado me gustaría que la paágina se muestre con el siguiente layout: header (con el hombre de la página), sidebar (con las acciones disponibles), content (donde se verá la data) y un footer con el texto de "Desarrollado por FeithNoir" enlazando al perfil de github de este usuario.
-El sidebar tendrá las acciones de "Subir otro archivo" (que permitira al usuario escoger otro archivo), "Analisis de estudiantes" (el cual daran datos estadisticos de los estudiantes, sus notas y sus estados), "Guardar Datos" (para descargar la data actual en formato JSON).
-El content mostrará la tabla con algunos datos. La tabla debe tener un select para para filtrar por el estado de los estudiantes, input para buscar por el nombre de los estudiantes.
-En cada una de las filas de los estudiantes la última columna se llamará "acciones" y tendrá un icono (puede ser de fontawesome) de una lupa que despliegue un modal con la información del estudiante actual, con la lista de actividades pendientes, actividades aprovadas y su estado actual. También deberá contener un botón para ver la lista de actividades pendientes/aprovadas. Así como un filtro por "Guías de aprendizaje", las cuales se identifican con las siglas "GA" y un número (por ejemplo "GA1") estas están dentro del nombre de las actividades, así pues la actividad "Evidencia de conocimiento: Infografía sobre la Teoría General de Sistemas. GA1-220501092-AA1-EV01.". Pertenece a la GA1. Me gustaría poder filtrar actividades de esta forma.

Cuando termines crea un archivo readme.md con la descripción del proyecto y posibles futuras caracteristicas.

Recuerda que las variables, así como los nombres de los objetos y sus propiedades deben estar en ingles cumpliendo los estandares del Clean Code. ¿Podrías ayudarme con esto colegui? Gracias de antemano.