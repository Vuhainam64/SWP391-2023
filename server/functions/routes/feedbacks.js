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

// Lấy danh sách feedback
router.post("/getAllFeedbacks", checkAdminRole, async (req, res) => {
    try {
        const feedbacksSnapshot = await db.collection("feedbacks").get();

        const feedbacks = [];

        for (const doc of feedbacksSnapshot.docs) {
            const feedback = doc.data();
            const feedbackId = doc.id;

            // Lấy campus name
            const campusDoc = await db.collection("campus").doc(feedback.campusId).get();
            const campusName = campusDoc.data().campusName;

            // Lấy room name
            const roomDoc = await db.collection("room").doc(feedback.roomId).get();
            const roomName = roomDoc.data().roomName;

            // Lấy facility name  
            const facilityDoc = await db.collection("facility").doc(feedback.facilityId).get();
            const facilityName = facilityDoc.data().facilityName;

            // Lấy status của feedback
            const statusDoc = await db.collection("feedbackstatus").doc(feedback.statusId).get();
            const statusData = statusDoc.data();

            // Lấy thông tin người gửi
            const userDocs = await db.collection("user")
                .where("uid", "==", feedback.createdBy)
                .get();

            const users = [];

            userDocs.forEach((userDoc) => {
                const user = userDoc.data();
                users.push(user);
            });

            feedbacks.push({
                feedbackId,
                campusName,
                roomName,
                facilityName,
                feedbackstatus: statusData,
                user: users,
                ...feedback
            });

        }

        return res.status(200).send({
            success: true,
            data: feedbacks,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`
        });
    }
});


// Tạo mới feedback
router.post('/createFeedback/:userId', async (req, res) => {
    const userId = req.params.userId;
    const {
        title,
        content,
        campusId,
        roomId,
        facilityId,
        imageURL,
    } = req.body;

    // Validate input
    if (!title || !content || !campusId || !roomId || !facilityId) {
        return res.status(400).json({
            message: 'Title and content,... are required'
        });
    }

    try {
        // Check if there is existing feedback for the same facility in the same room in the same campus
        const existingFeedbacksSnapshot = await db.collection("feedbacks")
            .where("campusId", "==", campusId)
            .where("roomId", "==", roomId)
            .where("facilityId", "==", facilityId)
            .get();

        // If there are existing feedbacks, check their status
        if (!existingFeedbacksSnapshot.empty) {
            const hasUnresolvedFeedback = existingFeedbacksSnapshot.docs.some(doc => {
                const feedbackData = doc.data();
                return feedbackData.status !== "Fixed" && feedbackData.status !== "Reject";
            });

            if (hasUnresolvedFeedback) {
                return res.status(400).json({
                    message: 'Cannot provide feedback for the same facility in the same room in the same campus if there is unresolved feedback.'
                });
            }
        }

        // Create the status document first
        const newStatus = {
            Status: "Not Verify",
            updatedAt: Date.now()
        };
        const docStatusRef = await db.collection('feedbackstatus').add(newStatus);

        // Create the feedback document with the status reference
        const newFeedback = {
            title,
            content,
            campusId,
            roomId,
            facilityId,
            imageURL,
            statusId: docStatusRef.id,
            createdBy: userId,
            createdAt: Date.now()
        };
        const docFeedbackRef = await db.collection('feedbacks').add(newFeedback);

        // Tạo thông báo (notify)
        const notify = {
            userId: userId,
            feedbackId: docFeedbackRef.id,
            feedbackName: title,
            description: "New Feedback had been created",
            createdAt: Date.now()
        };
        const notifyDocRef = await db.collection('notifies').add(notify);

        res.status(201).json({
            feedbackId: docFeedbackRef.id,
            statusId: docStatusRef.id,
            notifyId: notifyDocRef.id, // Trả về notifyId
            message: 'Feedback created successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Hàm để lấy danh sách phản hồi của một người dùng dựa trên userId và kèm theo trạng thái
router.get("/getFeedback/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Tìm tất cả các phản hồi mà createdBy field khớp với userId
        const feedbacksSnapshot = await db.collection("feedbacks")
            .where("createdBy", "==", userId)
            .get();

        const feedbacks = [];

        for (const doc of feedbacksSnapshot.docs) {
            const feedbackData = doc.data();
            const feedbackId = doc.id;

            // Tìm trạng thái của phản hồi dựa trên statusId
            const statusDoc = await db.collection("feedbackstatus").doc(feedbackData.statusId).get();
            const statusData = statusDoc.data();

            feedbacks.push({
                feedbackId,
                ...feedbackData,
                status: statusData
            });
        }

        return res.status(200).send({
            success: true,
            data: feedbacks,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`
        });
    }
});

