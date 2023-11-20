import {
  baseURL
} from ".";
import axios from "axios";
const adminId = localStorage.getItem("userId");

export const createDefaultRole = async (userId) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/roles/createDefaultRole/${userId}`
    );
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
    const res = await axios.post(
      `${baseURL}/api/roles/updateUserRole/${userId}`, {
        adminId: `${adminId}`,
        newRoleId: newRoleID,
      }
    );
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
        Authorization: `Bearer ${token}`,
      },
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