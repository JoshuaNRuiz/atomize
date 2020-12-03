import React from 'react';
import './Playlist.css';

const Playlist = (props) => {

    const title = props.title;
    const image = props.image;

    return (
        <div className='playlist'>
            HI I AM A PLAYLIST OBJECT
            {title}
            {image}
        </div>
    )
};

export default Playlist;