import React, { useEffect, useState } from 'react';
import './App.css';
import Page1 from './component/newPage';
import Loading from './component/Loading';
import axios from 'axios';
import SelectCity from './component/SelectCity';
import Cookies from 'js-cookie';
// import Page from './component/Page';

function App() {
    const [lat, setLat] = useState(23.0111110000);
    const [long, setLong] = useState(90.011110000);
    const [location, setLocation] = useState(false);
    const [city, setCity] = useState(null);
    const [country, setCountry] = useState(null);
    const [locError, setLocError] = useState(false);
    // const [getInfoFromCity, setGetInfoFromCity] = useState(false);

    useEffect(() => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(getUserLocation, getUserIpLocation);
        }
    }, []);

    //IF USER ALLOWS LOCATION
    const getUserLocation = pos => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLong(longitude);
        setLocation(true);
    }

    const getUserIpLocation = () => {

        // const cookie_city = Cookies.get('city');
        // const cookie_country = Cookies.get('country');

        axios.get('https://ipapi.co/json/').then(res => {
            const { data } = res;
            const { latitude, longitude, city, country_name } = data;
            setLat(latitude);
            setLong(longitude);
            setCity(city);
            setCountry(country_name);
            setLocation(true);
        }).catch(err => {
            getLocationFromCookie();
            // setGetInfoFromCity(true);
            // if(cookie_city && cookie_country){
            //     setCity(cookie_city);
            //     setCountry(cookie_country);
            //     setLocation(true);
            //     setLocError(false);
            // } else {
            //     setLocError(true);
            // }
        })
    }

    const getLocationFromCookie = () => {
        const lat = Cookies.get('lat');
        const long = Cookies.get('long');
        const city = Cookies.get('city');
        const country = Cookies.get('country');
        if (lat && long) {
            setLat(lat);
            setLong(long);
            setCity(city);
            setCountry(country);
            setLocation(true);
        } else {
            setLocError(true);
        }
    }

    if (locError) {
        return (
            <div className="App">
                <h1 className='error-msg'>Please turn off your adBlocker Extenstion from the browser! or</h1>
                <SelectCity />
            </div>
        )
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