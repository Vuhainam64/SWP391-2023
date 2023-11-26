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

// Utility function to check for whitespace or special characters
const isValidName = (name) => {
    // Check if the name contains only letters, numbers, and underscores
    return /^[a-zA-Z0-9_]+$/.test(name.trim());
};

router.post("/createCampus", checkAdminRole, async (req, res) => {
    try {
        const {
            campusName,
            tag
        } = req.body;

        // Validate input
        if (!campusName || !tag || !isValidName(campusName) || !isValidName(tag)) {
            return res.status(400).json({
                message: "Invalid input. Campus and tag names must not contain whitespace or special characters.",
            });
        }

        // Check if campus with the same name already exists
        const existingCampus = await db.collection("campus").where("campusName", "==", campusName).get();
        if (!existingCampus.empty) {
            return res.status(400).json({
                message: "Campus with the same name already exists",
            });
        }

        const campusData = {
            campusName,
            tag,
        };

        // Add a new campus document
        const campusRef = await db.collection("campus").add(campusData);
        const campusId = campusRef.id;

        res.status(201).json({
            campusId,
            message: "Campus created successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


router.post('/updateCampus/:campusId', async (req, res) => {
    try {
        const {
            newData
        } = req.body;
        const campusId = req.params.campusId;

        await db.collection('campus').doc(campusId).update(newData);

        res.status(200).json({
            success: true,
            message: 'Campus updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Create a New Room
router.post("/createRoom", checkAdminRole, async (req, res) => {
    try {
        const {
            campusId,
            roomName
        } = req.body;

        // Validate input
        if (!campusId || !roomName || !isValidName(roomName)) {
            return res.status(400).json({
                message: "Invalid input. Room name must not contain whitespace or special characters.",
            });
        }

        // Check if room with the same name in the same campus already exists
        const existingRoom = await db.collection("room").where("campusId", "==", campusId).where("roomName", "==", roomName).get();
        if (!existingRoom.empty) {
            return res.status(400).json({
                message: "Room with the same name in the same campus already exists",
            });
        }

        const roomData = {
            campusId,
            roomName,
        };

        // Add a new room document
        const roomRef = await db.collection("room").add(roomData);
        const roomId = roomRef.id;

        res.status(201).json({
            roomId,
            message: "Room created successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// Create a New Facility
router.post("/createFacility", checkAdminRole, async (req, res) => {
    try {
        const {
            roomId,
            facilityName
        } = req.body;

        // Validate input
        if (!roomId || !facilityName || !isValidName(facilityName)) {
            return res.status(400).json({
                message: "Invalid input. Facility name must not contain whitespace or special characters.",
            });
        }

        // Check if facility with the same name in the same room already exists
        const existingFacility = await db.collection("facility").where("roomId", "==", roomId).where("facilityName", "==", facilityName).get();
        if (!existingFacility.empty) {
            return res.status(400).json({
                message: "Facility with the same name in the same room already exists",
            });
        }

        const facilityData = {
            roomId,
            facilityName,
        };

        // Add a new facility document
        const facilityRef = await db.collection("facility").add(facilityData);
        const facilityId = facilityRef.id;

        res.status(201).json({
            facilityId,
            message: "Facility created successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// Get All Campuses
router.get("/getAllCampuses", async (req, res) => {
    try {
        const campusesSnapshot = await db.collection("campus").get();
        const campuses = [];

        campusesSnapshot.forEach((doc) => {
            const campusData = doc.data();
            const campusId = doc.id;
            campuses.push({
                campusId,
                ...campusData
            });
        });

        res.status(200).json({
            success: true,
            data: campuses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
});

// Get All Rooms in a Campus
router.get("/getAllRoomsInCampus/:campusId", async (req, res) => {
    try {
        const campusId = req.params.campusId;

        // Query the rooms collection to get all rooms in the specified campus
        const roomsSnapshot = await db.collection("room")
            .where("campusId", "==", campusId)
            .get();

        const rooms = [];

        roomsSnapshot.forEach((doc) => {
            const roomData = doc.data();
            const roomId = doc.id;
            rooms.push({
                roomId,
                ...roomData
            });
        });

        res.status(200).json({
            success: true,
            data: rooms,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
});

// Update Room
router.post('/updateRoom/:roomId', checkAdminRole, async (req, res) => {
    try {
        const {
            newData
        } = req.body;
        const roomId = req.params.roomId;

        await db.collection('room').doc(roomId).update(newData);

        res.status(200).json({
            success: true,
            message: 'Room updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get("/getAllFacilityInRoom/:roomId", async (req, res) => {
    try {
        const roomId = req.params.roomId;

        // Query the facilities collection to get all facilities in the specified room
        const facilitiesSnapshot = await db.collection("facility")
            .where("roomId", "==", roomId)
            .get();

        const facilities = [];

        facilitiesSnapshot.forEach((doc) => {
            const facilityData = doc.data();
            const facilityId = doc.id;
            facilities.push({
                facilityId,
                ...facilityData
            });
        });

        res.status(200).json({
            success: true,
            data: facilities, // Update this variable to facilities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
});

// Update Facility
router.post('/updateFacility/:facilityId', checkAdminRole, async (req, res) => {
    try {
        const {
            newData
        } = req.body;
        const facilityId = req.params.facilityId;

        await db.collection('facility').doc(facilityId).update(newData);

        res.status(200).json({
            success: true,
            message: 'Facility updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


module.exports = router;