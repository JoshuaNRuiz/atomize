import React, {useState, useEffect,  useRef} from 'react';
import axios from 'axios';
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

    const getUsersPlaylists = async () => {
        const url = 'http://localhost:8000/api/spotify-helper/user-playlists';
        const options = {"access_token": accessToken}
        try {
            const response = await axios.post(url, options)
            console.log(response.data);
            setUserPlaylists(response.data);
        } catch (error) {
            alert('Unable to retrieve your playlists: ' + error);
        }
    }

    const getUsersLikedTracks = async () => {
        const url = 'http://localhost:8000/api/spotify-helper/liked-tracks';
        const options = {"access_token": accessToken}
        try {
            const response = await axios.post(url, options)
            console.log(response.data);
            setUserTracks(response.data);
            return(response.data);
        } catch (error) {
            alert('Unable to retrieve your liked tracks: ' + error);
        }
    }

    const getAudioFeatureData = async (tracks) => {
        const trackIds = getTrackIds(tracks);
        const url = 'http://localhost:8000/api/spotify-helper/audio-features';
        const options = {
            access_token: accessToken,
            track_ids: trackIds,
        }

        const data = await axios.post(url, options)
            .then(response => {
                console.log(response.data);
                setAudioFeatureData(response.data);
                return response.data;
            })
            .catch(error => {
                alert("Unable to retrieve your audio data: " + error.message);
            });

        return data;
    }

    const getTrackIds = (listOfTracks) => {
        let ids = [];
        for (const track of Object.values(listOfTracks)) {
            ids.push(track.id);
        }
        return ids;
    }

    const calculateAudioFeatureAverages = async (featureData) => {
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

    useEffect(() => {
        async function getData() {
            const tracks = await getUsersLikedTracks();
            const featureData = await getAudioFeatureData(tracks);
            const audioFeatureAverages = await calculateAudioFeatureAverages(featureData);
            
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
            .then(response => {
                setIsLoaded(true);
            })
            .catch(error => {
                console.error(error);
            });
    }, [])

    return (
        <div>
            <h2 className='page-title'>analyzer</h2>
            {isLoaded? <Chart title={"Vibe"} data={audioFeatureAverages}/> : null}
        </div>
    )
}

export default Analyzer;