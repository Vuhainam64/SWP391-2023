const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// Tạo tuyến đường để lấy thông báo của người dùng
router.get('/getNotifications/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Truy vấn thông báo (notifies) của người dùng dựa trên userId
        const notifiesSnapshot = await db.collection('notifies')
            .where('userId', '==', userId)
            .get();

        const notifications = [];

        notifiesSnapshot.forEach(doc => {
            const notifyData = doc.data();
            notifications.push({
                notifyId: doc.id,
                userId: notifyData.userId,
                feedbackId: notifyData.feedbackId,
                feedbackName: notifyData.feedbackName,
                createdAt: notifyData.createdAt,
                description: notifyData.description
            });
        });

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;