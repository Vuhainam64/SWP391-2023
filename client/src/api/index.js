import axios from "axios";

export const baseURL =
    "http://127.0.0.1:5001/get-feedback-a0119/us-central1/app";
// "https://us-central1-get-feedback-a0119.cloudfunctions.net/app";

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

export const getAllUser = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/users/all`);
        return res.data.data;
    } catch (err) {
        return null;
    }
};

//Role
export const getAllRoles = async () => {
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

//photos
export const updateProfilePhoto = async (userId, file, token) => {
    try {
        const formData = new FormData();
        formData.append("photo", file);

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };

        const res = await axios.post(`${baseURL}/api/photos/uploadPhoto/${userId}`, formData, config);
        return res.data;
    } catch (err) {
        console.error("Error updating profile photo:", err);
        return null;
    }
};