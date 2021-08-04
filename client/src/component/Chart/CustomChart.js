import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

import './CustomChart.css';

const CustomChart = ({title, data, colors}) => {

    const reference = useRef(null);

    function buildChart() {
        if (!data || Object.keys(data).length === 0) return null;
        const [labels, values] = [Object.keys(data), Object.values(data)];
        const chartReference = reference.current.getContext("2d");

        const danceabilityColor = 'rgba(255, 202, 58, 0.2)';
        const energyColor = 'rgba(106, 76, 147, 0.2)';
        const instrumentalnessColor = 'rgba(25, 130, 196, 0.2)';
        const speechinessColor = 'rgba(93, 103, 91, 0.2)';
        const valenceColor = 'rgba(138, 201, 38, 0.2)';

        const backgroundColors = [danceabilityColor, energyColor,
            instrumentalnessColor, speechinessColor, valenceColor];

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Musical Breakdown',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: [
                    'rgb(255, 202, 58)',
                    'rgb(106, 76, 147)',
                    'rgb(255, 89, 94)',
                    'rgb(25, 130, 196)',
                    'rgb(93, 103, 91)',
                    'rgb(138, 201, 38)',
                    'rgb(138, 201, 38)'
                ],
                borderWidth: 1,
                barPercentage: 0.6,
            }]
        };

        const options = {
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 1,
                    ticks: {
                        count: 10,
                    }
                }
            }
        }

        const config = {
            type: 'bar',
            data: chartData,
            options: options
        }

        new Chart(chartReference, config);
    }

    useEffect(buildChart, [data]);

    return (
        <div className='CustomChart'>
            <h2 className='CustomChart__Title'>{title}</h2>
            <canvas className="CustomChart__Canvas" ref={reference} />
        </div>
    );
}

export default CustomChart;