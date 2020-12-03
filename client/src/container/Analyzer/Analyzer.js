import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import List from '../../component/List/List';

const Analyzer = (props) => {
    //TODO: pagination for the playlists

    const accessToken = props.accessToken || localStorage.getItem('accessToken');

    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [currentPlaylist, setCurrentPlaylist] = useState(null);

    const getPlaylists = async () => {
        const url = 'http://localhost:8000/api/spotify-helper/user-playlists';
        try {
            const response = await axios.post(url, {
                access_token: accessToken
            })
            console.log(response.data);
            setItems(response.data.items);
            setIsLoaded(true);
        } catch (error) {
            alert('Unable to retrieve your playlists: ' + error);
        }
    }

    useEffect(() => {
        getPlaylists();
    }, [])

    return (
        <div>
            ANALYZER
            <button onClick={getPlaylists}>CLICK ME</button>
            <List type={'playlists'} items={items}/>
        </div>
    )
}

export default Analyzer;