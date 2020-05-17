import React from 'react';
import playIcon from '../../../resources/play.png';

import './Track.css';

const Track = (props) => {

    const title = props.title;
    const artistName = props.artists;
    const albumName = props.album;

    return (
        <div className="track">
            <button class="play-button">
                <img src={playIcon}/>
            </button> 
            <div class="track-details"> 
                <p class="title">{title}</p>
                <p class="artist-album">{artistName} - {albumName} </p>
            </div>
        </div>
    );
}

export default Track;