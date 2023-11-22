import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { countTasksByStatus } from "../../api";
import Spinner from "../Spinner";

ChartJS.register(ArcElement, Tooltip, Legend);

function DBHome() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await countTasksByStatus();
      setLoading(false);
      setChartData(result);
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
                      <p className="text-xl text-white font-semibold">100</p>
                      <p className="text-md text-white ">Feedback Total</p>
                    </div>
                  </div>
                </div>
                <div class="border border-gray-400 bg-sky-300 justify-center text-center h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">10</p>
                      <p className="text-md text-white ">Feedback In Month </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="border border-gray-400 bg-sky-300 justify-center text-center h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">40</p>
                      <p className="text-md text-white ">User</p>
                    </div>
                  </div>
                </div>
                <div class="border border-gray-400 bg-red-400 justify-center text-center h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">20</p>
                      <p className="text-md text-white ">Employee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DBHome;
