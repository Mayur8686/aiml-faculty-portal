const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

admin.auth().listUsers()
.then(list => {
  list.users.forEach(u => {
    console.log(`UID: ${u.uid}, Email: ${u.email}`);
  });
})
.catch(err => console.error(err));
