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
            fHours : 0,
            fMinutes : 0,
            fSeconds : 0 
        },
        MaghribTimeRemaining : {
            mHours : 0,
            mMinutes : 0,
            mSeconds : 0 
        },
        night: false,
        ready: false,
        adhanOn : false
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
        const month = (now.getMonth() + 1).toString().padStart(2,0);
        const day = now.getDate().toString().padStart(2,0);
        
        //get the next day
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1)
        const nextDay = tomorrow.getDate().toString().padStart(2,0) // gives the next day. if today is the last day of the month it gives the first day of next month
        const tMonth = (tomorrow.getMonth() + 1).toString().padStart(2,0);
        const tYear = tomorrow.getFullYear();

        const FajrTime = `${year}-${month}-${day}T${fTime[0]}:${fTime[1]}:00${utc_offset}`;
        const MaghribTime = `${year}-${month}-${day}T${mTime[0]}:${mTime[1]}:00${utc_offset}`;
        const nextDatFajrTime = `${tYear}-${tMonth}-${nextDay}T${nextDayfTime[0]}:${nextDayfTime[1]}:00${utc_offset}`;

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
                },
                ready: true
            })

            //play adhan if the countdown is zero
            if (fHours === 0 && fMinutes === 0 && fSeconds === 0){
                this.setState({adhanOn: true})
            }

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
                },
                ready: true
            })

            //play adhan if the countdown is zero
            if (mHours === 0 && mMinutes === 0 && mSeconds === 0){
                this.setState({adhanOn: true})
            }
            
        } else if (FajrTimeRemaining._milliseconds < 0 && MaghribTimeRemaining._milliseconds < 0) { //fajr and maghrib done comong soon next day fajr
            const nextDayFajrTimeRemaining = duration(nextDayMomentFajrTime.diff(now));

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
                },
                ready: true
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

    //define adhan
    adhan = () =>{
        const adhan = new Audio();
        adhan.src = 'https://toufic.me/ex/feb/pt/audio/Adhan.mp3';
        console.log('adhn playing')
        adhan.play();
        this.setState({adhanOn: false})
    }

    componentDidMount(){
        this.setUpTime();
        //this.calculateTime();
        this.Intervar = setInterval(() => {
            this.calculateTime()
            if(this.state.adhanOn) this.adhan();
        }, 1000);
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
                            {city !== "" && country !== "" && <p>{city}, {country}</p>}
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
                        {city !== "" && country !== "" && <p>{city}, {country}</p>}
                        </div>
                        <div className="floating-box">
                            <div className="heading">
                                <h2>Iftar Starts in</h2>
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