import React from 'react';
import {Link, Redirect} from 'react-router-dom';

const Gateway = (props) => {

    const baseUrl = process.env.REACT_APP_ENVIRONMENT;

    return (
        <div className='gateway'>
            <Link to='analyze'> 
                <button>Music Analysis</button> 
            </Link>

            <Link to='top'> 
                <button>Top Artists & Tracks</button> 
            </Link>

            <Link to='explore'> 
                <button>Find New Music</button> 
            </Link>
        </div>
    )
    
}

export default Gateway;