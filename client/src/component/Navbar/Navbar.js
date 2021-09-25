import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

const Navbar = () => {

    return (
        <nav className='Navbar'>
            <NavLink to='/' className='Navbar__Logo'><span>atomize</span></NavLink>
            <div className='Navbar__Links'>
                <NavLink exact to='analyze' className='Navbar__Link' activeClassName='Navbar__Link--Active' disabled>
                    <span>analyze <i className="fas fa-chart-bar" /></span>
                </NavLink>
                <NavLink exact to='top' className='Navbar__Link' activeClassName='Navbar__Link--Active'>
                    <span>top <i className="fas fa-trophy" /></span>
                </NavLink>
                {/* <NavLink exact to='explore' className='Navbar__Link' activeClassName='Navbar__Link--Active' disabled>
                    <span>explore <i className="fas fa-atlas" /></span>
                </NavLink> */}
            </div>
        </nav>
    )
}

export default Navbar;

