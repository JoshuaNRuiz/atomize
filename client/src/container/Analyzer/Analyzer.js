import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import List from '../../component/List/List';
import Selector from '../../component/Selector/Selector';

import './Analyzer.css';

const Analyzer = (props) => {

    const [isSearch, setIsSearch] = useState(false);
    const [items, setItems] = useState({})
    const [searchItems, setSearchItems] = useState([]);
    const [mode, setMode] = useState('select');
    const [isLoaded, setLoaded] = useState(false);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    async function getUserData(type) {
        const url = `${BASE_URL}/api/spotify-helper/user-data/${type}`;
        const data = await axios.get(url).then(response => response.data);
        return data;
    }

    function getTrackIds(tracks) {
        let ids = [];
        const tracksArray = Object.values(items);
        if (tracksArray.length > 0) {
            for (const track of tracksArray) {
                ids.push(track.id);
            }
        } else {
            throw new Error("Tried to get track ids for an empty list of tracks");
        }
        return ids;
    }

    async function getAudioFeatureData(trackIds) {
        const url = `${BASE_URL}/api/spotify-helper/audio-features`
        const requestData = {
            track_ids: trackIds
        }
        const data = await axios.post(url, requestData);
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

        console.log(featureAverages);
        return featureAverages;
    }

    // TODO: THIS HAS TO BE IMPROVED, WE ARE DUPLICATING DATA -- we just need to filter
    function handleSearch(e) {
        const searchString = e.target.value.toUpperCase().trim();
        if (searchString !== '') {
            const searchResults = Object.values(items).filter(playlist => {
                return playlist.name.toUpperCase().includes(searchString);
            });
            setSearchItems({...searchResults});
            if (!isSearch) setIsSearch(true);
        } else {
            setIsSearch(false);
        }
    } 

    function handleSelection(e) {
        const value = e.target.value;
        setMode(value);
    }

    const testOptions = [
        {
            name: 'Playlists',
            imgUrl: ''
        },
        {
            name: 'Tracks',
            imgUrl: ''
        },
    ];

    function updateItems() {
        if ((mode === 'playlists' || mode === 'tracks') && !isLoaded) {
            getUserData(mode)
                .then(data => setItems(data))
                .then(() => setLoaded(true));
        }
    }

    function handleListClick(e) {
        console.log(e.target);
    }

    useEffect(updateItems, [mode]);

    return (
        <div>
            <h2 className='page-title'>analyzer</h2>
            {mode === 'select' && <Selector options={testOptions} handleSelection={handleSelection}/>}
            {mode === 'playlists' && isLoaded && <List type={mode} items={items} handleClick={handleListClick}/>}
            {mode === 'tracks' && <input type='text' onChange={handleSearch}/>}
        </div>
    )
}

export default Analyzer;