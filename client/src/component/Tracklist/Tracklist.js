import React, {useState, useEffect} from 'react';
import Track from './Track/Track.js'

import './Tracklist.css';

const Tracklist = (props) => {

    const items = props.items;

    let generateTracklist = () => {
        let tracklist = items.map(item => {
            let title = item.name;
            let artist = item.artists[0].name;
            let album = item.album;
            let key = title + artist;

            return <Track key={key} title={title} artists={artist} album={album}/>
        })
        return tracklist;
    }

    return (
        <div className='tracklist'>
            {generateTracklist()}
        </div>
    )
}

export default Tracklist;