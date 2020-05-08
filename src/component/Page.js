import React, { Component } from 'react';
import axios from 'axios';
import '../styles/_reset.css';
import '../styles/_page.css';

import Timer from './Timer';

class Page extends Component{

    state = {
        isLoaded : false,
        city: "",
        country_name: "",
        latitude: "",
        longitude: "",
        utc_offset: "",
        Fajr: "",
        Maghrib: "",
        FajrNextDay: ""
    }

    //geolocation
    geolocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getLocation, this.getTime)
        }
    }

    //adding zero if less than 10
    pad = n => {
        return n < 10 ? `0${n}` : n;
    }

    //GET DATA OF LOCATION AVAILABLE
    getLocation = pos => {

        const { latitude, longitude } = pos.coords;

        const now = new Date() //moment();
        const year = now.getFullYear(); //now.year();
        const month = now.getMonth() + 1; //now.month() + 1;
        const day = now.getDate() - 1; //now.day();

        //calcaulate timezoneOffet
        const offset     = now.getTimezoneOffset(),
              sign       = offset < 0 ? '+' : '-',
              tzHours    = this.pad(Math.floor(Math.abs(offset/60))),
              tzMinutes  = this.pad(Math.abs(offset%60)),
              utc_offset = `${sign}${tzHours}${tzMinutes}`;
        console.log(offset, sign, tzHours, tzMinutes)

        //make call to api
        axios.get(`https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=2&month=${month}&year=${year}`)
                .then(resp => {
                    const { data } = resp.data;
                    const { Fajr, Maghrib } = data[day].timings;
                    const FajrNextDay = data[day].timings.Fajr;
                    
                    //city and country name
                    axios.get('https://geolocation-db.com/json').then(res => {
                        console.log(res)
                    })

                    //setting the state according to the data
                    this.setState({
                        isLoaded: true,
                        //city,
                        //country_name,
                        latitude,
                        longitude,
                        utc_offset,
                        Fajr,
                        Maghrib,
                        FajrNextDay
                    })
                })


    }

    //GET TIME IF NO LOCATION AVAILABLE
    getTime = () => {

        const now = new Date() //moment();
        const year = now.getFullYear(); //now.year();
        const month = now.getMonth() + 1; //now.month() + 1;
        const day = now.getDate() - 1; //now.day();

        //get the ip & data
        axios.get('https://ipapi.co/json').then(res => {
            const { data } = res;
            const { city, country_name, latitude, longitude, utc_offset } = data;

            axios.get(`https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=2&month=${month}&year=${year}`)
                .then(resp => {
                    const { data } = resp.data;
                    const { Fajr, Maghrib } = data[day].timings;
                    const FajrNextDay = data[day].timings.Fajr;
                    
                    //setting the state according to the data
                    this.setState({
                        isLoaded: true,
                        city,
                        country_name,
                        latitude,
                        longitude,
                        utc_offset,
                        Fajr,
                        Maghrib,
                        FajrNextDay
                    })
                })
        })
    }


    async componentDidMount(){
        //this.getTime();
        this.geolocation();
    }

    render(){
        
        const {isLoaded, city, country_name, utc_offset, Fajr, Maghrib, FajrNextDay } = this.state;


        if(isLoaded){
            return(
                <React.Fragment>
                    <div className="content">
                        <Timer Fajr={Fajr} Maghrib={Maghrib} FajrNextDay={FajrNextDay} utc_offset={utc_offset} city={city} country={country_name} />
                        
                        <div className="bottom">
                            <div className="bottom-wrapper">
                                <div className="bottom-container">
                                    <div className="box">
                                        <p>Timing source: Islamic Society North America &#40;ISNA&#41;</p>
                                        {/* <p>Iftar Time: {Maghrib}</p> */}
                                        {/* <p>Sehri Time: {Fajr}</p> */}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }else {
            return(
                <React.Fragment>
                    <div className="fd" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{margin: 'auto', background: 'rgba(241, 242, 243,0)', display: 'block'}} width="191px" height="191px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                            <circle cx="50" cy="50" r="3.04639" fill="none" stroke="#eb7f19" strokeWidth="2">
                                <animate attributeName="r" repeatCount="indefinite" dur="1.8518518518518516s" values="0;20" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="-0.9259259259259258s"></animate>
                                <animate attributeName="opacity" repeatCount="indefinite" dur="1.8518518518518516s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="-0.9259259259259258s"></animate>
                            </circle>
                            <circle cx="50" cy="50" r="14.1886" fill="none" stroke="#dfa950" strokeWidth="2">
                                <animate attributeName="r" repeatCount="indefinite" dur="1.8518518518518516s" values="0;20" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline"></animate>
                                <animate attributeName="opacity" repeatCount="indefinite" dur="1.8518518518518516s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline"></animate>
                            </circle>

                        </svg>
                    </div>
                </React.Fragment>
            )
        }
        
    }
}

export default Page;