import React from 'react';
import '@fortawesome/fontawesome-free/js/all';

import './SearchBar.css';

const SearchBar = (props) => {

    const handleSearch = props.handleSearch;

    return (
        <div className="SearchBar">
            <i class="fas fa-search SearchBar__Icon"></i>
            <input className="SearchBar__Input" type="text" autoFocus placeholder="search" onKeyDown={handleSearch}>
            </input>
        </div>
    )
}

export default SearchBar;