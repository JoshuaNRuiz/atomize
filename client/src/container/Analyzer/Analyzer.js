import * as Constants from '../../helpers/Constants';
import React, { useState } from 'react';

import Selector from '../../component/Selector/Selector';
import TrackAnalyzer from './TrackAnalyzer/TrackAnalyzer';
import PlaylistAnalyzer from './PlaylistAnalyzer/PlaylistAnalyzer';

import vinyl from '../../resources/vinyl-background.jpg';
import playlist from '../../resources/playlist-image.jpg';

import './Analyzer.css';

const Analyzer = () => {

    const [mode, setMode] = useState('select');

    const modes = [
        {
            value: Constants.MODE_TRACK,
            title: 'select a track',
            image: vinyl,
        },
        {
            value: Constants.MODE_PLAYLIST,
            title: 'select a playlist',
            image: playlist,
        },
    ];

    function handleSelection(e) {
        e.stopPropagation();
        const value = e.currentTarget.value;
        setMode(value);
    }

    return (
        <div className='Analyzer'>
            {mode === Constants.MODE_SELECT && <Selector options={modes} handleSelection={handleSelection}/>}
            {mode === Constants.MODE_TRACK && <TrackAnalyzer />}
            {mode === Constants.MODE_PLAYLIST && <PlaylistAnalyzer />}
        </div>
    )
}

export default Analyzer;