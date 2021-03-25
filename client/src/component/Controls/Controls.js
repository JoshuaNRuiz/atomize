import React from 'react';
import './Controls.css';

const Controls = (props) => {

    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;

    return (
        <div className='controls'>
            <div className="control-input-container">
                <label>type</label>
                <select
                    name="type"
                    className="type-select"
                    onChange={props.handleTypeChange}>
                    <option value="tracks">tracks</option>
                    <option value="artists">artists</option>
                </select>
            </div>
            <div className="control-input-container">
                <label>range</label>
                <select
                    id='time-range-select'
                    className='time-range-select'
                    name='range'
                    onChange={props.handleTimeRangeChange}>
                    <option value='long_term'>all time</option>
                    <option value='medium_term'>6 months</option>
                    <option value='short_term'>4 weeks</option>
                </select>
            </div>
            <div className="control-input-container">
                <label>count</label>
                <input
                    type='number'
                    id='limit-input'
                    className='limit-input'
                    min={MIN_LIMIT}
                    max={MAX_LIMIT}
                    value={props.limit}
                    onClick={props.refresh}
                    onChange={props.handleLimitChange}/>
            </div>
        </div>
    )
}

export default Controls;