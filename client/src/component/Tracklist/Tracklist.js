import React, {useState, useEffect} from 'react';
import Track from './Track/Track.js'

const Tracklist = (props) => {

    const [type, setType] = useState('tracks');
    const [timeRange, setTimeRange] = useState('long_term')
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0)
    const [response, setResponse] = useState();

    let tracklist = null;

    let url = `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`

    useEffect(() => {
        // let result = fetch(url, {
        //     method: 'get',
        //     headers: new Headers({

        //     }),
        // });
        // setResponse(result);
        // generateTracklist();
    });

    let generateTracklist = () => {
        let items = response.items;
        tracklist = items.map((track) => {
            return <Track name={track.name} artists={track.artists} album={track.album}/>
        });
    }

    return (
        <div className="tracklist">
            {tracklist}
        </div>
    );
}

export default Tracklist;