import { baseURL } from ".";
import axios from "axios";
const adminId = localStorage.getItem("userId");

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
    const res = await axios.get(
      `${baseURL}/api/facility/getAllRoomsInCampus/${campusId}`
    );
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
    const res = await axios.get(
      `${baseURL}/api/facility/getAllFacilityInRoom/${roomId}`
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};
