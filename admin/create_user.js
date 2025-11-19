const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");  // download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

async function createStudentUser(roll) {
  const fakeEmail = `${roll}@student.com`;
  const password = roll; // default password = roll no

  try {
    const user = await auth.createUser({
      email: fakeEmail,
      password: password,
      displayName: `Roll-${roll}`
    });

    console.log("User created:", user.uid);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example run:
// node create_user.js 46
const rollNo = process.argv[2];
if (!rollNo) {
  console.log("Usage: node create_user.js <roll>");
  process.exit(0);
}

createStudentUser(rollNo);
