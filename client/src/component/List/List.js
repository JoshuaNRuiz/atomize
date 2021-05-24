import * as Constants from '../../helpers/Constants';
import React from 'react';
import TrackItem from '../Items/TrackItem/TrackItem';
import ArtistItem from '../Items/ArtistItem/ArtistItem';
import PlaylistItem from '../Items/PlaylistItem/PlaylistItem';

import './List.css';

const List = ({items, handleClick}) => {

    function makeList() {
        if (Object.keys(items).length === 0) {
            return (
                <div className='List--Empty'></div>
            )
        }

        if (items[0].type === Constants.TYPE_TRACK) {
            return makeTrackList();
        } else if (items[0].type === Constants.TYPE_ARTIST) {
            return makeArtistList();
        } else if (items[0].type === Constants.TYPE_PLAYLIST) {
            return makePlaylistList();
        }

        return null;
    }

    function makeTrackList() {
        return Object.values(items).map((item, index) => {
            const {id, name, artists, album} = item;
            const rank = index + 1;
            return (
                <TrackItem key={id} 
                    id={index} 
                    name={name} 
                    artists={artists} 
                    album={album} 
                    rank={rank} 
                    handleClick={handleClick}/>
            )
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
        let name, trackCount, playlistId;
        return Object.values(items).map((playlist) => {
            playlistId = playlist.id
            name = playlist.name;
            trackCount = playlist.tracks.total;
            return <PlaylistItem key={playlistId} id={playlistId} name={name} trackCount={trackCount} handleClick={handleClick}/>
        });
    }

    return (
        <div className='List'>
            {makeList()}
        </div>
    )
}

export default List;