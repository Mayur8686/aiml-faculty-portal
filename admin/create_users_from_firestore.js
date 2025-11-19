import admin from "firebase-admin";
import fs from "fs";

// Initialize admin SDK
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createAllUsers() {
  console.log("Fetching students...");

  const studentsSnap = await db.collection("students").get();
  const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  for (const s of students) {
    const email = `${s.roll}@student.com`;
    const password = String(s.roll);  // password = roll number

    try {
      await admin.auth().createUser({
        uid: s.roll.toString(),
        email,
        password,
        displayName: s.name,
      });
      console.log(`✔ Created: ${email}`);
    } catch (err) {
      if (err.code === "auth/email-already-exists") {
        console.log(`✔ Already exists: ${email}`);
      } else {
        console.log("Error:", err);
      }
    }
  }

  console.log("Done!");
}

createAllUsers();
