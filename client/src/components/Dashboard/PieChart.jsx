// PieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const PieChart = ({ labels, dataPoints, colors }) => {
    const total = dataPoints.reduce((acc, curr) => acc + curr, 0);  // Calculate total for percentage calculation

    const data = {
        labels: labels,
        datasets: [
            {
                data: dataPoints,
                backgroundColor: colors,
                hoverBackgroundColor: colors.map(color => `${color}bf`), // Add transparency to the hover color
                borderWidth: 1,
            }
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        let label = data.labels[tooltipItem.dataIndex] || '';
                        if (label) {
                            label += ': ';
                        }
                        const currentValue = data.datasets[0].data[tooltipItem.dataIndex];
                        const percentage = ((currentValue/total) * 100).toFixed(2); // Calculate percentage
                        label += `${currentValue} (${percentage}%)`;
                        return label;
                    }
                }
            },
            legend: {
                display: true,
                position: 'bottom'
            }
        }
    };

    return <Pie data={data} options={options} />;
};

export default PieChart;
