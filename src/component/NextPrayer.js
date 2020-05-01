import React, { Component, Fragment } from 'react';
import axios from 'axios';
import moment, { duration, parseZone, zone } from 'moment';

class NextTimes extends Component{

    //const { day, month, year } = this.props;
    //const { lat, long } = this.state.location;

    state={
        isLoaded: false,
        location: {
            lat: "0",
            long: "0"
        },
        day : this.props.day,
        month : this.props.month,
        year : this.props.year,
        prayerTime : {
            Fajr : null,
            Dhuhr : null,
            Asr : null,
            Maghrib : null,
            Isha : null
        }
    }

    //GET THE LOCATION
    getLocation = () => {

        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getPosition, this.getIP)
        }

    }

    getPosition = (pos) => {
        let { day, month, year } = this.state;
        
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;

        axios.get(`http://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${long}&method=3&month=${month}&year=${year}`)
        .then(res => {
            console.log(res);
            
            const { Fajr, Dhuhr, Asr, Maghrib, Isha } = res.data.data[day].timings;

            this.setState({
                isLoaded : true,
                prayerTime : {
                    Fajr,
                    Dhuhr,
                    Asr,
                    Maghrib,
                    Isha,
                }
            })

            console.log(res.data)
        })

        this.setState({
            location: {
                lat,
                long
            }
        });
    }

    getIP = (err) =>{
        console.log(err.message);
    }


    timeRemaining = () => {

        const { day, month, year } = this.state; 
        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = this.state.prayerTime;

        const m = `${year}-${month}-${day}T23:44:12`
        const cc = new Date(1585918861)
        console.log(m);
        console.log(cc)

    }


    //WHEN COMPONENT MOUTS
    componentDidMount(){
        this.getLocation();
        this.timeRemaining();
    }

    render(){

        const { day, month, year } = this.state;
        const { lat, long } = this.state.location;
        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = this.state.prayerTime;

        return(
            <Fragment>
            {/* <h1>This is the Prayer time</h1>
            <p>{day}/{month}/{year}</p>
            <p>{lat}/{long} </p>
            <p>{Fajr}</p> */}
            </Fragment>
        );
    }
}

export default NextTimes;