import React from 'react';
import './Selector.css'

const Selector = (props) => {

    const options = props.options
    const handleSelection = props.handleSelection;
    
    function makeSelector() {
        return options.map(option => {
            const {title, value, image} = option;
            return (
                <button 
                    className='Selector__Option' 
                    onClick={handleSelection} 
                    value={value}
                    style={{backgroundImage: `url(${image})`}}>
                    {title}
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