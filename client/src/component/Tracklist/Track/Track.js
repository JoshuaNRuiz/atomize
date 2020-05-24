import React from 'react';
import playIcon from '../../../resources/play.png';

import './Track.css';

const Track = (props) => {

    const title = props.title;
    const artistName = props.artists;
    const albumName = props.album;

    return (
        <div className="track">
            <img className='album-image' src={playIcon} alt="icon"/>
            <div className="track-details"> 
                <p className="title">{title}</p>
                <p className="artist-album">{artistName} - {albumName} </p>
            </div>
        </div>
    );
}

export default Track;