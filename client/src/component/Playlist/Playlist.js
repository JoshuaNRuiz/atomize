import React from 'react';
import './Playlist.css';

const Playlist = (props) => {

    const name = props.name;

    return (
        <div className='playlist'>
            <div>
                {name}
            </div>
        </div>
    )
};

export default Playlist;