import React from 'react';
import './Controls.css';

const Controls = (props) => {

    return (
        <div className='controls'> 
            <select className='time-range-input' name="range" onChange={props.handleTimeRangeChange}>
                <option value="long_term">All time</option>
                <option value="medium_term">6 Months</option>
                <option value="short_term">4 Weeks</option>
            </select>
            <input type='number' className='limit-input' min={props.min} max={props.max} value={props.limit} onClick={props.refresh} onChange={props.handleLimitChange}/>
            <button className='refresh-button' onClick={props.handleRefresh}>Refresh</button>
        </div>
    )
}

export default Controls;