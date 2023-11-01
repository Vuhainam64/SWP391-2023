const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();

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

// Định nghĩa một API route để tìm employee rảnh không có công việc vào thời gian createdAt
router.post('/findAvailableEmployees', checkAdminRole, async (req, res) => {
    try {
        // Lấy thời gian createdAt từ request
        const createdAt = req.body.createdAt;

        // Lấy tất cả các tasks tạo vào thời gian createdAt
        const tasksSnapshot = await db.collection("task").where("createdAt", "==", createdAt).get();
        const tasks = [];

        tasksSnapshot.forEach(doc => {
            const taskData = doc.data();
            const taskId = doc.id;
            tasks.push({
                taskId,
                ...taskData
            });
        });

        // Lấy tất cả nhân viên
        const employeesSnapshot = await db.collection("user").where("roleId", "==", 1698200208313).get();
        const employees = [];

        employeesSnapshot.forEach(doc => {
            const userData = doc.data();
            const userId = doc.uid;
            employees.push({
                uid: userId,
                ...userData
            });
        });

        // Tạo danh sách các nhân viên rảnh
        const availableEmployees = employees.filter((employee) => {
            // Kiểm tra xem employee có công việc nào vào thời gian createdAt không
            const hasTask = tasks.some((task) => {
                return task.employeeId === employee.uid;
            });

            return !hasTask;
        });

        res.json(availableEmployees);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi server'
        });
    }
});


// Route tạo task 
router.post('/createTask/:userId', checkAdminRole, async (req, res) => {

    const userId = req.params.userId;

    const {
        feedbackStatus,
        feedbackId,
    } = req.body;

    if (!feedbackStatus || !feedbackId) {
        return res.status(400).json({
            error: "Feedback status and ID are required"
        });
    }

    try {
        switch (feedbackStatus) {
            case "Not Verify":
                description = `Verify feedback ${feedbackId}`
                newFeedbackStatus = "Validating"
                break;
            case "Verify":
                description = `Processing feedback ${feedbackId}`
                newFeedbackStatus = "Validated"
                break;
            default:
                break;
        }

        const updateFeedbackStatus = {
            Status: newFeedbackStatus,
            updatedAt: new Date().getTime(),
        }

        const newTask = {
            employeeId: userId,
            feedbackId,
            description,
            status: 'Processing',
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        };

        const taskDocRef = await db.collection('tasks').add(newTask);

        const feedbackDoc = await db.collection('feedbacks').doc(feedbackId).get();
        const {
            statusId
        } = feedbackDoc.data();
        const feedbackStatusDocRef = await db.collection('feedbackstatus').doc(statusId).update(updateFeedbackStatus);

        return res.status(201).json({
            id: taskDocRef.id,
            updatedFeedbackStatusId: feedbackStatusDocRef.id,
            message: "Task created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating task');
    }
});

// Route lấy tất cả các task của một nhân viên dựa trên userId
router.get("/getAllTaskOfEmployee/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const tasksSnapshot = await db.collection("tasks")
            .where("employeeId", "==", userId)
            .get();

        const tasks = [];

        tasksSnapshot.forEach(doc => {
            const taskData = doc.data();
            const taskId = doc.id;

            tasks.push({
                taskId, // Thêm taskId để biết ID của task
                ...taskData
            });
        });

        return res.status(200).send({
            success: true,
            data: tasks,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`
        });
    }
});

module.exports = router;