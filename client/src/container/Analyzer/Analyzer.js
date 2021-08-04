import React, { useState, useEffect } from 'react';

import TrackAnalyzer from './TrackAnalyzer/TrackAnalyzer';
import PlaylistAnalyzer from './PlaylistAnalyzer/PlaylistAnalyzer';
import SearchBar from '../../component/SearchBar/SearchBar';
import List from '../../component/List/List';
import Toggle from '../../component/Toggle/Toggle';

import * as Constants from '../../helpers/Constants';
import { searchForTrack, getUsersPlaylists } from '../../helpers/functions';
import './Analyzer.css';

const Analyzer = () => {

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const [mode, setMode] = useState(null);
    const [type, setType] = useState(Constants.TYPE_TRACK);

    const [track, setTrack] = useState(null);
    const [playlist, setPlaylist] = useState({});
    const [userPlaylists, setUserPlaylists] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [handleSearch, setSearchHandler] = useState(null);

    const [isReady, setReadyStatus] = useState(false);

    function ModeChooser() {
        function handleModeChange(event) {
            const mode = event.target.value;
            setMode(mode);
            console.log(mode);
        }

        const options = {
            name: 'mode',
            values: [Constants.MODE_SEARCH, Constants.MODE_LIBRARY]
        }

        return <Toggle options={options} handleChange={handleModeChange}/>
    }

    function TypeChooser() {
        function handleTypeChange(event) {
            const type = event.target.value;
            setType(type);
            console.log(type);
        }

        const options = {
            name: 'type',
            values: [Constants.TYPE_TRACK, Constants.TYPE_PLAYLIST]
        }

        return <Toggle options={options} handleChange={handleTypeChange}/>
    }

    function reset() {
        setSearchText('');
        setSearchResults(null);
        setReadyStatus(false);
    }

    function buildSearchBar() {
        let searchFunction;

        if (type === Constants.TYPE_TRACK) {
            searchFunction = handleTrackSearch;
        } else if (type === Constants.TYPE_PLAYLIST) {
            searchFunction = filterPlaylists;
        }

        setSearchHandler(() => searchFunction);
    }

    async function handleTrackSearch(event) {
        console.log(event);
        if (event.key === 'Enter') {
            const tracks = await searchForTrack(searchText);
            if (tracks) setSearchResults(tracks);
            setReadyStatus(false);
        }
    }

    function filterPlaylists() {
        const search = searchText.toUpperCase();
        const results = Object.values(userPlaylists).filter(playlist => {
            return playlist.name.toUpperCase().includes(search);
        });
        setSearchResults(results);
    }

    function handleSearchTextInput(event) {
        const value = event.target.value;
        console.log(value);
        setSearchText(value);
    }

    function buildSearchList() {
        async function handleTrackSelection(event) {
            event.stopPropagation();
            const index = event.currentTarget.value;
            const track = searchResults[index];
            setTrack(track);
            setReadyStatus(true);
        };

        function handlePlaylistSelection(event) {
            event.stopPropagation();
            const index = event.currentTarget.value;
            const playlist = userPlaylists[index];
            setPlaylist(playlist);
            // now draw a list of tracks
        }

        let items, handleClick;

        if (mode === Constants.MODE_SEARCH) {
            items = searchResults;
            handleClick = handleTrackSelection;
        } else if (type === Constants.TYPE_PLAYLIST) {
            items = searchResults ? searchResults : userPlaylists;
            handleClick = handlePlaylistSelection;
        }

        return (
            <List
                items={items}
                handleClick={handleClick} />
        )
    }

    function renderAnalyzer() {
        switch (type) {
            case Constants.TYPE_TRACK:
                return <TrackAnalyzer track={track} />;
            case Constants.TYPE_PLAYLIST:
                return <PlaylistAnalyzer playlist={playlist} />;
            default:
                return null;
        }
    }

    function retrieveUserPlaylists() {
        if (mode === Constants.MODE_LIBRARY && type === Constants.TYPE_PLAYLIST) {
            getUsersPlaylists()
                .then(playlists => {
                    setUserPlaylists(playlists);
                });
        }
    }

    useEffect(retrieveUserPlaylists, [mode])
    useEffect(buildSearchBar, [type, searchText])

    return (
        <div className='Analyzer'>
            {mode === null ? ModeChooser() : TypeChooser()}
            <SearchBar
                value={searchText}
                handleSearch={handleSearch}
                handleChange={event => setSearchText(event.target.value)}/>
            {isReady
                ? renderAnalyzer()
                : buildSearchList()}
        </div>
    )
}

export default Analyzer;