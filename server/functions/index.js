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

const feedbackRoute = require('./routes/feedbacks');
const notificationRoute = require('./routes/notifications');
const roleRoute = require('./routes/roles');
const taskRoute = require('./routes/tasks');
const userRoute = require('./routes/users');
const facilityRoute = require('./routes/facility');

// Sử dụng các router
app.use('/api/feedbacks', feedbackRoute);
app.use('/api/notify', notificationRoute);
app.use('/api/roles', roleRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/users', userRoute);
app.use('/api/facility', facilityRoute);

exports.app = functions.https.onRequest(app);