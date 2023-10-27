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
            const feedbackData = doc.data();
            const feedbackId = doc.id;

            // Tìm trạng thái của phản hồi dựa trên statusId
            const statusDoc = await db.collection("feedbackstatus").doc(feedbackData.statusId).get();
            const statusData = statusDoc.data();

            feedbacks.push({
                feedbackId,
                ...feedbackData,
                feedbackstatus: statusData
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
        location,
        imageURL,
    } = req.body;

    // Validate input
    if (!title || !content) {
        return res.status(400).json({
            message: 'Title and content are required'
        })
    }

    try {
        // Create the status document first
        const newStatus = {
            Status: "Not Verify",
            updatedAt: Date.now()
        }
        const docStatusRef = await db.collection('feedbackstatus').add(newStatus);

        // Create the feedback document with the status reference
        const newFeedback = {
            title,
            content,
            location,
            imageURL,
            statusId: docStatusRef.id,
            createdBy: userId,
            createdAt: Date.now()
        }
        const docFeedbackRef = await db.collection('feedbacks').add(newFeedback);

        res.status(201).json({
            feedbackId: docFeedbackRef.id,
            statusId: docStatusRef.id,
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

module.exports = router;