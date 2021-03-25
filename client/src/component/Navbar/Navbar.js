import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = (props) => {

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    return (
        <nav className='navbar'>
            <h4 className='logo'>atomize</h4>
                <ul className="links">
                    <li className="link"><Link to='analyze'>analyze</Link></li>
                    <li className="link"><Link to='top'>top</Link></li>
                    <li className="link"><Link to='explore'>explore</Link></li>
                </ul>
        </nav>
    )
}

export default Navbar;
