import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = (props) => {

    const baseUrl = process.env.REACT_APP_ENVIRONMENT;

    return (
        <nav className='navbar'>
            <h4 className='logo'>atomize</h4>
            <ul>
                <li><Link to={baseUrl + 'analyze'} className='link-item'>Analyze</Link></li>
                <li><Link to={baseUrl + 'top'} className='link-item'>Top</Link></li>
                <li><Link to={baseUrl + 'explore'} className='link-item'>Explore</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;
