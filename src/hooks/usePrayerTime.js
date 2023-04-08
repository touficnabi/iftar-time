import {useEffect} from 'react'
import axios from 'axios'

const usePrayerTime = (latitude, longitude, method) => {
    
    const apiEndpoint = 'https://api.aladhan.com/v1/calendar';
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const getPrayerTime = async () => {
        try {
            const response = await axios.get(apiEndpoint, {
                params: {
                    latitude,
                    longitude,
                    method,
                    month,
                    year
                }
            });
            return response;
        } catch(err) {
            console.log('Error getting the prayer time', err)
        }

    }

    useEffect(() => {
        getPrayerTime();
    }, [latitude, longitude, method])
}

export default usePrayerTime;