import * as Constants from '../../helpers/Constants';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import List from '../../component/List/List';
import Selector from '../../component/Selector/Selector';
import TrackAnalyzer from './TrackAnalyzer/TrackAnalyzer';
import PlaylistAnalyzer from './PlaylistAnalyzer/PlaylistAnalyzer';

import './Analyzer.css';

const Analyzer = (props) => {

    const [isSearch, setIsSearch] = useState(false);
    const [items, setItems] = useState({})
    const [searchItems, setSearchItems] = useState([]);
    const [mode, setMode] = useState('select');
    const [isLoaded, setLoaded] = useState(false);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(updateItems, [mode]);

    function updateItems() {
        if (mode === Constants.MODE_PLAYLIST && !isLoaded) {
            getUserData(mode)
                .then(data => setItems(data))
                .then(() => setLoaded(true));
        }
    }

    async function getUserData(type) {
        const url = `${BASE_URL}/api/spotify-helper/user-data/${type}`;
        const data = await axios.get(url).then(response => response.data);
        return data;
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

    const selectorOptions = [
        {
            value: Constants.MODE_PLAYLIST,
            imgUrl: '',
        },
        {
            value: Constants.MODE_TRACK,
            imgUrl: ''
        },
    ];

    return (
        <div>
            <h2 className='page-title'>analyzer</h2>
            {mode === Constants.MODE_SELECT && <Selector options={selectorOptions} handleSelection={handleSelection}/>}
            {mode === Constants.MODE_PLAYLIST && isLoaded && <PlaylistAnalyzer items={items}/>}
            {mode === Constants.MODE_TRACK && <TrackAnalyzer />}
        </div>
    )
}

export default Analyzer;