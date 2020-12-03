import React from 'react';
import './Controls.css';

const Controls = (props) => {

    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;

    return (
        <div className='controls'>
            <select
                id='type-input'
                className='type-input'
                name='range'
                onChange={props.handleTypeChange}>
                <option value='tracks'>Tracks</option>
                <option value='artists'>Artists</option>
            </select>
            <select
                id='time-range-input'
                className='time-range-input'
                name='range'
                onChange={props.handleTimeRangeChange}>
                <option value='long_term'>All time</option>
                <option value='medium_term'>6 Months</option>
                <option value='short_term'>4 Weeks</option>
            </select>
            <input
                type='number'
                id='limit-input'
                className='limit-input'
                min={MIN_LIMIT}
                max={MAX_LIMIT}
                value={props.limit}
                onClick={props.refresh}
                onChange={props.handleLimitChange}/>
            <button className='refresh-button' onClick={props.handleRefresh}>Refresh</button>
        </div>
    )
}

export default Controls;