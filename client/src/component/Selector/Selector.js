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
                <button className='selector__option' onClick={handleSelection} value={value}>
                    {value.toUpperCase()}
                </button>
            )
        });
    }

    return (
        <div className='selector'>
            {makeSelector()}
        </div>
    )
}

export default Selector;