import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = (props) => {

    return (
        <nav className='navbar'>
            <h4 className='logo'>atomize</h4>
            <ul>
                <li><Link to='/analyze' className='link-item'>Analyze</Link></li>
                <li><Link to='/top' className='link-item'>Top</Link></li>
                <li><Link to='explorer' className='link-item'>Explore</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;
