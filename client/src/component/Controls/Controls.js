import React from 'react';

const Controls = (props) => {

    return (
        <div className='header'> 
            <select className='time-range-input' name="range" onChange={props.handleTimeRangeChange}>
                <option value="long_term">Long (all-time)</option>
                <option value="medium_term">Medium (6 months)</option>
                <option value="short_term">Short (4 weeks)</option>
            </select>
            <input type='number-input' className='limit' min={props.min} max={props.max} value={props.limit} onClick={props.refresh} onChange={props.handleLimitChange}/>
            <button className='refresh-button' onClick={props.handleRefresh}>Refresh</button>
        </div>
    )
}

export default Controls;