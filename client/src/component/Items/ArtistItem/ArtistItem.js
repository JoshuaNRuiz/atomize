import React from 'react';

import './ArtistItem.css';

const ArtistItem = (props) => {

    const name = props.name;
    const images = props.images;

    return (
        <div className="artist" >
            <img className='artist-image' 
                src={images == null ? null : images[0]} 
                alt='icon'/>
            <p>{name}</p>
        </div>
    );
}

export default ArtistItem;