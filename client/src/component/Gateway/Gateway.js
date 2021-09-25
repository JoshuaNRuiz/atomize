import React from 'react';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import './Gateway.css';

const Gateway = () => {

    return (
        <div className="Gateway">
            <Header>ATOMIZE</Header>
            <Link to="/top" className="Part">
                <i className="fas fa-trophy Part__Icon" />
                <span className="Part__Title"> Top Artists & Tracks</span>
            </Link>
        </div>
    )

}

export default Gateway;