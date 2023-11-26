import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { countTasksByStatus } from "../../api";
import Spinner from "../Spinner";

ChartJS.register(ArcElement, Tooltip, Legend);

function DBHome() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [statistics, setStatistics] = useState({});
  const [latestFeedbacks, setLatestFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await countTasksByStatus();
      setLoading(false);
      setChartData(result.taskStatusCounts);
      setLatestFeedbacks(result.latestFeedbacks);
      setStatistics(result);
    };

    fetchData();
  }, []);

  const data = {
    labels: Object.keys(chartData),
    datasets: [
      {
        label: "Tasks",
        data: Object.values(chartData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl p-2 font-semibold">Home Dashboard</h1>
          <div class="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center flex-col border border-gray-400">
              <div className="m-4">
                <h2 className="text-center text-2xl font-bold text-gray-800">
                  Tasks Status
                </h2>
                <div className="">
                  <Pie data={data} options={options} />
                </div>
              </div>
            </div>
            <div>
              <div class="grid grid-cols-2 gap-4">
                <div class="border border-gray-400 bg-red-400 h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">
                        {statistics.totalFeedbacks}
                      </p>
                      <p className="text-md text-white ">Feedback Total</p>
                    </div>
                  </div>
                </div>
                <div class="border border-gray-400 bg-sky-300 justify-center text-center h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">
                        {statistics.feedbacksInMonth}
                      </p>
                      <p className="text-md text-white ">Feedback In Month </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="border border-gray-400 bg-sky-300 justify-center text-center h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">
                        {statistics.totalUsers}
                      </p>
                      <p className="text-md text-white ">User</p>
                    </div>
                  </div>
                </div>
                <div class="border border-gray-400 bg-red-400 justify-center text-center h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">
                        {statistics.totalEmployees}
                      </p>
                      <p className="text-md text-white ">Employee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div class="mt-4 border border-gray-400">
            <p className="mt-4 ml-4 text-xl">Total facility has problem:</p>
            <div className="grid grid-cols-7 gap-4 m-4 text-center">
              <div className="rounded-full bg-red-400 text-white py-10">
                <p>20</p>
                <p>Bàn Học Sinh</p>
              </div>
              <div className="rounded-full bg-orange-400 text-white py-10">
                <p>20</p>
                <p>Bàn Giáo Viên</p>
              </div>
              <div className="rounded-full bg-yellow-400 text-white py-10">
                <p>20</p>
                <p>Camera</p>
              </div>
              <div className="rounded-full bg-green-400 text-white py-10">
                <p>20</p>
                <p>Máy Lạnh</p>
              </div>
              <div className="rounded-full bg-blue-400 text-white py-10">
                <p>20</p>
                <p>Tivi</p>
              </div>
              <div className="rounded-full bg-indigo-400 text-white py-10">
                <p>20</p>
                <p>Máy Chiếu</p>
              </div>
              <div className="rounded-full bg-violet-400 text-white py-10">
                <p>20</p>
                <p>Bảng Học</p>
              </div>
            </div>
          </div> */}
          <div class="grid grid-cols-3 gap-4 mt-4">
            <div class="border border-gray-400">
              <div className="m-4">
                <p className="text-xl mb-4">Top room feedback:</p>
              </div>
              <ul className="list-disc pl-6">
                {statistics.topRooms.map((room, index) => (
                  <li key={index} className="mb-4">
                    <p className="text-lg font-semibold">
                      Room: {room.roomName}
                    </p>
                    <p className="text-md">Campus: {room.campusName}</p>
                    <p className="text-md">
                      Feedback Count: {room.feedbackCount}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-400 p-4">
              <p className="text-xl mb-4">New Feedback:</p>
              <ul className="list-disc pl-6">
                {latestFeedbacks.map((feedback, index) => (
                  <li key={index} className="mb-4">
                    <p className="text-lg font-semibold">{feedback.title}</p>
                    <div
                      className="text-gray-700 break-words"
                      dangerouslySetInnerHTML={{ __html: feedback.content }}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(feedback.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div class="border border-gray-400">
              <div className="m-4">
                <p className="text-xl">Top Cancel:</p>
              </div>
              <ul className="list-disc pl-6">
                {statistics.employeeStatusList.map((employee, index) => (
                  <li key={index} className="mb-4">
                    <p className="text-lg font-semibold">
                      {employee.displayName}
                    </p>
                    <p className="text-md">
                      Total Cancelled Tasks: {employee.taskCancel}
                    </p>
                    <p className="text-md">
                      Total Tasks Assigned: {employee.totalTasksAssigned}
                    </p>
                    <p className="text-md">Status: {employee.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DBHome;
