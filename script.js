

const studentForm =
    document.getElementById("studentForm");

const studentList =
    document.getElementById("studentList");

const searchInput =
    document.getElementById("searchInput");

const filterStatus =
    document.getElementById("filterStatus");

const sortOption =
    document.getElementById("sortOption");

const clearButton =
    document.getElementById("clearButton");

const totalStudents =
    document.getElementById("totalStudents");

const placedStudents =
    document.getElementById("placedStudents");

const notPlacedStudents =
    document.getElementById("notPlacedStudents");

const averagePackage =
    document.getElementById("averagePackage");

const highestPackage =
    document.getElementById("highestPackage");

const placementPercentage =
    document.getElementById("placementPercentage");

const formTitle =
    document.getElementById("formTitle");

const cancelEditButton =
    document.getElementById("cancelEditButton");


let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];



let editingStudentId = null;


displayStudents();



studentForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();



        const name =
            document
                .getElementById("studentName")
                .value
                .trim();

        const company =
            document
                .getElementById("company")
                .value
                .trim();

        const role =
            document
                .getElementById("role")
                .value
                .trim();

        const packageValue =
            Number(
                document
                    .getElementById("package")
                    .value
            );

        const status =
            document
                .getElementById("status")
                .value;


        if (name === "") {

            alert("Please enter student name.");

            return;
        }


        if (status === "Placed") {

            if (company === "") {

                alert("Please enter company name.");

                return;
            }


            if (role === "") {

                alert("Please enter job role.");

                return;
            }


            if (packageValue <= 0) {

                alert(
                    "Package must be greater than 0."
                );

                return;
            }
        }


        if (editingStudentId !== null) {

            const student =
                students.find(
                    function(student) {

                        return (
                            student.id ===
                            editingStudentId
                        );
                    }
                );


            if (student) {

                student.name = name;

                student.company =
                    status === "Placed"
                    ? company
                    : "";

                student.role =
                    status === "Placed"
                    ? role
                    : "";

                student.package =
                    status === "Placed"
                    ? packageValue
                    : 0;

                student.status = status;
            }


            alert("Student updated successfully.");

            editingStudentId = null;

            formTitle.textContent =
                "Add Student";

            cancelEditButton.style.display =
                "none";

        }


        else {

            const student = {

                id: Date.now(),

                name: name,

                company:
                    status === "Placed"
                    ? company
                    : "",

                role:
                    status === "Placed"
                    ? role
                    : "",

                package:
                    status === "Placed"
                    ? packageValue
                    : 0,

                status: status
            };


            students.push(student);
        }


        // Save

        saveStudents();

        displayStudents();

        studentForm.reset();
    }
);


// ===============================
// SAVE STUDENTS
// ===============================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}



function displayStudents() {

    studentList.innerHTML = "";



    updateStatistics();



    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


  

    const selectedStatus =
        filterStatus.value;



    let filteredStudents =
        students.filter(
            function(student) {

                const matchesSearch =

                    student.name
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    student.company
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    student.role
                        .toLowerCase()
                        .includes(searchText);


                const matchesStatus =

                    selectedStatus === "All"

                    ||

                    student.status ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );



    const selectedSort =
        sortOption.value;


    if (selectedSort === "name") {

        filteredStudents.sort(
            function(a, b) {

                return a.name
                    .localeCompare(b.name);
            }
        );
    }


    else if (
        selectedSort === "packageHigh"
    ) {

        filteredStudents.sort(
            function(a, b) {

                return b.package -
                       a.package;
            }
        );
    }


    else if (
        selectedSort === "packageLow"
    ) {

        filteredStudents.sort(
            function(a, b) {

                return a.package -
                       b.package;
            }
        );
    }



    if (filteredStudents.length === 0) {

        studentList.innerHTML = `
            <div class="empty-message">
                No students found.
            </div>
        `;

        return;
    }

    filteredStudents.forEach(
        function(student) {

            const card =
                document.createElement("div");

            card.className =
                "student-card";


            card.innerHTML = `

                <h3>
                    ${student.name}
                </h3>

                <p>
                    <strong>Company:</strong>
                    ${
                        student.company ||
                        "Not Available"
                    }
                </p>

                <p>
                    <strong>Role:</strong>
                    ${
                        student.role ||
                        "Not Available"
                    }
                </p>

                <p>
                    <strong>Package:</strong>
                    ${
                        student.package > 0
                        ? student.package + " LPA"
                        : "Not Available"
                    }
                </p>

                <p>
                    <strong>Status:</strong>
                    ${student.status}
                </p>

                <button
                    class="edit-button"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            `;


            studentList.appendChild(card);
        }
    );
}



function updateStatistics() {



    totalStudents.textContent =
        students.length;


    const placed =
        students.filter(
            function(student) {

                return student.status ===
                    "Placed";
            }
        );


    const notPlaced =
        students.filter(
            function(student) {

                return student.status ===
                    "Not Placed";
            }
        );


    placedStudents.textContent =
        placed.length;

    notPlacedStudents.textContent =
        notPlaced.length;



    const totalPackage =
        placed.reduce(
            function(total, student) {

                return total +
                       student.package;

            },
            0
        );



    let average = 0;


    if (placed.length > 0) {

        average =
            totalPackage /
            placed.length;
    }


    averagePackage.textContent =
        average.toFixed(2) + " LPA";



    let highest = 0;


    if (placed.length > 0) {

        highest =
            Math.max(
                ...placed.map(
                    function(student) {

                        return student.package;
                    }
                )
            );
    }


    highestPackage.textContent =
        highest + " LPA";



    let percentage = 0;


    if (students.length > 0) {

        percentage =
            (placed.length /
            students.length) * 100;
    }


    placementPercentage.textContent =
        percentage.toFixed(2) + "%";
}



function editStudent(id) {

    const student =
        students.find(
            function(student) {

                return student.id === id;
            }
        );


    if (!student) {

        return;
    }



    document.getElementById(
        "studentName"
    ).value = student.name;


    document.getElementById(
        "company"
    ).value = student.company;


    document.getElementById(
        "role"
    ).value = student.role;


    document.getElementById(
        "package"
    ).value = student.package;


    document.getElementById(
        "status"
    ).value = student.status;


    // Remember student ID

    editingStudentId = id;


    // Change form title

    formTitle.textContent =
        "Edit Student";


    // Show cancel button

    cancelEditButton.style.display =
        "inline-block";


    // Scroll to form

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


cancelEditButton.addEventListener(
    "click",
    function() {

        editingStudentId = null;

        studentForm.reset();

        formTitle.textContent =
            "Add Student";

        cancelEditButton.style.display =
            "none";
    }
);




function deleteStudent(id) {

    const confirmDelete =
        confirm(
            "Delete this student?"
        );


    if (!confirmDelete) {

        return;
    }


    students =
        students.filter(
            function(student) {

                return student.id !== id;
            }
        );


    saveStudents();

    displayStudents();
}


searchInput.addEventListener(
    "input",
    function() {

        displayStudents();
    }
);



filterStatus.addEventListener(
    "change",
    function() {

        displayStudents();
    }
);


sortOption.addEventListener(
    "change",
    function() {

        displayStudents();
    }
);



clearButton.addEventListener(
    "click",
    function() {

        const confirmDelete =
            confirm(
                "Delete all student records?"
            );


        if (confirmDelete) {

            students = [];

            saveStudents();

            displayStudents();
        }
    }
);
