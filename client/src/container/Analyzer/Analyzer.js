import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import List from '../../component/List/List';

const Analyzer = (props) => {
    //TODO: pagination for the playlists

    const accessToken = props.accessToken || localStorage.getItem('accessToken');

    const [isLoaded, setIsLoaded] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [items, setItems] = useState([]);
    const [searchItems, setSearchItems] = useState([]);
    const [tracks, setTracks] = useState([]);

    const getPlaylists = async () => {
        const url = 'http://localhost:8000/api/spotify-helper/user-playlists';
        try {
            const response = await axios.post(url, {
                access_token: accessToken
            })
            let result = response.data.items;
            result.sort((a,b) => {
                let nameA = a.name.toLowerCase();
                let nameB = b.name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            console.log(result);
            setItems(result);
            setIsLoaded(true);
        } catch (error) {
            alert('Unable to retrieve your playlists: ' + error);
        }
    }

    const handleSearch = (e) => {
        console.log('called');
        const searchString = e.target.value.toLowerCase().trim();
        if (searchString != '') {
            let searchResults = []

            for (const item of items) {
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
            ANALYZER
            <button onClick={getPlaylists}>CLICK ME</button>
            <input type='text' id='search' onChange={handleSearch}/>
            <List type={'playlists'} items={isSearch ? searchItems : items}/>
        </div>
    )
}

export default Analyzer;