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
        // Check if the employee has an entry in the employeeStatus collection
        const employeeStatusDoc = await db.collection('employeeStatus').doc(employeeId).get();
        let employeeStatusData = {};

        if (employeeStatusDoc.exists) {
            employeeStatusData = employeeStatusDoc.data();
            // Increment the counts if the fields exist
            employeeStatusData.totalTasksAssigned = (employeeStatusData.totalTasksAssigned || 0) + 1;
            employeeStatusData.tasksInProgress = (employeeStatusData.tasksInProgress || 0) + 1;
        } else {
            // If not, create a new entry with initial values
            employeeStatusData = {
                totalTasksAssigned: 1,
                tasksInProgress: 1,
            };
            await db.collection('employeeStatus').doc(employeeId).set(employeeStatusData);
        }


        switch (feedbackStatus) {
            case "Not Verify":
                description = `Verify feedback ${feedbackId}`
                newFeedbackStatus = "Validating"
                break;
            case "Verified":
                description = `Handle feedback ${feedbackId}`
                newFeedbackStatus = "Processing"
                // Increase the totalTasksAssigned count
                employeeStatusData.totalTasksAssigned++;
                break;
            default:
                break;
        }

        // Check if the status is transitioning from "Ready" to "Working"
        if (employeeStatusData.status === 'Ready') {
            // Update the status to "Working"
            employeeStatusData.status = 'Working';
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

        // Update the tasksInProgress count if the task is in progress
        if (newFeedbackStatus === 'Processing') {
            employeeStatusData.tasksInProgress++;
        }

        // Update the employeeStatus entry
        await db.collection('employeeStatus').doc(employeeId).update(employeeStatusData);

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

        const tasksWithDetails = [];

        for (const taskDoc of tasksSnapshot.docs) {
            const taskData = taskDoc.data();
            const taskId = taskDoc.id;

            const feedbackDoc = await db.collection("feedbacks").doc(taskData.feedbackId).get();
            const feedbackData = feedbackDoc.data();

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
                taskData,
                campusName,
                roomName,
                facilityName,
                adminName,
            });
        }

        return res.status(200).json({
            success: true,
            data: tasksWithDetails,
        });
    } catch (err) {
        return res.status(500).json({
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

                const feedbackStatusDoc = await db.collection('feedbackstatus').doc(feedback.statusId).get()
                const feedbackStatusData = feedbackStatusDoc.data()
                let newFeedbackStatus;
                switch (feedbackStatusData.Status) {
                    case "Validating":
                        newFeedbackStatus = "Not Verify";
                        break;
                    case "Processing":
                        newFeedbackStatus = "Verified";
                        break;
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

router.get('/countTasksByStatus', async (req, res) => {
    try {
        // Count tasks by status
        const taskStatusCounts = {
            Canceled: 0,
            Pending: 0,
            Verified: 0,
            Fixed: 0,
            Reject: 0,
        };

        const tasksSnapshot = await db.collection("task").get();

        tasksSnapshot.forEach(doc => {
            const taskData = doc.data();
            const status = taskData.status;

            if (taskStatusCounts.hasOwnProperty(status)) {
                taskStatusCounts[status]++;
            }
        });

        // Count total feedbacks
        const totalFeedbacksSnapshot = await db.collection("feedbacks").get();
        const totalFeedbacks = totalFeedbacksSnapshot.size;

        // Count feedbacks within the current month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const feedbacksInMonthSnapshot = await db.collection("feedbacks")
            .where("createdAt", ">=", firstDayOfMonth.getTime())
            .where("createdAt", "<=", lastDayOfMonth.getTime())
            .get();
        const feedbacksInMonth = feedbacksInMonthSnapshot.size;

        // Count total users
        const totalUsersSnapshot = await db.collection("user").get();
        const totalUsers = totalUsersSnapshot.size;

        // Count total employees
        const totalEmployeesSnapshot = await db.collection("user").where("roleId", "==", 1698200208313).get();
        const totalEmployees = totalEmployeesSnapshot.size;

        // Get 5 latest feedbacks
        const latestFeedbacksSnapshot = await db.collection("feedbacks")
            .orderBy("createdAt", "desc")
            .limit(5)
            .get();

        const latestFeedbacks = latestFeedbacksSnapshot.docs.map(doc => {
            const feedbackData = doc.data();
            return {
                id: doc.id,
                ...feedbackData,
            };
        });

        const employeeStatusSnapshot = await db.collection('employeeStatus')
            .where('taskCancel', '>', 0) // Chỉ lấy những dòng có taskCancel
            .orderBy('taskCancel', 'desc') // Sắp xếp theo taskCancel giảm dần
            .get();

        const employeeStatusList = [];

        // Lặp qua mỗi dòng dữ liệu và thêm vào mảng
        for (const doc of employeeStatusSnapshot.docs) {
            const employeeStatusData = doc.data();
            const employeeId = doc.data().userID; // id của mỗi dòng sẽ là employeeId

            // Lấy thông tin từ bảng user dựa trên employeeId
            const userDoc = await db.collection('user').doc(employeeId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const displayName = userData.displayName;

                // Thêm thông tin vào mảng
                employeeStatusList.push({
                    employeeId,
                    displayName,
                    ...employeeStatusData
                });
            } else {
                console.warn(`User not found for employeeId: ${employeeId}`);
            }
        }

        const topRoomsSnapshot = await db.collection("feedbacks")
            .get();

        const roomCounts = new Map();

        topRoomsSnapshot.forEach(doc => {
            const roomId = doc.data().roomId;
            if (roomCounts.has(roomId)) {
                roomCounts.set(roomId, roomCounts.get(roomId) + 1);
            } else {
                roomCounts.set(roomId, 1);
            }
        });

        // Chuyển Map sang mảng và sắp xếp theo số lượng phản hồi giảm dần
        const sortedTopRooms = [...roomCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const topRooms = [];

        for (const [roomId, feedbackCount] of sortedTopRooms) {
            // Lấy thông tin chi tiết về phòng
            const roomDoc = await db.collection("room").doc(roomId).get();
            const roomData = roomDoc.data();

            // Lấy thông tin chi tiết về campus
            const campusDoc = await db.collection("campus").doc(roomData.campusId).get();
            const campusName = campusDoc.data().campusName;

            topRooms.push({
                roomName: roomData.roomName,
                campusName,
                feedbackCount,
            });
        }

        const statistics = {
            taskStatusCounts,
            totalFeedbacks,
            feedbacksInMonth,
            totalUsers,
            totalEmployees,
            latestFeedbacks,
            employeeStatusList,
            topRooms
        };

        res.status(200).json(statistics);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
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

router.get("/countTaskStatusByEmployee/:employeeId", async (req, res) => {
    try {
        const employeeId = req.params.employeeId;

        const tasksSnapshot = await db.collection("task")
            .where("employeeId", "==", employeeId)
            .get();

        const taskStatusCounts = {
            Fixed: 0,
            Verified: 0,
            Reject: 0,
            Pending: 0,
        };

        tasksSnapshot.forEach(taskDoc => {
            const taskData = taskDoc.data();
            const status = taskData.status;

            if (taskStatusCounts.hasOwnProperty(status)) {
                taskStatusCounts[status]++;
            }
        });

        // Get employee status
        const employeeStatusDoc = await db.collection('employeeStatus').doc(employeeId).get();

        if (employeeStatusDoc.exists) {
            const employeeStatusData = employeeStatusDoc.data();
            const userId = employeeStatusDoc.data().userID
            // Get user display name
            const userDoc = await db.collection('user').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const displayName = userData.displayName;

                return res.status(200).json({
                    success: true,
                    userId,
                    displayName,
                    employeeStatus: employeeStatusData,
                    taskStatusCounts,
                });
            } else {
                return res.status(404).json({
                    success: false,
                    msg: 'User not found.',
                });
            }
        } else {
            return res.status(404).json({
                success: false,
                msg: 'Employee status not found.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: `Error: ${error}`,
        });
    }
});


module.exports = router;