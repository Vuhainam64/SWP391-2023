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
} from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
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
          to={"/admin/home"}
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
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Users
            </NavLink>
          </motion.div>
        </div>
        {/* Employee  */}
        <Link
          to={"/admin/employee"}
          className="flex items-center py-2 hover:bg-slate-200 p-2"
        >
          <div className="flex items-center">
            <FaUserTie />
            <p className="px-1">Employee</p>
          </div>
        </Link>
        {/* View Feedback  */}
        <Link
          to={"/admin/feedback"}
          className="flex items-center py-2 hover:bg-slate-200 p-2"
        >
          <div className="flex items-center">
            <VscFeedback />
            <p className="px-1">View Feedback</p>
          </div>
        </Link>
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
