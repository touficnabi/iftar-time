/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from "react";
import useGetCity from "./useGetCity";

const CitySelect = () => {

    const [newCon, setNewCon] = useState('');
    const [newStates, setNewStates] = useState([]);
    // const [newCities, setNewCities] = useState([]);

    const {countries, states, cities} = useGetCity(newCon, newStates);
    const handleSelect = (e) => setNewCon(e.target.value);
    const handleSelect1 = (e) => setNewStates(e.target.value);
    // const handleSelect2 = (e) => setNewCities(e.target.value);

    return (
        <>
        <select onChange={handleSelect}>
            {countries.map((country, i) => (
                <option key={i} value={country.country_name}>{country.country_name}</option>
            ))}
        </select>
        <select onChange={handleSelect1}>
            {states.map((state, i) => (
                <option key={i} value={state.state_name}>{state.state_name}</option>
            ))}
        </select>
        <select>
            {cities.map((city, i) => (
                <option key={i} value={city.city_name}>{city.city_name}</option>
            ))}
        </select>
        </>
    )
}

export default CitySelect;