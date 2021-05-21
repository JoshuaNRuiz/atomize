import React from 'react';
import './PlaylistItem.css';

const PlaylistItem = (props) => {

    const {id, name, trackCount, handleClick } = props;

    return (
        <div className='PlaylistItem' value={id} onClick={handleClick}>
            <p className='PlaylistItem__Title'>{name}</p>
            <div className='PlaylistItem__CountContainer'>
                <span className='PlaylistItem__CountContainer__TrackCount'>{trackCount}</span>
            </div>
        </div>
    )
};

export default PlaylistItem;