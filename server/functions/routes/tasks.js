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
        const startTimeAt = req.body.startTimeAt;

        // Lấy tất cả các tasks tạo vào thời gian createdAt
        const tasksSnapshot = await db.collection("task").where("startTimeAt", "==", startTimeAt).get();
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
router.post('/createTask/:employeeId', checkAdminRole, async (req, res) => {

    const employeeId = req.params.employeeId;

    const {
        adminId,
        startTimeAt,
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
            adminId: adminId,
            employeeId: employeeId,
            startTimeAt,
            feedbackId,
            description,
            status: 'Pending',
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        };

        const taskDocRef = await db.collection('task').add(newTask);

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

        const tasksSnapshot = await db.collection("task")
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

// Thêm một route để huỷ các task quá 2 tiếng ở trạng thái "Pending"
const cancelOverdueTasks = async () => {
    try {
        // Lấy thời gian hiện tại
        const currentTime = new Date().getTime();

        // Tìm các task cần huỷ (quá 2 tiếng ở trạng thái "Pending")
        const tasksSnapshot = await db.collection("task")
            .where("status", "==", "Pending")
            .get();

        const tasksToCancel = [];

        tasksSnapshot.forEach(doc => {
            const taskData = doc.data();
            const taskStartTime = taskData.startTimeAt;

            // Kiểm tra thời gian đã trôi qua (hiện tại - startTimeAt) >= 2 giờ
            if (currentTime - taskStartTime >= 2 * 60 * 60 * 1000) {
                tasksToCancel.push({
                    taskId: doc.id,
                    ...taskData
                });
            }
        });

        // Cập nhật trạng thái và thông báo cho các task bị huỷ
        const promises = tasksToCancel.map(async (task) => {
            const description = "Task canceled due to overdue";
            await db.collection('task').doc(task.taskId).update({
                status: 'Canceled',
                description,
                updatedAt: currentTime
            });

            // Cập nhật trạng thái của phản hồi (feedback) nếu cần
            if (task.feedbackId) {
                const feedback = await db.collection('feedbacks').doc(task.feedbackId).update({
                    description,
                    updatedAt: currentTime
                });

                // Cập nhật trạng thái của feedbackstatus dựa trên trạng thái hiện tại của task
                let newFeedbackStatus;
                switch (task.status) {
                    case "Pending":
                        newFeedbackStatus = "Not Verify";
                        break;
                    case "Validating":
                        newFeedbackStatus = "Not Verify";
                        break;
                    case "Processing":
                        newFeedbackStatus = "Validated";
                        break;
                        // Thêm các trường hợp khác tại đây nếu cần
                    default:
                        newFeedbackStatus = "Not Verify"; // Trạng thái mặc định
                }
                // Cập nhật trạng thái của feedbackstatus
                await db.collection('feedbackstatus').doc(feedback.statusId).update({
                    Status: newFeedbackStatus,
                    updatedAt: currentTime,
                    processingCount: task.processingCount + 1 // Tăng số lần xử lý lên 1
                });

            }
        });

        await Promise.all(promises);

        console.log('Overdue tasks canceled and feedbacks updated.');
    } catch (error) {
        console.error(error);
    }
};

const taskUpdateInterval = 60 * 60 * 1000; // 1 tiếng (trong mili giây)

setInterval(() => {
    cancelOverdueTasks();
}, taskUpdateInterval);

// Route đếm số lượng task theo trạng thái
router.get('/countTasksByStatus', async (req, res) => {
    try {
        const taskStatusCounts = {
            Canceled: 0,
            Pending: 0,
            Verified: 0
        };

        const tasksSnapshot = await db.collection("task").get();

        tasksSnapshot.forEach(doc => {
            const taskData = doc.data();
            const status = taskData.status;

            if (taskStatusCounts.hasOwnProperty(status)) {
                taskStatusCounts[status]++;
            }
        });

        res.status(200).json(taskStatusCounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi server'
        });
    }
});

router.post("/getAllTasksWithDetails", checkAdminRole, async (req, res) => {
    try {
        const tasksRef = db.collection("task");
        const tasksSnapshot = await tasksRef.get();

        const tasksWithDetails = [];

        for (const taskDoc of tasksSnapshot.docs) {
            const taskData = taskDoc.data();
            const taskId = taskDoc.id;

            const feedbackDoc = await db.collection("feedbacks").doc(taskData.feedbackId).get();
            const feedbackData = feedbackDoc.data();

            // Retrieve employee details
            const employeeDoc = await db.collection("user").where("uid", "==", taskData.employeeId).get();
            const employeeName = employeeDoc.docs[0].data().displayName;

            // Retrieve campus name
            const campusDoc = await db.collection("campus").doc(feedbackData.campusId).get();
            const campusName = campusDoc.data().campusName;

            // Retrieve room name
            const roomDoc = await db.collection("room").doc(feedbackData.roomId).get();
            const roomName = roomDoc.data().roomName;

            // // Retrieve facility name
            const facilityDoc = await db.collection("facility").doc(feedbackData.facilityId).get();
            const facilityName = facilityDoc.data().facilityName;

            // Retrieve admin name
            const adminDoc = await db.collection("user").doc(taskData.adminId).get();
            const adminName = adminDoc.data().displayName;

            tasksWithDetails.push({
                taskId,
                employeeName,
                startedAt: taskData.startTimeAt,
                campusName,
                roomName,
                facilityName,
                adminName,
                status: taskData.status
            });
        }

        return res.status(200).json({
            success: true,
            data: tasksWithDetails,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: `Error: ${err}`,
        });
    }
});

module.exports = router;