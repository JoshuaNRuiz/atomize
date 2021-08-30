import React, { useState, useEffect } from 'react';

import PlaylistItem from '../../../component/Items/PlaylistItem/PlaylistItem';
import CustomChart from '../../../component/Chart/CustomChart';

import './PlaylistAnalyzer.css'

import { getAudioFeatures } from '../../../helpers/functions';

const PlaylistAnalyzer = ({ playlist }) => {

    const [audioFeatures, setAudioFeatures] = useState([]);

    function renderAnalyticalComponents() {
        if (!playlist || Object.keys(playlist).length === 0) return null;
        
        const audioFeatureAverages = calculateAudioFeatureAverages();
        const components = [
            <PlaylistItem id={playlist.id} name={playlist.name} count={playlist.count}/>,
            <CustomChart audioFeatures={audioFeatureAverages} />,
        ]

        return components
    }

    useEffect(load, [playlist]);

    function load() {
        if (playlist) {
            const trackIds = Object.entries(playlist.tracks).map(({id}) => id);
            getAudioFeatures(trackIds)
                .then(audioFeatures => setAudioFeatures(audioFeatures));
        }
    }

    function calculateAudioFeatureAverages(audioFeatures) {
        let featureAverages = {
            danceability: 0,
            energy: 0,
            tempo: 0,
            valence: 0,
            liveness: 0,
            instrumentalness: 0,
            speechiness: 0
        }

        for (const data of Object.values(audioFeatures)) {
            featureAverages.danceability += data.danceability;
            featureAverages.energy += data.energy;
            featureAverages.tempo += data.tempo;
            featureAverages.valence += data.valence;
            featureAverages.liveness += data.liveness;
            featureAverages.instrumentalness += data.instrumentalness;
            featureAverages.speechiness += data.speechiness;
        }

        const count = Object.keys(audioFeatures).length;

        Object.keys(featureAverages).forEach(key => {
            featureAverages[key] = featureAverages[key] / count;
        })

        return featureAverages;
    }

    return (
        <div className='PlaylistAnalyzer'>
            {renderAnalyticalComponents()}
        </div>
    )
}

export default PlaylistAnalyzer;