import React from 'react';

import './Track.css';

const Track = (props) => {

    const title = props.title;
    const artistName = props.artists;
    const albumName = props.album.name;
    const albumImage = props.album.images[0].url;
    const rank = props.rank;

    return (
        <div className="track" >
            <img className='album-image' src={albumImage} alt='icon'/>
            <div className="track-details"> 
                <p className="title">{title}</p>
                <p className="artist-album">{artistName} — {`${albumName}`} </p>
            </div>
            <p className="rank">{rank}</p>
        </div>
    );
}

export default Track;