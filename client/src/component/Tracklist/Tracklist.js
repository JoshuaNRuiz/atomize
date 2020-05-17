import React, {useState, useEffect} from 'react';
import Track from './Track/Track.js'

const Tracklist = (props) => {

    // fetch the users top songs through the Spotify API
    // store them in an array
    // iterate through the array 
    // create a SongItem for each one

    /* SPOTIFY API EXPECTED DATA
        id: String
        name: String
        album: Album Object
        artists: Artist object
    */

    const initialState = null;
    const [response, setResponse] = useState(initialState);

    useEffect(() => {

    });

    return (
        <div>
            <Track title="One More" artists="Yaeji" album="EP2"/>
        </div>
    );
}

export default Tracklist;