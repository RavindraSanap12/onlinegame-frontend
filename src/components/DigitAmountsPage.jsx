import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { API_BASE_URL2 } from "./api";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DigitAmountsPage = () => {
  const [digitData, setDigitData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current date in YYYY-MM-DD format
        const today = new Date();
        const dateString = today.toISOString().split("T")[0];

        const response = await fetch(
          `${API_BASE_URL2}/single-ank/totals/by-date?date=${dateString}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDigitData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart data configuration
  const chartData = {
    labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    datasets: [
      {
        label: "Digit Amounts",
        data: digitData
          ? [
              digitData.zero,
              digitData.one,
              digitData.two,
              digitData.three,
              digitData.four,
              digitData.five,
              digitData.six,
              digitData.seven,
              digitData.eight,
              digitData.nine,
            ]
          : Array(10).fill(0),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(199, 199, 199, 0.7)",
          "rgba(83, 102, 255, 0.7)",
          "rgba(40, 159, 64, 0.7)",
          "rgba(210, 99, 132, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
          "rgba(83, 102, 255, 1)",
          "rgba(40, 159, 64, 1)",
          "rgba(210, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Digit Amounts Distribution",
        font: {
          size: 20,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Amount: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount",
          font: {
            weight: "bold",
          },
        },
        ticks: {
          stepSize: 5,
        },
      },
      x: {
        title: {
          display: true,
          text: "Digits",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          marginLeft: "340px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#333",
            marginTop: "30px",
          }}
        >
          Digit Amounts Visualization
        </h1>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          marginLeft: "340px",
          textAlign: "center",
          color: "red",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#333",
            marginTop: "30px",
          }}
        >
          Digit Amounts Visualization
        </h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        marginLeft: "340px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          marginTop: "30px",
        }}
      >
        Digit Amounts Visualization
      </h1>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Bar data={chartData} options={options} />
      </div>

      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          color: "#666",
        }}
      >
        <p>Hover over bars to see exact values</p>
      </div>
    </div>
  );
};

export default DigitAmountsPage;
