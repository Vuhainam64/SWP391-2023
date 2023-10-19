const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccountKey = require("./serviceAccountKey.json");

const express = require("express");
const app = express();

// Body parser for our JSON data
app.use(express.json());

// cross orgin
const cors = require("cors");
app.use(cors({
  origin: true
}));
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

// firebase credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

admin.auth().setCustomUserClaims("wYcLjiaX12V0KLp27eWyOCrf3TC3", {
    admin: true
  })
  .then(() => {
    console.log("Người dùng 'admin' đã được gán quyền 'admin'.");
  })
  .catch((error) => {
    console.error("Lỗi khi gán quyền 'admin' cho người dùng:", error);
  });

// api endpoints
app.get("/", (req, res) => {
  return res.send("hello word");
});

const userRoute = require("./routes/user");
app.use("/api/users", userRoute);


exports.app = functions.https.onRequest(app);