import React, { useState, useEffect } from 'react';

import SearchBar from '../../component/SearchBar/SearchBar';

import { searchForTrack, getAudioFeatures } from '../../helpers/functions';
import './Analyzer.css';
import TrackList from '../../component/List/TrackList/TrackList';

const Analyzer = () => {
    const [track, setTrack] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    async function handleTrackSearch(event) {
        if (event.key === 'Enter') {
            let results = await searchForTrack(searchText);
            if (results) {
                const ids = results.map(result => result.id);
                const features = await getAudioFeatures(ids);
                const tracks = results.map((result, index) => {
                    const track = {...result};
                    track.features = features[index];
                    return track;
                });
                setSearchResults(tracks);
            }
        }
    }

    function buildSearchList() {
        const TRACKLIST_COLUMNS = ['tempo', 'energy', 'valence'];
        return <TrackList tracks={searchResults} columns={TRACKLIST_COLUMNS}/>
    }

    return (
        <div className='Analyzer'>
            <SearchBar
                value={searchText}
                handleSearch={handleTrackSearch}
                handleChange={event => setSearchText(event.target.value)} />
            {buildSearchList()}
        </div>
    )
}

export default Analyzer;