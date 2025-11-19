// assets/js/fy.js
// Subject-aware attendance script (date-only) with fetch helpers.
// IMPORTANT: load this as module (type="module") in your HTML.

// ------------- Firebase config -------------
const firebaseConfig = {
  apiKey: "AIzaSyCmr6ohetgRU38w1UPf5WlviPc869MqrKE",
  authDomain: "aiml-portal.firebaseapp.com",
  projectId: "aiml-portal",
  storageBucket: "aiml-portal.firebasestorage.app",
  messagingSenderId: "976880421269",
  appId: "1:976880421269:web:33d16bf4147259032b4e9c",
  measurementId: "G-M8X3YJF1GK"
};
// -------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM refs (may be absent in some pages — we check)
const studentListEl = document.getElementById("studentList");
const attendanceForm = document.getElementById("attendanceForm");
const recordsTable = document.getElementById("recordsTable");
const selectAllCheckbox = document.getElementById("selectAllCheckbox");
const selectAllBtn = document.getElementById("selectAllBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const submitBtn = document.getElementById("submitAttendanceBtn");
const courseSelectEl = document.getElementById("courseSelect");
const attendanceDateEl = document.getElementById("attendanceDate"); // optional date picker

let srNo = 0;
const studentMap = new Map(); // studentId -> { roll, name, prn, division }

/* ----- helpers ----- */
function todayDateKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
function safeString(val) {
  if (val === undefined || val === null) return "";
  if (typeof val === "number") return Number.isNaN(val) ? "" : String(val);
  return String(val);
}
function extractRollFromData(data) {
  return (
    safeString(data.roll) ||
    safeString(data.rollNo) ||
    safeString(data.roll_no) ||
    safeString(data.prn) ||
    ""
  );
}
function getSelectedSubject() {
  try {
    if (courseSelectEl && courseSelectEl.value) {
      return String(courseSelectEl.value).trim() || "DSA";
    }
  } catch (e) {}
  return "DSA";
}
// get dateKey from optional input; fallback to today
function getSelectedDateKey() {
  try {
    if (attendanceDateEl && attendanceDateEl.value) {
      const v = attendanceDateEl.value.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    }
  } catch (e) {}
  return todayDateKey();
}

/* -------------------- render student checkboxes -------------------- */
function renderStudentCheckboxes(students) {
  if (!studentListEl) return;
  studentListEl.innerHTML = "";
  studentMap.clear();

  if (!students || students.length === 0) {
    studentListEl.innerHTML = "<p>No students found.</p>";
    return;
  }

  students.forEach((s, idx) => {
    const id = s.id || "";
    const roll = safeString(s.roll || s.prn || "");
    const name = safeString(s.name);
    const prn = safeString(s.prn);
    const division = safeString(s.division);

    studentMap.set(id, { roll, name, prn, division });

    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "8px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `stu-${idx}`;
    checkbox.name = "students";
    checkbox.value = roll;
    checkbox.dataset.id = id;
    checkbox.dataset.name = name;
    checkbox.dataset.prn = prn;
    checkbox.dataset.division = division;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.style.marginLeft = "8px";

    const labelParts = [];
    if (roll) labelParts.push(roll);
    if (prn) labelParts.push(prn);
    if (name) labelParts.push(name);
    if (division) labelParts.push(`Div ${division}`);
    label.textContent = labelParts.join(" — ");

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    studentListEl.appendChild(wrapper);
  });
}

/* -------------------- students subscription -------------------- */
function subscribeStudents() {
  if (!studentListEl) return;
  const studentsCol = collection(db, "students");
  const q = query(studentsCol, orderBy("roll"));
  onSnapshot(
    q,
    (snapshot) => {
      const students = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      renderStudentCheckboxes(students);
      console.log(`[fy.js] Loaded ${students.length} student(s) from Firestore.`);
      setupSelectAllHandlers();
    },
    (err) => {
      console.error("[fy.js] Failed to fetch students:", err);
      studentListEl.innerHTML = "<p>Error loading students. Check console.</p>";
    }
  );
}

/* -------------------- submit attendance (subject+date aware, date-only) -------------------- */
async function submitAttendanceToFirestore(finalList) {
  if (!Array.isArray(finalList) || finalList.length === 0) {
    alert("No attendance to submit.");
    return;
  }

  const dateKey = getSelectedDateKey();
  const subject = getSelectedSubject();
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Saving..."; }

  const targetCollPath = ["attendance", subject, "records"];

  const writes = finalList.map((s) => {
    const baseId = s.studentId || s.roll || Math.random().toString(36).slice(2, 9);
    const docId = `${dateKey}_${baseId}`;
    // date-only payload (no timestamps)
    const payload = {
      studentId: s.studentId || "",
      roll: safeString(s.roll) || safeString(studentMap.get(s.studentId)?.roll || ""),
      name: safeString(s.name) || safeString(studentMap.get(s.studentId)?.name || ""),
      prn: safeString(s.prn) || safeString(studentMap.get(s.studentId)?.prn || ""),
      division: safeString(s.division) || safeString(studentMap.get(s.studentId)?.division || ""),
      status: safeString(s.status),
      dateKey,
      subject
    };
    return setDoc(doc(collection(db, ...targetCollPath), docId), payload);
  });

  try {
    await Promise.all(writes);
    console.log(`[fy.js] Saved attendance for ${finalList.length} student(s) under subject=${subject} date=${dateKey}.`);
  } catch (err) {
    console.error("[fy.js] Error saving attendance:", err);
    alert("Failed to save attendance. See console for details.");
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Submit Attendance"; }
  }
}

/* -------------------- subscribe attendance for selected date -------------------- */
let currentAttendanceUnsub = null;

function subscribeAttendanceForSelectedDate() {
  if (!recordsTable) return;

  // unsubscribe old
  if (typeof currentAttendanceUnsub === "function") {
    try { currentAttendanceUnsub(); } catch (e) {}
    currentAttendanceUnsub = null;
  }

  const dateKey = getSelectedDateKey();
  const subject = getSelectedSubject();
  const collRef = collection(db, "attendance", subject, "records");
  const q = query(collRef, where("dateKey", "==", dateKey));

  const unsub = onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, data: d.data() }));
      // sort by roll/studentId if possible
      docs.sort((a, b) => {
        const ra = (a.data && (a.data.roll || a.data.studentId)) || "";
        const rb = (b.data && (b.data.roll || b.data.studentId)) || "";
        return String(ra).localeCompare(String(rb), undefined, { numeric: true });
      });
      renderAttendanceDocs(docs);
    },
    (err) => {
      console.error("[fy.js] Failed to subscribe to attendance:", err);
      if (recordsTable) recordsTable.innerHTML = "<tr><td colspan='5'>Error loading attendance. Check console.</td></tr>";
    }
  );

  currentAttendanceUnsub = unsub;
  console.log(`[fy.js] Subscribed to attendance for subject=${subject} date=${dateKey}`);
}

