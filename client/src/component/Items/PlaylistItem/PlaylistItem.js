import React from 'react';
import './PlaylistItem.css';

const PlaylistItem = (props) => {

    const {id, name, trackCount, handleClick } = props;

    return (
        <button className='playlist-item' value={id} onClick={handleClick}>
            <p className='title'>{name}</p>
            <div className='count-container'>
                <p className='track-count'>{trackCount}</p>
            </div>
        </button>
    )
};

export default PlaylistItem;