import React, { Component, Fragment } from 'react';
import moment, { duration } from 'moment';
import '../styles/_timer.css';

class Timer extends Component {

    state = {
        city: this.props.city,
        country: this.props.country,
        FajrTime : "",
        MaghribTime: "",
        nextDatFajrTime: "",
        FajrTimeRemaining : {
            fHours : null,
            fMinutes : null,
            fSeconds : null 
        },
        MaghribTimeRemaining : {
            mHours : null,
            mMinutes : null,
            mSeconds : null 
        },
        night: false,
        ready: false
    }

    setUpTime = () => {
        const { Fajr, Maghrib, FajrNextDay, utc_offset } = this.props;
        
        //splitting the time of prayer
        const fTime = Fajr.split(/[:\s]+/);
        const mTime = Maghrib.split(/[:\s]+/);
        const nextDayfTime = FajrNextDay.split(/[:\s]+/);

        //getting time date
        const now = new Date();
        const year = now.getFullYear();
        const m = now.getMonth() + 1;
        const month = m < 10 ? `0${m}` : m ;
        const day = now.getDate();
        const nextDay = day + 1;

        const FajrTime = `${year}-${month}-${day}T${fTime[0]}:${fTime[1]}:00${utc_offset}`;
        const MaghribTime = `${year}-${month}-${day}T${mTime[0]}:${mTime[1]}:00${utc_offset}`;
        const nextDatFajrTime = `${year}-${month}-${day}T${nextDayfTime[0]}:${nextDayfTime[1]}:00${utc_offset}`;

        this.setState({
            FajrTime,
            MaghribTime,
            nextDatFajrTime
        })
        
    }

    calculateTime = () => {
        const now = moment();
        const momentFajrTime = moment(this.state.FajrTime);
        const momentMaghribTime = moment(this.state.MaghribTime);
        const nextDayMomentFajrTime = moment(this.state.nextDatFajrTime);

        let FajrTimeRemaining = duration(momentFajrTime.diff(now));
        let MaghribTimeRemaining = duration(momentMaghribTime.diff(now));

        if(FajrTimeRemaining._milliseconds > 0 && MaghribTimeRemaining._milliseconds > 0){ //starting the day at 12:00 AM, coming soon fajr
            this.setState({
                night: true
            })

            const fHours = FajrTimeRemaining.hours();
            const fMinutes = FajrTimeRemaining.minutes();
            const fSeconds = FajrTimeRemaining.seconds();

            this.setState({
                FajrTimeRemaining : {
                    fHours,
                    fMinutes,
                    fSeconds 
                }
            })

        } else if (FajrTimeRemaining._milliseconds < 0 && MaghribTimeRemaining._milliseconds > 0){ //fajr over, coming soon maghrib
            this.setState({
                night: false
            })

            const mHours = MaghribTimeRemaining.hours();
            const mMinutes = MaghribTimeRemaining.minutes();
            const mSeconds = MaghribTimeRemaining.seconds();

            this.setState({
                MaghribTimeRemaining : {
                    mHours,
                    mMinutes,
                    mSeconds 
                }
            })
            
        } else if (FajrTimeRemaining._milliseconds < 0 && MaghribTimeRemaining._milliseconds < 0) { //fajr and maghrib done comong soon next day fajr
            const nextDayFajrTimeRemaining = duration(nextDayMomentFajrTime.diff(now));

            console.log(nextDayFajrTimeRemaining)
            this.setState({
                night: true
            })

            const fHours = nextDayFajrTimeRemaining.hours();
            const fMinutes = nextDayFajrTimeRemaining.minutes();
            const fSeconds = nextDayFajrTimeRemaining.seconds();

            this.setState({
                FajrTimeRemaining : {
                    fHours,
                    fMinutes,
                    fSeconds 
                }
            })
        }
    }

    //adding zero if less than 10
    pad = n => {
        return n < 10 ? `0${n}` : n;
    }

    // plural or singuler
    lebel = (n, label) => {
        return n === 1 ? `${label}` : `${label}s`;
    }

    componentDidMount(){
        this.setUpTime();
        //this.calculateTime();
        this.Intervar = setInterval(() => {
            this.calculateTime()
        }, 10)
    }

    componentWillUnmount(){
        clearInterval(this.calculateTime)
    }

    render(){

        const { night, city, country } = this.state;
        const { fHours, fMinutes, fSeconds } = this.state.FajrTimeRemaining;
        const { mHours, mMinutes, mSeconds } = this.state.MaghribTimeRemaining;

        if (night){
            return(
                <Fragment>
                    <div className="timer-wrapper">
                        <div className="city-country">
                            <p>{city}, {country}</p>
                        </div>
                        <div className="floating-box">
                            <div className="heading">
                                <h2>Sehri Ends in</h2>
                            </div>
                            <div className="timer">
                                <div className="tm-parts hours">
                                    <div className="tm-part">
                                        <p>{fHours}</p>
                                        <span className="foot">{this.lebel(fHours, 'Hour')}</span>
                                    </div>
                                </div>
                                <div className="tm-parts minutes">
                                    <div className="tm-part">
                                        <p>{this.pad(fMinutes)}</p>
                                        <span className="foot">{this.lebel(fMinutes, 'Minute')}</span>
                                    </div>
                                </div> 
                                <div className="tm-parts seconds">
                                    <div className="tm-part">
                                        <p>{this.pad(fSeconds)}</p>
                                        <span className="foot">{this.lebel(fSeconds, 'Second')}</span>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }else{
            return(
                <Fragment>
                    <div className="timer-wrapper">
                        <div className="city-country">
                            <p>{city}, {country}</p>
                        </div>
                        <div className="floating-box">
                            <div className="heading">
                                <h2>Iftar Start in</h2>
                            </div>
                            <div className="timer">
                                <div className="tm-parts hours">
                                    <div className="tm-part">
                                        <p>{mHours}</p>
                                        <span className="foot">{this.lebel(mHours, 'Hour')}</span>
                                    </div>
                                </div>
                                <div className="tm-parts minutes">
                                    <div className="tm-part">
                                        <p>{this.pad(mMinutes)}</p>
                                        <span className="foot">{this.lebel(mMinutes, 'Minute')}</span>
                                    </div>
                                </div> 
                                <div className="tm-parts seconds">
                                    <div className="tm-part">
                                        <p>{this.pad(mSeconds)}</p>
                                        <span className="foot">{this.lebel(mSeconds, 'Second')}</span>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }
    }
}

export default Timer;