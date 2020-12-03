import React from 'react';
import './PlaylistItem.css';

const PlaylistItem = (props) => {

    const name = props.name;

    return (
        <div className='playlist'>
            {name}
        </div>
    )
};

export default PlaylistItem;