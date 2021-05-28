import React from 'react';
import '@fortawesome/fontawesome-free/js/all';

import './SearchBar.css';

const SearchBar = ({handleSearch, handleChange}) => {

    function search(event) {
        const searchText = event.target.value.trim();
        if (!!handleSearch && event.key === 'Enter') {
            handleSearch(searchText);
        }
    }

    return (
        <div className="SearchBar">
            <i class="fas fa-search SearchBar__Icon"></i>
            <input className="SearchBar__Input" 
                type="text" 
                autoFocus 
                placeholder="search" 
                onKeyDown={search}
                onChange={handleChange}>
            </input>
        </div>
    )
}

export default SearchBar;