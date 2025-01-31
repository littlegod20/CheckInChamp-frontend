import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const KudosChart: React.FC = () => {
  const data = {
    labels: ["Jan 1", "Jan 2", "Jan 3"],
    datasets: [
      {
        label: "Kudos Given",
        data: [10, 20, 15],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-lg font-bold">Monthly Kudos Trends</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default KudosChart;
