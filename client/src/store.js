import { configureStore } from '@reduxjs/toolkit';
import trackReducer from './features/trackSlice';
import itemsReducer from './features/itemsSlice';

export default configureStore({
    reducer: {
        track: trackReducer,
        items: itemsReducer
    }
});