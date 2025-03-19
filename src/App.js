import React, { useEffect, useState } from 'react';
import './App.css';
import Page1 from './component/newPage';
import Loading from './component/Loading';
import axios from 'axios';
import Cookies from 'js-cookie';
import './styles/style.scss';
import ManualLocation from './component/manualLocation';
// import SelectCity from './component/SelectCity';
// import Page from './component/Page';

function App() {
    const [lat, setLat] = useState(23.0111110000);
    const [long, setLong] = useState(90.011110000);
    const [location, setLocation] = useState(false);
    const [city, setCity] = useState(null);
    const [country, setCountry] = useState(null);
    const [locError, setLocError] = useState(false);
    const [getInfoFromCity, setGetInfoFromCity] = useState(false);

    const onManualLocationSelection = (city, country, lat, long) => {
        setGetInfoFromCity(true);
        city && setCity(city);
        country && setCountry(country);
        lat && setLat(lat);
        long && setLong(long);
        setLocError(false)
        setLocation(true);

        //removing query peram on location change
        const url = new URL(window.location.href);
        url.searchParams.delete('method');
        window.history.pushState({}, "", url);
    }

    useEffect(() => {
        const controller = new AbortController();
        //IF USER ALLOWS LOCATION
        const getUserLocation = pos => {
            const { latitude, longitude } = pos.coords;
            setLat(latitude);
            setLong(longitude);
            setLocation(true);
            getCity(latitude, longitude);
        }


        const getUserIpLocation = () => {
            const cookieCity = Cookies.get('city');
            const cookieCountry = Cookies.get('country');
            const cookieLat = Cookies.get('lat');
            const cookieLong = Cookies.get('long');

            if (cookieCity && cookieCountry && cookieLat && cookieLong) {
                setCity(cookieCity);
                setCountry(cookieCountry);
                setLat(cookieLat);
                setLong(cookieLong);
                setLocation(true);
            } else {
                axios.get('https://ipapi.co/json/', {signal: controller.signal}).then(res => {
                    const { data } = res;
                    const { latitude, longitude, city, country_name } = data;
                    setLat(latitude);
                    setLong(longitude);
                    setCity(city);
                    setCountry(country_name);
                    setLocation(true);
                }).catch(err => {
                    console.log(err);
                    getLocationFromCookie();
                })
            }

        }

        const getLocation = () => {
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(getUserLocation, getUserIpLocation);
            }
        }

        getLocation();
        // location && document.body.classList.add('ready');
        return () => controller.abort();
    },[]);


    const getCity = (lat, long) => {
        axios.get('http://api.openweathermap.org/geo/1.0/reverse', {
            params: {
                lat: lat, 
                lon: long,
                limit: 2,  
                appid: process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY
            }
        })
        .then(res => {
            setCity(res.data[0].name);
            setCountry(res.data[0].state);
        })
        .catch(error => console.error("Error fetching open weather map data:", error));
    }


    //TODO implement cookie logic
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
                {/* <SelectCity /> */}
                <ManualLocation existingCity={city} existingCountry={country} locError={locError} onManualLocationSelection={onManualLocationSelection} />
            </div>
        )
    }

    if (location){
        return(
            <div className="App">
                <ManualLocation existingCity={city} existingCountry={country} onManualLocationSelection={onManualLocationSelection} />
                <Page1 getInfoFromCity={getInfoFromCity} lat={lat} long={long} city={city} country={country} />
            </div>
        )
    }

    return (
        <Loading />
    );
}

export default App;