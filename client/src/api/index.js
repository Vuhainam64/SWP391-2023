import axios from "axios";

export const baseURL =
    "http://127.0.0.1:5001/get-feedback-a0119/us-central1/app";
// "https://us-central1-get-feedback-a0119.cloudfunctions.net/app";

const adminId = localStorage.getItem('userId')
const uid = localStorage.getItem('uid')

//User
export const validateUserJWTToken = async (token) => {
    try {
        const res = await axios.get(`${baseURL}/api/users/jwtVerfication`, {
            headers: {
                Authorization: "Bearer " + token
            },
        });
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const getAllUserAPI = async () => {
    try {
        const res = await axios.post(`${baseURL}/api/users/getAllUsers`, {
            adminId: `${adminId}`
        });
        console.log("adminId: ", adminId)
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const getAllEmployeesWithStatus = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/users/getAllEmployeesWithStatus`, {
            adminId: `${adminId}`
        });
        return res.data.data;
    } catch (err) {
        return null;
    }
};

//employee
export const updateEmployeeStatus = async (employeeUid, status) => {
    try {
        const res = await axios.post(`${baseURL}/api/users/updateEmployeeStatus/${employeeUid}`, {
            status
        });
        return res.data.data;
    } catch (err) {
        return null;
    }
};


//Role
export const createDefaultRole = async (userId) => {
    try {
        const res = await axios.post(`${baseURL}/api/roles/createDefaultRole/${userId}`);
        return res.data;
    } catch (err) {
        return null;
    }
};

export const getAllRolesAPI = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/roles/getAllRoles`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const updateRole = async (userId, newRoleID) => {
    try {
        const res = await axios.post(`${baseURL}/api/roles/updateUserRole/${userId}`, {
            adminId: `${adminId}`,
            newRoleId: newRoleID
        });
        return res.data;
    } catch (err) {
        console.error("Error updating user role:", err);
        return null;
    }
};

export const getUserRole = async (userId, token) => {
    try {
        const res = await axios.get(`${baseURL}/api/roles/getRole/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data.data.role_name;
    } catch (err) {
        console.error("Error fetching user role:", err);
        return null;
    }
};

export const getRoleWithRoleID = async (roleId) => {
    try {
        const res = await axios.get(`${baseURL}/api/roles/getRole/${roleId}`);
        return res.data.data.role_name;
    } catch (err) {
        return null;
    }
};

//feedbacks
export const createFeedback = async (userId, feedbackData) => {
    try {
        const res = await axios.post(`${baseURL}/api/feedbacks/createFeedback/${userId}`, feedbackData);
        return res.data;
    } catch (err) {
        console.error("Error creating feedback:", err);
        return null;
    }
};

export const getFeedbackWithUser = async (userId) => {
    try {
        const res = await axios.get(`${baseURL}/api/feedbacks/getFeedback/${userId}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const getAllFeedbacks = async () => {
    try {
        const res = await axios.post(`${baseURL}/api/feedbacks/getAllFeedbacks`, {
            adminId: `${adminId}`
        });
        return res.data.data;
    } catch (err) {
        return null;
    }
};


export const updateFeedbackStatus = async (statusId) => {
    try {
        const res = await axios.post(`${baseURL}/api/feedbacks/verifyFeedback/${statusId}`, {
            adminId: `${adminId}`,
        });
        return res.data;
    } catch (err) {
        return null;
    }
};

export const getFeedbackWithId = async (feedbackId) => {
    try {
        const res = await axios.get(`${baseURL}/api/feedbacks/getFeedbackWithId/${feedbackId}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const feedbackHandle = async (feedbackId, employeeComment) => {
    try {
        const res = await axios.post(`${baseURL}/api/feedbacks/feedbackHandle/${feedbackId}`, {
            employeeComment
        });
        return res.data.data;
    } catch (err) {
        return null;
    }
};

//task
export const createTask = async (useruid, feedbackStatus, feedbackId) => {
    try {
        const res = await axios.post(`${baseURL}/api/tasks/createTask/${useruid}`, {
            adminId: `${adminId}`,
            feedbackStatus,
            feedbackId,
        });
        return res.data;
    } catch (err) {
        return null;
    }
};

export const getAllTaskOfEmployee = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/tasks/getAllTaskOfEmployee/${uid}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

//facility
export const createCampus = async (campusName, tag) => {
    try {
        const res = await axios.post(`${baseURL}/api/facility/createCampus`, {
            adminId: `${adminId}`,
            campusName,
            tag,
        });
        return res.data;
    } catch (err) {
        return null;
    }
};

export const getAllCampuses = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/facility/getAllCampuses`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const createRoom = async (campusId, roomName) => {
    try {
        const res = await axios.post(`${baseURL}/api/facility/createRoom`, {
            adminId: `${adminId}`,
            campusId,
            roomName,
        });
        return res.data;
    } catch (err) {
        return null;
    }
};

export const getAllRoomsInCampus = async (campusId) => {
    try {
        const res = await axios.get(`${baseURL}/api/facility/getAllRoomsInCampus/${campusId}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const createFacility = async (roomId, facilityName) => {
    try {
        const res = await axios.post(`${baseURL}/api/facility/createFacility`, {
            adminId: `${adminId}`,
            roomId,
            facilityName,
        });
        return res.data;
    } catch (err) {
        return null;
    }
};

export const getAllFacilityInRoom = async (roomId) => {
    try {
        const res = await axios.get(`${baseURL}/api/facility/getAllFacilityInRoom/${roomId}`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};