import React, { useState, useEffect } from 'react';
import axios from 'axios';

import List from '../../../component/List/List';

const TrackAnalyzer = (props) => {

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    function handleSearch(e) {
        setSearchText(e.currentTarget.value);
    }

    async function handleClick() {
        const url = `${BASE_URL}/api/spotify-helper/search?q=${searchText}&type=track`;
        await axios.get(url)
            .then(response => response.data.tracks.items)
            .then(items => {
                setSearchResults(items);
                if (!isLoaded) setIsLoaded(true);
            });
    }

    return (
        <div classname='track-analyzzer'>
            <input type="text" onChange={handleSearch} />
            <button onClick={handleClick}>search</button>
            <span>{'track-analyzer'}</span>
            {isLoaded ? <List items={searchResults} /> : null}
        </div>
    )
}

export default TrackAnalyzer;