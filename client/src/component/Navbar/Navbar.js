import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import './Navbar.css';

const Navbar = (props) => {

    return (
        <nav className='Navbar'>
            <Link to='/'><h4 className='Navbar__Logo'>atomize</h4></Link>
            <ul className='Navbar__Links'>
                <NavLink to='analyze' className='Navbar__Link' activeClassName='Navbar__Link--active' disabled>
                    <li>analyze</li>
                </NavLink>
                <NavLink to='top' className='Navbar__Link' activeClassName='Navbar__Link--active'>
                    <li>top</li>
                </NavLink>
                <NavLink to='explore' className='Navbar__Link' activeClassName='Navbar__Link--active' disabled>
                    <li>explore</li>
                </NavLink>
                <NavLink to='vibe' className='Navbar__Link' activeClassName='Navbar__Link--active' disabled>
                    <li>vibe</li>
                </NavLink>
            </ul>
        </nav>
    )
}

export default Navbar;
