import React from 'react';
import './PlaylistItem.css';

const PlaylistItem = (props) => {

    const {id, name, trackCount, handleClick } = props;

    return (
        <div className='playlist' id={id} onClick={handleClick}>
            <p className='title'>{name}</p>
            <div className='count-container'>
                <p className='track-count'>{trackCount}</p>
            </div>
        </div>
    )
};

export default PlaylistItem;