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
    const [country, setCountry] = useState(existingCountry);
    const [cities, setCities] = useState(null);
    const [cityLoading, setCityLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState(existingCity);
    const [error, setError] = useState(null);
    const [geoLoading, setGeoLoading] = useState(false);

    const handleManualLocationSelection = async () => {
        setGeoLoading(true);
        const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${selectedCity},${country.code}&limit=5&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY}`);
        if (res.data[0]) {
            const { lat, lon } = res.data[0];
            onManualLocationSelection(selectedCity, country.name, lat, lon);
            Cookies.set('city', selectedCity, { expires: COOKIE_EXPIRATION_DURATION })
            Cookies.set('country', country.name, { expires: COOKIE_EXPIRATION_DURATION })
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
        country = JSON.parse(country);
        
        setError(null); //clearing the previous errors.
        setCountry(country);
        setCities(null); //to clean up previous selection
        setSelectedCity(""); //reset previous city
        setCityLoading(true);
        
        //check if the countriesData is available to access
        const cachedCountryData = JSON.parse(localStorage.getItem('countriesData')) || [];
        const selectedCountry = cachedCountryData?.find(c => c.country === country.name);
        
        if (selectedCountry) {
            const sortedCities = selectedCountry.cities.sort((a,b) => a.localeCompare(b)).map(city => ({value: city, label: city}));
            setCities(sortedCities);
            setCityLoading(false);
        } else {
            try {
                const res = await axios.post("https://countriesnow.space/api/v0.1/countries/cities", { country: country?.name }); 
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
    }

    useEffect(() => {
        locError && setOpen(true);

        //TODO: impmenet this (https://github.com/dr5hn/countries-states-cities-database) in toufic.me then make calls from there
        const cachedCountryData = JSON.parse(localStorage.getItem('countriesData')) || [];
        if (cachedCountryData.length) {
            setCountries(cachedCountryData);
        } else {
            axios.get("https://countriesnow.space/api/v0.1/countries")
                .then(res => {
                    setCountries(res.data.data); 
                    localStorage.setItem('countriesData', JSON.stringify(res.data.data))
                })
                .catch(error => console.error("Error fetching countries:", error))
        }

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
                <>{existingCity ?? selectedCity}, {existingCountry ?? country?.name}</> <span>{<CiEdit />}</span>
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