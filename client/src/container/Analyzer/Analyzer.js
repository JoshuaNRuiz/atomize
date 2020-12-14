import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import List from '../../component/List/List';
import searchicon from '../../resources/searchicon.svg';

const Analyzer = (props) => {
    //TODO: pagination for the playlists

    const accessToken = props.accessToken || localStorage.getItem('accessToken');

    const [isLoaded, setIsLoaded] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [items, setItems] = useState({});
    const [searchItems, setSearchItems] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [mode, setMode] = useState('')

    const LIST_TYPE = 'playlists';
    const LIKED_MODE = 'liked';
    const PLAYLIST_MODE = 'playlist';

    const getPlaylists = async () => {
        const url = 'http://localhost:8000/api/spotify-helper/user-playlists';
        const options = {"access_token": accessToken}
        try {
            const response = await axios.post(url, options)
            setItems(response.data);
            setIsLoaded(true);
        } catch (error) {
            alert('Unable to retrieve your playlists: ' + error);
        }
    }

    // TODO: THIS HAS TO BE IMPROVED, WE ARE DUPLICATING DATA -- we just need to filter
    const handleSearch = (e) => {
        const searchString = e.target.value.toLowerCase().trim();
        if (searchString != '') {
            let searchResults = {}
            for (const [key, playlist] of Object.entries(items)) {
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
        getPlaylists();
    }, [])

    return (
        <div>
            <h2>analyzer</h2>
            <div class='search-container'>
                <input type='text' onChange={handleSearch}/>
            </div>
            <List type={LIST_TYPE} items={isSearch ? searchItems : items}/>
        </div>
    )
}

export default Analyzer;