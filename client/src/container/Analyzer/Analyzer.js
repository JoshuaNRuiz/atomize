import React, { useState, useEffect } from 'react';
import { searchForTrack, getAudioFeaturesForTrack, getTrack, useQueryParameters } from '../../helpers/functions';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useHistory } from 'react-router-dom';
import SearchBar from '../../component/SearchBar/SearchBar';
import TrackItem from '../../component/Items/TrackItem/TrackItem';
import './Analyzer.css';
import List from '../../component/List/List';

const Analyzer = () => {
    const [track, setTrack] = useState(null);
    const [audioFeatures, setAudioFeatures] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearch, setIsSearch] = useState(false);

    const queryParameters = useQueryParameters();
    const history = useHistory();

    // getting track details
    useEffect(() => {
        const trackId = queryParameters.get("trackId");
        if (trackId) {
            getTrack(trackId)
                .then(track => setTrack(track))
                .catch(error => alert(error))
        }
    }, [])

    // getting audio features
    useEffect(() => {
        if (track && track.id) {
            getAudioFeaturesForTrack(track.id)
                .then(audioFeatures => processAudioFeatures(audioFeatures))
                .then(processedAudioFeatures => setAudioFeatures(processedAudioFeatures));
        }
    }, [track]);

    function processAudioFeatures(features) {
        const { acousticness,
            danceability,
            energy,
            instrumentalness,
            liveness,
            valence,
            speechiness
        } = features;
        return [
            { name: "acousticness", value: acousticness },
            { name: "danceability", value: danceability },
            { name: "energy", value: energy },
            { name: "instrumentalness", value: instrumentalness },
            { name: "liveness", value: liveness },
            { name: "speechiness", value: speechiness },
            { name: "valence", value: valence }
        ]
    }

    async function handleTrackSearch(event) {
        if (event.key === 'Enter') {
            setIsSearch(true);
            let results = await searchForTrack(searchText);
            if (results) setSearchResults(results);
        }
    }
    
    function handleResultSelection(event) {
        const value = event.currentTarget.value;
        setTrack(searchResults[value]);
        history.push(`?trackId=${value}`);
        setIsSearch(false);
    }

    function buildSearchResults() {
        return (
            <List items={searchResults} handleClick={handleResultSelection}/>
        )
    }

    function buildChart() {
        return (
            <ResponsiveContainer height={250} width={"90%"}>
                <RadarChart
                    outerRadius={85}
                    width={800}
                    height={250}
                    data={audioFeatures}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#FFFFFF' }} />
                    <Radar
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#FFC608"
                        fillOpacity={0.9}
                        isAnimationActive={false} />
                    <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        )
    }

    function buildTrack() {
        return (
            <TrackItem id={track.id} index={0} name={track.name} artists={track.artists} album={track.album} />
        )
    }

    return (
        <div className='Analyzer'>
            <SearchBar
                value={searchText}
                handleSearch={handleTrackSearch}
                handleChange={event => setSearchText(event.target.value)} />
            {isSearch && searchResults && buildSearchResults()}
            {!isSearch && track && buildTrack()}
            {!isSearch && audioFeatures && buildChart()}
        </div>
    )
}

export default Analyzer;