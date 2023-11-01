import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  getAllFeedbacks,
  updateFeedbackStatus,
  findAvailableEmployees,
} from "../../api";
import { setAllFeedbacks } from "../../context/actions/allFeedbackActions";
import { Logo } from "../../assets";
import { buttonClick } from "../../animations";
import moment from "moment-timezone";

function ViewFeedback() {
  const allFeedbacks = useSelector(
    (state) => state?.allFeedbacks?.allFeedbacks
  );
  const dispatch = useDispatch();

  const [openDeliveryTaskForFeedbackId, setOpenDeliveryTaskForFeedbackId] =
    useState(null);
  const [availableEmployees, setAvailableEmployees] = useState([]); // Initialize as an empty array

  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(
    currentDate.toISOString().split("T")[0]
  );
  const [selectedHour, setSelectedHour] = useState(() => {
    const currentHour = new Date().getHours();
    return currentHour;
  });

  const closingHour = 17; // Giờ nghỉ làm là 17:00
  const currentHour = currentDate.getHours();
  const selectedDateObj = new Date(selectedDate);
  const selectedDateIsToday =
    currentDate.toISOString().split("T")[0] ===
    selectedDateObj.toISOString().split("T")[0];

  const hours = Array.from(
    { length: closingHour - (selectedDateIsToday ? currentHour : 7) + 1 },
    (_, i) => (selectedDateIsToday ? currentHour : 7) + i
  );

  useEffect(() => {
    getAllFeedbacks().then((data) => {
      dispatch(setAllFeedbacks(data));
    });
  }, [dispatch]);

  const notVerifiedFeedbacks = allFeedbacks?.filter(
    (item) => item.feedbackstatus?.Status === "Not Verify"
  );

  const acceptFeedback = async (statusId) => {
    // Your acceptFeedback logic
  };

  const closeDeliveryTask = () => {
    setOpenDeliveryTaskForFeedbackId(null);
  };

  const handleFindEmployee = async () => {
    // Chuyển ngày và giờ thành định dạng Moment.js hiểu
    const dateTimeString = `${selectedDate}T${selectedHour}:00:00`;
    const selectedDateTimestamp = moment
      .tz(dateTimeString, "Asia/Ho_Chi_Minh")
      .valueOf();
    // Gọi API để tìm nhân viên dựa trên selectedDateTimestamp
    const availableEmployees = await findAvailableEmployees(
      selectedDateTimestamp
    );
    setAvailableEmployees(availableEmployees); // Use setAvailableEmployees to update the state
    console.log("selectedDate: ", selectedDate);
    console.log("selectedHour: ", selectedHour);
    console.log("selectedDateTimestamp: ", selectedDateTimestamp);
    console.log("availableEmployees: ", availableEmployees);
  };

  return (
    <div className="mt-10">
      {notVerifiedFeedbacks && notVerifiedFeedbacks.length > 0 ? (
        notVerifiedFeedbacks.map((item) => (
          <div className="bg-blue-400 rounded-md" key={item.feedbackId}>
            <div className="flex m-4">
              <motion.img
                alt="feedback"
                src={item.imageURL ? item.imageURL : Logo}
                whileHover={{ scale: 1.1 }}
                className="w-32 h-32 my-4"
              />
              <div className="flex-col ml-10 text-white relative w-full my-4">
                <div className="flex items-center m-2">
                  <img
                    src={item.user[0].photoURL}
                    alt="user avatar"
                    className="w-8 h-8 border rounded-full mr-4"
                  />
                  {item.user[0].displayName}
                </div>
                <div>Title: {item.title}</div>
                <div>
                  Location: {item.campusName} - Room: {item.roomName} -{" "}
                  {item.facilityName}
                </div>
                <div>
                  Create At: {new Date(item.createdAt).toLocaleString()}
                </div>
                <div>
                  Last Updated:{" "}
                  {new Date(item.feedbackstatus.updatedAt).toLocaleString()}
                </div>
                <div className="absolute bottom-0 right-0 flex">
                  <motion.div
                    {...buttonClick}
                    onClick={() => acceptFeedback(item.statusId)}
                    className="bg-green-400 px-2 py-1 rounded-md mx-2 cursor-pointer"
                  >
                    Accept
                  </motion.div>
                  <motion.div
                    {...buttonClick}
                    onClick={() =>
                      setOpenDeliveryTaskForFeedbackId(item.feedbackId)
                    }
                    className="bg-red-400 px-2 py-1 rounded-md mx-2 cursor-pointer"
                  >
                    Delivery Task
                  </motion.div>
                </div>
              </div>
            </div>
            {openDeliveryTaskForFeedbackId === item.feedbackId && (
              <div className="flex items-center w-full bg-yellow-50">
                <div className="grid grid-cols-2 w-full">
                  <div className="col-span-1 m-4">
                    <div className="flex flex-wrap">
                      <div className="flex flex-col">
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="date"
                          >
                            Ngày
                          </label>

                          <input
                            id="date"
                            type="date"
                            className="border border-gray-400 p-2 rounded w-full"
                            value={selectedDate}
                            min={currentDate.toISOString().split("T")[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                          />
                        </div>

                        <div>
                          <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="time"
                          >
                            Giờ
                          </label>

                          <select
                            id="time"
                            className="border border-gray-400 p-2 rounded w-full"
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.target.value)}
                          >
                            {hours.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}:00
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row-reverse cursor-pointer">
                      <motion.div
                        {...buttonClick}
                        onClick={handleFindEmployee}
                        className="bg-blue-400 px-2 py-1 rounded-md mx-2"
                      >
                        Find Employee
                      </motion.div>
                    </div>
                  </div>
                  <div className="col-span-1 m-4">
                    <div className="">
                      <div className="flex items-center justify-between w-full">
                        <p>Employee:</p>
                        <div
                          onClick={closeDeliveryTask}
                          className="font-semibold text-black cursor-pointer"
                        >
                          X
                        </div>
                      </div>
                      <div>
                        <div>
                          {availableEmployees &&
                          availableEmployees.length > 0 ? (
                            availableEmployees.map((employee) => (
                              <div
                                key={employee.uid}
                                className="m-4 border rounded-md bg-white flex items-center"
                              >
                                <div className="p-2">
                                  <img
                                    src={employee.photoURL || Logo}
                                    alt=""
                                    className="w-10 h-10"
                                  />
                                </div>
                                <div className="">
                                  <div>Name: {employee.displayName}</div>
                                  <div>
                                    Last Sign: {employee.lastSignInTime}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>No available employees found.</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row-reverse cursor-pointer">
                      <motion.div
                        {...buttonClick}
                        className="bg-green-400 px-2 py-1 rounded-md mx-2"
                      >
                        Delivery
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No feedbacks found.</p>
      )}
    </div>
  );
}

export default ViewFeedback;
