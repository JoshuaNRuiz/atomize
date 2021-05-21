import React, { useState, useEffect } from 'react';
import axios from 'axios';

import List from '../../../component/List/List';
import CustomChart from "../../../component/Chart/CustomChart";

const TrackAnalyzer = (props) => {

    const [searchResults, setSearchResults] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isTrackSelected, setIsTrackSelected] = useState(false);
    const [trackFeatures, setTrackFeatures] = useState({});

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    async function searchForTrack(event) {
        if (event.key == 'Enter') {
            const searchText = event.target.value.trim();
            const url = `${BASE_URL}/api/spotify-helper/search?q=${searchText}&type=track`;
            await axios.get(url)
                .then(response => response.data.tracks.items)
                .then(items => {
                    setSearchResults(items);
                    if (!isLoaded) setIsLoaded(true);
                });
        }
    }

    async function handleClick(event) {
        event.stopPropagation();
        const trackId = event.currentTarget.id;

        const url = `${BASE_URL}/api/spotify-helper/audio-features/${trackId}`;
        await axios.get(url)
            .then(response => {
                const data = filterData(response.data);
                setTrackFeatures(data);
            })
            .then(() => setIsTrackSelected(true));
    }

    function filterData(data) {
        console.log(data);
        const {acousticness, danceability, energy, liveness, speechiness} = data;
        return {
            acousticness: acousticness,
            danceability: danceability,
            energy: energy,
            liveness: liveness,
            speechiness: speechiness,
        }
    }

    return (
        <div classname='TrackAnalyzer'>
            <input type="text" onKeyDown={searchForTrack}/>
            {isLoaded && !isTrackSelected && <List items={searchResults} handleClick={handleClick}/>}
            {isTrackSelected && <CustomChart title={"vibe"} data={trackFeatures} />}
        </div>
    )
}

export default TrackAnalyzer;