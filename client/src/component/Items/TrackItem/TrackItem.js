import React from 'react';

import './TrackItem.css';

const TrackItem = ({id, name, artists, album, rank, handleClick}) => {
    const primaryArtist = artists[0].name;
    const albumImage = album.images[0].url;

    return (
        <div className="TrackItem" id={id} onClick={handleClick}>
            <img className='TrackItem__Image' src={albumImage} alt='icon'/>
            <div className="TrackItem__Details"> 
                <span className="TrackItem__Details__Name">{name}</span>
                <span className="TrackItem__Details__Artist">{primaryArtist}</span>
            </div>
            {!!rank ? <span className="TrackItem__Rank">{rank}</span> : null}
        </div>
    );
}

export default TrackItem;