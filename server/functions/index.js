const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccountKey = require("./serviceAccountKey.json");

const express = require("express");
const app = express();
app.use(express.json());

// CORS settings
const cors = require("cors");
app.use(cors());

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
});


// API endpoints
app.get("/", (req, res) => {
    return res.send("This is API of Get-Feedback");
});

const userRoute = require('./routes/users');
const photoRoute = require('./routes/photos');
const roleRoute = require('./routes/roles');
const feedbackRoute = require('./routes/feedbacks');

// Sử dụng các router
app.use('/api/users', userRoute);
app.use('/api/photos', photoRoute);
app.use('/api/roles', roleRoute);
app.use('/api/feedbacks', feedbackRoute);

exports.app = functions.https.onRequest(app);