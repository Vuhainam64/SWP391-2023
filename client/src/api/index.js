export const baseURL =
  // "http://127.0.0.1:5001/get-feedback-a0119/us-central1/app";
  "https://us-central1-get-feedback-a0119.cloudfunctions.net/app";

//user
export {
  validateUserJWTToken,
  getAllUserAPI,
  getAllEmployeesWithStatus,
  createUserAPI,
}
from "./user";

//employee
export {
  updateEmployeeStatus
}
from "./employee";

//Role
export {
  createDefaultRole,
  getRoleWithRoleID,
  getAllRolesAPI,
  getUserRole,
  updateRole,
}
from "./role";

//feedbacks
export {
  createFeedback,
  getAllFeedbacks,
  feedbackHandle,
  getFeedbackWithId,
  getFeedbackWithUser,
  updateFeedbackStatus,
}
from "./feedback";

//task
export {
  countTasksByStatus,
  createTask,
  findAvailableEmployees,
  getAllTaskOfEmployee,
  getAllTasksWithDetails,
  countTaskStatusByEmployee,
}
from "./task";
//facility
export {
  createCampus,
  createFacility,
  createRoom,
  getAllCampuses,
  getAllFacilityInRoom,
  getAllRoomsInCampus,
  updateCampus,
  updateRoom,
  updateFacility
}
from "./facility";

//notify
export {
  getNotifications
}
from "./notify";