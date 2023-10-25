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

// Middleware kiểm tra vai trò
const checkAdminRole = async (req, res, next) => {
    const adminId = req.body.adminId; // Lấy userId từ request hoặc thông tin người dùng được lưu trong session
    try {
        const userDoc = await db.collection("user").doc(adminId).get();
        if (userDoc.exists) {
            const userRoleId = userDoc.data().roleId;
            if (userRoleId === 1698024103953) { // Kiểm tra xem roleId của "admin" là gì
                // Nếu vai trò của người dùng là "admin", cho phép tiếp tục
                next();
            } else {
                return res.status(403).send({
                    success: false,
                    msg: "Permission denied. User is not an admin.",
                });
            }
        } else {
            return res.status(404).send({
                success: false,
                msg: "User not found.",
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`,
        });
    }
};

// Route lấy tất cả users
router.post("/getAllUsers", checkAdminRole, async (req, res) => {
    try {
        const usersRef = db.collection("user");
        const snapshot = await usersRef.get();
        let users = [];
        snapshot.forEach(doc => {
            let user = doc.data();
            user.id = doc.id;
            users.push(user);
        });
        res.status(200).send({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }

});
module.exports = router;