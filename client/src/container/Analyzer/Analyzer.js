import * as Constants from '../../helpers/Constants';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Selector from '../../component/Selector/Selector';
import TrackAnalyzer from './TrackAnalyzer/TrackAnalyzer';
import PlaylistAnalyzer from './PlaylistAnalyzer/PlaylistAnalyzer';

import trackImage from '../../resources/vinyl-background.jpg';
import playlistImage from '../../resources/playlist-image.jpg';

import './Analyzer.css';
import SearchBar from '../../component/SearchBar/SearchBar';
import List from '../../component/List/List';

import { searchForTrack, getAudioFeatures, getUsersPlaylists } from '../../helpers/functions';
import TrackItem from '../../component/Items/TrackItem/TrackItem';
import CustomChart from '../../component/Chart/CustomChart';

const Analyzer = () => {

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const [mode, setMode] = useState(Constants.MODE_TRACK);
    const [track, setTrack] = useState(null);
    const [playlist, setPlaylist] = useState({});
    const [userPlaylists, setUserPlaylists] = useState({});
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [audioFeatures, setAudioFeatures] = useState(null);
    const [isReady, setReady] = useState(false);

    function ModeChooser() {
        return (
            <div>
                <span>tracks</span>
                <input type="radio" name="mode" value={Constants.MODE_TRACK} onChange={handleModeChange} />
                <span>playlists</span>
                <input type="radio" name="mode" value={Constants.MODE_PLAYLIST} onChange={handleModeChange} />
            </div>
        )
    }

    function handleModeChange(event) {
        const mode = event.target.value;
        setMode(mode);
    }

    function renderAnalyzer() {
        switch(mode) {
            case Constants.MODE_TRACK:
                return TrackAnalyzer();
            case Constants.MODE_PLAYLIST:
                return PlaylistAnalyzer();
            default: 
                return null;
        }
    }

    function TrackAnalyzer() {
        if (mode !== Constants.MODE_TRACK) return null;

        async function handleTrackSearch(event) {
            if (event.key === 'Enter') {
                const value = event.target.value;
                const tracks = await searchForTrack(value);
                setSearchResults(tracks);
                setReady(false);
            }
        }

        async function handleTrackSelection(event) {
            event.stopPropagation();

            const index = event.currentTarget.id;
            const track = searchResults[index];
            setTrack(track);

            const trackId = track.id;
            const filteredAudioFeatures = await getAudioFeatures(trackId);
            setAudioFeatures(filteredAudioFeatures);

            setReady(true);
        };

        return (
            <div>
                <SearchBar handleSearch={handleTrackSearch} />
                {!isReady && <List
                    items={searchResults ? searchResults : null}
                    handleClick={handleTrackSelection}
                />}
            </div>
        )
    }

    function PlaylistAnalyzer() {
        if (mode !== Constants.MODE_PLAYLIST) return null;

        function filterPlaylists(event) {
            const search = event.target.value.trim().toUpperCase();
            const results = Object.values(userPlaylists).filter(playlist => {
                return playlist.name.toUpperCase().includes(search);
            });
            setSearchResults(results);
        }

        function handlePlaylistSelection(event) {
            event.stopPropagation();

            const index = event.currentTarget.id
            const playlist = userPlaylists[index]
            setPlaylist(playlist);

            // now draw a list of tracks
        }

        return (
            <div>
                <SearchBar handleChange={filterPlaylists} />
                <List
                    items={searchResults ? searchResults : userPlaylists}
                    handleClick={handlePlaylistSelection}
                />
            </div>
        )
    }

    function renderAnalyticalComponents() {
        if (!isReady) return null;
        
        const { id, name, artists, album } = track;
        const analyzeHeader = (
            <div className="TrackAnalyzer__AnalyzerHeader">
                <TrackItem id={id} name={name} artists={artists} album={album} />
            </div>
        );

        const components = [
            analyzeHeader,
            <CustomChart data={audioFeatures} />,
        ];

        return components;
    }

    function changeMode() {
        setSearchResults(null);
        setReady(false);
        if (mode === Constants.MODE_PLAYLIST) {
            getUsersPlaylists()
                .then(playlists => setUserPlaylists(playlists));
        }
    }

    useEffect(changeMode, [mode]);

    return (
        <div className='Analyzer'>
            {ModeChooser()}
            {renderAnalyzer()}
            {renderAnalyticalComponents()}
        </div>
    )
}

export default Analyzer;