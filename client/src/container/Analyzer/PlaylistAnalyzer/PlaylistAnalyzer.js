import React, {useState, useEffect} from 'react';
import axios from 'axios';

import List from '../../../component/List/List';
import './PlaylistAnalyzer.css'

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PlaylistAnalyzer = (props) => {

    const [playlistId, setPlaylistId] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [audioFeatureData, setAudioFeatureData] = useState([]);

    const items = props.items;

    useEffect(getData,[isReady]);

    function getData() {
        if (isReady) {
            getPlaylistItems()
                .then(items => getTrackIds(items))
                .then(trackIds => getAudioFeatures(trackIds))
                .then(audioFeatureData => {
                    setAudioFeatureData(audioFeatureData);
                });
        }
    }

    async function getPlaylistItems() {
        const url = `${BASE_URL}/api/spotify-helper/playlist/${playlistId}`;
        return await axios.get(url)
            .then(response => response.data.items);
    }

    function getTrackIds(arrayOfTrackObjects) {
        let trackIds = [];
        for (const track of arrayOfTrackObjects) {
            trackIds.push(track.track.id);
        }
        console.log(trackIds);
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

    function handleClick(e) {
        const id = e.target.id;
        setPlaylistId(id);
        setIsReady(true);
    }

    function DataAnalyzer() {
        return (
            <div>
                <span>{calculateAudioFeatureAverages(audioFeatureData).danceability}</span>
            </div>
        )
    }

    return (
        <div className='playlist-analyzer'>
            {isReady ? DataAnalyzer() : <List items={items} handleClick={handleClick}/>}
        </div>
    )
}

export default PlaylistAnalyzer;