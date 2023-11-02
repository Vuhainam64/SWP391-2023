import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { countTasksByStatus } from "../../api";

ChartJS.register(ArcElement, Tooltip, Legend);

function DBHome() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await countTasksByStatus();
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
    <div className="flex items-center justify-center flex-col mt-16">
      <h2 className="text-center text-2xl font-bold mb-4 text-gray-800">
        Tasks Status
      </h2>

      <div className="w-508">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default DBHome;
