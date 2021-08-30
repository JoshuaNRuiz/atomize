import React from 'react';

import './TrackList.css';

const TrackList = ({ tracks, columns }) => {

    function renderTrackList() {
        const columnHeaders = columns?.map(column => <span className="TrackList__Header__Title">{column}</span>)
        const header = (
            <div className="TrackList__Header">
                <span className="TrackList__Header__Title"></span>
                <span className="TrackList__Header__Title">title - artist</span>
                {columnHeaders}
            </div>
        )

        if (tracks && tracks.length !== 0) {
            const tracksObjects = tracks.map(track => {
                return (
                    <div className="TrackList__Item">
                        <img className="TrackList__Item__AlbumImage" src={track?.album?.images[0]?.url} alt="album art" />
                        <div className="TrackList__Item__Details">
                            <span className="TrackList__Item__Details__Title">{track?.name}</span>
                            <span className="TrackList__Item__Details__Artist">{track?.artists?.[0]?.name}</span>
                        </div>
                        {track.features && Object.keys(track.features).length > 0 && renderAudioFeatures(track.features)}
                    </div>
                )
            });

            return [header, ...tracksObjects];
        }
    }

    function renderAudioFeatures(trackAudioFeatures) {
        const audioFeatureColumns = columns.map(feature => {
            let value = trackAudioFeatures[feature];
            if (feature === 'tempo') value = Math.round(value);

            return (
                <div className="TrackList__Item__Features">
                    <span className="TrackList__Item__Features__Value">{value}</span>
                </div>
            )
        });
        return audioFeatureColumns;
    }

    return (
        <div className="TrackList">
            {renderTrackList()}
        </div>
    )
    
}

export default TrackList;