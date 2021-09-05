import React from 'react';
import './Selector.css'

const Selector = ({options, handleSelection}) => {
    
    function makeSelector() {
        const buttons = options.map(option => {
            const {title, value, image} = option;
            const style = {
                backgroundImage: `url("${image}")`,
                backgroundSize: 'cover',
            }

            return (
                <button 
                    className='Selector__Option' 
                    onClick={handleSelection} 
                    value={value}
                    style={style}>
                    <span className="Selector__Option__Title">{title}</span>
                </button>
            )
        });

        return buttons;
    }

    return (
        <div className='Selector'>
            {makeSelector()}
        </div>
    )
}

export default Selector;