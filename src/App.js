import React, { useEffect, useState } from 'react';
import './App.css';
import Page1 from './component/newPage';
import Loading from './component/Loading';
import axios from 'axios';
import SelectCity from './component/SelectCity';
// import Page from './component/Page';

function App() {
    const [lat, setLat] = useState(23.0111110000);
    const [long, setLong] = useState(90.011110000);
    const [location, setLocation] = useState(false);
    const [city, setCity] = useState(null);
    const [country, setCountry] = useState(null);

    useEffect(() => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(getUserLocation, getUserIpLocation);
        }
    })

    //IF USER ALLOWS LOCATION
    const getUserLocation = pos => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLong(longitude);
        setLocation(true);
    }

    const getUserIpLocation = () => {
        axios.get('https://ipapi.co/latlong').then(res => {
            const { data } = res;
            const [ lat, long ] = data.split(',');
            setLat(lat);
            setLong(long);
            setLocation(true);
            setCity(null);
            setCountry(null)
        })
    }

    if (location){
        return(
            <div className="App">
                <Page1 lat={lat} long={long} city={city} country={country} />
                <SelectCity />
            </div>
        )
    }

    return (
        <Loading />
    );
}

export default App;