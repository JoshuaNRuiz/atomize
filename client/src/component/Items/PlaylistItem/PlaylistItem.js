import React from 'react';
import './PlaylistItem.css';

const PlaylistItem = ({ id, name, trackCount, handleClick }) => {

    return (
        <div className='PlaylistItem' id={id} onClick={handleClick}>
            <span className='PlaylistItem__Title'>{name}</span>
            <div className='PlaylistItem__TrackCountContainer'>
                <span className='PlaylistItem__TrackCountContainer__TrackCount'>{trackCount}</span>
            </div>
        </div>
    )
};

export default PlaylistItem;