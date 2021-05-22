import * as Constants from '../../helpers/Constants';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import List from '../../component/List/List';
import Selector from '../../component/Selector/Selector';
import TrackAnalyzer from './TrackAnalyzer/TrackAnalyzer';
import PlaylistAnalyzer from './PlaylistAnalyzer/PlaylistAnalyzer';

import './Analyzer.css';

const Analyzer = (props) => {

    const [mode, setMode] = useState('select');

    const modes = [
        {
            value: Constants.MODE_TRACK,
            title: '',
            imgUrl: ''
        },
        {
            value: Constants.MODE_PLAYLIST,
            title: '',
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
            {mode !== Constants.MODE_SELECT && <div>return</div>}
            {mode === Constants.MODE_PLAYLIST && <PlaylistAnalyzer />}
            {mode === Constants.MODE_TRACK && <TrackAnalyzer />}
        </div>
    )
}

export default Analyzer;