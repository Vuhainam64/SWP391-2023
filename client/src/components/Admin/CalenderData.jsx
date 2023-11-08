import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { BiBuildingHouse } from "react-icons/bi";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { useState } from "react";
import { colStartClasses, months } from "../../ultils/DataCalenderExample";
import { motion } from "framer-motion";
import { AiOutlineStar } from "react-icons/ai";
import { MdOutlineRecordVoiceOver } from "react-icons/md";
import { buttonClick } from "../../animations";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CalenderData({ week, tasks }) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [isMorning, setIsMorning] = useState(true);
  const [isNoon, setIsNoon] = useState(true);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index);

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const previousMonthDate = add(firstDayCurrentMonth, { months: -1 });
    setSelectedMonth(previousMonthDate.getMonth());
    setSelectedYear(previousMonthDate.getFullYear());
    setCurrentMonth(format(previousMonthDate, "MMM-yyyy"));
  }

  function nextMonth() {
    const nextMonthDate = add(firstDayCurrentMonth, { months: 1 });
    setSelectedMonth(nextMonthDate.getMonth());
    setSelectedYear(nextMonthDate.getFullYear());
    setCurrentMonth(format(nextMonthDate, "MMM-yyyy"));
  }

  const selectedDayMeetings = tasks.filter((task) => {
    const taskDate = parseISO(task.startedAt);
    const taskYear = taskDate.getFullYear();
    const taskMonth = taskDate.getMonth();
    const taskDay = taskDate.getDate();

    const selectedYear = selectedDay.getFullYear();
    const selectedMonth = selectedDay.getMonth();
    const selectedDayOfMonth = selectedDay.getDate();

    return (
      taskYear === selectedYear &&
      taskMonth === selectedMonth &&
      taskDay === selectedDayOfMonth
    );
  });

  console.log("Selected Day Meetings:", selectedDayMeetings);

  function handleYearChange(year) {
    setSelectedYear(year);
    // Cập nhật lại tháng và ngày
    const newDate = new Date(year, selectedMonth, 1);
    setSelectedDay(newDate);
    setCurrentMonth(format(newDate, "MMM-yyyy"));
  }

  function renderTasksForTimeRange(startHour, endHour) {
    return selectedDayMeetings
      .filter((task) => {
        const taskDate = parseISO(task.startedAt);
        const taskHour = taskDate.getHours();
        return taskHour >= startHour && taskHour < endHour;
      })
      .map((task) => (
        <div
          key={task.taskId}
          className="flex relative items-center justify-start mx-2"
        >
          <div className="group flex relative items-center justify-start mx-2">
            <div className="flex bg-slate-600 px-2 py-1 rounded-md text-white">
              <div className="px-2">{task.campusName}</div>
              <div className="px-[0.25px] m-1 bg-white "></div>
              <div className="px-2">{task.status}</div>
            </div>
            <div className="hidden group-hover:block absolute top-8 left-0 w-full bg-blue-500 bg-opacity-90 rounded-t-sm rounded-b-md min-h-[200px] z-10">
              <div className="m-2">
                <div className="text-sm font-medium">{task.facilityName}</div>
                <div className="grid grid-cols-2">
                  <div className="flex items-center w-full">
                    <BiBuildingHouse />
                    <p className="px-2">Location</p>
                  </div>
                  <p>Room: {task.roomName}</p>
                  <div className="flex items-center w-full">
                    <MdOutlineRecordVoiceOver />
                    <p className="px-2">Employee</p>
                  </div>
                  <p className="underline text-slate-700">
                    {task.employeeName}
                  </p>
                  <div className="flex items-center w-full">
                    <AiOutlineStar />
                    <p className="px-2">Admin</p>
                  </div>
                  <p className="underline text-slate-700">{task.adminName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ));
  }
  return (
    <div className="w-full">
      <div className="">
        {/* calendar  */}
        <div className="md:pr-14">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={previousMonth}
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <BsChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="mx-32">
              {!week ? (
                <h2 className="font-semibold text-gray-900">
                  {/* Display the selected month and year */}
                  {format(
                    new Date(selectedYear, selectedMonth, 1),
                    "MMMM yyyy"
                  )}
                </h2>
              ) : (
                <>
                  {/* Dropdown to select month */}
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(parseInt(e.target.value));
                      setCurrentMonth(
                        format(
                          new Date(selectedYear, parseInt(e.target.value), 1),
                          "MMM-yyyy"
                        )
                      );
                    }}
                    className="outline-none"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {/* Dropdown to select year */}
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(parseInt(e.target.value))}
                    className="outline-none"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <button
              onClick={nextMonth}
              type="button"
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <BsChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-7 mt-10 font-semibold leading-6 text-center text-gray-500">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>
          <div className="grid grid-cols-7 mt-2 text-sm">
            {days.map((day, dayIdx) => (
              <div
                key={day.toString()}
                className={classNames(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  "py-1.5"
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={classNames(
                    isEqual(day, selectedDay) && "text-white",
                    !isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "text-red-500",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayCurrentMonth) &&
                      "text-gray-900",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "text-gray-400",
                    isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
                    isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      "bg-slate-900",
                    !isEqual(day, selectedDay) && "hover:bg-gray-200",
                    (isEqual(day, selectedDay) || isToday(day)) &&
                      "font-semibold",
                    "mx-auto flex h-6 w-14 items-center justify-center rounded-2xl"
                  )}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                </button>

                <div className="w-1 h-1 mx-auto mt-1">
                  {tasks.some((task) =>
                    isSameDay(parseISO(task.startedAt), day)
                  ) && <div className="w-1 h-1 rounded-full bg-sky-500"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* task  */}
        <section className="mt-12 md:mt-0 md:pl-14">
          <h2 className="font-semibold text-gray-900">
            Schedule for{" "}
            <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
              {format(selectedDay, "MMM dd, yyy")}
            </time>
          </h2>
          <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
            {selectedDayMeetings.length > 0 ? (
              selectedDayMeetings.map((task) => (
                <div key={task.taskId}>{task.employeeName}</div>
              ))
            ) : (
              <p>No tasks for today.</p>
            )}
          </ol>
        </section>
        {/* task end  */}
        <div className="w-full flex flex-col items-center">
          {/* morning  */}
          <div className="w-full p-2">
            <motion.div
              {...buttonClick}
              onClick={() => {
                setIsMorning(!isMorning);
              }}
              className="bg-slate-700 text-white px-4 py-1 rounded-md cursor-pointer"
            >
              Morning (8:00 - 12:00)
            </motion.div>
            {isMorning && (
              <div className="m-2 mx-4 flex flex-col items-center">
                {[8, 9, 10, 11, 12].map((hour) => (
                  <div key={hour} className="w-full">
                    <div className="flex">
                      <div className="w-20 flex justify-between">
                        {`${hour}:00`}{" "}
                        <span className="px-[0.25px] bg-gray-300"></span>
                      </div>
                      {renderTasksForTimeRange(hour, hour + 1)}
                    </div>
                    <div className="w-full my-2 py-[0.25px] bg-gray-300"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* noon  */}
          <div className="w-full p-2">
            <motion.div
              {...buttonClick}
              onClick={() => {
                setIsNoon(!isNoon);
              }}
              className="bg-slate-700 text-white px-4 py-1 rounded-md cursor-pointer"
            >
              Noon (13:00 - 17:00)
            </motion.div>
            {isNoon && (
              <div className="m-2 mx-4 flex flex-col items-center">
                {[13, 14, 15, 16, 17].map((hour) => (
                  <div key={hour} className="w-full">
                    <div className="flex">
                      <div className="w-20 flex justify-between">
                        {`${hour}:00`}{" "}
                        <span className="px-[0.25px] bg-gray-300"></span>
                      </div>
                      {renderTasksForTimeRange(hour, hour + 1)}
                    </div>
                    <div className="w-full my-2 py-[0.25px] bg-gray-300"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
