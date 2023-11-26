import {
  baseURL
} from ".";
import axios from "axios";
const adminId = localStorage.getItem("userId");
const uid = localStorage.getItem("uid");

export const createTask = async (
  employeeId,
  startTimeAt,
  feedbackStatus,
  feedbackId
) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/tasks/createTask/${employeeId}`, {
        adminId: `${adminId}`,
        startTimeAt,
        feedbackStatus,
        feedbackId,
      }
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getAllTaskOfEmployee = async () => {
  try {
    const res = await axios.get(
      `${baseURL}/api/tasks/getAllTaskOfEmployee/${uid}`
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const findAvailableEmployees = async (startTimeAt) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/tasks/findAvailableEmployees`, {
        adminId: `${adminId}`,
        startTimeAt,
      }
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const countTasksByStatus = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/tasks/countTasksByStatus`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getAllTasksWithDetails = async () => {
  try {
    const res = await axios.post(
      `${baseURL}/api/tasks/getAllTasksWithDetails`, {
        adminId: `${adminId}`,
      }
    );
    console.log("data: ", res.data.data);
    return res.data.data;
  } catch (err) {
    return null;
  }
};
export const countTaskStatusByEmployee = async () => {
  try {
    const res = await axios.get(
      `${baseURL}/api/tasks/countTaskStatusByEmployee/${uid}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};