// Update the status of a feedback
router.post("/verifyFeedback/:statusId", checkAdminRole, async (req, res) => {
    const statusId = req.params.statusId;

    if (!statusId) {
        return res.status(400).send({
            success: false,
            msg: "statusId is required."
        });
    }

    try {
        // Truy vấn để cập nhật vai trò của người dùng
        await db.collection("feedbackstatus").doc(statusId).update({
            Status: "Verified", // Cập nhật trường newStatus với vai trò mới
            updatedAt: Date.now()
        });

        return res.status(200).send({
            success: true,
            msg: "New status updated successfully."
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`
        });
    }
});

router.get("/getFeedbackWithId/:feedbackId", async (req, res) => {
    try {
        const feedbackId = req.params.feedbackId;

        // Tìm phản hồi theo feedbackId
        const feedbackDoc = await db.collection("feedbacks").doc(feedbackId).get();

        if (!feedbackDoc.exists) {
            return res.status(404).send({
                success: false,
                msg: "Feedback not found.",
            });
        }

        const feedbackData = feedbackDoc.data();
        // Lấy campus name
        const campusDoc = await db.collection("campus").doc(feedbackData.campusId).get();
        const campusName = campusDoc.data().campusName;

        // Lấy room name
        const roomDoc = await db.collection("room").doc(feedbackData.roomId).get();
        const roomName = roomDoc.data().roomName;

        // Lấy facility name  
        const facilityDoc = await db.collection("facility").doc(feedbackData.facilityId).get();
        const facilityName = facilityDoc.data().facilityName;

        // Tìm trạng thái của phản hồi dựa trên statusId
        const statusDoc = await db.collection("feedbackstatus").doc(feedbackData.statusId).get();
        const statusData = statusDoc.data();

        const response = {
            feedbackId: feedbackId,
            campusName,
            roomName,
            facilityName,
            ...feedbackData,
            feedbackstatus: statusData
        };

        return res.status(200).send({
            success: true,
            data: response,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`
        });
    }
});

router.post("/feedbackHandle/:feedbackId", async (req, res) => {
    const feedbackId = req.params.feedbackId;
    const {
        employeeComment,
        uid
    } = req.body;

    try {
        const feedbackDoc = await db.collection("feedbacks").doc(feedbackId).get();

        if (!feedbackDoc.exists) {
            return res.status(404).send({
                error: "Feedback not found"
            });
        }

        // Fetch employeeStatus document
        const employeeStatusDoc = await db.collection("employeeStatus").doc(uid).get();

        // Default values for updateData
        let description, status, updateData;

        switch (employeeComment) {
            case "verify":
                description = `Verified feedback ${feedbackId}`;
                status = "Verified";
                updateData = {
                    Status: status,
                    updatedAt: Date.now()
                };
                break;
            case "reject":
                description = `Reject feedback ${feedbackId}`;
                status = "Reject";
                updateData = {
                    Status: status,
                    updatedAt: Date.now()
                };
                break;
            case "fixed":
                description = `Fixed feedback ${feedbackId}`;
                status = "Fixed";
                updateData = {
                    Status: status,
                    updatedAt: Date.now()
                };
                break;
            case "not fixed":
                description = `Not fixed feedback ${feedbackId}`;
                status = "Not Verify";
                updateData = {
                    Status: status,
                    updatedAt: Date.now()
                };
                break;
            case "cancel":
                description = `Cancel feedback ${feedbackId}`;
                status = "Not Verify";
                updateData = {
                    Status: status,
                    updatedAt: Date.now()
                };

                let taskCancel = 1;

                if (employeeStatusDoc.exists) {
                    const currentTaskCancel = employeeStatusDoc.data().taskCancel;

                    if (!isNaN(currentTaskCancel)) {
                        taskCancel = currentTaskCancel + 1;
                    }
                }

                // Update employeeStatus
                await db.collection("employeeStatus").doc(uid).update({
                    taskCancel: taskCancel,
                    tasksInProgress: employeeStatusDoc.exists ? employeeStatusDoc.data().tasksInProgress - 1 : 0,
                    status: (employeeStatusDoc.data().tasksInProgress - 1 === 0) ? "Ready" : employeeStatusDoc.data().status,
                });

                break;
            default:
                return res.status(400).send({
                    error: "Invalid employee comment"
                });
        }

        // Update employeeStatus
        if (employeeComment !== "verify") {
            await db.collection("employeeStatus").doc(uid).update({
                tasksInProgress: employeeStatusDoc.exists ? employeeStatusDoc.data().tasksInProgress - 1 : 0,
            });
        }

        // Update feedbackstatus
        await db.collection("feedbackstatus").doc(feedbackDoc.data().statusId).update(updateData);

        // Update feedbacks
        await db.collection("feedbacks").doc(feedbackId).update({
            description,
            updatedAt: Date.now()
        });

        // Update tasks associated with the feedback
        await db.collection("task")
            .where("feedbackId", "==", feedbackId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.update({
                        description,
                        status: status,
                        updatedAt: Date.now()
                    });
                });
            });

        // Notify user
        const notify = {
            userId: feedbackDoc.data().createdBy,
            feedbackId: feedbackId,
            feedbackName: feedbackDoc.data().title,
            description: "The Feedback has been updated",
            createdAt: Date.now()
        };
        await db.collection('notifies').add(notify);

        res.send({
            success: true,
            data: `Feedback ${feedbackId} updated with status: ${status}`
        });

    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).send({
            error: "Error updating feedback"
        });
    }
});




module.exports = router;