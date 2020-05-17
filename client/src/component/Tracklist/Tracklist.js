import React from 'react';
import Track from './Track/Track.js'

function Tracklist() {

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

    return (
        <Track />
    );
}

export default Tracklist;