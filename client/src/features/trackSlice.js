import { createSlice } from "@reduxjs/toolkit";

export const trackSlice = createSlice({
    name: "trackSlice",
    initialState: {
        value: {}
    },
    reducers: {
        setTrack: (state, action) => {
            state.value = action.payload;
        },
        clearTrack: (state) => {
            state.value = {};
        }
    }
});

export const { setTrack, clearTrack } = trackSlice.actions;
export default trackSlice.reducer;