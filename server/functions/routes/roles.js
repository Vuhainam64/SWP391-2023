const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();

const DEFAULT_ROLE_ID = "1698024496834"; //student
// Route tạo role mặc định
router.post("/createDefaultRole/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        // Truy vấn để lấy tài liệu người dùng
        const userDoc = await db.collection("user").doc(userId).get();

        if (userDoc.exists) {
            // Kiểm tra xem người dùng đã có roleId hay chưa
            if (!userDoc.data().roleId) {
                // Nếu roleId của người dùng là null hoặc không tồn tại, thực hiện cập nhật
                await db.collection("user").doc(userId).update({
                    roleId: DEFAULT_ROLE_ID
                });

                return res.status(200).send({
                    success: true,
                    msg: "Default role created successfully"
                });
            } else {
                // Người dùng đã có roleId, không thực hiện cập nhật
                return res.status(400).send({
                    success: false,
                    msg: "User already has a role."
                });
            }
        } else {
            return res.status(404).send({
                success: false,
                msg: "User not found."
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`
        });
    }
});


router.post("/createRole/:userId", async (req, res) => {
    const userId = req.params.userId;
    const role_name = req.body.role_name;

    if (!role_name) {
        return res.status(400).send({
            success: false,
            msg: "Role name is required."
        });
    }

    try {
        // Kiểm tra xem vai trò đã tồn tại chưa
        const roleExists = await db.collection("roles")
            .where("role_name", "==", role_name)
            .get();

        if (!roleExists.empty) {
            return res.status(400).send({
                success: false,
                msg: "Role name already exists."
            });
        }
        const id = Date.now();
        const data = {
            roleId: id,
            role_name: role_name,
            createdBy: userId,
        };

        const response = await db.collection("roles").doc(`/${id}/`).set(data);
        console.log(response);
        return res.status(201).send({
            success: true,
            data: response,
            role_name: data.role_name,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`
        });
    }
});


router.get("/getAllRoles", async (req, res) => {
    try {
        const rolesSnapshot = await db.collection("roles").get();

        const roles = [];

        rolesSnapshot.forEach((doc) => {
            const roleData = doc.data();
            roles.push(roleData);
        });

        return res.status(200).send({
            success: true,
            data: roles,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`
        });
    }
});

router.post("/updateUserRole/:userId", async (req, res) => {
    const userId = req.params.userId;
    const newRoleId = req.body.newRoleId; // Sử dụng newRoleId để lấy vai trò mới

    if (!newRoleId) {
        return res.status(400).send({
            success: false,
            msg: "New role ID is required."
        });
    }

    try {
        // Truy vấn để cập nhật vai trò của người dùng
        await db.collection("user").doc(userId).update({
            roleId: newRoleId, // Cập nhật trường roleId với vai trò mới
        });

        return res.status(200).send({
            success: true,
            msg: "User role updated successfully."
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`
        });
    }
});

router.get("/getRole/:roleId", async (req, res) => {
    const roleId = req.params.roleId;

    try {
        const roleDoc = await db.collection("roles").doc(roleId).get();

        if (roleDoc.exists) {
            const roleData = roleDoc.data();
            return res.status(200).send({
                success: true,
                data: roleData,
            });
        } else {
            return res.status(404).send({
                success: false,
                msg: "Role not found.",
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`,
        });
    }
});

module.exports = router;