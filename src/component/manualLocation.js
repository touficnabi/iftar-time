import axios from 'axios';
import { useEffect, useState } from 'react';

const ManualLocation = ({onManualLocationSelection}) => {
    const [countries, setCountries] = useState(null);
    const [country, setCountry] = useState(null);
    const [cities, setCities] = useState();
    const [selectedCity, setSelectedCity] = useState(null)

    const handleManualLocationSelection = () => {
        console.log('this is confirm')
        onManualLocationSelection(selectedCity, country);
    }
    
    const fetchCities = async country => {
        setCountry(country);
        setCities([]); //to clean up previous selection
        setSelectedCity(""); //reset previous city

        try {
            const res = await axios.post("https://countriesnow.space/api/v0.1/countries/cities", { country });
            setCities(res.data.data);
        } catch (error) {
            console.log('error finding cities for specific country', error);
        }
    }

    useEffect(() => {
        axios.get("https://countriesnow.space/api/v0.1/countries")
            .then(res => setCountries(res.data.data))
            .catch(error => console.error("Error fetching countries:", error));

    }, [])
    return (
        <div className='manual-location-selction'>
        {countries && <select onChange={(e)  => fetchCities(e.target.value)} name="country" id="country">
            <option value="">Select a country</option>
            {countries.map(country => (
                <option key={country.iso3} value={country.country}>
                    {country.country}
                </option>
            ))}
        </select>}

        {cities && <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="">Select your city</option> 
            {cities.map(city => (
                <option key={city} value={city}>{city}</option>
            ))}
        </select>}

        <button onClick={handleManualLocationSelection}>Confirm</button>
            
        </div>
    )
}

export default ManualLocation;