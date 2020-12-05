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

    const handleSearch = (e) => {
        const searchString = e.target.value.toLowerCase().trim();
        if (searchString != '') {
            let searchResults = []
            let itemsArray = Object.values(items)
            for (const item of itemsArray) {
                if (item.name.toLowerCase().includes(searchString)) {
                    searchResults.push(item);
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
            <List type={'playlists'} items={isSearch ? searchItems : items}/>
        </div>
    )
}

export default Analyzer;