const router = require("express").Router();
const admin = require("firebase-admin");

// Middleware để xác thực JWT token
const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      msg: "Token Not Found"
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodedValue = await admin.auth().verifyIdToken(token);
    if (!decodedValue) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized access"
      });
    }

    // Gắn thông tin người dùng đã giải mã vào đối tượng request
    req.user = decodedValue;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: `Lỗi khi trích xuất token: ${err}`,
    });
  }
};

// Middleware để kiểm tra quyền dựa trên vai trò
const checkIfRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.customClaims && req.user.customClaims[role] === true) {
      return next(); // Người dùng có quyền cho vai trò cụ thể, cho phép truy cập
    } else {
      return res.status(403).json({
        success: false,
        msg: "Bạn không có quyền truy cập tài nguyên này"
      });
    }
  }
}

// API để lấy danh sách tất cả người dùng (Yêu cầu quyền "admin")
router.get("/all-users", verifyToken, checkIfRole("admin"), async (req, res) => {
  try {
    const listUserResult = await admin.auth().listUsers(1000);
    const users = listUserResult.users.map((userRecord) => userRecord.toJSON());
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: `Lỗi khi lấy danh sách người dùng: ${err}`,
    });
  }
});

// API để gán quyền "student" cho người dùng (Yêu cầu quyền "admin")
router.post("/make-student/:userId", verifyToken, checkIfRole("admin"), async (req, res) => {
  const userId = req.params.userId;
  try {
    await admin.auth().setCustomUserClaims(userId, {
      student: true
    });
    return res.status(200).json({
      success: true,
      msg: "Người dùng đã được gán quyền 'student'"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: `Lỗi khi gán quyền 'student' cho người dùng: ${err}`,
    });
  }
});

// API để gán quyền "teacher" cho người dùng (Yêu cầu quyền "admin")
router.post("/make-teacher/:userId", verifyToken, checkIfRole("admin"), async (req, res) => {
  const userId = req.params.userId;
  try {
    await admin.auth().setCustomUserClaims(userId, {
      teacher: true
    });
    return res.status(200).json({
      success: true,
      msg: "Người dùng đã được gán quyền 'teacher'"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: `Lỗi khi gán quyền 'teacher' cho người dùng: ${err}`,
    });
  }
});

// API để gán quyền "employee" cho người dùng (Yêu cầu quyền "admin")
router.post("/make-employee/:userId", verifyToken, checkIfRole("admin"), async (req, res) => {
  const userId = req.params.userId;
  try {
    await admin.auth().setCustomUserClaims(userId, {
      employee: true
    });
    return res.status(200).json({
      success: true,
      msg: "Người dùng đã được gán quyền 'employee'"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: `Lỗi khi gán quyền 'employee' cho người dùng: ${err}`,
    });
  }
});

// Thêm mã để lấy danh sách tất cả người dùng và thực hiện phân quyền tại đây

module.exports = router;