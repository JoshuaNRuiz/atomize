import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Playlist from '../../component/Playlist/Playlist';

const Analyzer = (props) => {


    //TODO: pagination for the playlists
    //TODO: display to the user each of their playlists

    const accessToken = props.accessToken || localStorage.getItem('accessToken');

    const [isLoaded, setIsLoaded] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [currentPlaylist, setCurrentPlaylist] = useState(null);

    const getPlaylists = async () => {
        const url = 'http://localhost:8000/api/spotify-helper/user-playlists';
        try {
            const response = await axios.post(url, {
                access_token: accessToken
        }   )
            console.log(response.data);
            setPlaylists(response.data.items);
            setIsLoaded(true);
        } catch (error) {
            alert('Unable to retrieve your playlists: ' + error);
        }
    }

    const generatePlaylists = () => {
        return playlists.map((playlist, index) => {
            let name = playlist.name;
            // let image = playlist.images[0].url;
            return <Playlist name={name}/>
        });
    }

    const pl = generatePlaylists();

    useEffect(() => {
        console.log("called")
        console.log(accessToken);
        getPlaylists();
    }, [])

    return (
        <div>
            ANALYZER
            <button onClick={getPlaylists}>CLICK ME</button>
            {pl}
        </div>
    )
}

export default Analyzer;