/* -------------------- render attendance docs (date only) -------------------- */
function renderAttendanceDocs(docs) {
  if (!recordsTable) return;
  recordsTable.innerHTML = "";
  srNo = 0;

  if (!docs || docs.length === 0) {
    recordsTable.innerHTML = "<tr><td colspan='5' class='small'>No attendance recorded for selected date.</td></tr>";
    return;
  }

  docs.forEach((item) => {
    srNo += 1;
    const data = item.data || {};

    let rollLabel = extractRollFromData(data);
    if (!rollLabel && data.studentId && studentMap.has(data.studentId)) {
      rollLabel = studentMap.get(data.studentId).roll || "";
    }
    if (!rollLabel) rollLabel = data.studentId ? `(id:${data.studentId})` : "(no-roll)";

    const nameLabel = safeString(data.name) || (data.studentId && studentMap.has(data.studentId) ? studentMap.get(data.studentId).name : "");
    const statusLabel = safeString(data.status);

    // Date label — prefer dateKey only (YYYY-MM-DD -> localized date)
    let dateLabel = "-";
    if (data.dateKey) {
      try {
        const parts = String(data.dateKey).split("-");
        if (parts.length === 3) {
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          dateLabel = d.toLocaleDateString();
        } else {
          dateLabel = data.dateKey;
        }
      } catch (e) {
        dateLabel = data.dateKey;
      }
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${srNo}</td>
      <td>${rollLabel}</td>
      <td>${nameLabel}</td>
      <td>${statusLabel}</td>
      <td>${dateLabel}</td>
    `;
    recordsTable.appendChild(tr);
  });
}

/* -------------------- attendance submit handler (SMART inversion) -------------------- */
if (attendanceForm) {
  attendanceForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("status") ? document.getElementById("status").value : "Present";
    const allBoxes = Array.from(document.querySelectorAll('input[name="students"]'));
    if (!allBoxes.length) { alert("No students available to mark."); return; }
    const checked = allBoxes.filter(cb => cb.checked);

    let finalList = [];

    if (checked.length === 0) {
      const inverted = status === "Absent" ? "Present" : "Absent";
      finalList = allBoxes.map(cb => ({
        studentId: cb.dataset.id || "",
        roll: cb.value || "",
        name: cb.dataset.name || "",
        prn: cb.dataset.prn || "",
        division: cb.dataset.division || "",
        status: inverted
      }));
    } else {
      const selected = checked.map(cb => ({
        studentId: cb.dataset.id || "",
        roll: cb.value || "",
        name: cb.dataset.name || "",
        prn: cb.dataset.prn || "",
        division: cb.dataset.division || "",
        status: status
      }));
      const notSelected = allBoxes
        .filter(cb => !cb.checked)
        .map(cb => ({
          studentId: cb.dataset.id || "",
          roll: cb.value || "",
          name: cb.dataset.name || "",
          prn: cb.dataset.prn || "",
          division: cb.dataset.division || "",
          status: status === "Absent" ? "Present" : "Absent"
        }));
      finalList = [...selected, ...notSelected];
    }

    console.log("[fy.js] FINAL attendance list count:", finalList.length);
    await submitAttendanceToFirestore(finalList);

    allBoxes.forEach(cb => cb.checked = false);
    if (selectAllCheckbox) selectAllCheckbox.checked = false;
  });
}

/* -------------------- select all helpers -------------------- */
function setAllCheckboxes(val) {
  const allBoxes = Array.from(document.querySelectorAll('input[name="students"]'));
  allBoxes.forEach(b => b.checked = !!val);
}
function setupSelectAllHandlers() {
  if (selectAllBtn) selectAllBtn.onclick = () => setAllCheckboxes(true);
  if (clearAllBtn) clearAllBtn.onclick = () => setAllCheckboxes(false);
  if (selectAllCheckbox) selectAllCheckbox.onchange = () => setAllCheckboxes(selectAllCheckbox.checked);
}

/* -------------------- Init -------------------- */
function init() {
  subscribeStudents();
  // subscribe to selected date (either manual or today's)
  subscribeAttendanceForSelectedDate();
  setupSelectAllHandlers();

  // if courseSelect changes, resubscribe
  if (courseSelectEl) {
    courseSelectEl.addEventListener("change", () => subscribeAttendanceForSelectedDate());
  }
  // if attendanceDate input exists, resubscribe on change
  if (attendanceDateEl) {
    attendanceDateEl.addEventListener("change", () => {
      const v = attendanceDateEl.value;
      if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        alert("Date must be YYYY-MM-DD");
        return;
      }
      subscribeAttendanceForSelectedDate();
    });
  }
}
init();

/* -------------------- NEW: fetch helpers -------------------- */
async function fetchAttendanceByDate(subject = "DSA", dateKey) {
  if (!dateKey) throw new Error("dateKey required (YYYY-MM-DD)");
  const collRef = collection(db, "attendance", subject, "records");
  const q = query(collRef, where("dateKey", "==", dateKey));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, data: d.data() }));
}

async function fetchAttendanceForStudent(subject = "DSA", studentIdOrRoll) {
  if (!studentIdOrRoll) throw new Error("studentIdOrRoll required");
  const collRef = collection(db, "attendance", subject, "records");

  const queries = [
    query(collRef, where("studentId", "==", studentIdOrRoll)),
    query(collRef, where("studentId", "==", String(studentIdOrRoll))),
    query(collRef, where("roll", "==", studentIdOrRoll)),
    query(collRef, where("roll", "==", String(studentIdOrRoll))),
    query(collRef, where("prn", "==", studentIdOrRoll)),
    query(collRef, where("prn", "==", String(studentIdOrRoll)))
  ];

  const all = [];
  for (const q of queries) {
    try {
      const snap = await getDocs(q);
      snap.forEach(docSnap => all.push({ id: docSnap.id, data: docSnap.data() }));
    } catch (e) {
      console.warn("fetchAttendanceForStudent query ignored error:", e);
    }
  }
  const map = new Map();
  all.forEach(item => { if (item && item.id) map.set(item.id, item); });
  return Array.from(map.values());
}

async function fetchAttendanceForStudentByDate(subject = "DSA", studentIdOrRoll, dateKey) {
  if (!dateKey) throw new Error("dateKey required");
  const candidateDocId = `${dateKey}_${studentIdOrRoll}`;
  try {
    const docRef = doc(db, "attendance", subject, "records", candidateDocId);
    const dSnap = await getDoc(docRef);
    if (dSnap.exists()) return { id: dSnap.id, data: dSnap.data() };
  } catch (e) {
    // ignore
  }

  const collRef = collection(db, "attendance", subject, "records");
  const queries = [
    query(collRef, where("dateKey", "==", dateKey), where("studentId", "==", studentIdOrRoll)),
    query(collRef, where("dateKey", "==", dateKey), where("roll", "==", studentIdOrRoll)),
    query(collRef, where("dateKey", "==", dateKey), where("prn", "==", studentIdOrRoll))
  ];

  for (const q of queries) {
    try {
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        return { id: docSnap.id, data: docSnap.data() };
      }
    } catch (e) {
      console.warn("fetchAttendanceForStudentByDate query ignored error:", e);
    }
  }
  return null;
}

// attach to window
window.fetchAttendanceByDate = fetchAttendanceByDate;
window.fetchAttendanceForStudent = fetchAttendanceForStudent;
window.fetchAttendanceForStudentByDate = fetchAttendanceForStudentByDate;

console.log('[fy.js] fetch helpers attached to window (date-only).');
