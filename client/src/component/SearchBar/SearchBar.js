import React from 'react';

import './SearchBar.css';

const SearchBar = (props) => {

    const handleSearch = props.handleSearch;

    return (
        <div className="SearchBar">
            <input className="SearchBar__Input" type="text" autoFocus onKeyDown={handleSearch}>
            </input>
        </div>
    )
}

export default SearchBar;