import React from 'react';
import {Link, Redirect} from 'react-router-dom';

const Gateway = (props) => {

    return (
        <div className='gateway'>
            <Link to='/analyze'> 
                <button>Music Analysis</button> 
            </Link>

            <Link to='/top'> 
                <button>Top Artists & Tracks</button> 
            </Link>

            <Link to='/explorer'> 
                <button>Find New Music</button> 
            </Link>
        </div>
    )
    
}

export default Gateway;