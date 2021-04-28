import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = (props) => {

    return (
        <nav className='navbar'>
            <h4 className='logo'>atomize</h4>
                <ul className="links">
                    <Link to='analyze' className="link" disabled><li>analyze</li></Link>
                    <Link to='top' className="link"><li>top</li></Link>
                    <Link to='explore' className="link" disabled><li>explore</li></Link>
                </ul>
        </nav>
    )
}

export default Navbar;
