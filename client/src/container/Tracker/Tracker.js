import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Controls from '../../component/Controls/Controls';
import List from '../../component/List/List';
import './Tracker.css'

const Tracker = (props) => {

    const TYPE_DEFAULT = 'tracks';
    const LIMIT_DEFAULT = 10;
    const RANGE_DEFAULT = 'long_term';

    const [type, setType] = useState(TYPE_DEFAULT);
    const [limit, setLimit] = useState(LIMIT_DEFAULT);
    const [timeRange, setTimeRange] = useState(RANGE_DEFAULT);
    const [items, setItems] = useState([]);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    function handleTypeChange(e) {
        setType(e.target.value);
    }

    function handleTimeRangeChange(e) {
        setTimeRange(e.target.value);
    }

    function handleLimitChange(e) {
        if (e.target.value > 50) {
            e.target.value = 50;
        } else if (e.target.value < 0) {
            e.target.value = 0
        }
        setLimit(e.target.value);
    }

    function getItems() {
        const url = `${BASE_URL}/api/spotify-helper/top-${type}`;
        const options = {
            params: {
                'time_range': timeRange,
                'limit': limit,
                'offset': 0
            }
        }

        axios.get(url, options)
            .then(response => response.data.items)
            .then(items => setItems(items));
    }

    useEffect(getItems, [type, timeRange, limit]);

    return (
        <div className='tracker'>
            <Controls
                limit={limit}
                handleTypeChange={handleTypeChange}
                handleTimeRangeChange={handleTimeRangeChange}
                handleLimitChange={handleLimitChange}/>
            <List type={type} items={items} />
        </div>
    )
}

export default Tracker;