import React from 'react';
import Track from './Track/Track.js';
import Artist from './Artist/Artist';

import './List.css';

const List = (props) => {

    const type = props.type;
    const items = props.items;

    const getTrackList = () => {
        return props.items.map((item, index) => {
            let title = item.name;
            let artist = item.artists[0].name;
            let album = item.album;
            let rank = index + 1;
            let key = title + artist;
            return <Track key={key} title={title} artists={artist} album={album} rank={rank}/>
        });
    };

    const getArtistList = () => {
        return items.map((item, index) => {
            let name = item.name;
            let genres = item.genres;
            let images = item.images;
            return <Artist name={name} genres={genres} images={images}/>
        });
    };

    const getList = () => {
        if (items.length > 0) {
            if (type == 'tracks' && items[0].type == 'track') {
                return getTrackList();
            } else if (type == 'artists' && items[0].type == 'artist') {
                return getArtistList();
            }
        }
        return null;
    }

    const list = getList();

    return (
        <div className='list'>
            {list}
        </div>
    )
}

export default List;