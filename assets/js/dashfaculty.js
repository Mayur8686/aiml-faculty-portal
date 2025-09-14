// Show section on navigation click
function showSection(sectionId) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

// Add course dynamically
function addCourse() {
  const course = prompt("Enter course name:");
  if (course) {
    const li = document.createElement("li");
    li.textContent = course;
    document.getElementById("courseList").appendChild(li);
  }
}

// Add assignment dynamically
function addAssignment() {
  const assignment = prompt("Enter assignment name:");
  if (assignment) {
    const li = document.createElement("li");
    li.textContent = assignment;
    document.getElementById("assignmentList").appendChild(li);
  }
}

// Add project dynamically
function addProject() {
  const project = prompt("Enter project name:");
  if (project) {
    const li = document.createElement("li");
    li.textContent = project;
    document.getElementById("projectList").appendChild(li);
  }
}

// Update faculty name
function updateName() {
  const newName = document.getElementById("nameInput").value;
  if (newName) {
    document.getElementById("facultyName").textContent = newName;
    alert("Name updated successfully!");
  }
}

// Attendance Chart (using Chart.js)
// Dummy student data (replace with DB data)
const students = {
  AIML101: [
    { roll: 1, name: "Alice" },
    { roll: 2, name: "Bob" },
    { roll: 3, name: "Charlie" }
  ],
  AIML201: [
    { roll: 1, name: "David" },
    { roll: 2, name: "Eva" }
  ],
  AIML301: [
    { roll: 1, name: "Frank" },
    { roll: 2, name: "Grace" },
    { roll: 3, name: "Hannah" }
  ]
};

// Load students when course is selected
document.getElementById("courseSelect").addEventListener("change", loadStudents);

function loadStudents() {
  const course = document.getElementById("courseSelect").value;
  const table = document.getElementById("studentTable");
  table.innerHTML = ""; // Clear old rows

  students[course].forEach(student => {
    const row = `
      <tr>
        <td>${student.roll}</td>
        <td>${student.name}</td>
        <td><input type="radio" name="att_${student.roll}" value="Present" required></td>
        <td><input type="radio" name="att_${student.roll}" value="Absent"></td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

// Handle form submission
document.getElementById("attendanceForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const course = document.getElementById("courseSelect").value;
  const result = [];

  students[course].forEach(student => {
    const status = document.querySelector(`input[name="att_${student.roll}"]:checked`).value;
    result.push({ roll: student.roll, name: student.name, status: status });
  });

  // Show result (can be saved to DB here)
  document.getElementById("attendanceResult").style.display = "block";
  document.getElementById("attendanceResult").innerHTML = `
    <strong>Attendance Saved for ${course}</strong><br>
    ${result.map(r => `${r.name} - ${r.status}`).join("<br>")}
  `;
});

// Load default students on page load
loadStudents();

});
