import React from 'react';
import Track from './Track/Track.js'

import './Tracklist.css';

const Tracklist = (props) => {

    const items = props.items;

    const tracklist = items.map((item,index) => {
        let title = item.name;
        let artist = item.artists[0].name;
        let album = item.album;
        let rank = index + 1;
        let key = title + artist;

        return <Track key={key} title={title} artists={artist} album={album} rank={rank}/>
    });

    return (
        <div className='tracklist'>
            {tracklist}
        </div>
    )
}

export default Tracklist;