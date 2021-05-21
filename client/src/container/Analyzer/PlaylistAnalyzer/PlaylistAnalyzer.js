import React, { useState, useEffect } from 'react';
import axios from 'axios';

import List from '../../../component/List/List';
import './PlaylistAnalyzer.css'

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PlaylistAnalyzer = (props) => {

    const [playlists, setPlaylists] = useState({})
    const [isReady, setIsReady] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [audioFeatureData, setAudioFeatureData] = useState([]);

    useEffect(getUsersPlaylists, []);

    async function getUsersPlaylists() {
        const url = `${BASE_URL}/api/spotify-helper/user-data/playlists`;
        axios.get(url)
            .then(response => {
                const playlists = response.data;
                setPlaylists(playlists);
            })
            .then(() => setIsReady(true));
    }

    function handleClick(event) {
        event.stopPropagation();
        const playlistId = event.currentTarget.value;
        if (!!playlistId) {
            getData(playlistId);
        }
    }

    function getData(playlistId) {
        getTracksFromPlaylist(playlistId)
            .then(tracks => getTrackIds(tracks))
            .then(trackIds => getAudioFeatures(trackIds))
            .then(audioFeatureData => setAudioFeatureData(audioFeatureData));
    }

    async function getTracksFromPlaylist(playlistId) {
        const url = `${BASE_URL}/api/spotify-helper/playlist/${playlistId}`;
        const tracks = await axios.get(url)
            .then(response => response.data.items);
        return tracks;
    }

    function getTrackIds(tracks) {
        let trackIds = [];
        for (const track of tracks) {
            trackIds.push(track.track.id);
        }
        return trackIds;
    }

    async function getAudioFeatures(trackIds) {
        const url = `${BASE_URL}/api/spotify-helper/audio-features`;
        const requestData = {
            track_ids: trackIds
        }
        const data = await axios.post(url, requestData)
            .then(response => {
                return response.data;
            });
        console.log(data);
        return data;
    }

    function calculateAudioFeatureAverages(featureData) {
        let featureAverages = {
            danceability: 0,
            energy: 0,
            tempo: 0,
            valence: 0,
            liveness: 0,
            instrumentalness: 0,
            speechiness: 0
        }

        for (const data of Object.values(featureData)) {
            featureAverages.danceability += data.danceability;
            featureAverages.energy += data.energy;
            featureAverages.tempo += data.tempo;
            featureAverages.valence += data.valence;
            featureAverages.liveness += data.liveness;
            featureAverages.instrumentalness += data.instrumentalness;
            featureAverages.speechiness += data.speechiness;
        }

        const count = Object.keys(featureData).length;

        Object.keys(featureAverages).forEach(key => {
            featureAverages[key] = featureAverages[key] / count;
        })

        return featureAverages;
    }

    // TODO: THIS HAS TO BE IMPROVED, WE ARE DUPLICATING DATA -- we just need to filter
    function handleSearch(event) {
        const searchString = event.currentTarget.value.trim().toUpperCase();
        if (searchString !== '') {
            let results = Object.values(playlists).filter(playlist => {
                return playlist.name.toUpperCase().includes(searchString);
            });
            if (results.length === 0) results = {};
            setSearchResults(results)
            if (!isSearch) setIsSearch(true);
        } else {
            setIsSearch(false);
        }
    }

    return (
        <div className='PlaylistAnalyzer'>
            {isReady && <input type="text" className="Analyzer__SearchBar" onChange={handleSearch} />}
            {isReady && <List items={isSearch ? searchResults : playlists} handleClick={handleClick} />}
        </div>
    )
}

export default PlaylistAnalyzer;