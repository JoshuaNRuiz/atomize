import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export async function getUsersPlaylists() {
    const url = `${BASE_URL}/api/spotify-helper/user-data/playlists`;
    return await axios.get(url)
        .then(response => response.data);
}

export async function searchForTrack(query) {
    const url = `${BASE_URL}/api/spotify-helper/search?q=${query}&type=track`;
    return await axios.get(url)
        .then(response => response.data.tracks.items);
};

export async function getAudioFeatures(trackId) {
    const url = `${BASE_URL}/api/spotify-helper/audio-features/${trackId}`;
    return await axios.get(url)
        .then(response => filterAudioFeatures(response.data));
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