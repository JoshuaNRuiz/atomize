import React from 'react';
import {Link} from 'react-router-dom';

const Gateway = (props) => {

    return (
        <div className='gateway'>
            <Link to='/music-analysis'> 
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