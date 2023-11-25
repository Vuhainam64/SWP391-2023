const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const nodemailer = require("nodemailer");
db.settings({
    ignoreUndefinedProperties: true
});

router.get("/", (req, res) => {
    return res.send("Inside the user router");
});

router.get("/jwtVerfication", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({
            msg: "Token Not Found"
        });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedValue = await admin.auth().verifyIdToken(token);
        if (!decodedValue) {
            return res
                .status(500)
                .json({
                    success: false,
                    msg: "Unauthorized access"
                });
        }
        return res.status(200).json({
            success: true,
            data: decodedValue
        });
    } catch (err) {
        return res.send({
            success: false,
            msg: `Error in extracting the token : ${err}`,
        });
    }
});

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

// Route lấy tất cả users
router.post("/getAllUsers", checkAdminRole, async (req, res) => {
    try {
        const usersRef = db.collection("user");
        const snapshot = await usersRef.get();
        let users = [];
        snapshot.forEach(doc => {
            let user = doc.data();
            user.id = doc.id;
            users.push(user);
        });
        res.status(200).send({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }

});

// Route lấy tất cả employees và status của họ
router.get("/getAllEmployeesWithStatus", async (req, res) => {
    try {
        const usersRef = db.collection("user");
        const usersSnapshot = await usersRef.where("roleId", "==", 1698200208313).get();

        const employeesWithStatus = [];

        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const userId = userDoc.id;

            const employeeStatusId = userData.uid; // Lấy uid từ thông tin người dùng

            if (employeeStatusId) {
                const employeeStatusDoc = await db.collection("employeeStatus").doc(employeeStatusId).get();
                const employeeStatusData = employeeStatusDoc.data();

                // Kết hợp thông tin user và status
                const employeeWithStatus = {
                    id: userId,
                    ...userData,
                    status: employeeStatusData || {
                        lastUpdated: null,
                        status: null
                    }
                };

                employeesWithStatus.push(employeeWithStatus);
            }
        }

        res.status(200).json({
            success: true,
            data: employeesWithStatus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


router.get("/getAllEmployees", async (req, res) => {
    try {
        const usersRef = db.collection("user");
        const usersSnapshot = await usersRef.get();

        const employees = [];

        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.roleId === 1698200208313) {
                // Kiểm tra nếu vai trò của người dùng là nhân viên (sử dụng roleID)
                employees.push({
                    id: doc.id,
                    ...userData
                });
            }
        });

        res.status(200).json({
            success: true,
            data: employees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// API cập nhật status employee 
router.post('/updateEmployeeStatus/:empId', async (req, res) => {
    const empId = req.params.empId;
    const newStatus = req.body.status;
    try {
        await db.collection('employeeStatus')
            .doc(empId)
            .update({
                status: newStatus
            });

        return res.status(200).json({
            message: "Employee status updated successfully"
        });

    } catch (error) {
        // handle error 
    }
});

// Route to create users and send signup link emails
router.post("/createUsers", checkAdminRole, async (req, res) => {
    const usersData = req.body.users;

    try {
        const createdUsers = [];

        for (const user of usersData) {
            const {
                email,
                role
            } = user;

            // Map role name to roleId (assuming roles are stored in a separate collection)
            const roleSnapshot = await db.collection("roles").where("role_name", "==", role).get();
            let roleId;

            if (!roleSnapshot.empty) {
                // Convert roleId to a number
                roleId = parseInt(roleSnapshot.docs[0].id, 10);
            } else {
                console.error(`Role '${role}' not found`);
                continue; // Skip creating the user if the role is not found
            }

            // Generate a random password
            const password = generateRandomPassword();

            // Extract the characters before '@' in the email as displayName
            const displayName = email.split('@')[0];

            // Create user in Firebase Authentication
            const authUser = await admin.auth().createUser({
                email,
                emailVerified: false,
                password,
                displayName,
                disabled: false,
            });

            // Save user information to Firestore
            await db.collection("user").doc(authUser.uid).set({
                displayName,
                email,
                roleId: roleId, // Save roleId as a number
                creationTime: authUser.metadata.creationTime,
            });

            // Send signup link email
            await sendSignupEmail(email, password, role);

            createdUsers.push({
                uid: authUser.uid,
                email: authUser.email,
                password,
                displayName,
                // Add other relevant user information if needed
            });

            // Check if the user has the "employee" role
            if (role === "employee") {
                // Create an entry in the employeeStatus collection
                await createEmployeeStatusEntry(authUser.uid, email);
            }
        }

        res.status(200).json({
            success: true,
            data: {
                createdUsers,
            },
        });
    } catch (error) {
        console.error("Error creating users:", error);
        res.status(500).json({
            success: false,
            msg: "Error creating users",
        });
    }
});

// Function to create an entry in the employeeStatus collection
const createEmployeeStatusEntry = async (uid, email) => {
    try {
        const employeeStatusRef = db.collection("employeeStatus").doc(email);
        const employeeStatusData = {
            lastUpdate: Date.now(),
            status: "Ready",
            userID: uid,
        };

        await employeeStatusRef.set(employeeStatusData, {
            merge: true
        });
    } catch (error) {
        console.error("Error creating employee status entry:", error);
        throw error;
    }
};




// Function to generate a random password
const generateRandomPassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
};


// Function to send the signup link email
const sendSignupEmail = async (email, password, roleName) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "vuhainam272@gmail.com",
            pass: "obck fdrj bmlf wwjd",
        },
    });

    const loginLink = "http://localhost:3000/auth";
    const mailOptions = {
        from: "getfeedback@gmail.com",
        to: email,
        subject: "Account Information",
        text: `Your account has been created.\n\nEmail: ${email}\nPassword: ${password}\nRole: ${roleName}\n\nYou can use these credentials to log in.\nLogin Link: ${loginLink}`,
    };

    await transporter.sendMail(mailOptions);
};


module.exports = router;