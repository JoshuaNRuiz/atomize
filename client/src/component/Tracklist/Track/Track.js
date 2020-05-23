import React from 'react';
import playIcon from '../../../resources/play.png';

import './Track.css';

const Track = (props) => {

    const title = props.title;
    const artistName = props.artists;
    const albumName = props.album;

    return (
        <div className="track">
            <button className="play-button">
                <img src={playIcon} alt="icon"/>
            </button> 
            <div className="track-details"> 
                <p className="title">{title}</p>
                <p className="artist-album">{artistName} - {albumName} </p>
            </div>
        </div>
    );
}

export default Track;