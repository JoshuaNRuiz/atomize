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
    const [trackIds, setTrackIds] = useState([]);
    const [audioFeatureData, setAudioFeatureData] = useState({});
    const [audioFeatureAverages, setAudioFeatureAverages] = useState({})
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
            setUserTracks(response.data);
            console.log(response.data);
        } catch (error) {
            alert('Unable to retrieve your liked tracks: ' + error);
        }
    }

    const getTrackIds = async () => {
        let ids = [];
        for (const track of Object.values(userTracks)) {
            ids.push(track.id);
        }
        console.log(ids);
        setTrackIds(ids);
    }

    const getAudioFeatures = async () => {
        const url = 'http://localhost:8000/api/spotify-helper/audio-features';
        const options = {
            access_token: accessToken,
            track_ids: trackIds,
        }
        try {
            const response = await axios.post(url, options)
            setAudioFeatureData(response.data);
            console.log(response.data);
        } catch (error) {
            alert('Unable to retrieve your liked tracks: ' + error);
        } finally {}
    }

    const calculateAudioFeatureAverages = async () => {
        let danceability = 0;
        let energy = 0;
        let tempo = 0;
        let valence = 0;

        let liveness = 0;
        let instrumentalness = 0;
        let speechiness = 0;

        for (const data of Object.values(audioFeatureData)) {
            danceability += data.danceability;
            energy += data.energy;
            tempo += data.tempo;

            valence += data.valence;
            liveness += data.liveness;
            instrumentalness += data.instrumentalness;
            speechiness += data.speechiness;
        }

        const count = Object.keys(audioFeatureData).length;

        danceability /= count;
        energy /= count;
        tempo /= count;
        valence /= count;

        liveness /= count;
        instrumentalness /= count;
        speechiness /= count;
        
        const averages = {
            danceability: danceability,
            energy: energy,
            tempo: tempo,
            valence: valence,
            liveness: liveness,
            instrumentalness: instrumentalness,
            speechiness: speechiness
        }

        setAudioFeatureAverages(averages);
        console.log(averages);
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
    
    // get the users liked tracks
    useEffect(() => {
        const userTracksIsEmpty = Object.keys(userTracks).length === 0;
        if (userTracksIsEmpty) {
            getUsersLikedTracks();
        }
        
    }, []);

    // get the  track ids
    useEffect(() => {
        const userTracksIsEmpty = Object.keys(userTracks).length === 0;
        const isTrackIdsEmpty = trackIds.length === 0
        if (!userTracksIsEmpty && isTrackIdsEmpty) {
            getTrackIds();
        }
    },[userTracks]);

    // get the audio features of those track ids
    useEffect(() => {
        const isTrackIdsEmpty = trackIds.length == 0;
        const isAudioFeatureDataEmpty = Object.keys(audioFeatureData).length === 0;
        if (!isTrackIdsEmpty && isAudioFeatureDataEmpty) {
            getAudioFeatures();
        }
    },[trackIds]);

    // calculate the averages
    useEffect(() => {
        const isAudioFeatureDataEmpty = Object.keys(audioFeatureData).length === 0;
        const isAudioFeatureAveragesEmpty = Object.keys(audioFeatureAverages).length === 0;
        if (!isAudioFeatureDataEmpty && isAudioFeatureAveragesEmpty) {
            calculateAudioFeatureAverages();
        }
    },[audioFeatureData]);
    
    // display the data
    useEffect(() => {
        const isAudioFeatureAveragesEmpty = Object.keys(audioFeatureAverages).length === 0;
        if (!isAudioFeatureAveragesEmpty) {
            setIsLoaded(true);
        }
    }, [audioFeatureAverages]);

    return (
        <div>
            <h2 className='page-title'>analyzer</h2>
            {isLoaded? <Chart title={"Vibe"} data={audioFeatureAverages}/> : null}
        </div>
    )
}

export default Analyzer;