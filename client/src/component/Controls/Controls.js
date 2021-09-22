import React from 'react';
import './Controls.css';

const Controls = (props) => {

    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;

    return (
        <div className='Controls'>
            <div className="Controls__Container">
                <label className="Controls__Container__Label">type</label>
                <select
                    name="type"
                    className="Controls__Container__TypeSelect"
                    onChange={props.handleTypeChange}>
                    <option value="tracks">tracks</option>
                    <option value="artists">artists</option>
                </select>
            </div>
            <div className="Controls__Container">
                <label className="Controls__Container__Label">range</label>
                <select
                    id='time-range-select'
                    className='Controls__Container__TimeRangeSelect'
                    name='range'
                    onChange={props.handleTimeRangeChange}>
                    <option value='long_term'>all time</option>
                    <option value='medium_term'>6 months</option>
                    <option value='short_term'>4 weeks</option>
                </select>
            </div>
            <div className="Controls__Container">
                <label className="Controls__Container__Label">count</label>
                <input
                    type='number'
                    id='limit-input'
                    className='Controls__Container__LimitInput'
                    min={MIN_LIMIT}
                    max={MAX_LIMIT}
                    value={props.limit}
                    onClick={props.refresh}
                    onChange={props.handleLimitChange}
                    size={2}/>
            </div>
        </div>
    )
}

export default Controls;