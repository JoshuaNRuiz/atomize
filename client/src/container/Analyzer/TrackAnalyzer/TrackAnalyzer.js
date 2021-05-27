import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Constants from '../../../helpers/Constants';

import List from '../../../component/List/List';
import CustomChart from "../../../component/Chart/CustomChart";
import SearchBar from '../../../component/SearchBar/SearchBar';
import TrackItem from '../../../component/Items/TrackItem/TrackItem';

import './TrackAnalyzer.css';

const TrackAnalyzer = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [mode, setMode] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [trackDetails, setTrackDetails] = useState({});
    const [trackFeatures, setTrackFeatures] = useState({});

    function searchForTrack(track) {
        const url = `${BASE_URL}/api/spotify-helper/search?q=${track}&type=track`;
        axios.get(url)
            .then(response => response.data.tracks.items)
            .then(items => {
                setSearchResults(items);
                if (mode !== Constants.MODE_SEARCH) setMode(Constants.MODE_SEARCH);
            });
    };

    function handleTrackSelection(event) {
        event.stopPropagation();
        const index = event.currentTarget.id;

        const trackDetails = searchResults[index];
        setTrackDetails(trackDetails);

        const trackId = trackDetails.id;
        getAudioFeatures(trackId)
            .then(audioFeatures => {
                setTrackFeatures(audioFeatures);
                setMode(Constants.MODE_ANALYZE)
            });
    };

    async function getAudioFeatures(trackId) {
        const url = `${BASE_URL}/api/spotify-helper/audio-features/${trackId}`;
        return await axios.get(url)
            .then(response => response.data)
            .then(audioFeatures => filterAudioFeatures(audioFeatures));
    }

    function filterAudioFeatures(data) {
        const { danceability, energy, instrumentalness, speechiness, valence } = data;
        return {
            danceability: danceability,
            energy: energy,
            instrumentalness: instrumentalness,
            speechiness: speechiness,
            valence: valence
        }
    };

    function returnToSearch() {
        setMode(Constants.MODE_SEARCH);
    }

    function renderSearchList() {
        return (mode === Constants.MODE_SEARCH)
            ? <List items={searchResults} handleClick={handleTrackSelection} />
            : null;
    }

    function renderAnalyticalComponents() {
        if (mode === Constants.MODE_ANALYZE) {
            const { id, name, artists, album } = trackDetails;
            const analyzeHeader = (
                <div className="TrackAnalyzer__AnalyzerHeader">
                    <button className="TrackAnalyzer__BackButton" onClick={returnToSearch}><i class="fas fa-chevron-left"></i></button>
                    <TrackItem id={id} name={name} artists={artists} album={album} />
                </div>
            );

            const components = [
                analyzeHeader,
                <CustomChart data={trackFeatures} />,
            ];

            return components;
        } else {
            return null;
        }
    }

    return (
        <div className='TrackAnalyzer'>
            <SearchBar handleSearch={searchForTrack} />
            {renderSearchList()}
            {renderAnalyticalComponents()}
        </div>
    )
}

export default TrackAnalyzer;