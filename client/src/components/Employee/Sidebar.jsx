import { AiFillCalendar, AiOutlineClose } from "react-icons/ai";
import { MdFeed, MdPendingActions } from "react-icons/md";
import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import {
  buttonClick,
  isActiveStyles,
  isNotActiveStyles,
} from "../../animations";
import { Logo } from "../../assets";

function Sidebar() {
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
        <NavLink
          to={"/employee/"}
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold flex`
              : `${isNotActiveStyles} flex`
          }
        >
          <div className="flex items-center">
            <MdFeed className="text-xl" />
            <p className="px-1">Home</p>
          </div>
        </NavLink>
        {/* Pending  */}
        <NavLink
          to={"/employee/tasks"}
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold flex`
              : `${isNotActiveStyles} flex`
          }
        >
          <div className="flex items-center">
            <MdPendingActions className="text-xl" />
            <p className="px-1">Tasks</p>
          </div>
        </NavLink>
        {/* complete  */}
        {/* <NavLink
          to={"/employee/completes"}
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold flex`
              : `${isNotActiveStyles} flex`
          }
        >
          <div className="flex items-center">
            <AiOutlineFileDone className="text-xl" />
            <p className="px-1">Completes</p>
          </div>
        </NavLink> */}
        {/* calendar  */}
        <NavLink
          to={"/employee/calendar"}
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-l-8  border-slate-600 hover:bg-slate-200  pl-16 p-2w-full font-semibold flex`
              : `${isNotActiveStyles} flex`
          }
        >
          <div className="flex items-center">
            <AiFillCalendar className="text-xl" />
            <p className="px-1">Calendar</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
