import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const CustomChart = (props) => {

    const { title, data, colors } = props;
    const [labels, values] = [Object.keys(data), Object.values(data)];
    const reference = useRef(null);

    const buildChart = () => {
        const chartReference = reference.current.getContext("2d");

        const danceabilityColor = 'rgba(255, 202, 58, 1)';
        const energyColor = 'rgba(106, 76, 147, 1)';
        const livenessColor = 'rgba(255, 89, 94, 1)';
        const instrumentalnessColor = 'rgba(25, 130, 196, 1)';
        const speechinessColor = 'rgba(93, 103, 91, 1)';
        const valenceColor = 'rgba(138, 201, 38, 1)';

        const backgroundColors = [danceabilityColor, energyColor, livenessColor,
            instrumentalnessColor, speechinessColor, valenceColor];

        const data = {
            labels: labels,
            datasets: [{
                label: 'My First Dataset',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
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
        <div className='chart-container'>
            <h2 className='chart-title'>{title}</h2>
            <canvas id="" ref={reference} />
        </div>
    );
}

export default CustomChart;