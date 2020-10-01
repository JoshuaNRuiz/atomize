import React from 'react';

const Artist = (props) => {

    const name = props.name;
    const genres = props.genres;
    const images = props.images;

    return (
        <div className="artist" >
            <img className='artist-image' src={images[0].url} alt='icon'/>
            <p>{name}</p>
            <p>{genres[0]}</p>
        </div>
    );
}

export default Artist;