import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = (props) => {

    return (
        <nav className='navbar'>
            <h4 className='logo'>atomize</h4>
                <ul className="links">
                    <Link to='analyze' className="link"><li>analyze</li></Link>
                    <Link to='top' className="link"><li>top</li></Link>
                    <Link to='explore' className="link"><li>explore</li></Link>
                </ul>
        </nav>
    )
}

export default Navbar;
