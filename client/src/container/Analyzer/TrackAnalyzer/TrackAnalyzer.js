import React, { useState, useEffect } from 'react';
import axios from 'axios';

import List from '../../../component/List/List';

const TrackAnalyzer = (props) => {

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isTrackSelected, setIsTrackSelected] = useState(false);
    const [trackFeatures, setTrackFeatures] = useState({});

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    function handleSearchInput(e) {
        // setSearchText(e.currentTarget.value);
    }

    async function searchForTrack(e) {
        if (e.key == 'Enter') {
            const searchText = e.target.value.trim();
            const url = `${BASE_URL}/api/spotify-helper/search?q=${searchText}&type=track`;
            await axios.get(url)
                .then(response => response.data.tracks.items)
                .then(items => {
                    setSearchResults(items);
                    if (!isLoaded) setIsLoaded(true);
                });
        }
    }

    async function handleClick(e) {
        e.stopPropagation();
        const trackId = e.currentTarget.id;
        console.log(trackId);
        const url = `${BASE_URL}/api/spotify-helper/audio-features/${trackId}`
        await axios.get(url)
            .then(response => {
                const data = response.data;
                setTrackFeatures(data);
            })
            .then(() => setIsTrackSelected(true));
    }

    function displayData() {
        if (isTrackSelected) {
            console.log(trackFeatures);
        }
    }

    useEffect(displayData, [isTrackSelected]);

    return (
        <div classname='track-analyzer'>
            <input type="text" onChange={handleSearchInput} onKeyDown={searchForTrack}/>
            {isLoaded && !isTrackSelected && <List items={searchResults} handleClick={handleClick}/>}
            {isTrackSelected && <div>A</div>}
        </div>
    )
}

export default TrackAnalyzer;