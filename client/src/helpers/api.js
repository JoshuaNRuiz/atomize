import axios from 'axios';
import { useLocation } from 'react-router';

const API = '/api/spotify-helper';

export async function getUsersPlaylists() {
    const url = `${API}/user-data/playlists`;
    return await axios.get(url)
        .then(response => response.data);
}

export async function getPlaylistTracks(playlistId) {
    const url = `${API}/playlist/${playlistId}`;
    return await axios.get(url)
        .then(response => response.data.items);
}

export async function searchForTrack(trackName) {
    const url = `${API}/search?q=${trackName}&type=track`;
    return await axios.get(url)
        .then(response => response.data.tracks.items);
};

export async function getAudioFeaturesForTrack(trackId) {
    const url = `${API}/audio-features/${trackId}`;
    return await axios.get(url)
        .then(response => response.data);
}

export async function getAudioFeatures(trackIds) {
    const url = `${API}/audio-features`;
    const requestData = {
        track_ids: trackIds
    }
    return await axios.post(url, requestData)
        .then(response => response.data);
}

export async function getLikedTracks() {
    const url = `${API}/user-data/track`;
    return await axios.get(url)
        .then(response => response.data);
}

export async function getTrack(id) {
    const url = `${API}/tracks/${id}`;
    return await axios.get(url)
        .then(response => response.data);
}

export async function getTop(type, timeRange, limit, offset = 0) {
    const url = `${API}/top-${type}?time_range=${timeRange}&limit=${limit}&offset=${0}`;
    return await axios.get(url)
        .then(response => response.data.items);
}

export function useQueryParameters() {
    return new URLSearchParams(useLocation().search);
}