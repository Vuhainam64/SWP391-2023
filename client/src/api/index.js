import axios from "axios";

export const baseURL =
    "http://127.0.0.1:5001/get-feedback-a0119/us-central1/app";

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

export const getAllUser = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/users/all`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

export const updateRole = async (userId, newRole, token) => {
    try {
        const res = await axios.post(`${baseURL}/api/users/make-${newRole}/${userId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (err) {
        console.error("Error updating user role:", err);
        return null;
    }
};