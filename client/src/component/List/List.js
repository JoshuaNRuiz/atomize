import * as Constants from '../../helpers/Constants';
import React from 'react';
import TrackItem from '../Items/TrackItem/TrackItem';
import ArtistItem from '../Items/ArtistItem/ArtistItem';
import PlaylistItem from '../Items/PlaylistItem/PlaylistItem';

import './List.css';

const List = (props) => {

    const { type, items, handleClick } = props;

    function makeList() {
        if (!type || items.length === 0) return null;

        let list = undefined;

        if (type === Constants.TYPE_TRACK && items[0].type === Constants.TYPE_TRACK) {
            list = makeTrackList();
        } else if (type === Constants.TYPE_ARTIST && items[0].type === Constants.TYPE_ARTIST) {
            list = makeArtistList();
        } else if (type === Constants.TYPE_PLAYLIST && items[0].type === Constants.TYPE_PLAYLIST) {
            list = makePlaylistList();
        }

        return list || null;
    }

    function makeTrackList() {
        let title, artist, album, rank, key;
        return Object.values(items).map((item, index) => {
            title = item.name;
            artist = item.artists[0].name;
            album = item.album;
            rank = index + 1;
            key = title + artist;
            return <TrackItem key={key} title={title} artists={artist} album={album} rank={rank} handleClick={handleClick}/>
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
            return <ArtistItem key={key} name={name} genres={genres} images={images} rank={rank} handleClick={handleClick}/>
        });
    };

    function makePlaylistList() {
        let name, trackCount, playlistId, key;
        return Object.values(items).map((playlist, index) => {
            playlistId = playlist.id
            name = playlist.name;
            trackCount = playlist.tracks.total;
            key = index;
            return <PlaylistItem id={playlistId} name={name} trackCount={trackCount} handleClick={handleClick}/>
        });
    }

    return (
        <div className='list'>
            {makeList()}
        </div>
    )
}

export default List;