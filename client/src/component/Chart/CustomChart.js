import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

import './CustomChart.css';

const CustomChart = (props) => {

    const { title, data, colors } = props;
    const [labels, values] = [Object.keys(data), Object.values(data)];
    const reference = useRef(null);

    const buildChart = () => {
        const chartReference = reference.current.getContext("2d");

        const danceabilityColor = 'rgba(255, 202, 58, 0.2)';
        const energyColor = 'rgba(106, 76, 147, 0.2)';
        const livenessColor = 'rgba(255, 89, 94, 0.2)';
        const instrumentalnessColor = 'rgba(25, 130, 196, 0.2)';
        const speechinessColor = 'rgba(93, 103, 91, 0.2)';
        const valenceColor = 'rgba(138, 201, 38, 0.2)';

        const backgroundColors = [danceabilityColor, energyColor, livenessColor,
            instrumentalnessColor, speechinessColor, valenceColor];

        const data = {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backgroundColors,
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        };

        const options = {
            indexAxis: 'y',
        }

        const config = {
            type: 'bar',
            data: data,
            options: options
        }

        new Chart(chartReference, config);
    }

    useEffect(() => {
        buildChart();
    })

    return (
        <div className='CustomChart'>
            <h2 className='CustomChart__Title'>{title}</h2>
            <canvas className="CustomChart__Canvas" ref={reference} />
        </div>
    );
}

export default CustomChart;