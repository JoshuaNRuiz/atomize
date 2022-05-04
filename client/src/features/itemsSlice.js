import { createSlice } from "@reduxjs/toolkit";

export const itemsSlice = createSlice({
    name: "itemsSlice",
    initialState: {
        value: {}
    },
    reducers: {
        setItems: (state, action) => {
            state.value = action.payload;
        },
        clearItems: (state, action) => {
            state.value = {};
        }
    }
});

export const { setItems, clearItems } = itemsSlice.actions;
export default itemsSlice.reducer;