import axios from "axios";

export const baseURL =
    "https://us-central1-get-feedback-a0119.cloudfunctions.net/app";

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

export const getUserRole = async (userId, token) => {
    try {
        const res = await axios.get(`${baseURL}/api/users/getRole/${userId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        return res.data.role;
    } catch (err) {
        console.error("Error fetching user role:", err);
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