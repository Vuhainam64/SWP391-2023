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

const myReducer = combineReducers({
  user: userReducer,
  role: roleReducer,
  alert: alertReducer,
  allUsers: allUserReducer,
  allRoles: allRolesReducer,
  feedback: feedbackReducer,
  allFeedbacks: allFeedbackReducer,
  allEmployee: allEmployeeReducer,
});

export default myReducer;