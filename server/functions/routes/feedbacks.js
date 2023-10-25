const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// Lấy danh sách feedback
router.get("/getAllFeedbacks", async (req, res) => {
    try {
        const feedbacksSnapshot = await db.collection("feedbacks").get();

        const feedbacks = [];

        feedbacksSnapshot.forEach((doc) => {
            const feedbackData = doc.data();
            feedbacks.push(feedbackData);
        });

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
        const docStatusRef = await db.collection('status').add(newStatus);

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
            const statusDoc = await db.collection("status").doc(feedbackData.statusId).get();
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

module.exports = router;