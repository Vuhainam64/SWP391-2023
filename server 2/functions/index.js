const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccountKey = require("./serviceAccountKey.json");

const express = require("express");
const app = express();

// Body parser for JSON data
app.use(express.json());

// CORS settings
const cors = require("cors");
app.use(cors());

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: "https://get-feedback-a0119.firebaseio.com",
});


// API endpoints
app.get("/", (req, res) => {
    return res.send("hello word");
});

const userRoute = require("./routes/user");
app.use("/api/users", userRoute);

exports.app = functions.https.onRequest(app);
