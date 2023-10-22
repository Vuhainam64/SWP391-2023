const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();

router.post("/createRole/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const id = Date.now();
        const data = {
            roleId: id,
            role_name: "student",
            userId: userId,
        };

        const response = await db.collection("roles").doc(`/${id}/`).set(data);
        console.log(response);
        return res.status(200).send({
            success: true,
            data: response,
            role_name: "student"
        });
    } catch (err) {
        return res.send({
            success: false,
            msg: `Error :${err}`
        });
    }
});

router.get("/getRole/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Tìm vai trò của người dùng dựa trên userId
        const rolesRef = db.collection("roles");
        const query = rolesRef.where("userId", "==", userId);
        const snapshot = await query.get();

        if (snapshot.empty) {
            // Không tìm thấy vai trò cho userId
            return res.status(404).send({
                success: false,
                msg: "Không tìm thấy vai trò cho userId"
            });
        } else {
            // Lấy thông tin vai trò từ tài liệu đầu tiên trong kết quả
            const roleData = snapshot.docs[0].data();

            return res.status(200).send({
                success: true,
                data: roleData
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Lỗi: ${err}`
        });
    }
});

// Middleware để kiểm tra quyền admin
const checkAdminPermission = async (req, res, next) => {
    try {
        const idToken = req.headers.authorization;
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // Kiểm tra vai trò của người dùng có phải admin hay không
        const rolesRef = db.collection("roles");
        const query = rolesRef.where("userId", "==", userId);
        const snapshot = await query.get();

        if (snapshot.empty) {
            return res.status(403).send({
                success: false,
                msg: "Người dùng không có quyền admin"
            });
        }

        const userRole = snapshot.docs[0].data();

        if (userRole.role_name !== "admin") {
            return res.status(403).send({
                success: false,
                msg: "Người dùng không có quyền admin"
            });
        }

        // Nếu người dùng có quyền admin, tiếp tục xử lý
        next();
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Lỗi: ${err}`
        });
    }
};

router.put("/updateRole/:userId", checkAdminPermission, async (req, res) => {
    try {
        const userId = req.params.userId;
        const newRoleName = req.body.newRoleName;

        // Cập nhật vai trò của người dùng dựa trên userId
        const rolesRef = db.collection("roles");
        const query = rolesRef.where("userId", "==", userId);
        const snapshot = await query.get();

        if (snapshot.empty) {
            return res.status(404).send({
                success: false,
                msg: "Không tìm thấy vai trò cho userId"
            });
        }

        const roleDoc = snapshot.docs[0];
        const updatedData = {
            role_name: newRoleName
        };

        await roleDoc.ref.update(updatedData);

        return res.status(200).send({
            success: true,
            msg: "Vai trò của người dùng đã được cập nhật"
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Lỗi: ${err}`
        });
    }
});
module.exports = router;