import React, {useState} from 'react';
import Controls from '../../component/Controls/Controls';
import Tracklist from '../../component/Tracklist/Tracklist';
import './Tracker.css'

const Tracker = (props) => {

    const LIMIT_DEFAULT = 10;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;
    const RANGE_DEFAULT = 'long_term';

    const [isLoaded, setIsLoaded] = useState(false);
    const [limit, setLimit] = useState(LIMIT_DEFAULT);
    const [timeRange, setTimeRange] = useState(RANGE_DEFAULT);
    const [items, setItems] = useState([]);

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
        fetch('/api/songs', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.accessToken
            },
            body: {
                
            }
        })
        .then(response => {
            if (!response.ok) {
                alert("Your authentication has expired.");
                throw new Error("Authentication has failed. Please log in again.")
            }
            return response.json();
        })
        .then(data => {
            setIsLoaded(true);
            setItems(data.items)
        })
        .catch(error => {
            console.log(error);
        })
    }

    let tracklist = isLoaded ? <Tracklist items={items}/> : null

    return (
        <div className='tracker'>
            <Controls 
                min={MIN_LIMIT} 
                max={MAX_LIMIT} 
                limit={limit} 
                handleTimeRangeChange={handleTimeRangeChange}
                handleLimitChange={handleLimitChange}
                handleRefresh={handleRefresh}/>
            {tracklist}
        </div>
    )
}

export default Tracker;