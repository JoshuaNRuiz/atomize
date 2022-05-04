import { createSlice } from "@reduxjs/toolkit";

export const playlistSlice = createSlice({
    name: 'playlistSlice',
    initialState: {
        value: {},
    },
    reducers: {
        setPlaylist: (state, action) => {
            state.value = action.payload;
        },
        clearPlaylist: (state, action) => {
            state.value = {};
        }
    }
});

export const { setPlaylist, clearPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;