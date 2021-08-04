import React, { useState, useEffect } from 'react';

import CustomChart from "../../../component/Chart/CustomChart";
import TrackItem from '../../../component/Items/TrackItem/TrackItem';

import { getAudioFeaturesForTrack } from '../../../helpers/functions';

import './TrackAnalyzer.css';

const TrackAnalyzer = ({ track }) => {

    const [audioFeatures, setAudioFeatures] = useState({});

    function renderAnalyticalComponents() {
        if (!track || Object.keys(track).length === 0) return null;

        const { id, name, artists, album } = track;

        const components = [
            <TrackItem id={id} name={name} artists={artists} album={album} />,
            <CustomChart data={audioFeatures} />,
        ];

        return components;
    }

    useEffect(load, [track]);

    function load() {
        if (track) {
            getAudioFeaturesForTrack(track.id)
                .then(audioFeatures => {
                    const filteredAudioFeatures = filterAudioFeatures(audioFeatures);
                    setAudioFeatures(filteredAudioFeatures);
                })
        }
    }

    function filterAudioFeatures(data) {
        const { danceability, energy, instrumentalness, speechiness, valence } = data;
        return {
            danceability: danceability,
            energy: energy,
            instrumentalness: instrumentalness,
            speechiness: speechiness,
            valence: valence
        }
    };

    return (
        <div className='TrackAnalyzer'>
            {renderAnalyticalComponents()}
        </div>
    )

}

export default TrackAnalyzer;