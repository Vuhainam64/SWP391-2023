const express = require("express");
const admin = require("firebase-admin");
const db = admin.firestore();
const router = express.Router();

// Import thư viện để xử lý tải lên tệp
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

// Định nghĩa route để tải lên hình ảnh
router.post("/uploadPhoto/:userId", upload.single("photo"), async (req, res) => {
    try {
        const userId = req.params.userId;
        const userRef = db.collection("user").doc(userId);

        // Đảm bảo rằng người dùng tồn tại
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                msg: "Người dùng không tồn tại"
            });
        }

        const photoData = req.file.buffer;

        const userPhotoRef = userRef.collection("photos").doc();
        await userPhotoRef.set({
            photo: photoData
        });

        return res.status(200).json({
            success: true,
            msg: "Hình ảnh đã được tải lên và lưu trữ thành công"
        });
    } catch (error) {
        console.error("Lỗi khi tải lên hình ảnh:", error);
        return res.status(500).json({
            success: false,
            msg: `Error: ${error}`
        });
    }
});

module.exports = router;