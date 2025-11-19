const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const app = express();

app.get("/createUser", async (req, res) => {
  const roll = req.query.roll;
  if (!roll) return res.send("Roll missing");

  const email = `${roll}@student.com`;
  const password = roll;

  try {
    await auth.createUser({ email, password });
    res.send(`User created for roll ${roll}`);
  } catch (e) {
    res.send("Error: " + e.message);
  }
});

app.listen(5000, () => console.log("Admin server running on port 5000"));
