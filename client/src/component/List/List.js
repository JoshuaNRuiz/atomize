import React from 'react';
import TrackItem from '../Items/TrackItem/TrackItem';
import ArtistItem from '../Items/ArtistItem/ArtistItem';
import PlaylistItem from '../Items/PlaylistItem/PlaylistItem';

import './List.css';

const List = (props) => {

    const type = props.type;
    const items = props.items;

    const getList = () => {
        if (type === null || items === null) {
            throw new Error ('Could not generate a list. There were no items or the type was not specified.')
        }

        let getItems;

        switch(type) {
            case 'tracks':
                getItems = getTrackList;
                break;
            case 'artists':
                getItems = getArtistList;
                break;
            case 'playlists':
                getItems = getPlaylistList;
                break;
            default:
                break;
        }

        return items.length > 0 ? getItems() : null;
    }

    const getTrackList = () => {
        return props.items.map((item, index) => {
            let title = item.name;
            let artist = item.artists[0].name;
            let album = item.album;
            let rank = index + 1;
            let key = title + artist;
            return <TrackItem key={key} title={title} artists={artist} album={album} rank={rank}/>
        });
    };

    const getArtistList = () => {
        return items.map((item, index) => {
            let name = item.name;
            let genres = item.genres;
            let images = item.images;
            return <ArtistItem name={name} genres={genres} images={images}/>
        });
    };

    const getPlaylistList = () => {
        return items.map((item, index) => {
            let name = item.name;
            let trackCount = item.tracks.total;
            return <PlaylistItem name={name} trackCount={trackCount}/>
        });
    }

    const list = getList();

    return (
        <div className='list'>
            {list}
        </div>
    )
}

export default List;