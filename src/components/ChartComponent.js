import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Set global defaults for a sleek modern look
ChartJS.defaults.font.family = "'Inter', 'Helvetica', 'Arial', sans-serif";
ChartJS.defaults.color = '#333';
ChartJS.defaults.borderColor = '#e0e0e0';

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          family: "'Inter', 'Helvetica', 'Arial', sans-serif",
          weight: 500
        },
        color: '#333',
        boxWidth: 15,
        padding: 15
      }
    },
    title: {
      display: true,
      text: 'JSW Steel Data Visualization',
      font: {
        family: "'Inter', 'Helvetica', 'Arial', sans-serif",
        size: 16,
        weight: 600
      },
      color: '#000',
      padding: 20
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        family: "'Inter', 'Helvetica', 'Arial', sans-serif",
        size: 13
      },
      bodyFont: {
        family: "'Inter', 'Helvetica', 'Arial', sans-serif",
        size: 12
      },
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 10,
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        lineWidth: 1
      },
      ticks: {
        font: {
          family: "'Inter', 'Helvetica', 'Arial', sans-serif"
        },
        color: '#555'
      }
    },
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        lineWidth: 1
      },
      ticks: {
        font: {
          family: "'Inter', 'Helvetica', 'Arial', sans-serif"
        },
        color: '#555'
      }
    }
  }
};

const ChartComponent = ({ data, options = {} }) => {
  // Determine the chart type based on the query or data
  const chartType = data?.chartType || 'bar';
  const mergedOptions = { ...defaultOptions, ...options };

  // Check if data is properly formatted
  if (!data || !data.labels || !data.datasets) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No valid chart data available</p>
      </div>
    );
  }

  // Apply consistent styling to datasets if not already applied
  const formattedData = {
    ...data,
    datasets: data.datasets.map(dataset => {
      // If backgroundColor is a string (single color), convert to array of grays
      if (typeof dataset.backgroundColor === 'string') {
        const grayShades = [
          'rgba(45, 45, 45, 0.7)',
          'rgba(75, 75, 75, 0.7)',
          'rgba(105, 105, 105, 0.7)',
          'rgba(135, 135, 135, 0.7)',
          'rgba(165, 165, 165, 0.7)'
        ];
        return {
          ...dataset,
          backgroundColor: grayShades.slice(0, data.labels.length),
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1
        };
      }
      return dataset;
    })
  };

  // Render the appropriate chart based on type
  const renderChart = () => {
    switch (chartType.toLowerCase()) {
      case 'line':
        return <Line data={formattedData} options={mergedOptions} />;
      case 'pie':
        return <Pie data={formattedData} options={mergedOptions} />;
      case 'doughnut':
        return <Doughnut data={formattedData} options={mergedOptions} />;
      case 'bar':
      default:
        return <Bar data={formattedData} options={mergedOptions} />;
    }
  };

  return (
    <div className="chart-container h-full">
      {renderChart()}
    </div>
  );
};

export default ChartComponent; 