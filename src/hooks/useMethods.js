import axios from "axios";
import {useState, useEffect} from "react";


const useMethods = (lat, long) => {
    const [methods, setMethods] = useState([]);
    const [defaultLocation, setDefaultLocation] = useState(3);
    
    useEffect(() => {
        axios.get('http://api.aladhan.com/v1/methods').then(res => {
            const newData = Object.values(res.data.data);
            setMethods(newData);
            setDefaultLocation(2);
            
            const arrayWithLocation = newData.filter(method => method.location && method).map(method => {
                return {
                    id: method.id,
                    name: method.name,
                    latitude: method.location.latitude,
                    longitude: method.location.longitude
                }
            });

            //find the nearest location from a list of locations
            const findNearestLocation = (locations, lat, long) => {
                let nearestLocation = null;
                let nearestDistance = null;
                locations.forEach(location => {
                    const distance = Math.sqrt(Math.pow(location.latitude - lat, 2) + Math.pow(location.longitude - long, 2));
                    if(nearestDistance === null || distance < nearestDistance){
                        nearestDistance = distance;
                        nearestLocation = location;
                    }
                });
                return nearestLocation;
            }

            const nearestLocation = findNearestLocation(arrayWithLocation, lat, long);
            // console.log(nearestLocation);
            setDefaultLocation(nearestLocation.id);
            
            
            
        }).catch(err => {
            console.log(err);
        })
    } , [lat, long]);
    
    return {methods, defaultLocation};
}

export default useMethods;