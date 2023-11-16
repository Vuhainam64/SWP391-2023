import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { buttonClick } from "../../animations";
import CalenderData from "./CalenderData";
import { getAllTasksWithDetails } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { setAllTasks } from "../../context/actions/allTasksActions";
import Spinner from "../Spinner";

function Calendar() {
  const [loading, setLoading] = useState(true);
  const [isWeek, setIsWeek] = useState(false);

  const tasks = useSelector((state) => state?.allTasks?.allTasks);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const taskData = await getAllTasksWithDetails();
        const formattedTasks = taskData.map((task) => {
          const startedAt = new Date(task.startedAt);

          // Add 7 hours to the startTimeAt
          startedAt.setHours(startedAt.getHours() + 7);

          const formattedStartedAt = startedAt.toISOString().slice(0, 16);

          console.log("Fulltime: ");
          return {
            ...task,
            startedAt: formattedStartedAt,
          };
        });

        console.log("formattedTasks: ", formattedTasks);
        dispatch(setAllTasks(formattedTasks));
      } catch (error) {
        console.log("Error fetching tasks:", error);
        dispatch(setAllTasks([]));
      } finally {
        // Move setLoading(false) outside of the map function
        setLoading(false);
      }
    }
    fetchTasks();
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center bg-slate-700 w-full p-4">
            <div className="text-white font-semibold text-2xl relative">
              Repair Schedule
              <div className="absolute top-0 -right-6 w-3 h-3 text-sm text-gray-700 rounded-full bg-white flex items-center justify-center">
                i
              </div>
            </div>
          </div>
          <div className="flex items-center w-full bg-white p-4"></div>
          {/* calendar  */}
          <div className="w-full bg-white">
            {!isWeek ? (
              <div className="flex ml-2">
                <motion.div
                  {...buttonClick}
                  className="flex m-1 cursor-pointer"
                >
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
                <motion.div
                  {...buttonClick}
                  className="flex m-1 cursor-pointer"
                >
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
      )}
    </>
  );
}

export default Calendar;
