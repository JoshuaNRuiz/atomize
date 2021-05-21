import * as Constants from '../../helpers/Constants';
import React from 'react';
import './Selector.css'

const Selector = (props) => {

    const options = props.options
    const handleSelection = props.handleSelection;

    function makeSelector() {
        return options.map(option => {
            const value = option.value;
            return (
                <button className='Selector__Option' onClick={handleSelection} value={value}>
                    {value.toUpperCase()}
                </button>
            )
        });
    }

    return (
        <div className='Selector'>
            {makeSelector()}
        </div>
    )
}

export default Selector;