import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, doc, getDocs, setDoc, addDoc, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCmr6ohetgRU38w1UPf5WlviPc869MqrKE",
  authDomain: "aiml-portal.firebaseapp.com",
  projectId: "aiml-portal",
  storageBucket: "aiml-portal.firebasestorage.app",
  messagingSenderId: "976880421269",
  appId: "1:976880421269:web:33d16bf4147259032b4e9c",
  measurementId: "G-M8X3YJF1GK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const studentSelect = document.getElementById("studentSelect");
const attendanceForm = document.getElementById("attendanceForm");
const recordsTable = document.getElementById("recordsTable");

// ✅ Load students into dropdown
async function loadStudents() {
  const studentsCol = collection(db, "students");
  const snapshot = await getDocs(studentsCol);
  studentSelect.innerHTML = '<option value="">Select Student</option>';
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const option = document.createElement("option");
    option.value = docSnap.id; // use document ID
    option.textContent = `${data.roll} - ${data.name}`;
    studentSelect.appendChild(option);
  });
}

// ✅ Load today's attendance records
async function loadAttendance() {
  const today = new Date().toISOString().split("T")[0];
  const attendanceDoc = doc(db, "attendance", today);
  const recordsCol = collection(attendanceDoc, "records");
  const snapshot = await getDocs(recordsCol);
  
  recordsTable.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.roll}</td>
      <td>${data.name}</td>
      <td>${data.status}</td>
      <td>${today}</td>
    `;
    recordsTable.appendChild(row);
  });
}

// ✅ Submit attendance record
attendanceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const studentId = studentSelect.value;
  const status = document.getElementById("status").value;

  if (!studentId) {
    alert("Please select a student.");
    return;
  }

  try {
    const studentDoc = doc(db, "students", studentId);
    const studentSnap = await getDocs(query(collection(db, "students"), where("__name__", "==", studentId)));
    const studentData = (await studentSnap.docs[0].data());

    const today = new Date().toISOString().split("T")[0];
    const attendanceDoc = doc(db, "attendance", today);
    const recordDoc = doc(attendanceDoc, "records", studentId);

    await setDoc(recordDoc, {
      roll: studentData.roll,
      name: studentData.name,
      status: status
    });

    alert("Attendance saved!");
    loadAttendance();
  } catch (error) {
    console.error("Error saving attendance:", error);
    alert("Failed to save attendance.");
  }
});

// ✅ Initialize everything on page load
window.addEventListener("load", () => {
  loadStudents();
  loadAttendance();
});
