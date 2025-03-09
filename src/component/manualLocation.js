import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const COOKIE_EXPIRATION_DURATION = 30;

const ManualLocation = ({onManualLocationSelection, locError}) => {
    const [open, setOpen] = useState(false);
    const [countries, setCountries] = useState(null);
    const [country, setCountry] = useState(null);
    const [cities, setCities] = useState();
    const [cityLoading, setCityLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);

    const handleManualLocationSelection = async () => {
        const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${selectedCity},${country}&limit=1&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY}`);
        if (res.data[0]) {
            const {lat, lon} = res.data[0];
            onManualLocationSelection(selectedCity, country, lat, lon);
            Cookies.set('city', selectedCity, { expires: COOKIE_EXPIRATION_DURATION })
            Cookies.set('country', country, { expires: COOKIE_EXPIRATION_DURATION })
            Cookies.set('lat', lat, { expires: COOKIE_EXPIRATION_DURATION })
            Cookies.set('long', lon, { expires: COOKIE_EXPIRATION_DURATION })
            setOpen(false)
        } else {
            alert('Your city was not found, Please select a nearby major city');
        }
    }

    const handleManualLocationTrigger = () => {
        setOpen(prevState => !prevState);
    }
    
    const fetchCities = async country => {
        setCountry(country);
        setCities(null); //to clean up previous selection
        setSelectedCity(""); //reset previous city
        setCityLoading(true);

        try {
            const res = await axios.post("https://countriesnow.space/api/v0.1/countries/cities", { country });
            const sortedCities = res.data.data.sort((a, b) => a.localeCompare(b));
            setCities(sortedCities);
            setCityLoading(false);
        } catch (error) {
            console.log('error finding cities for specific country', error);
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
        <>
            <button className='manual-location-trigger' onClick={handleManualLocationTrigger}>{open ? 'Close' : 'Change Location'}</button>
            <div className={`manual-location-selction ${open ? 'open' : ''}`}>
                <h2 className='manual-location-heading'>Select your location</h2>
                <div className="container">
                    {countries && <select onChange={(e)  => fetchCities(e.target.value)} name="country" id="country">
                        <option value="">Select a country</option>
                        {countries.map(country => (
                            <option key={country.iso3} value={country.country}>
                                {country.country}
                            </option>
                        ))}
                    </select>}
                    {cityLoading && <p>Loading cities...</p>}
                    {cities && <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                        <option value="">Select your city</option> 
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>}

                    {selectedCity && <button onClick={handleManualLocationSelection}>Confirm</button>}
                </div>
                
            </div>
        </>
    )
}

export default ManualLocation;