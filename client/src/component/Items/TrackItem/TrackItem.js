import React from 'react';

import './TrackItem.css';

const TrackItem = (props) => {

    const id = props.id;
    const title = props.title;
    const artistName = props.artists;
    const albumImage = props.album.images[0].url;
    const rank = props.rank;

    const handleClick = props.handleClick;

    return (
        <div className="TrackItem" id={id} onClick={handleClick}>
            <img className='TrackItem__Image' src={albumImage} alt='icon'/>
            <div className="TrackItem__Details"> 
                <span className="TrackItem__Details__Title">{title}</span>
                <span className="TrackItem__Details__Artist">{artistName}</span>
            </div>
            <p className="TrackItem__Rank">{rank}</p>
        </div>
    );
}

export default TrackItem;