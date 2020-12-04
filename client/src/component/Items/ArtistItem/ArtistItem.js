import React from 'react';

import './ArtistItem.css';

const ArtistItem = (props) => {

    const name = props.name;
    const genres = props.genres;
    const images = props.images;

    const genreList = genres.join(', ');

    return (
        <div className="artist" >
            <img className='artist-image' src={images[0].url} alt='icon'/>
            <p>{name}</p>
        </div>
    );
}

export default ArtistItem;