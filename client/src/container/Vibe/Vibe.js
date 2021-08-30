import React, { useState, useEffect } from 'react';
import { getAudioFeatures, getAudioFeaturesForTrack, getLikedTracks } from '../../helpers/functions';
import './Vibe.css';
import axios from 'axios';

axios.defaults.withCredentials = true;

const Vibe = (props) => {

    const [track, setTrack] = useState({});
    const [tracks, setTracks] = useState({});
    const [audioFeatures, setAudioFeatures] = useState([]);

    function buildTable() {
        return (
            <table className="VibeTable">
                {buildTableHeader()}
                {buildTableData()}
            </table>
        )
    }

    function buildTableHeader() {
        const columns = ['Track', 'Artist', 'BPM', 'Energy', 'Valence'];
        const headers = columns.map(col => <th>{col}</th>);
        return (
            <thead className='VibeTable__HeaderRow'>
                <tr>
                    {headers}
                </tr>
            </thead>
        );
    }

    function buildTableData() {
        const rows = Object.values(tracks).map((track, index) => {
            const trackId = track.id;
            const trackName = track.name;
            const trackArtist = track.artists[0].name
            const features = audioFeatures[index];
            return (
                <tr id={trackId} className='VibeTable__DataRow' onClick={handleTrackSelection}>
                    <td>{trackName}</td>
                    <td>{trackArtist}</td>
                    <td>{features.tempo}</td>
                    <td>{features.energy}</td>
                    <td>{features.valence}</td>
                </tr>
            )
        });
        return (
            <tbody>
                {rows}
            </tbody>
        )
    }

    function handleTrackSelection(event) {
        event.stopPropagation();
        const index = event.currentTarget.rowIndex;
        const targetTrack = tracks[index];
        getAudioFeaturesForTrack(targetTrack.id)
            .then(data => console.log(data));
    }

    useEffect(() => {
        getLikedTracks().then(data => setTracks(data));
    }, [])

    useEffect(() => {
        if (Object.keys(tracks).length !== 0) {
            const ids = Object.values(tracks).map(track => track.id);
            getAudioFeatures(ids).then(data => setAudioFeatures(data));
        }
    }, [tracks])

    return (
        <div className='VibeContainer'>
            {audioFeatures.length !== 0 && buildTable()}
        </div>

    )
}

export default Vibe;