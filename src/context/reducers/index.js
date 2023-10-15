import { combineReducers } from "redux";
import userAuthReducer from "./userAuthReducer";
import alertReducer from "./alertReducer";

const myReducer = combineReducers({
  user: userAuthReducer,
  alert: alertReducer,
});

export default myReducer;
