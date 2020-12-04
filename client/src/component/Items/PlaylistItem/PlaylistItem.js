import React from 'react';
import './PlaylistItem.css';

const PlaylistItem = (props) => {

    const {name, trackCount} = props;

    return (
        <div className='playlist'>
            <p className='title'>{name}</p>
            <div className='count-container'>
                <p className='track-count'>{trackCount}</p>
            </div>
        </div>
    )
};

export default PlaylistItem;