import { useEffect, useState } from "react";
import { MdFilterList, MdSearch } from "react-icons/md";
import { motion } from "framer-motion";
import { buttonClick } from "../../animations";
import CalenderData from "./CalenderData";
import Filter from "./Filter";
import { getAllTasksWithDetails } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { setAllTasks } from "../../context/actions/allTasksActions";

function Calendar() {
  const [isFilter, setIsFilter] = useState(false);
  const [isWeek, setIsWeek] = useState(false);

  const tasks = useSelector((state) => state?.allTasks?.allTasks);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const taskData = await getAllTasksWithDetails();
        const formattedTasks = taskData.map((task) => ({
          taskId: task.taskId,
          employeeName: task.employeeName,
          startedAt: new Date(task.startedAt).toISOString(),
          campusName: task.campusName,
          roomName: task.roomName,
          facilityName: task.facilityName,
          adminName: task.adminName,
          status: task.status,
        }));

        dispatch(setAllTasks(formattedTasks));
      } catch (error) {
        console.log("Error fetching users:", error);
        dispatch(setAllTasks([]));
      }
    }
    fetchTasks();
  }, [dispatch]);
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center bg-slate-700 w-full p-4">
        <div className="text-white font-semibold text-2xl relative">
          Repair Schedule
          <div className="absolute top-0 -right-6 w-3 h-3 text-sm text-gray-700 rounded-full bg-white flex items-center justify-center">
            i
          </div>
        </div>
      </div>
      <div className="flex items-center w-full bg-white p-4">
        {/* search  */}
        <div className="relative ">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MdSearch className="text-gray-900 text-2xl" />
          </div>
          <input
            className="w-full border border-gray-900 rounded-md py-2 pl-10 pr-3 placeholder:italic placeholder:text-gray-900 min-w-350"
            placeholder="Search by..."
          />
        </div>
        {/* filter */}
        <div className="flex items-center text-white bg-slate-700 p-1 pl-2 mx-2 rounded-md cursor-pointer relative">
          <motion.div
            {...buttonClick}
            onClick={() => setIsFilter(!isFilter)}
            className="flex"
          >
            <MdFilterList className="text-2xl" />
            <p className="px-2">Filter</p>
          </motion.div>
          {isFilter && (
            <div className="absolute top-10 left-0 bg-white text-slate-900 border border-gray-700 rounded-2xl">
              <Filter />
            </div>
          )}
        </div>
      </div>
      {/* calendar  */}
      <div className="w-full bg-white">
        {!isWeek ? (
          <div className="flex ml-2">
            <motion.div {...buttonClick} className="flex m-1 cursor-pointer">
              <p className="bg-slate-800 text-white px-6 py-1 rounded-2xl">
                Day
              </p>
            </motion.div>
            <motion.div
              {...buttonClick}
              onClick={() => setIsWeek(!isWeek)}
              className="flex m-1 cursor-pointer"
            >
              <p className="text-slate-800 bg-white px-6 py-1 rounded-2xl font-semibold">
                Week
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="flex ml-2">
            <motion.div
              {...buttonClick}
              onClick={() => setIsWeek(!isWeek)}
              className="flex m-1 cursor-pointer"
            >
              <p className="text-slate-800 bg-white px-6 py-1 rounded-2xl font-semibold">
                Day
              </p>
            </motion.div>
            <motion.div {...buttonClick} className="flex m-1 cursor-pointer">
              <p className="bg-slate-800 text-white px-6 py-1 rounded-2xl">
                Week
              </p>
            </motion.div>
          </div>
        )}
        <div className="w-full">
          <div className="w-full bg-gray-200 pt-[1px] my-2"></div>
          <CalenderData week={isWeek} tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

export default Calendar;
