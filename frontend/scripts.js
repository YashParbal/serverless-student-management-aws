const API_ENDPOINT =
    "https://1pis34svoj.execute-api.ap-south-1.amazonaws.com/V1";


// ======================================================
// ADD STUDENT
// ======================================================
const saveButton = document.getElementById("saveStudent");

if (saveButton) {

    saveButton.addEventListener("click", async function () {

        const message = document.getElementById("message");

        const studentData = {

            studentid:
                document.getElementById("studentid").value,

            name:
                document.getElementById("name").value,

            class:
                document.getElementById("class").value,

            age:
                document.getElementById("age").value
        };


        // Check empty fields

        if (
            !studentData.studentid ||
            !studentData.name ||
            !studentData.class ||
            !studentData.age
        ) {

            message.textContent =
                "Please fill in all fields.";

            message.style.color = "red";

            return;
        }


        try {

            const response = await fetch(API_ENDPOINT, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(studentData)

            });


            if (!response.ok) {

                throw new Error(
                    "HTTP Error: " + response.status
                );

            }


            const result = await response.json();

            console.log("POST response:", result);


            message.textContent =
                "Student data saved successfully!";

            message.style.color = "lightgreen";


            // Clear fields

            document.getElementById("studentid").value = "";
            document.getElementById("name").value = "";
            document.getElementById("class").value = "";
            document.getElementById("age").value = "";


        }

        catch (error) {

            console.error(
                "Error saving student:",
                error
            );

            message.textContent =
                "Error saving student data.";

            message.style.color = "red";

        }

    });

}



// ======================================================
// LOAD STUDENTS
// ======================================================

const loadButton =
    document.getElementById("loadStudents");


if (loadButton) {

    loadButton.addEventListener(
        "click",
        async function () {

            const tableBody =
                document.getElementById("studentTable");

            const status =
                document.getElementById("status");


            status.textContent =
                "Loading students...";


            try {

                const response =
                    await fetch(API_ENDPOINT, {

                        method: "GET",

                        headers: {
                            "Accept": "application/json"
                        }

                    });


                if (!response.ok) {

                    throw new Error(
                        "HTTP Error: " +
                        response.status
                    );

                }


                const students =
                    await response.json();


                console.log(
                    "GET response:",
                    students
                );


                tableBody.innerHTML = "";


                if (!Array.isArray(students)) {

                    throw new Error(
                        "API did not return an array."
                    );

                }


                students.forEach(
                    function (student) {

                        const row =
                            document.createElement("tr");


                        row.innerHTML = `

                            <td>
                                ${student.studentid ?? ""}
                            </td>

                            <td>
                                ${student.name ?? ""}
                            </td>

                            <td>
                                ${student.class ?? ""}
                            </td>

                            <td>
                                ${student.age ?? ""}
                            </td>

                        `;


                        tableBody.appendChild(row);

                    }
                );


                status.textContent =
                    students.length +
                    " student(s) loaded.";

                status.style.color =
                    "lightgreen";


            }

            catch (error) {

                console.error(
                    "Error loading students:",
                    error
                );


                status.textContent =
                    "Error retrieving student data.";

                status.style.color =
                    "red";

            }

        }
    );

}

