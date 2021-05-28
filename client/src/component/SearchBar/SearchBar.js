import React from 'react';
import '@fortawesome/fontawesome-free/js/all';

import './SearchBar.css';

const SearchBar = ({value, handleSearch, handleChange}) => {

    return (
        <div className="SearchBar">
            <i class="fas fa-search SearchBar__Icon"></i>
            <input className="SearchBar__Input" 
                type="text" 
                autoFocus 
                placeholder="search"
                value={value}
                onKeyDown={handleSearch} 
                onChange={handleChange}>
            </input>
        </div>
    )
}

export default SearchBar;