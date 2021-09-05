import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = (props) => {

    return (
        <nav className='Navbar'>
            <Link to='/'><h4 className='Navbar__Logo'>atomize</h4></Link>
            <ul className="Navbar__Links">
                <Link to='analyze' className="Navbar__Link" disabled><li>analyze</li></Link>
                <Link to='top' className="Navbar__Link"><li>top</li></Link>
                <Link to='explore' className="Navbar__Link" disabled><li>explore</li></Link>
                <Link to='vibe' className="Navbar__Link" disabled><li>vibe</li></Link>
            </ul>
        </nav>
    )
}

export default Navbar;
