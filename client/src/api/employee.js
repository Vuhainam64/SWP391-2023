import { baseURL } from ".";
import axios from "axios";

export const updateEmployeeStatus = async (employeeUid, status) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/users/updateEmployeeStatus/${employeeUid}`,
      {
        status,
      }
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};
