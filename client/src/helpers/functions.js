import axios from 'axios';

export async function getUsersPlaylists() {
    const url = '/api/spotify-helper/user-data/playlists';
    return await axios.get(url)
        .then(response => response.data);
}

export async function getPlaylistTracks(playlistId) {
    const url = `/api/spotify-helper/playlist/${playlistId}`;
    return await axios.get(url)
        .then(response => response.data.items);
}

export async function searchForTrack(trackName) {
    const url = `/api/spotify-helper/search?q=${trackName}&type=track`;
    return await axios.get(url)
        .then(response => response.data.tracks.items);
};

export async function getAudioFeaturesForTrack(trackId) {
    const url = `/api/spotify-helper/audio-features/${trackId}`;
    return await axios.get(url)
        .then(response => response.data);
}

export async function getAudioFeatures(trackIds) {
    const url = `/api/spotify-helper/audio-features`;
    const requestData = {
        track_ids: trackIds
    }
    return await axios.post(url, requestData)
        .then(response => response.data);
}

export async function getLikedTracks() {
    const url = `/api/spotify-helper/user-data/track`;
    return await axios.get(url)
        .then(response => response.data);
}