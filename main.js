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
        // Grades start at column H (index 7) and go to the end of the available headers.
        for (let i = 7; i < evidenceNames.length; i++) {
            // Only add columns that are under the "EVIDENCIAS" type and have a name.
            if (evidenceNames[i]) {
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

    function showStudentDetails(student) {
        const approved = student.grades.filter(g => g.grade === 'A');
        const pending = student.grades.filter(g => g.grade !== 'A');

        const guides = [...new Set(student.grades.map(g => {
            const match = g.name.match(/GA\d+/);
            return match ? match[0] : null;
        }).filter(g => g))];

        let guideOptions = guides.map(g => `<option value="${g}">${g}</option>`).join('');

        Swal.fire({
            title: `${student.firstName} ${student.lastName}`,
            html: `
                <div class="text-left">
                    <p><strong>Estado:</strong> ${student.status}</p>
                    <div class="my-4">
                        <select id="grade-filter" class="swal2-select">
                            <option value="all">Todas</option>
                            <option value="approved">Aprobadas</option>
                            <option value="pending">Pendientes</option>
                        </select>
                        <select id="guide-filter" class="swal2-select ml-2">
                            <option value="all">Todas las guías</option>
                            ${guideOptions}
                        </select>
                    </div>
                    <div id="grades-list" class="max-h-60 overflow-y-auto"></div>
                </div>
            `,
            didOpen: () => {
                const gradeFilter = document.getElementById('grade-filter');
                const guideFilter = document.getElementById('guide-filter');
                const gradesList = document.getElementById('grades-list');

                function updateGradesList() {
                    const filterValue = gradeFilter.value;
                    const guideValue = guideFilter.value;
                    let gradesToShow = [];

                    if (filterValue === 'approved') gradesToShow = approved;
                    else if (filterValue === 'pending') gradesToShow = pending;
                    else gradesToShow = student.grades;

                    if (guideValue !== 'all') {
                        gradesToShow = gradesToShow.filter(g => g.name.includes(guideValue));
                    }

                    gradesList.innerHTML = gradesToShow.map(g => `<p>${g.name} - <strong>${g.grade}</strong></p>`).join('');
                }

                gradeFilter.addEventListener('change', updateGradesList);
                guideFilter.addEventListener('change', updateGradesList);
                updateGradesList();
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