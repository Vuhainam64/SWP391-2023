import {
  combineReducers
} from "redux";
import alertReducer from "./alertReducer";
import allUserReducer from "./allUserReducer";
import userReducer from "./userReducer";
import roleReducer from "./roleReducer";
import allRolesReducer from "./allRolesReducer";

const myReducer = combineReducers({
  user: userReducer,
  role: roleReducer,
  alert: alertReducer,
  allUsers: allUserReducer,
  allRoles: allRolesReducer,
});

export default myReducer;