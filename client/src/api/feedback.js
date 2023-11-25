import { baseURL } from ".";
import axios from "axios";
const adminId = localStorage.getItem("userId");
const uid = localStorage.getItem("uid");

export const createFeedback = async (userId, feedbackData) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/feedbacks/createFeedback/${userId}`,
      feedbackData
    );
    return res.data;
  } catch (err) {
    console.error("Error creating feedback:", err);
    return null;
  }
};

export const getFeedbackWithUser = async (userId) => {
  try {
    const res = await axios.get(
      `${baseURL}/api/feedbacks/getFeedback/${userId}`
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const getAllFeedbacks = async () => {
  try {
    const res = await axios.post(`${baseURL}/api/feedbacks/getAllFeedbacks`, {
      adminId: `${adminId}`,
    });
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const updateFeedbackStatus = async (statusId) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/feedbacks/verifyFeedback/${statusId}`,
      {
        adminId: `${adminId}`,
      }
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getFeedbackWithId = async (feedbackId) => {
  try {
    const res = await axios.get(
      `${baseURL}/api/feedbacks/getFeedbackWithId/${feedbackId}`
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const feedbackHandle = async (feedbackId, employeeComment) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/feedbacks/feedbackHandle/${feedbackId}`,
      {
        employeeComment,
        uid,
      }
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};
