import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Controls from '../../component/Controls/Controls';
import List from '../../component/List/List';
import './Tracker.css'

const Tracker = () => {

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const TYPE_DEFAULT = 'tracks';
    const LIMIT_DEFAULT = 10;
    const RANGE_DEFAULT = 'long_term';

    const [type, setType] = useState(TYPE_DEFAULT);
    const [limit, setLimit] = useState(LIMIT_DEFAULT);
    const [timeRange, setTimeRange] = useState(RANGE_DEFAULT);
    const [items, setItems] = useState([]);
    const [isReady, setIsReady] = useState(false);

    function handleTypeChange(event) {
        setType(event.target.value);
    }

    function handleTimeRangeChange(event) {
        setTimeRange(event.target.value);
    }

    function handleLimitChange(event) {
        if (event.target.value > 50) {
            event.target.value = 50;
        } else if (event.target.value < 0) {
            event.target.value = 0
        }
        setLimit(event.target.value);
    }

    function getItems() {
        let url = `${BASE_URL}/api/spotify-helper/top-${type}`;
        url += `?time_range=${timeRange}&limit=${limit}&offset=${0}`
        axios.get(url)
            .then(response => {
                const items = response.data.items;
                setItems(items);
                setIsReady(true);
            });
    }

    useEffect(getItems, [type, timeRange, limit]);

    return (
        <div className='Tracker'>
            <Controls
                limit={limit}
                handleTypeChange={handleTypeChange}
                handleTimeRangeChange={handleTimeRangeChange}
                handleLimitChange={handleLimitChange}/>
            {isReady && <List items={items} />}
        </div>
    )
}

export default Tracker;