import React from 'react';
import {Link} from 'react-router-dom';

import './Navbar.css';

const Navbar = (props) => {

    return (
        <nav className='navbar'>
            <h4>APOLLO</h4>
            <ul>
               <Link to='/analyze'> <li>ANALYZE</li> </Link>
               <Link to='/top'> <li>TOP</li> </Link>
               <Link to='explorer'> <li>EXPLORE</li> </Link>
            </ul>
        </nav>
    )
}

export default Navbar;
