const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();

const DEFAULT_ROLE_ID = 1698024496834; //student
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

router.post("/createRole", checkAdminRole, async (req, res) => {
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


router.post("/updateUserRole/:userId", checkAdminRole, async (req, res) => {
  const userId = req.params.userId;
  const newRoleId = req.body.newRoleId; // Sử dụng newRoleId để lấy vai trò mới

  if (!newRoleId) {
    return res.status(400).send({
      success: false,
      msg: "New role ID is required."
    });
  }

  try {
    const userRef = db.collection("user").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).send({
        success: false,
        msg: "User not found."
      });
    }

    // Lấy giá trị uid của người dùng để làm giá trị cho employeeStatusId
    const userUid = userDoc.data().uid;

    // Khởi tạo một đối tượng chứa thông tin cần cập nhật
    const updateData = {
      roleId: newRoleId // Cập nhật trường roleId với vai trò mới
    };

    if (newRoleId === 1698200208313) {
      // Tạo hoặc cập nhật tài liệu trong bảng "employeeStatus" với employeeStatusId bằng uid của người dùng
      const employeeStatusRef = db.collection("employeeStatus").doc(userUid);
      const employeeStatusData = {
        lastUpdate: Date.now(),
        status: "Ready",
        userID: userId // Thêm trường userID là giá trị userId
      };

      await employeeStatusRef.set(employeeStatusData, {
        merge: true
      });
    }

    // Cập nhật trường "roleId" trong bảng "user"
    await userRef.update(updateData);

    return res.status(200).send({
      success: true,
      msg: "User role and employee status updated successfully."
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