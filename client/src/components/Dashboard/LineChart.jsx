// LineChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const LineChart = ({ labels, dataPoints, color }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Dataset',
                data: dataPoints,
                borderColor: color,
                backgroundColor: `${color}80`, // Adds transparency to the color
            }
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return <Line data={data} options={options} />;
};

export default LineChart;
