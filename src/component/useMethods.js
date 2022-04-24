import axios from "axios";
import {useState, useEffect} from "react";

const useMethods = (lat, long) => {
    const [methods, setMethods] = useState([]);
    const [defaultLocation, setDefaultLocation] = useState(2);

    useEffect(() => {
        axios.get('http://api.aladhan.com/v1/methods').then(res => {
            const newData = Object.values(res.data.data);
            setMethods(newData);
            
            const arrayWithLocation = newData.filter(method => method.location && method);
            
            const findClosest = (arr = []) => {
                return arr.sort((a, b) => {
                    const distanceA = Math.abs(a.latitude - lat);
                    const distanceB = Math.abs(b.latitude - lat);
                    if (distanceA === distanceB) {
                        return a - b;
                    }
                    return distanceA - distanceB;
                }).slice(0, 2).sort((a, b) => a - b)
            }

            const closestLat = findClosest(arrayWithLocation, lat);
            const closestLocation = closestLat.reduce((prev, curr) => Math.abs(curr.location.longitude - long) < Math.abs(prev.location.longitude - long) ? curr : prev);
            console.log(closestLocation);
            setDefaultLocation(closestLocation.id);

        }).catch(err => {
            console.log(err);
        })
    } , [lat, long]);

    return {methods, defaultLocation};
}

export default useMethods;