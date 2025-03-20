import {useState, useEffect} from "react";
import axios from "axios";
// import Cookies from "js-cookie";


const useMethods = (lat, long) => {
    const [methods, setMethods] = useState(null);
    const [defaultMethod, setDefaultMethod] = useState(null);
    // const [arrayWithMethod, setArrayWithMethod] = useState(null);

    useEffect(() => {
        axios.get('http://api.aladhan.com/v1/methods').then(res => {
            const newData = Object.values(res.data.data); //convert object to array
            // setMethods(newData);

            const arrayWithLocation = newData.filter(method => method.location && method).map(method => {
                return {
                    id: method.id,
                    name: method.name,
                    latitude: method.location.latitude,
                    longitude: method.location.longitude
                }
            });

            setMethods(arrayWithLocation);
        }).catch(err => {
            console.log(err);
        })
    }, [])
    
    useEffect(() => {
        //TODO get these functions in a name function
        //TODO run the name function here inside the useEffect
        //TODO export the name function to be used inside of newPage.js useEffect on lat long update
        
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

        if (methods) {
            const nearestLocation = findNearestLocation(methods, lat, long);
            setDefaultMethod(nearestLocation.id);
        }
    }, [lat, long, methods]);

    return {methods, defaultMethod};
}

export default useMethods;