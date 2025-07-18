document.addEventListener('DOMContentLoaded', () => {
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
    const saveDataButton = document.getElementById('save-data');

    let studentsData = [];

    fileUpload.addEventListener('change', handleFileUpload);
    toggleSidebarButton.addEventListener('click', () => sidebar.classList.toggle('hidden'));
    uploadNewButton.addEventListener('click', () => location.reload());
    saveDataButton.addEventListener('click', saveData);
    searchStudentInput.addEventListener('input', () => renderTable(studentsData));
    filterStatusSelect.addEventListener('change', () => renderTable(studentsData));

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    processWorkbook(workbook);
                    uploadContainer.classList.add('hidden');
                    mainContent.classList.remove('hidden');
                } catch (error) {
                    Swal.fire('Error', 'No se pudo procesar el archivo de Excel.', 'error');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    function processWorkbook(workbook) {
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" }); // Use defval to avoid undefined
        const evidenceNames = json[2]; // Row 3 in Excel
        const evidences = [];
        const gaPattern = /GA\d+-/; // Regex to match "GA" followed by a number and a hyphen.

        // Grades start at column H (index 7) and go to the end of the available headers.
        for (let i = 7; i < evidenceNames.length; i++) {
            // Only add columns that have a name and match the GA pattern.
            if (evidenceNames[i] && gaPattern.test(evidenceNames[i])) {
                evidences.push({ name: evidenceNames[i], index: i });
            }
        }

        // Student data starts from the 4th row (index 3) as per user request.
        studentsData = json.slice(3).map(row => {
            // Skip empty rows
            if (!row || !row[1]) return null;

            const temporalGrades = [];
            evidences.forEach(evidence => {
                // Ensure grade is a string, default to "-" if empty/undefined
                const grade = String(row[evidence.index] || "-");
                temporalGrades.push({ name: evidence.name, grade: grade });
            });
            
            const student = {
                firstName: row[1],
                lastName: row[2],
                documentType: row[3],
                documentNumber: row[4],
                status: row[6],
                grades: temporalGrades
            };
            return student;
        }).filter(Boolean); // filter(Boolean) removes null/undefined entries

        populateStatusFilter(studentsData);
        renderTable(studentsData);
    }

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
            row.querySelector('.view-details').addEventListener('click', () => showStudentDetails(student));
            studentsTableBody.appendChild(row);
        });
    }

    function parseEvidenceName(name) {
    // Split the name to separate the evidence type, description, and codes.
    const parts = name.split(':');
    if (parts.length < 2) {
        return {
            evidenceType: 'N/A',
            description: name,
            learningGuide: 'N/A',
            subjectCode: 'N/A',
            activityGroup: 'N/A',
            activityCode: 'N/A'
        };
    }

    const evidenceType = parts[0].trim();
    const rest = parts.slice(1).join(':').trim();

    const descriptionParts = rest.split('.');
    const description = descriptionParts[0].trim();
    
    const codeString = rest.substring(description.length).trim();
    const codeParts = codeString.split('-').filter(p => p);

    return {
        evidenceType: evidenceType,
        description: description,
        learningGuide: codeParts[0] || 'N/A',
        subjectCode: codeParts[1] || 'N/A',
        activityGroup: codeParts[2] || 'N/A',
        activityCode: codeParts[3] || 'N/A'
    };
}

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
                    <select id="grade-filter" class="swal2-select">
                        <option value="all">Todas las notas</option>
                        ${createOptions(grades)}
                    </select>
                    <select id="evidence-type-filter" class="swal2-select">
                        <option value="all">Todos los tipos</option>
                        ${createOptions(evidenceTypes)}
                    </select>
                    <select id="learning-guide-filter" class="swal2-select">
                        <option value="all">Todas las guías</option>
                        ${createOptions(learningGuides)}
                    </select>
                    <select id="subject-code-filter" class="swal2-select">
                        <option value="all">Todas las materias</option>
                        ${createOptions(subjectCodes)}
                    </select>
                    <select id="activity-group-filter" class="swal2-select">
                        <option value="all">Todos los grupos</option>
                        ${createOptions(activityGroups)}
                    </select>
                    <select id="activity-code-filter" class="swal2-select">
                        <option value="all">Todas las act.</option>
                        ${createOptions(activityCodes)}
                    </select>
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
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        width: '90%',
        customClass: {
            popup: 'swal-wide',
        },
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

                const filteredGrades = detailedGrades.filter(g => {
                    return Object.keys(filterValues).every(key => {
                        return filterValues[key] === 'all' || String(g[key]) === filterValues[key];
                    });
                });

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

            Object.values(filters).forEach(filter => {
                filter.addEventListener('change', renderGradesTable);
            });

            renderGradesTable();
        }
    });
}

    function saveData() {
        if (studentsData.length === 0) {
            Swal.fire('No hay datos', 'No hay datos de estudiantes para guardar.', 'warning');
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

        const totalGrades = studentsData.flatMap(s => s.grades).length;
        const approvedGrades = studentsData.flatMap(s => s.grades).filter(g => g.grade === 'A').length;
        const pendingGrades = totalGrades - approvedGrades;

        let analysisHtml = `
            <div class="text-left">
                <p><strong>Total de estudiantes:</strong> ${totalStudents}</p>
                <p><strong>Estado de los estudiantes:</strong></p>
                <ul>
                    ${Object.entries(statusCounts).map(([status, count]) => `<li>${status}: ${count}</li>`).join('')}
                </ul>
                <p><strong>Total de evidencias:</strong> ${totalGrades}</p>
                <p><strong>Evidencias aprobadas:</strong> ${approvedGrades}</p>
                <p><strong>Evidencias pendientes:</strong> ${pendingGrades}</p>
            </div>
        `;

        Swal.fire({
            title: 'Análisis de Estudiantes',
            html: analysisHtml
        });
    });
});