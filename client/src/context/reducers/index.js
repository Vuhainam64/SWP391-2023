import {
  combineReducers
} from "redux";
import alertReducer from "./alertReducer";
import allUserReducer from "./allUserReducer";
import userReducer from "./userReducer";
import roleReducer from "./roleReducer";
import allRolesReducer from "./allRolesReducer";
import feedbackReducer from "./feedbackReducer";
import allFeedbackReducer from "./allFeedbackReducer";
import allEmployeeReducer from "./allEmployeeReducer";
import allTasksReducer from "./allTaskReducer";
import taskDetailsReducer from "./taskDetailsReducer";
import allNotifyReducer from "./allNotifyReducer";

const myReducer = combineReducers({
  user: userReducer,
  role: roleReducer,
  alert: alertReducer,
  allUsers: allUserReducer,
  allRoles: allRolesReducer,
  feedback: feedbackReducer,
  allFeedbacks: allFeedbackReducer,
  allEmployee: allEmployeeReducer,
  allTasks: allTasksReducer,
  taskDetails: taskDetailsReducer,
  allNotify: allNotifyReducer,
});

export default myReducer;