import React from 'react';
import './PlaylistItem.css';

const PlaylistItem = (props) => {

    const {id, name, trackCount, handleClick } = props;

    return (
        <button className='PlaylistItem' value={id} onClick={handleClick}>
            <p className='PlaylistItem__Title'>{name}</p>
            <div className='PlaylistItem__CountContainer'>
                <p className='PlaylistItem__CountContainer__TrackCount'>{trackCount}</p>
            </div>
        </button>
    )
};

export default PlaylistItem;