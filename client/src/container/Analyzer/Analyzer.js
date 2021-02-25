import React, {useState, useEffect,  useRef} from 'react';
import axios from 'axios';

import Loader from '../../component/Loader/Loader';
import List from '../../component/List/List';
import searchicon from '../../resources/searchicon.svg';
import Chart from '../../component/Chart/Chart';

import './Analyzer.css';

const Analyzer = (props) => {
    const accessToken = props.accessToken || localStorage.getItem('accessToken');

    const [isSearch, setIsSearch] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState({});
    const [userTracks, setUserTracks] = useState({});
    const [audioFeatureData, setAudioFeatureData] = useState({});
    const [audioFeatureAverages, setAudioFeatureAverages] = useState({});
    const [searchItems, setSearchItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isChart, setIsChart] = useState(true);
    
    const getUserData = async (type) => {
        let url = "";

        switch (type) {
            case 'playlist': 
                url = 'http://localhost:8000/api/spotify-helper/user-playlists';
                break;
            case 'liked-tracks':
                url = 'http://localhost:8000/api/spotify-helper/liked-tracks';
                break;
            default:
                throw new Error("requested user data not available");
        }

        const options = {"access_token": accessToken}

        const response = await axios.post(url, options)
            .catch(error => {
                throw error;
            });

        return response.data;
    }

    const getTrackIds = (tracks) => {
        let ids = [];
        for (const track of Object.values(tracks)) {
            ids.push(track.id);
        }
        return ids;
    }

    const getAudioFeatureData = async (trackIds) => {
        const url = 'http://localhost:8000/api/spotify-helper/audio-features';
        const options = {
            access_token: accessToken,
            track_ids: trackIds,
        }

        const response = await axios.post(url, options)
            .catch(error => {
                console.error(error);
                throw error;
            });

        console.log(response.data);

        return response.data;
    }

    const calculateAudioFeatureAverages = (featureData) => {
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
    const handleSearch = (e) => {
        const searchString = e.target.value.toLowerCase().trim();
        if (searchString != '') {
            let searchResults = {}
            for (const [key, playlist] of Object.entries(userPlaylists)) {
                const playlistName = playlist.name.toLowerCase();
                if (playlistName.includes(searchString)) {
                    searchResults[key] = playlist;
                }
            }
            setSearchItems(searchResults);
            if (!isSearch) setIsSearch(true);
        } else {
            setIsSearch(false);
        }
    }

    /* MANAGING THE USERS INFORMATION */

    useEffect(() => {
        async function getData() {
            const tracks = await getUserData('liked-tracks');
            const trackIds = getTrackIds(tracks);
            const featureData = await getAudioFeatureData(trackIds);
            const audioFeatureAverages = calculateAudioFeatureAverages(featureData);
            
            return {
                tracks: tracks,
                featureData: featureData,
                audioFeatureAverages: audioFeatureAverages
            }
        }

        getData()
            .then(data => {
                setUserTracks(data.tracks);
                setAudioFeatureData(data.featureData);
                setAudioFeatureAverages(data.audioFeatureAverages);
            })
            .then(() => {
                setIsLoaded(true);
            })
            .catch(error => {
                if (error.response) {
                    const response = error.response;
                    if (response.status === 401) {
                        alert("Your access token has expired. Please renew it.");
                    }
                }
                console.error(error);
            });
    }, [])

    return (
        <div>
            <h2 className='page-title'>analyzer</h2>
            {isLoaded ? <Chart title={"Vibe"} data={audioFeatureAverages}/> : <Loader />}
        </div>
    )
}

export default Analyzer;