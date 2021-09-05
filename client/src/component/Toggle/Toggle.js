import React from 'react';

const Toggle = ({ options, handleChange}) => {

    function buildToggle() {
        const inputs = options.values.map((value) => {
            return (
                <div>
                    <label>{value}</label>
                    <input type='radio' value={value} name={options.name}/>
                </div>
            )
        });

        return inputs;
    }

    return (
        <div className="Toggle" onChange={handleChange}>
            {buildToggle()}
        </div>
    )
}

export default Toggle;