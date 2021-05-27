import React from 'react';
import '@fortawesome/fontawesome-free/js/all';

import './SearchBar.css';

const SearchBar = (props) => {

    const handleSearch = props.handleSearch;

    function search(event) {
        event.stopPropagation();
        const searchText = event.currentTarget.value.trim();
        if (event.key === 'Enter') {
            handleSearch(searchText);
        }
    }

    return (
        <div className="SearchBar">
            <i class="fas fa-search SearchBar__Icon"></i>
            <input className="SearchBar__Input" type="text" autoFocus placeholder="search" onKeyDown={search}>
            </input>
        </div>
    )
}

export default SearchBar;