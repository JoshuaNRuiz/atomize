import React, { useEffect, useRef } from 'react';
import ChartJS from 'chart.js';

const Chart = (props) => {

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

        // new ChartJS(chartReference, {
        //     type: 'polarArea',
        //     data: {
        //         labels: labels,
        //         datasets: [{
        //             label: 'value',
        //             data: values,
        //             backgroundColor: backgroundColors,
        //             borderColor: "rgba(46, 46, 46, 0.8)",
        //             borderWidth: 1
        //         }],
        //     },
        //     options: {
        //         aspectRatio: 1,
        //         scale: {
        //             ticks: {
        //                 suggestedMin: 0,
        //                 suggestedMax: 1,
        //                 stepSize: 0.2,
        //                 showLabelBackdrop: false,
        //             },
        //             gridLines: {
        //                 color: 'rgba(0, 0, 0, 0.2)',
        //                 z: -1
        //             },
        //             pointLabels: {
        //                 fontSize: 16
        //             }
        //         },
        //         legend: {
        //             position: 'right',
        //             align: 'left'
        //         }
        //     }
        // });

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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }

        const config = {
            type: 'bar',
            data: data,
            options: options
        }

        new ChartJS(chartReference, config);
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

export default Chart;