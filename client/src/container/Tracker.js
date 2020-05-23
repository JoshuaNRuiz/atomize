import React from 'react';
import Tracklist from '../component/Tracklist/Tracklist';

const Tracker = (props) => {

    const accessToken = props.accessToken;

    return (
        <div>
            <div> HEADER HERE</div>
            <Tracklist accessToken={accessToken}/>
        </div>
    )
}

export default Tracker;