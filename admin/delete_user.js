const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const uid = process.argv[2];

if (!uid) {
  console.log("Usage: node delete_user.js uid");
  process.exit();
}

admin.auth().deleteUser(uid)
.then(() => console.log("User deleted:", uid))
.catch(err => console.error("Error:", err));
