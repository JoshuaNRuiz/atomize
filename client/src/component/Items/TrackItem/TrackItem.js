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
        <div className="TrackItem" id={id} onClick={handleClick}>
            <img className='TrackItem__Image' src={albumImage} alt='icon'/>
            <div className="TrackItem__Details"> 
                <p className="TrackItem__Details__Title">{title}</p>
                <p className="TrackItem__Details__ArtistAlbum">{artistName} — {`${albumName}`} </p>
            </div>
            <p className="TrackItem__Rank">{rank}</p>
        </div>
    );
}

export default TrackItem;