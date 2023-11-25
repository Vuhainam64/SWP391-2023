import {
  AiOutlineCalendar,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineSetting,
} from "react-icons/ai";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineKeyboardArrowDown,
  MdPeople,
  MdSpaceDashboard,
} from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  buttonClick,
  isActiveStyles,
  isNotActiveStyles,
  slideUpOut,
} from "../../animations";
import { Logo } from "../../assets";

function DBLeftSection() {
  const [isUser, setIsUser] = useState(false);
  const [isFeedback, setIsFeedback] = useState(false);
  const [isFacility, setIsFacility] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  return (
    <div className="flex flex-col items-center pt-4 pl-4 text-sky-800 bg-slate-100 h-full">
      <div className="flex items-center w-full justify-between font-semibold text-xl">
        <Link to={"/home"}>
          <img src={Logo} alt="logo" className="w-8 h-8" />
        </Link>
        <p>Menu</p>
        <motion.div {...buttonClick} className="px-4">
          <AiOutlineClose className="cursor-pointer" />
        </motion.div>
      </div>
      <div className="p-2 w-full mt-5">
        {/* home  */}
        <Link
          to={"/admin/"}
          className="flex items-center py-2 hover:bg-slate-200 p-2"
        >
          <div className="flex items-center">
            <AiOutlineHome />
            <p className="px-1">Home</p>
          </div>
        </Link>
        {/* user managament */}
        <div>
          <div
            onClick={() => {
              setIsUser(!isUser);
            }}
            className="flex flex-wrap items-center justify-between py-2 hover:bg-slate-200 p-2"
          >
            <div className="flex items-center">
              <MdPeople className="text-xl" />
              <p className="px-1">User management</p>
            </div>
            {isUser ? (
              <MdOutlineKeyboardArrowDown className="text-2xl" />
            ) : (
              <MdOutlineArrowBackIosNew />
            )}
          </div>
          <motion.div
            {...slideUpOut}
            className={`flex flex-col ${!isUser ? "hidden" : "block"}`}
          >
            <NavLink
              to={"/admin/users"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold `
                  : isNotActiveStyles
              }
            >
              Users
            </NavLink>
            <NavLink
              to={"/admin/create-user"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Create User
            </NavLink>
            <NavLink
              to={"/admin/employee"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Employee
            </NavLink>
            <NavLink
              to={"/admin/roles"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Roles
            </NavLink>
          </motion.div>
        </div>
        {/* View Feedback  */}
        <div>
          <div
            onClick={() => {
              setIsFeedback(!isFeedback);
            }}
            className="flex flex-wrap items-center justify-between py-2 hover:bg-slate-200 p-2"
          >
            <div className="flex items-center">
              <VscFeedback />

              <p className="px-1">View Feedback</p>
            </div>
            {isFeedback ? (
              <MdOutlineKeyboardArrowDown className="text-2xl" />
            ) : (
              <MdOutlineArrowBackIosNew />
            )}
          </div>
          <motion.div
            {...slideUpOut}
            className={`flex flex-col ${!isFeedback ? "hidden" : "block"}`}
          >
            <NavLink
              to={"/admin/verify-feedback"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Handle Feedback
            </NavLink>
            {/* <NavLink
              to={"/admin/feedback-handle"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Handle Feedback
            </NavLink> */}
          </motion.div>
        </div>
        {/* facility  */}
        <div>
          <div
            onClick={() => {
              setIsFacility(!isFacility);
            }}
            className="flex flex-wrap items-center justify-between py-2 hover:bg-slate-200 p-2"
          >
            <div className="flex items-center">
              <MdSpaceDashboard className="text-xl" />
              <p className="px-1">Facility management</p>
            </div>
            {isFacility ? (
              <MdOutlineKeyboardArrowDown className="text-2xl" />
            ) : (
              <MdOutlineArrowBackIosNew />
            )}
          </div>
          <motion.div
            {...slideUpOut}
            className={`flex flex-col ${!isFacility ? "hidden" : "block"}`}
          >
            <NavLink
              to={"/admin/campus"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Campus
            </NavLink>
            <NavLink
              to={"/admin/room"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Room
            </NavLink>
            <NavLink
              to={"/admin/facility"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Facility
            </NavLink>
          </motion.div>
        </div>
        {/* Calendar  */}
        <Link
          to={"/admin/calendar"}
          className="flex items-center py-2 hover:bg-slate-200 p-2"
        >
          <div className="flex items-center">
            <AiOutlineCalendar />
            <p className="px-1">Calendar</p>
          </div>
        </Link>
        {/* setting  */}
        <div>
          <div
            onClick={() => {
              setIsSetting(!isSetting);
            }}
            className="flex flex-wrap items-center justify-between py-2 hover:bg-slate-200 p-2"
          >
            <div className="flex items-center">
              <AiOutlineSetting className="text-xl" />
              <p className="px-1">Setting</p>
            </div>
            {isUser ? (
              <MdOutlineKeyboardArrowDown className="text-2xl" />
            ) : (
              <MdOutlineArrowBackIosNew />
            )}
          </div>
          <motion.div
            {...slideUpOut}
            className={`flex flex-col ${!isSetting ? "hidden" : "block"}`}
          >
            <NavLink
              to={"/admin/setting"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Setting
            </NavLink>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DBLeftSection;
