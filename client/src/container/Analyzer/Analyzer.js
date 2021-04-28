import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import List from '../../component/List/List';
import Chart from '../../component/Chart/Chart';

import searchicon from '../../resources/searchicon.svg';

import './Analyzer.css';

const Analyzer = (props) => {

    const [isSearch, setIsSearch] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState({});
    const [userTracks, setUserTracks] = useState({});
    const [audioFeatureData, setAudioFeatureData] = useState({});
    const [audioFeatureAverages, setAudioFeatureAverages] = useState({});
    const [searchItems, setSearchItems] = useState([]);
    const [isChart, setIsChart] = useState(true);
    const [mode, setMode] = useState(null);
    const [isReady, setReady] = useState(false);

    const MODES = ['SELECTION', 'PLAYLIST', 'TRACK'];

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    async function getUserData(type) {
        let url = BASE_URL;

        switch (type) {
            case 'playlist':
                url += '/api/spotify-helper/user-playlists';
                break;
            case 'liked-tracks':
                url += '/api/spotify-helper/liked-tracks';
                break;
            default:
                throw new Error("requested user data not available");
        }

        const data = await axios.get(url)
            .then(response => response.data);

        console.log(data);

        return data;
    }

    function getTrackIds(tracks) {
        let ids = [];
        const tracksArray = Object.values(tracks);
        if (tracksArray.length > 0) {
            for (const track of tracksArray) {
                ids.push(track.id);
            }
        } else {
            throw new Error("Tried to get track ids for an empty list of tracks");
        }
        console.log(ids);
        return ids;
    }

    async function getAudioFeatureData(trackIds) {
        const url = BASE_URL + '/api/spotify-helper/audio-features';
        const reqData = {
            track_ids: trackIds
        }

        const data = await axios.post(url, reqData)
            .then(response => response.data);
            
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

        console.log(featureAverages);
        return featureAverages;
    }

    // TODO: THIS HAS TO BE IMPROVED, WE ARE DUPLICATING DATA -- we just need to filter
    function handleSearch(e) {
        const searchString = e.target.value.toUpperCase().trim();
        if (searchString !== '') {
            const searchResults = Object.values(userPlaylists).filter(playlist => {
                playlist.name.toUpperCase().includes(searchString);
            });
            setSearchItems({...searchResults});
            if (!isSearch) setIsSearch(true);
        } else {
            setIsSearch(false);
        }
    }


    useEffect(() => {
        
    },[mode])

    useEffect(() => {
        // async function getData() {
        //     const tracks = await getUserData('liked-tracks');
        //     const trackIds = getTrackIds(tracks);
        //     const featureData = await getAudioFeatureData(trackIds);
        //     const audioFeatureAverages = calculateAudioFeatureAverages(featureData);

        //     return {
        //         tracks: tracks,
        //         featureData: featureData,
        //         audioFeatureAverages: audioFeatureAverages
        //     }
        // }

        // getData()
        //     .then(data => {
        //         setUserTracks(data.tracks);
        //         setAudioFeatureData(data.featureData);
        //         setAudioFeatureAverages(data.audioFeatureAverages);
        //     })
        //     .then(() => {
        //         setIsLoaded(true);
        //     })
        //     .catch(error => {
        //         if (error.response) {
        //             const response = error.response;
        //             if (response.status === 401) {
        //                 alert("Your access token has expired. Please renew it.");
        //             }
        //         }
        //         console.error(error);
        //     });
        (() => {
            getUserData('playlist')
                .then(data => {
                    setUserPlaylists(data);
                })
                .then(() => setMode('playlist'));
        })();
    }, [])

    // 4 modes?
    // gateway choice -> playlists -> playlist breakdown 
    //               |-> track search -> track breakdown

    return (
        <div>
            <h2 className='page-title'>analyzer</h2>
            {mode === 'playlist' && <List type={'playlists'} items={userPlaylists}/>}
            {isReady && <Chart title={"Vibe"} data={audioFeatureAverages}/> }
        </div>
    )
}

export default Analyzer;