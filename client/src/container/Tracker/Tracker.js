import React, {useState, useEffect, useRef} from 'react';
import Controls from '../../component/Controls/Controls';
import List from '../../component/List/List';
import './Tracker.css'

const Tracker = (props) => {

    const TYPE_DEFAULT = 'tracks';
    const LIMIT_DEFAULT = 10;
    const RANGE_DEFAULT = 'long_term';

    const accessToken = props.accessToken || localStorage.getItem('accessToken');

    const [type, setType] = useState(TYPE_DEFAULT);
    const [limit, setLimit] = useState(LIMIT_DEFAULT);
    const [timeRange, setTimeRange] = useState(RANGE_DEFAULT);
    const [items, setItems] = useState([]);

    const handleTypeChange = (e) => {
        setType(e.target.value);
    }

    const handleTimeRangeChange = (e) => {
        setTimeRange(e.target.value);
    }

    const handleLimitChange = (e) => {
        if (e.target.value > 50) {
            e.target.value = 50;
        } else if (e.target.value  < 0) {
            e.target.value = 0
        }
        setLimit(e.target.value);
    }

    const handleRefresh = () => {
        const url = `http://localhost:8000/api/spotify-helper/top-${type}`;
        const serverData = {
            'access_token': accessToken,
            'time_range': timeRange,
            'limit': limit,
            'offset': 0
        }

        fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serverData)
        })
        .then(response => {
            return response.ok ? response.json() : new Error(response.status);
        })
        .then(data => {
            setItems(data.items);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div className='tracker'>
            <Controls 
                limit={limit} 
                handleTypeChange={handleTypeChange}
                handleTimeRangeChange={handleTimeRangeChange}
                handleLimitChange={handleLimitChange}
                handleRefresh={handleRefresh}/>
            <List type={type} items={items}/>
        </div>
    )
}

export default Tracker;