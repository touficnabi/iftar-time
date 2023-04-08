import { useEffect, useState } from "react";
import axios from "axios"

const useGetCities = ({cityName}) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios.get('http://geodb-free-service.wirefreethought.com/v1/geo/cities', {
            params: {
                namePrefix: cityName
            }
        })
        .then(res => setCities(res))
        .catch(err => {
            console.log('City hook error', err);
        })
    }, [cityName])

    return cities;
}

export default useGetCities;