const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// Lấy danh sách feedback
router.get('/getAll', async (req, res) => {

    try {
        const querySnapshot = await db.collection('feedbacks').get();

        let feedbacks = [];
        querySnapshot.forEach(doc => {
            feedbacks.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json(feedbacks);

    } catch (error) {
        res.status(500).send(error.message);
    }

});


// Tạo mới feedback
router.post('/create', async (req, res) => {

    try {
        const {
            text,
            image,
            location
        } = req.body;

        const newFeedback = {
            text,
            image,
            location,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('feedbacks').add(newFeedback);

        res.status(201).send({
            id: docRef.id
        });

    } catch (error) {
        res.status(500).send(error.message);
    }

})


module.exports = router;