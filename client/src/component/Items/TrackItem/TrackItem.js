import React from 'react';

import './TrackItem.css';

const TrackItem = ({id, index, name, artists, album, rank, handleClick}) => {
    const primaryArtist = artists?.[0]?.name;
    const albumImage = album.images?.[0]?.url;

    const classes = handleClick ? 'TrackItem TrackItem--List' : 'TrackItem';

    return (
        <data className={classes} id={id} value={index} onClick={handleClick}>
            <img className='TrackItem__Image' src={albumImage} alt='icon'/>
            <div className="TrackItem__Details"> 
                <span className="TrackItem__Details__Name">{name}</span>
                <span className="TrackItem__Details__Artist">{primaryArtist}</span>
            </div>
            {!!rank ? <span className="TrackItem__Rank">{rank}</span> : null}
        </data>
    );
}

export default TrackItem;