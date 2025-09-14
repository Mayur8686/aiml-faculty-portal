// ====== Import Firebase modules ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ====== Firebase Configuration ======
// 🔑 Replace with your Firebase project settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ====== Tab Switching ======
const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ====== Attendance Form ======
const form = document.getElementById("attendanceForm");
const tableBody = document.getElementById("recordsTable");

form.addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("studentName").value;
  const roll = document.getElementById("rollNo").value;
  const status = document.getElementById("status").value;
  const date = new Date().toLocaleDateString();

  try {
    await addDoc(collection(db, "attendance"), {
      rollNo: roll,
      name: name,
      status: status,
      date: date
    });
    console.log("✅ Attendance saved to Firestore!");
    form.reset();
    fetchRecords();
  } catch (err) {
    console.error("❌ Error saving:", err);
    alert("Failed to save attendance, check console.");
  }
});

// ====== Fetch Records ======
async function fetchRecords() {
  tableBody.innerHTML = "";
  try {
    const q = query(collection(db, "attendance"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      const data = doc.data();
      const row = `<tr>
        <td>${data.rollNo}</td>
        <td>${data.name}</td>
        <td>${data.status}</td>
        <td>${data.date}</td>
      </tr>`;
      tableBody.innerHTML += row;
    });
    updateAttendanceStats(snapshot);
  } catch (err) {
    console.error("❌ Error fetching:", err);
  }
}

// ====== Update Average Attendance ======
function updateAttendanceStats(snapshot) {
  let total = 0, present = 0;
  snapshot.forEach(doc => {
    total++;
    if (doc.data().status === "Present") present++;
  });
  const avg = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
  document.getElementById("avgAttendance").textContent = avg + "%";
}

// ====== Academic Chart ======
const ctx = document.getElementById("marksChart").getContext("2d");
new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Math", "Science", "English", "AI", "ML"],
    datasets: [{
      label: "Marks",
      data: [78, 85, 69, 90, 80],
      backgroundColor: "#3b82f6"
    }]
  },
  options: { responsive: true }
});

// ====== Load Data On Page Start ======
window.onload = fetchRecords;
