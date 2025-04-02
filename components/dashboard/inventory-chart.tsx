"use client"

import { useEffect, useState } from "react"
import { Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

// Mock data - in a real app you would fetch this from an API
const generateMockData = (period: string) => {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))
    return `${date.getMonth() + 1}/${date.getDate()}`
  })

  // Generate random data for each category
  const electronics = Array.from({ length: days }, () => Math.floor(Math.random() * 50) + 20)
  const furniture = Array.from({ length: days }, () => Math.floor(Math.random() * 30) + 10)
  const office = Array.from({ length: days }, () => Math.floor(Math.random() * 20) + 5)

  return {
    labels,
    datasets: [
      {
        label: "电子产品",
        data: electronics,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "家具",
        data: furniture,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "办公设备",
        data: office,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  }
}

const generatePieData = () => {
  return {
    labels: ["电子产品", "家具", "办公设备"],
    datasets: [
      {
        data: [45, 25, 30],
        backgroundColor: ["rgba(53, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)", "rgba(75, 192, 192, 0.8)"],
        borderColor: ["rgba(53, 162, 235, 1)", "rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  }
}

interface InventoryChartProps {
  type?: "line" | "pie"
  period: string
}

export function InventoryChart({ type = "line", period }: InventoryChartProps) {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    if (type === "line") {
      setChartData(generateMockData(period))
    } else {
      setChartData(generatePieData())
    }
  }, [type, period])

  if (!chartData) {
    return <div>Loading...</div>
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return (
    <div className="h-[300px]">
      {type === "line" ? (
        <Line data={chartData} options={options} />
      ) : (
        <Pie data={chartData} options={{ ...options, aspectRatio: 1 }} />
      )}
    </div>
  )
}

