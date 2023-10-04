import {
  AiOutlineClose,
  AiOutlineFolder,
  AiOutlineHome,
  AiOutlineSetting,
} from "react-icons/ai";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineKeyboardArrowDown,
  MdPeople,
} from "react-icons/md";
import { BsBook, BsCalendar } from "react-icons/bs";
import { LiaMicroscopeSolid } from "react-icons/lia";
import { LuGraduationCap } from "react-icons/lu";
import { motion } from "framer-motion";

import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  buttonClick,
  isActiveStyles,
  isNotActiveStyles,
  slideUpOut,
} from "../../animations";

function DBLeftSection() {
  const [isSyllabus, setIsSyllabus] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isClass, setIsClass] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  return (
    <div className="flex flex-col items-center pt-4 pl-4 text-sky-800 bg-slate-100 h-full">
      <div className="flex items-center w-full justify-between font-semibold text-xl">
        <p>Menu</p>
        <motion.div {...buttonClick} className="px-4">
          <AiOutlineClose className="cursor-pointer" />
        </motion.div>
      </div>
      <div className="p-2 w-full">
        {/* home  */}
        <Link
          to={"/home"}
          className="flex items-center py-2 hover:bg-slate-200 p-2"
        >
          <div className="flex items-center">
            <AiOutlineHome />
            <p className="px-1">Home</p>
          </div>
        </Link>
        {/* syllabus */}
        <div>
          <div
            onClick={() => {
              setIsSyllabus(!isSyllabus);
            }}
            className="flex flex-wrap items-center justify-between py-2 hover:bg-slate-200 p-2"
          >
            <div className="flex items-center">
              <BsBook />
              <p className="px-1">Syllabus</p>
            </div>
            {isSyllabus ? (
              <MdOutlineKeyboardArrowDown className="text-2xl" />
            ) : (
              <MdOutlineArrowBackIosNew />
            )}
          </div>
          <motion.div
            {...slideUpOut}
            className={`flex flex-col ${!isSyllabus ? "hidden" : "block"}`}
          >
            <NavLink
              to={"/syllasbus"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              View syllabus
            </NavLink>
            <NavLink
              to={"/create-syllabus"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Create syllabus
            </NavLink>
          </motion.div>
        </div>
        {/* training program */}
        <div>
          <div
            onClick={() => {
              setIsTraining(!isTraining);
            }}
            className="flex flex-wrap items-center justify-between py-2 hover:bg-slate-200 p-2"
          >
            <div className="flex items-center">
              <LiaMicroscopeSolid className="text-xl" />
              <p className="px-1">Training program</p>
            </div>
            {isTraining ? (
              <MdOutlineKeyboardArrowDown className="text-2xl" />
            ) : (
              <MdOutlineArrowBackIosNew />
            )}
          </div>
          <motion.div
            {...slideUpOut}
            className={`flex flex-col ${!isTraining ? "hidden" : "block"}`}
          >
            <NavLink
              to={"/program"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              View program
            </NavLink>
            <NavLink
              to={"/create-program"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Create program
            </NavLink>
            <NavLink
              to={"/import-program"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Import program
            </NavLink>
          </motion.div>
        </div>
        {/* class  */}
        <div>
          <div
            onClick={() => {
              setIsClass(!isClass);
            }}
            className="flex flex-wrap items-center justify-between py-2 hover:bg-slate-200 p-2"
          >
            <div className="flex items-center">
              <LuGraduationCap className="text-xl" />
              <p className="px-1">Class</p>
            </div>
            {isClass ? (
              <MdOutlineKeyboardArrowDown className="text-2xl" />
            ) : (
              <MdOutlineArrowBackIosNew />
            )}
          </div>
          <motion.div
            {...slideUpOut}
            className={`flex flex-col ${!isClass ? "hidden" : "block"}`}
          >
            <NavLink
              to={"/class"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              View class
            </NavLink>
            <NavLink
              to={"/create-class"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Create class
            </NavLink>
          </motion.div>
        </div>
        {/* training calendar */}
        <Link
          to={"/training-calender"}
          className="flex items-center py-2 hover:bg-slate-200 p-2"
        >
          <div className="flex items-center">
            <BsCalendar />
            <p className="px-1">Training calendar</p>
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
              to={"/users"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Users
            </NavLink>
            <NavLink
              to={"/user-list"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              User list
            </NavLink>
            <NavLink
              to={"/user-permission"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              User permission
            </NavLink>
          </motion.div>
        </div>
        {/* learning materials */}
        <Link
          to={"/learning-material"}
          className="flex items-center py-2 hover:bg-slate-200 p-2"
        >
          <div className="flex items-center">
            <AiOutlineFolder className="text-xl" />
            <p className="px-1">Learning materials</p>
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
              to={"/setting"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Setting
            </NavLink>
            <NavLink
              to={"/calendar"}
              className={({ isActive }) =>
                isActive
                  ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold`
                  : isNotActiveStyles
              }
            >
              Calendar
            </NavLink>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DBLeftSection;
