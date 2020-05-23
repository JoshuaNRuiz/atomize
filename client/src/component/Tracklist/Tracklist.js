import React, {useState, useEffect} from 'react';
import Track from './Track/Track.js'

const Tracklist = (props) => {

    const TYPE_DEFAULT = 'tracks'
    const RANGE_DEFAULT = 'long_term'
    const LIMIT_DEFAULT = 10;
    const OFFSET_DEFAULT = 0;

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [type, setType] = useState(TYPE_DEFAULT);
    const [timeRange, setTimeRange] = useState(RANGE_DEFAULT)
    const [limit, setLimit] = useState(LIMIT_DEFAULT);
    const [offset, setOffset] = useState(OFFSET_DEFAULT)
    const [items, setItems] = useState([]);

    let url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=10&offset=0`

    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.accessToken
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.items);
                setIsLoaded(true);
                setItems(data.items)
            })
    }, [url, props.accessToken]);

    let generateTracklist = () => {
        let tracklist = items.map(item => {
            let title = item.name;
            let artist = item.artists[0].name;
            let album = item.album.name;
            let key = title + artist;

            return <Track key={key} title={title} artists={artist} album={album}/>
        })
        return tracklist;
    }

    if (!isLoaded) {
        return <div>...loading</div>
    } else {
        let tracklist = generateTracklist();
        return (
            <div className='tracklist'>
                {tracklist}
            </div>
        )
    }
}

export default Tracklist;