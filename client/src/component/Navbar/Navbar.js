import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import './Navbar.css';

const Navbar = () => {

    const [isMenuExpanded, setIsMenuExpanded] = useState(true);

    function toggleBurgerMenu() {
        setIsMenuExpanded(!isMenuExpanded);
    }

    return (
        <nav className='Navbar'>
            <NavLink to='/' className='Navbar__Logo'><span>atomize</span></NavLink>
            <div className="Navbar__Menu__Toggle" onClick={toggleBurgerMenu}>
                <i className="fas fa-bars" />
            </div>
            <div className='Navbar__Links'>
                <NavLink to='analyze' className='Navbar__Link' activeClassName='Navbar__Link--active' disabled>
                    <span>analyze <i className="fas fa-chart-bar" /></span>
                </NavLink>
                <NavLink to='top' className='Navbar__Link' activeClassName='Navbar__Link--active'>
                    <span>top <i className="fas fa-trophy" /></span>
                </NavLink>
                <NavLink to='explore' className='Navbar__Link' activeClassName='Navbar__Link--active' disabled>
                    <span>explore <i className="fas fa-atlas" /></span>
                </NavLink>
            </div>
        </nav>
    )
}

export default Navbar;
