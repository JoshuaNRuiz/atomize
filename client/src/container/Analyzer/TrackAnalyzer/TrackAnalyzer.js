import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Constants from '../../../helpers/Constants';

import List from '../../../component/List/List';
import CustomChart from "../../../component/Chart/CustomChart";
import SearchBar from '../../../component/SearchBar/SearchBar';
import TrackItem from '../../../component/Items/TrackItem/TrackItem';

import './TrackAnalyzer.css';

const TrackAnalyzer = (props) => {

    const [searchResults, setSearchResults] = useState({});
    const [targetTrack, setTargetTrack] = useState({});
    const [trackFeatures, setTrackFeatures] = useState({});

    const [mode, setMode] = useState('');

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    async function searchForTrack(event) {
        if (event.key == 'Enter') {
            const searchText = event.target.value.trim();
            const url = `${BASE_URL}/api/spotify-helper/search?q=${searchText}&type=track`;
            await axios.get(url)
                .then(response => response.data.tracks.items)
                .then(items => {
                    setSearchResults(items);;
                })
                .then(() => setMode(Constants.MODE_SEARCH));
        }
    };

    async function handleTrackSelection(event) {
        event.stopPropagation();

        const trackId = event.currentTarget.id;
        const track = searchResults.find(item => item.id === trackId);
        setTargetTrack(track);

        const url = `${BASE_URL}/api/spotify-helper/audio-features/${trackId}`;
        await axios.get(url)
            .then(response => {
                const data = filterData(response.data);
                setTrackFeatures(data);
            })
            .then(() => setMode(Constants.MODE_ANALYZE));
    };

    function filterData(data) {
        const { acousticness, danceability, energy, liveness, speechiness } = data;
        return {
            acousticness: acousticness,
            danceability: danceability,
            energy: energy,
            liveness: liveness,
            speechiness: speechiness,
        }
    };

    function buildHeader(track) {
        const id = track.id;
        const title = track.name;
        const artistName = track.artists[0].name;
        const album = track.album;
        return (
            <TrackItem id={id} title={title} artists={artistName} album={album}/>
        )
    };

    return (
        <div className='TrackAnalyzer'>
            <SearchBar handleSearch={searchForTrack} />
            {mode === Constants.MODE_SEARCH && <List items={searchResults} handleClick={handleTrackSelection} />}
            {mode === Constants.MODE_ANALYZE && buildHeader(targetTrack)}
            {mode === Constants.MODE_ANALYZE && <CustomChart data={trackFeatures} />}
        </div>
    )
}

export default TrackAnalyzer;