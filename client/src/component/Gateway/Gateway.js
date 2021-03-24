import React from 'react';
import {Link, Redirect} from 'react-router-dom';

const Gateway = (props) => {

    const baseUrl = process.env.REACT_APP_ENVIRONMENT;

    return (
        <div className='gateway'>
            <Link to={baseUrl + 'analyze'}> 
                <button>Music Analysis</button> 
            </Link>

            <Link to={baseUrl + 'top'}> 
                <button>Top Artists & Tracks</button> 
            </Link>

            <Link to={baseUrl + 'explore'}> 
                <button>Find New Music</button> 
            </Link>
        </div>
    )
    
}

export default Gateway;