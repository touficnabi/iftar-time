import React, { useEffect, useState } from 'react';
import './App.css';
import Page1 from './component/newPage';
import Loading from './component/Loading';
// import Page from './component/Page';
// import axios from 'axios';

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
        setLocation(true)
    }

    const getUserIpLocation = () => {
        console.log('location is not available');
        setCity(null);
        setCountry(null)
        // const IPSTACK_API_KEY = process.env.REACT_APP_IP_STACK_API_KEY;
        // axios.get(`http://api.ipstack.com/check?access_key=${IPSTACK_API_KEY}`).then(res => {
        //     const {latitude, longitude, city, country_name} = res.data;
        //     setLat(latitude);
        //     setLong(longitude);
        //     setCity(city);
        //     setCountry(country_name);
        //     setLocation(true);
        // })
    }

    if (location){
        return(
            <div className="App">
                <Page1 lat={lat} long={long} city={city} country={country} />
            </div>
        )
    }

    return (
        <Loading />
    );
}

export default App;