import React from 'react';

import './TrackItem.css';

const TrackItem = (props) => {

    const id = props.id;
    const title = props.title;
    const artistName = props.artists;
    const albumName = props.album.name;
    const albumImage = props.album.images[0].url;
    const rank = props.rank;

    const handleClick = props.handleClick;

    return (
        <div className="track-item" id={id} onClick={handleClick}>
            <img className='album-image' src={albumImage} alt='icon'/>
            <div className="track-details"> 
                <p className="title">{title}</p>
                <p className="artist-album">{artistName} — {`${albumName}`} </p>
            </div>
            <p className="rank">{rank}</p>
        </div>
    );
}

export default TrackItem;