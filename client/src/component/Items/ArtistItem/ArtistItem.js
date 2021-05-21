import React from 'react';

import './ArtistItem.css';

const ArtistItem = (props) => {

    const name = props.name;
    const images = props.images;

    return (
        <div className="ArtistItem" >
            <img className='ArtistItem__Image' 
                src={images === null ? null : images[0].url} 
                alt='icon'/>
            <span className="ArtistItem__Name">{name}</span>
        </div>
    );
}

export default ArtistItem;