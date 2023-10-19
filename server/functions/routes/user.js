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

router.get("/getRole/:userId", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({
            msg: "Token Not Found"
        });
    }
    try {
        const userId = req.params.userId;
        const userRef = db.collection("user").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            res.status(404).json({
                success: false,
                msg: "Người dùng không tồn tại"
            });
        } else {
            const userData = userDoc.data();
            const userRole = userData.role;

            res.status(200).json({
                success: true,
                role: userRole
            });
        }
    } catch (error) {
        console.error("Lỗi khi lấy vai trò người dùng:", error);
        res.status(500).json({
            success: false,
            msg: "Lỗi khi lấy vai trò người dùng"
        });
    }
});

router.post("/updateRole/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    const {
        role
    } = req.body;
    try {
        const userRef = db.collection("user").doc(user_id);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }
        await userRef.update({
            role
        });

        await admin.auth().setCustomUserClaims(user_id, {
            role
        });
        const updatedUserDoc = await userRef.get();
        const updatedUserData = updatedUserDoc.data();
        const updatedUserRole = updatedUserData.role;
        return res.status(200).json({
            success: true,
            msg: "User role updated successfully",
            role: updatedUserRole // Trả về vai trò đã được cập nhật
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: `Error: ${error}`
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