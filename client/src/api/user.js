import {
  baseURL
} from ".";
import axios from "axios";
const adminId = localStorage.getItem("userId");

//User
export const validateUserJWTToken = async (token) => {
  try {
    const res = await axios.get(`${baseURL}/api/users/jwtVerfication`, {
      headers: {
        Authorization: "Bearer " + token,
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
      adminId: `${adminId}`,
    });
    console.log("adminId: ", adminId);
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const getAllEmployeesWithStatus = async () => {
  try {
    const res = await axios.get(
      `${baseURL}/api/users/getAllEmployeesWithStatus`, {
        adminId: `${adminId}`,
      }
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const createUserAPI = async (userData) => {
  try {
    const res = await axios.post(`${baseURL}/api/users/createUsers`, {
      adminId: `${adminId}`,
      users: userData,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};