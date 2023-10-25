import {
  combineReducers
} from "redux";
import alertReducer from "./alertReducer";
import allUserReducer from "./allUserReducer";
import userReducer from "./userReducer";
import roleReducer from "./roleReducer";
import allRolesReducer from "./allRolesReducer";
import feedbackReducer from "./feedbackReducer";

const myReducer = combineReducers({
  user: userReducer,
  role: roleReducer,
  alert: alertReducer,
  allUsers: allUserReducer,
  allRoles: allRolesReducer,
  feedback: feedbackReducer,
});

export default myReducer;