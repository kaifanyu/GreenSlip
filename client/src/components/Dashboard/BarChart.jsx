// BarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarChart = ({ labels, dataPoints, color }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'CO2 Emissions (%)',
                data: dataPoints,
                backgroundColor: color.map(c => `${c}80`), // Adding transparency to colors
                borderColor: color,
                borderWidth: 1,
            }
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Percentage of Global Emissions',
                    font: {
                        size: 16
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Company',
                    font: {
                        size: 16
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false // Hide the legend if not required
            }
        }
    };

    return <Bar data={data} options={options} />;
};

export default BarChart;
