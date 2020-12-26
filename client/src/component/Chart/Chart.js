import React, {useEffect, useRef} from 'react';
import ChartJS from 'chart.js';

const Chart = (props) => {

    const {title, data, colors} = props;
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

        new ChartJS(chartReference, {
            type: 'polarArea',
            data: {
                labels: labels,
                datasets: [{
                    label: 'value',
                    data: values,
                    backgroundColor: backgroundColors,
                    borderColor: "rgba(46, 46, 46, 0.8)",
                    borderWidth: 1
                }],
            },
            options: {
                aspectRatio: 1,
                scale: {
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 1,
                        stepSize: 0.2,
                        showLabelBackdrop: false,
                    },
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.2)',
                        z: -1
                    },
                    pointLabels: {
                        fontSize: 16
                    }
                },
                legend: {
                    position: 'right',
                    align: 'left'
                }
            }
        });
    }

    useEffect(() => {
        buildChart();
    })

    return (
        <div className='chart-container'>
            <h2 className='chart-title'>{title}</h2>
            <canvas id="" ref={reference}/>
        </div>
    );
}

export default Chart;