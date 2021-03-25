import React from 'react';

import './ArtistItem.css';

const ArtistItem = (props) => {

    const name = props.name;
    const images = props.images;

    return (
        <div className="artist" >
            <img className='artist-image' 
                src={images === null ? null : images[0].url} 
                alt='icon'/>
            <span className="artist-name">{name}</span>
        </div>
    );
}

export default ArtistItem;