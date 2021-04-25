import React from 'react';
import {Link} from 'react-router-dom';

const Gateway = () => {

    return (
        <div className='gateway'>
            <Link to='analyze'> 
                <button disabled>Music Analysis</button> 
            </Link>

            <Link to='top'> 
                <button>Top Artists & Tracks</button> 
            </Link>

            <Link to='explore'> 
                <button disabled>Find New Music</button> 
            </Link>
        </div>
    )
    
}

export default Gateway;