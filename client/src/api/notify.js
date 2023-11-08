import { baseURL } from ".";
import axios from "axios";
const uid = localStorage.getItem("uid");

export const getNotifications = async () => {
  try {
    const res = await axios.get(
      `${baseURL}/api/notify/getNotifications/${uid}`
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};
