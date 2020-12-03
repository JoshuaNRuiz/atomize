import React from 'react';
import './Playlist.css';

const Playlist = (props) => {

    const name = props.name;
    const imageUrl = props.imageUrl;

    return (
        <div className='playlist'>
            {name}
            <img src={imageUrl}></img>
        </div>
    )
};

export default Playlist;