import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTrack } from '../../features/trackSlice';
import { setItems } from '../../features/itemsSlice';
import { getTop } from '../../helpers/api';

import Header from '../../component/Header/Header';
import Controls from '../../component/Controls/Controls';
import List from '../../component/List/List';
import './Tracker.css'

const Tracker = () => {
    const track = useSelector(state => state.track.value);
    const items = useSelector(state => state.items.value);
    const dispatch = useDispatch();

    const TYPE_DEFAULT = 'tracks';
    const LIMIT_DEFAULT = 10;
    const RANGE_DEFAULT = 'long_term';

    const [type, setType] = useState(TYPE_DEFAULT);
    const [limit, setLimit] = useState(LIMIT_DEFAULT);
    const [timeRange, setTimeRange] = useState(RANGE_DEFAULT);
    const [isReady, setIsReady] = useState(false);

    function handleTypeChange(event) {
        setType(event.target.value);
    }

    function handleTimeRangeChange(event) {
        setTimeRange(event.target.value);
    }

    function handleLimitChange(event) {
        let value = Math.round(event.target.value)
        if (value > 50) {
            value = 50;
        } else if (value < 0) {
            value = 0
        }
        setLimit(value);
    }

    function handleItemClick(event) {
        const id = event.currentTarget.id;
    }

    async function getItems() {
        getTop(type, timeRange, limit)
            .then(items => dispatch(setItems(items)))
            .then(setIsReady(true));
    }

    useEffect(() => {
        getItems();
    }, [type, timeRange, limit]);

    return (
        <div className='Tracker'>
            <Header>
                top artists & tracks
                <Controls
                    limit={limit}
                    handleTypeChange={handleTypeChange}
                    handleTimeRangeChange={handleTimeRangeChange}
                    handleLimitChange={handleLimitChange} />
            </Header>
            {isReady && <List items={items} handleClick={handleItemClick}/>}
        </div>
    )
}

export default Tracker;