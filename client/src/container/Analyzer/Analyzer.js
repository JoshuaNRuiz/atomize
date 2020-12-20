import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import List from '../../component/List/List';
import searchicon from '../../resources/searchicon.svg';

const Analyzer = (props) => {
    //TODO: pagination for the playlists

    const accessToken = props.accessToken || localStorage.getItem('accessToken');

    const [isSearch, setIsSearch] = useState(false);
    const [playlists, setPlaylists] = useState({});
    const [tracks, setTracks] = useState([]);
    const [trackIds, setTrackIds] = useState([]);
    const [searchItems, setSearchItems] = useState([]);

    const getPlaylists = async () => {
        const url = 'http://localhost:8000/api/spotify-helper/user-playlists';
        const options = {"access_token": accessToken}
        try {
            const response = await axios.post(url, options)
            console.log(response.data);
            setPlaylists(response.data);
        } catch (error) {
            alert('Unable to retrieve your playlists: ' + error);
        }
    }

    const getLikedTracks = async () => {
        const url = 'http://localhost:8000/api/spotify-helper/liked-tracks';
        const options = {"access_token": accessToken}
        try {
            const response = await axios.post(url, options)
            setTracks(response.data);
            console.log(response.data);
        } catch (error) {
            alert('Unable to retrieve your liked tracks: ' + error);
        }
    }

    const getTrackIds = async () => {
        let ids = [];
        for (const track of Object.values(tracks)) {
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
            console.log(response.data);
        } catch (error) {
            alert('Unable to retrieve your liked tracks: ' + error);
        }
    }

    // TODO: THIS HAS TO BE IMPROVED, WE ARE DUPLICATING DATA -- we just need to filter
    const handleSearch = (e) => {
        const searchString = e.target.value.toLowerCase().trim();
        if (searchString != '') {
            let searchResults = {}
            for (const [key, playlist] of Object.entries(playlists)) {
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
        if (tracks.length !== 0) {
            if (trackIds.length === 0) getTrackIds();
        } else {
            getLikedTracks();
        }
    }, [tracks]);

    useEffect(() => {
        if (trackIds.length !== 0) {
            getAudioFeatures();
        }
    }, [trackIds]);

    return (
        <div>
            <h2>analyzer</h2>
            
        </div>
    )
}

export default Analyzer;