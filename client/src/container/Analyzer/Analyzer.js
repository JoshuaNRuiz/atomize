import * as Constants from '../../helpers/Constants';
import React, { useState } from 'react';

import Selector from '../../component/Selector/Selector';
import TrackAnalyzer from './TrackAnalyzer/TrackAnalyzer';
import PlaylistAnalyzer from './PlaylistAnalyzer/PlaylistAnalyzer';

import vinyl from '../../resources/vinyl-background.jpg'

import './Analyzer.css';

const Analyzer = () => {

    const [mode, setMode] = useState('select');

    const modes = [
        {
            value: Constants.MODE_TRACK,
            title: 'Select a track',
            imgUrl: vinyl,
        },
        {
            value: Constants.MODE_PLAYLIST,
            title: 'Select a playlist',
            imgUrl: '',
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
            {mode === Constants.MODE_PLAYLIST && <PlaylistAnalyzer />}
            {mode === Constants.MODE_TRACK && <TrackAnalyzer />}
        </div>
    )
}

export default Analyzer;