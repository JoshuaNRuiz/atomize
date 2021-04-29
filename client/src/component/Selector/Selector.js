import React from 'react';
import './Selector.css'

const Selector = (props) => {

    const options = props.options
    const handleSelection = props.handleSelection;

    function makeSelector() {
        const radios = options.map(option => {
            const name = option.name;
            return (
                <button className='selector__option' onClick={handleSelection} value={name.toUpperCase()}>
                    {name}
                </button>
            )
        });

        return (
            <div className='selector'>
                {radios}
            </div>
        )
    }

    return (
        <div className='selector'>
            {makeSelector()}
        </div>
    )
}

export default Selector;