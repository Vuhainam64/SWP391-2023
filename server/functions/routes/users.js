const router = require("express").Router();
const admin = require("firebase-admin");
let data = [];
const db = admin.firestore();
db.settings({
    ignoreUndefinedProperties: true
});

router.get("/", (req, res) => {
    return res.send("Inside the user router");
});

router.get("/jwtVerfication", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({
            msg: "Token Not Found"
        });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedValue = await admin.auth().verifyIdToken(token);
        if (!decodedValue) {
            return res
                .status(500)
                .json({
                    success: false,
                    msg: "Unauthorized access"
                });
        }
        return res.status(200).json({
            success: true,
            data: decodedValue
        });
    } catch (err) {
        return res.send({
            success: false,
            msg: `Error in extracting the token : ${err}`,
        });
    }
});

const listAllUsers = async (nextPageToken) => {
    const usersRef = db.collection("user");

    const querySnapshot = await usersRef.get();

    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });

    return data;
};

router.get("/all", async (req, res) => {
    try {
        const allUsers = await listAllUsers();
        return res.status(200).send({
            success: true,
            data: allUsers,
            dataCount: allUsers.length
        });
    } catch (err) {
        return res.send({
            success: false,
            msg: `Error in listing users: ${err}`,
        });
    }
});
module.exports = router;