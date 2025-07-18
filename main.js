document.addEventListener('DOMContentLoaded', () => {

    // ==================================================================================================
    // CONFIGURATION
    // ==================================================================================================

    let config = {
        excel: {
            evidenceRow: 2, // Row 3 in Excel
            studentStartRow: 3, // Row 4 in Excel
            gradeStartCol: 7, // Column H
            firstNameCol: 1, // Column B
            lastNameCol: 2, // Column C
            documentTypeCol: 3, // Column D
            documentNumberCol: 4, // Column E
            statusCol: 6 // Column G
        }
    };

    // ==================================================================================================
    // GLOBAL STATE
    // ==================================================================================================

    let studentsData = [];
    let workbook = null; // To store the workbook globally

    // ==================================================================================================
    // DOM ELEMENTS
    // ==================================================================================================

    const fileUpload = document.getElementById('file-upload');
    const uploadContainer = document.getElementById('upload-container');
    const mainContent = document.getElementById('main-content');
    const studentsTableBody = document.querySelector('#students-table tbody');
    const searchStudentInput = document.getElementById('search-student');
    const filterStatusSelect = document.getElementById('filter-status');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const uploadNewButton = document.getElementById('upload-new');
    const studentAnalysisButton = document.getElementById('student-analysis');
    const exportDataButton = document.getElementById('export-data');
    const importDataButton = document.getElementById('import-data');
    const settingsButton = document.getElementById('settings-button');
    const helpButton = document.getElementById('help-button');

    // ==================================================================================================
    // INITIALIZATION
    // ==================================================================================================

    fileUpload.addEventListener('change', handleFileUpload);
    toggleSidebarButton.addEventListener('click', () => sidebar.classList.toggle('hidden'));
    uploadNewButton.addEventListener('click', () => location.reload());
    exportDataButton.addEventListener('click', exportData);
    importDataButton.addEventListener('click', importData);
    searchStudentInput.addEventListener('input', () => renderTable(studentsData));
    filterStatusSelect.addEventListener('change', () => renderTable(studentsData));
    settingsButton.addEventListener('click', showSettingsModal);
    helpButton.addEventListener('click', showHelpModal);

    // ==================================================================================================
    // CORE LOGIC (SERVICES)
    // ==================================================================================================

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    workbook = XLSX.read(data, { type: 'array' });
                    processWorkbook();
                    uploadContainer.classList.add('hidden');
                    mainContent.classList.remove('hidden');
                } catch (error) {
                    Swal.fire('Error', 'No se pudo procesar el archivo de Excel.', 'error');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    function processWorkbook() {
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        const evidenceNames = json[config.excel.evidenceRow];
        const evidences = [];
        const gaPattern = /GA\d+-/;

        for (let i = config.excel.gradeStartCol; i < evidenceNames.length; i++) {
            if (evidenceNames[i] && gaPattern.test(evidenceNames[i])) {
                evidences.push({ name: evidenceNames[i], index: i });
            }
        }

        studentsData = json.slice(config.excel.studentStartRow).map(row => {
            if (!row || !row[config.excel.firstNameCol]) return null;

            const temporalGrades = evidences.map(evidence => ({
                name: evidence.name,
                grade: String(row[evidence.index] || "-")
            }));

            return {
                firstName: row[config.excel.firstNameCol],
                lastName: row[config.excel.lastNameCol],
                documentType: row[config.excel.documentTypeCol],
                documentNumber: row[config.excel.documentNumberCol],
                status: row[config.excel.statusCol],
                grades: temporalGrades
            };
        }).filter(Boolean);

        populateStatusFilter(studentsData);
        renderTable(studentsData);
    }

    function parseEvidenceName(name) {
        const codeRegex = /(GA\d+-\d+-AA\d+-EV\d+)/;
        const match = name.match(codeRegex);

        if (!match) {
            return {
                evidenceType: 'N/A',
                description: name,
                learningGuide: 'N/A',
                subjectCode: 'N/A',
                activityGroup: 'N/A',
                activityCode: 'N/A'
            };
        }

        const codeString = match[0];
        const codeParts = codeString.split('-');
        const parts = name.split(codeString);
        let evidenceType = 'N/A';
        let description = (parts[0] || '').trim().replace(/^-|:$/g, '').trim();

        if (description.includes(':')) {
            const typeAndDesc = description.split(':');
            evidenceType = typeAndDesc[0].trim();
            description = (typeAndDesc[1] || '').trim();
        }

        return {
            evidenceType: evidenceType,
            description: description,
            learningGuide: codeParts[0] || 'N/A',
            subjectCode: codeParts[1] || 'N/A',
            activityGroup: codeParts[2] || 'N/A',
            activityCode: codeParts[3] || 'N/A'
        };
    }

    function exportData() {
        if (studentsData.length === 0) {
            Swal.fire('No hay datos', 'No hay datos de estudiantes para exportar.', 'warning');
            return;
        }
        const dataStr = JSON.stringify(studentsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'datos_estudiantes.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        studentsData = JSON.parse(event.target.result);
                        populateStatusFilter(studentsData);
                        renderTable(studentsData);
                        uploadContainer.classList.add('hidden');
                        mainContent.classList.remove('hidden');
                    } catch (error) {
                        Swal.fire('Error', 'No se pudo procesar el archivo JSON.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // ==================================================================================================
    // UI COMPONENTS
    // ==================================================================================================

    // --------------------------------------------------------------------------------
    // Sidebar Component
    // --------------------------------------------------------------------------------

    function showSettingsModal() {
        Swal.fire({
            title: 'Configuración de Filas y Columnas',
            html: `
                <div class="text-left grid grid-cols-2 gap-4">
                    <label>Fila de Evidencias: <input type="number" id="evidenceRow" value="${config.excel.evidenceRow + 1}" class="swal2-input"></label>
                    <label>Fila de Inicio de Estudiantes: <input type="number" id="studentStartRow" value="${config.excel.studentStartRow + 1}" class="swal2-input"></label>
                    <label>Columna de Inicio de Notas: <input type="text" id="gradeStartCol" value="${XLSX.utils.encode_col(config.excel.gradeStartCol)}" class="swal2-input"></label>
                    <label>Columna de Nombres: <input type="text" id="firstNameCol" value="${XLSX.utils.encode_col(config.excel.firstNameCol)}" class="swal2-input"></label>
                    <label>Columna de Apellidos: <input type="text" id="lastNameCol" value="${XLSX.utils.encode_col(config.excel.lastNameCol)}" class="swal2-input"></label>
                    <label>Columna de Tipo Doc: <input type="text" id="documentTypeCol" value="${XLSX.utils.encode_col(config.excel.documentTypeCol)}" class="swal2-input"></label>
                    <label>Columna de Num Doc: <input type="text" id="documentNumberCol" value="${XLSX.utils.encode_col(config.excel.documentNumberCol)}" class="swal2-input"></label>
                    <label>Columna de Estado: <input type="text" id="statusCol" value="${XLSX.utils.encode_col(config.excel.statusCol)}" class="swal2-input"></label>
                </div>
            `,
            preConfirm: () => {
                try {
                    config.excel.evidenceRow = parseInt(document.getElementById('evidenceRow').value) - 1;
                    config.excel.studentStartRow = parseInt(document.getElementById('studentStartRow').value) - 1;
                    config.excel.gradeStartCol = XLSX.utils.decode_col(document.getElementById('gradeStartCol').value.toUpperCase());
                    config.excel.firstNameCol = XLSX.utils.decode_col(document.getElementById('firstNameCol').value.toUpperCase());
                    config.excel.lastNameCol = XLSX.utils.decode_col(document.getElementById('lastNameCol').value.toUpperCase());
                    config.excel.documentTypeCol = XLSX.utils.decode_col(document.getElementById('documentTypeCol').value.toUpperCase());
                    config.excel.documentNumberCol = XLSX.utils.decode_col(document.getElementById('documentNumberCol').value.toUpperCase());
                    config.excel.statusCol = XLSX.utils.decode_col(document.getElementById('statusCol').value.toUpperCase());
                    // Re-process the workbook with the new settings
                    if (workbook) {
                        processWorkbook();
                    }
                } catch (e) {
                    Swal.showValidationMessage(`Error en la configuración: ${e.message}`);
                }
            }
        });
    }

    // --------------------------------------------------------------------------------
    // Help Modal Component
    // --------------------------------------------------------------------------------

    function showHelpModal() {
        Swal.fire({
            title: 'Ayuda - Analizador de Notas SENA',
            html: `
                <div class="text-left">
                    <h3 class="text-xl font-bold mb-2">¿Qué es esto?</h3>
                    <p class="mb-4">Esta es una herramienta para visualizar y analizar los datos de notas de los aprendices del SENA directamente desde un archivo de Excel.</p>
                    
                    <h3 class="text-xl font-bold mb-2">¿Para qué sirve?</h3>
                    <p class="mb-4">Sirve para obtener una vista rápida y organizada del rendimiento de los estudiantes, permitiendo filtrar, buscar y ver detalles de las calificaciones de una manera más amigable que en una hoja de cálculo.</p>
                    
                    <h3 class="text-xl font-bold mb-2">¿Qué puedo hacer?</h3>
                    <ul class="list-disc list-inside mb-4">
                        <li><b>Subir un archivo Excel:</b> Carga tu archivo de Excel para empezar.</li>
                        <li><b>Importar Datos:</b> Carga datos de estudiantes desde un archivo JSON previamente exportado.</li>
                        <li><b>Visualizar estudiantes:</b> Ve una lista de todos los estudiantes del archivo.</li>
                        <li><b>Buscar y Filtrar:</b> Usa la barra de búsqueda para encontrar a un estudiante por su nombre o filtra por su estado.</li>
                        <li><b>Ver Detalles:</b> Haz clic en una fila o en el icono de la lupa para ver las notas detalladas de un estudiante.</li>
                        <li><b>Análisis Rápido:</b> Obtén estadísticas básicas sobre los estudiantes y sus notas desde el botón "Análisis".</li>
                        <li><b>Exportar Datos:</b> Descarga los datos procesados en un archivo JSON.</li>
                        <li><b>Configurar Columnas:</b> Si tu archivo de Excel tiene un formato diferente, usa el botón de "Configuración" para ajustar las filas y columnas donde la aplicación busca los datos.</li>
                    </ul>
                </div>
            `,
            confirmButtonText: 'Entendido'
        });
    }

    // --------------------------------------------------------------------------------
    // Student Table Component
    // --------------------------------------------------------------------------------

    function populateStatusFilter(data) {
        const statuses = [...new Set(data.map(student => student.status))];
        filterStatusSelect.innerHTML = '<option value="">Todos los estados</option>';
        statuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            filterStatusSelect.appendChild(option);
        });
    }

    function renderTable(data) {
        const searchTerm = searchStudentInput.value.toLowerCase();
        const statusFilter = filterStatusSelect.value;

        const filteredData = data.filter(student => {
            const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchTerm);
            const matchesStatus = !statusFilter || student.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        studentsTableBody.innerHTML = '';
        filteredData.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-3 px-4">${student.firstName}</td>
                <td class="py-3 px-4">${student.lastName}</td>
                <td class="py-3 px-4">${student.status}</td>
                <td class="py-3 px-4"><button class="text-blue-400 hover:underline view-details"><i class="fas fa-search"></i></button></td>
            `;
            row.querySelector('.view-details').addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent row click from triggering
                showStudentDetails(student);
            });
            row.addEventListener('click', () => showStudentDetails(student));
            studentsTableBody.appendChild(row);
        });
    }

    // --------------------------------------------------------------------------------
    // Student Details Modal Component
    // --------------------------------------------------------------------------------

    function showStudentDetails(student) {
        const detailedGrades = student.grades.map(g => ({
            ...parseEvidenceName(g.name),
            grade: g.grade,
            originalName: g.name
        }));

        const getUniqueValues = (key) => [...new Set(detailedGrades.map(g => g[key]))].sort();
        const evidenceTypes = getUniqueValues('evidenceType');
        const learningGuides = getUniqueValues('learningGuide');
        const subjectCodes = getUniqueValues('subjectCode');
        const activityGroups = getUniqueValues('activityGroup');
        const activityCodes = getUniqueValues('activityCode');
        const grades = getUniqueValues('grade');

        const createOptions = (values) => values.map(v => `<option value="${v}">${v}</option>`).join('');

        Swal.fire({
            title: `${student.firstName} ${student.lastName}`,
            html: `
                <div class="text-left">
                    <p><strong>Estado:</strong> ${student.status}</p>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
                        <select id="grade-filter" class="swal2-select"><option value="all">Todas las notas</option>${createOptions(grades)}</select>
                        <select id="evidence-type-filter" class="swal2-select"><option value="all">Todos los tipos</option>${createOptions(evidenceTypes)}</select>
                        <select id="learning-guide-filter" class="swal2-select"><option value="all">Todas las guías</option>${createOptions(learningGuides)}</select>
                        <select id="subject-code-filter" class="swal2-select"><option value="all">Todas las materias</option>${createOptions(subjectCodes)}</select>
                        <select id="activity-group-filter" class="swal2-select"><option value="all">Todos los grupos</option>${createOptions(activityGroups)}</select>
                        <select id="activity-code-filter" class="swal2-select"><option value="all">Todas las act.</option>${createOptions(activityCodes)}</select>
                    </div>
                    <div class="overflow-x-auto max-h-96">
                        <table id="grades-table" class="min-w-full bg-gray-700 text-sm">
                            <thead>
                                <tr class="bg-gray-600">
                                    <th class="py-2 px-3 text-left">Tipo Evidencia</th>
                                    <th class="py-2 px-3 text-left">Descripción</th>
                                    <th class="py-2 px-3 text-left">Guía</th>
                                    <th class="py-2 px-3 text-left">Materia</th>
                                    <th class="py-2 px-3 text-left">Grupo</th>
                                    <th class="py-2 px-3 text-left">Actividad</th>
                                    <th class="py-2 px-3 text-left">Nota</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            `,
            width: '90%',
            customClass: { popup: 'swal-wide' },
            didOpen: () => {
                const filters = {
                    grade: document.getElementById('grade-filter'),
                    evidenceType: document.getElementById('evidence-type-filter'),
                    learningGuide: document.getElementById('learning-guide-filter'),
                    subjectCode: document.getElementById('subject-code-filter'),
                    activityGroup: document.getElementById('activity-group-filter'),
                    activityCode: document.getElementById('activity-code-filter'),
                };
                const gradesTableBody = document.querySelector('#grades-table tbody');

                const renderGradesTable = () => {
                    const filterValues = {
                        grade: filters.grade.value,
                        evidenceType: filters.evidenceType.value,
                        learningGuide: filters.learningGuide.value,
                        subjectCode: filters.subjectCode.value,
                        activityGroup: filters.activityGroup.value,
                        activityCode: filters.activityCode.value,
                    };

                    const filteredGrades = detailedGrades.filter(g => 
                        Object.keys(filterValues).every(key => filterValues[key] === 'all' || String(g[key]) === filterValues[key])
                    );

                    gradesTableBody.innerHTML = filteredGrades.map(g => `
                        <tr class="border-b border-gray-600 hover:bg-gray-600">
                            <td class="py-2 px-3" title="${g.evidenceType}">${g.evidenceType}</td>
                            <td class="py-2 px-3" title="${g.description}">${g.description}</td>
                            <td class="py-2 px-3">${g.learningGuide}</td>
                            <td class="py-2 px-3">${g.subjectCode}</td>
                            <td class="py-2 px-3">${g.activityGroup}</td>
                            <td class="py-2 px-3">${g.activityCode}</td>
                            <td class="py-2 px-3 text-center"><strong>${g.grade}</strong></td>
                        </tr>
                    `).join('');
                };

                Object.values(filters).forEach(filter => filter.addEventListener('change', renderGradesTable));
                renderGradesTable();
            }
        });
    }

    // --------------------------------------------------------------------------------
    // Student Analysis Modal Component
    // --------------------------------------------------------------------------------

    studentAnalysisButton.addEventListener('click', () => {
        if (studentsData.length === 0) {
            Swal.fire('No hay datos', 'No hay datos de estudiantes para analizar.', 'warning');
            return;
        }

        const totalStudents = studentsData.length;
        const statusCounts = studentsData.reduce((acc, student) => {
            acc[student.status] = (acc[student.status] || 0) + 1;
            return acc;
        }, {});

        const allGrades = studentsData.flatMap(s => s.grades);
        const totalGrades = allGrades.length;
        const approvedGrades = allGrades.filter(g => g.grade === 'A').length;
        const pendingGrades = totalGrades - approvedGrades;

        Swal.fire({
            title: 'Análisis de Estudiantes',
            html: `
                <div class="text-left">
                    <p><strong>Total de estudiantes:</strong> ${totalStudents}</p>
                    <p><strong>Estado de los estudiantes:</strong></p>
                    <ul>${Object.entries(statusCounts).map(([status, count]) => `<li>${status}: ${count}</li>`).join('')}</ul>
                    <p><strong>Total de evidencias:</strong> ${totalGrades}</p>
                    <p><strong>Evidencias aprobadas:</strong> ${approvedGrades}</p>
                    <p><strong>Evidencias pendientes:</strong> ${pendingGrades}</p>
                </div>
            `
        })
    })
})
