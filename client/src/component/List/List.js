import React from 'react';
import TrackItem from '../Items/TrackItem/TrackItem';
import ArtistItem from '../Items/ArtistItem/ArtistItem';
import PlaylistItem from '../Items/PlaylistItem/PlaylistItem';

import './List.css';

const List = (props) => {

    const { type, items } = props;

    function makeList() {
        if (!type || items.length === 0) return null;

        let list = undefined;

        if (type === 'tracks' && items[0].type === 'track') {
            list = makeTrackList();
        } else if (type === 'artists' && items[0].type === 'artist') {
            list = makeArtistList();
        } else if (type === 'playlist' && items[0].type === 'playlist') {
            list = makePlaylistList();
        }

        return list || null;
    }

    function makeTrackList() {
        let title, artist, album, rank, key;
        return props.items.map((item, index) => {
            title = item.name;
            artist = item.artists[0].name;
            album = item.album;
            rank = index + 1;
            key = title + artist;
            return <TrackItem key={key} title={title} artists={artist} album={album} rank={rank} />
        });

    };

    function makeArtistList() {
        let name, genres, images, rank, key;
        return items.map((item, index) => {
            name = item.name;
            genres = item.genres;
            images = item.images;
            rank = index + 1;
            key = name + " " + rank;
            return <ArtistItem key={key} name={name} genres={genres} images={images} rank={rank}/>
        });
    };

    function makePlaylistList() {
        let name, trackCount, rank;
        return Object.values(items).map((item, index) => {
            name = item.name;
            trackCount = item.tracks.total;
            return <PlaylistItem name={name} trackCount={trackCount} />
        });
    }

    return (
        <div className='list'>
            {makeList()}
        </div>
    )
}

export default List;