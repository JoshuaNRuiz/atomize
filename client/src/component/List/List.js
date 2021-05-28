import * as Constants from '../../helpers/Constants';
import React from 'react';
import TrackItem from '../Items/TrackItem/TrackItem';
import ArtistItem from '../Items/ArtistItem/ArtistItem';
import PlaylistItem from '../Items/PlaylistItem/PlaylistItem';

import './List.css';

const List = ({items, handleClick}) => {

    function makeList() {
        if (!items || Object.keys(items).length === 0) return null;

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
        return Object.values(items).map((track, index) => {
            const {id, name, artists, album} = track;
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
        return items.map((artist, index) => {
            const {id, name, genres, images} = artist;
            const rank = index + 1;
            return (
                <ArtistItem key={id} 
                    id={id}
                    name={name} 
                    genres={genres} 
                    images={images} 
                    rank={rank} 
                    handleClick={handleClick}/>
            )
        });
    };

    function makePlaylistList() {
        return Object.values(items).map((playlist, index) => {
            const {id, name, tracks: {total}} = playlist;
            return (
                <PlaylistItem key={id} 
                    id={index} 
                    name={name} 
                    trackCount={total} 
                    handleClick={handleClick}/>
            )
        });
    }

    return (
        <div className='List'>
            {makeList()}
        </div>
    )
}

export default List;