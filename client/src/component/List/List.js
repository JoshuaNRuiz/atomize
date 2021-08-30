import * as Constants from '../../helpers/Constants';

import React from 'react';
import TrackItem from '../Items/TrackItem/TrackItem';
import ArtistItem from '../Items/ArtistItem/ArtistItem';
import PlaylistItem from '../Items/PlaylistItem/PlaylistItem';

import './List.css';

const List = ({ items, handleClick }) => {

    function makeList() {
        if (!items || Object.keys(items).length === 0) return null;
        
        let list = null;
        const type = items[0].type;
        if (type === Constants.TYPE_TRACK) {
            list = TrackList();
        } else if (type === Constants.TYPE_ARTIST) {
            list = ArtistList();
        } else if (type === Constants.TYPE_PLAYLIST) {
            list = PlaylistList();
        }
    
        const capitalizedTypeName = type.charAt(0).toUpperCase() + type.slice(1);
        const classes = `List ${capitalizedTypeName}List`;

        return (
            <div className={classes}>
                {list}
            </div>
        )
    }

    function TrackList() {
        const trackList = Object.values(items).map((track, index) => {
            const { id, name, artists, album, features } = track;
            const rank = index + 1;
            return (
                <TrackItem key={id}
                    id={id}
                    index={index}
                    name={name}
                    artists={artists}
                    album={album}
                    rank={rank}
                    audioFeatures={features}
                    handleClick={handleClick || null} />
            );
        });

        return trackList;
    };

    function ArtistList() {
        const artistList = items.map((artist, index) => {
            const { id, name, genres, images } = artist;
            const rank = index + 1;
            return (
                <ArtistItem key={id}
                    id={id}
                    name={name}
                    genres={genres}
                    images={images}
                    rank={rank}
                    handleClick={handleClick || null} />
            );
        });

        return artistList;
    };

    function PlaylistList() {
        const playlistList = Object.values(items).map((playlist, index) => {
            const { id, name, tracks: { total } } = playlist;
            return (
                <PlaylistItem key={id}
                    id={index}
                    name={name}
                    trackCount={total}
                    handleClick={handleClick || null}/>
            );
        });

        return playlistList;
    }

    return makeList();
}

export default List;