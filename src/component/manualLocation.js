import { useEffect, useState } from 'react';
import axios from 'axios';
// import countryData from './../data/city-country.json';
import Cookies from 'js-cookie';
import { CiEdit } from "react-icons/ci";
import ChangeCity from './changeCity';

const COOKIE_EXPIRATION_DURATION = 30;

const ManualLocation = ({onManualLocationSelection, locError, existingCity, existingCountry}) => {
    const [open, setOpen] = useState(false);
    const [countries, setCountries] = useState(null);
    const [country, setCountry] = useState(null);
    const [cities, setCities] = useState(null);
    const [cityLoading, setCityLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const [error, setError] = useState(null);
    const [geoLoading, setGeoLoading] = useState(false);

    const handleManualLocationSelection = async () => {
        setGeoLoading(true);
        const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${selectedCity},${country}&limit=1&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY}`);
        if (res.data[0]) {
            const {lat, lon} = res.data[0];
            onManualLocationSelection(selectedCity, country, lat, lon);
            Cookies.set('city', selectedCity, { expires: COOKIE_EXPIRATION_DURATION })
            Cookies.set('country', country, { expires: COOKIE_EXPIRATION_DURATION })
            Cookies.set('lat', lat, { expires: COOKIE_EXPIRATION_DURATION })
            Cookies.set('long', lon, { expires: COOKIE_EXPIRATION_DURATION })
            setGeoLoading(false);
            setOpen(false);
        } else {
            setGeoLoading(false);
            setError('Your city was not found, Please select a nearby major city');
        }
    }

    const handleManualLocationTrigger = () => {
        setCountry(null);
        setCities(null);
        setSelectedCity(null);
        setError(null);
        setOpen(prevState => !prevState);
    }
    
    const fetchCities = async country => {
        setError(null); //clearing the previous errors.
        setCountry(country);
        setCities(null); //to clean up previous selection
        setSelectedCity(""); //reset previous city
        setCityLoading(true);

        try {
            const res = await axios.post("https://countriesnow.space/api/v0.1/countries/cities", { country }); 
            const sortedCities = res.data.data.sort((a, b) => a.localeCompare(b)).map(city => ({value: city, label: city}));
            setCities(sortedCities);
            setCityLoading(false);
        } catch (error) {
            if (error) {
                setError('There was an error finding the cities of the selected Country.')
                setCityLoading(false);
            }
        }
    }

    useEffect(() => {
        locError && setOpen(true)
        axios.get("https://countriesnow.space/api/v0.1/countries")
            .then(res => setCountries(res.data.data))
            .catch(error => console.error("Error fetching countries:", error));

    }, [locError])

    useEffect(() => {
        const city = new URLSearchParams(window.location.search).get('city');
        const country = new URLSearchParams(window.location.search).get('country');

        if (city && country) {
            console.log('this is city from url', city);
            console.log('this is country from url', country);
        }
    }, [])
    return (
        <div className='manual-location'>
            <button className='manual-location-trigger' onClick={handleManualLocationTrigger}>
                <>{existingCity ?? selectedCity}, {existingCountry ?? country}</> <span>{<CiEdit />}</span>
            </button>
            {open && (
                <ChangeCity 
                    error={error}
                    geoLoading={geoLoading}
                    countries={countries} 
                    fetchCities={fetchCities}
                    country={country}
                    cityLoading={cityLoading}
                    cities={cities}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    handleManualLocationSelection={handleManualLocationSelection}
                    handleManualLocationTrigger={handleManualLocationTrigger}
                />
            )}
        </div>
    )
}

export default ManualLocation;