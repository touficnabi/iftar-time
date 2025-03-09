import React, { Component, Fragment, useState, useEffect } from 'react';
import Counter from './Counter';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
// import moment, { duration as momentDuration } from 'moment';
// import '../styles/_timer.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const Timer = ({Fajr, Maghrib, FajrNextDay, city, country, timezone}) => {
    const [timeRemaining, setTimeRemaining] = useState();
    const [comingPrayer, setComingPrayer] = useState();

    const humanizeTimes = time => {
        const timeOnly = time.split(" ");

        const readableTime = dayjs(timeOnly, "HH:mm").format("h:mm A")
        return time;
    }

    const formatTime = (time, nextDay) => {
        const timeOnly = time.match(/\d{2}:\d{2}/)[0];  // Extract the time (HH:mm)
        const currentDate = dayjs().format('YYYY-MM-DD');  // Get today's date (YYYY-MM-DD)
        const formattedTime = dayjs.tz(`${currentDate} ${timeOnly}`, "YYYY-MM-DD HH:mm", timezone);  // Return dayjs object
    
        if (nextDay) return formattedTime.add(1, "day");  // Add a day if it's the next day's time
        return formattedTime;
    }
    
    const calculateTime = () => {
        // Get current time as a dayjs object in the chosen timezone
        const now = dayjs().tz(timezone);  // Keep as a dayjs object, not a string
    
        // Ensure formatTime returns dayjs objects
        const formattedFajrTime = formatTime(Fajr);
        const formattedMaghribTime = formatTime(Maghrib);
        const formattedNextDayFajrTime = formatTime(FajrNextDay, true);  // Pass `true` for the next day's time
    
        // Calculate the remaining time by getting the difference in milliseconds
        const FajrTimeRemaining = dayjs.duration(formattedFajrTime.diff(now));
        const MaghribTimeRemaining = dayjs.duration(formattedMaghribTime.diff(now));
        const FajrNextDayTimeRemaining = dayjs.duration(formattedNextDayFajrTime.diff(now));
    
        if(now.isBefore(formattedMaghribTime) && now.isBefore(formattedFajrTime)){
            //time now is before magrib and before fajr. so must be morning
            setComingPrayer("FAJR");
            setTimeRemaining(FajrTimeRemaining);
        } else if (now.isBefore(formattedMaghribTime) && now.isAfter(formattedFajrTime)) {
            // time is before magrib but after fajr. so must be day time and coming prayer is margib
            setComingPrayer("MAGHRIB");
            setTimeRemaining(MaghribTimeRemaining);
        } else if (now.isAfter(formattedMaghribTime) && now.isBefore(formattedFajrTime)) {
            // time is after magrib but before fajr. so must be night time and coming prayer is fajr
            setComingPrayer("FAJR_NEXT_DAY");
            setTimeRemaining(FajrNextDayTimeRemaining);
        }
    }

    useEffect(() => {
        const Interval = setInterval(() => {
            calculateTime();
        }, [1000])

        return () => clearInterval(Interval);
    }, [Fajr, Maghrib, FajrNextDay, timezone, city, country]);

    switch(comingPrayer) {
        default: 
            return  <p>Loading</p>
        case "FAJR":
            return (
                <Counter timeRemaining={timeRemaining} heading={"Sehri Ends in"} iftar={humanizeTimes(Maghrib)} sehri={humanizeTimes(Fajr)} city={city} country={country} />
            )
        case "MAGHRIB":
            return (
                <Counter timeRemaining={timeRemaining} heading={"Iftar Starts in"} iftar={humanizeTimes(Maghrib)} sehri={humanizeTimes(Fajr)} city={city} country={country} />
            )
        case "FAJR_NEXT_DAY":
            return (
                <Counter timeRemaining={timeRemaining} heading={"Sehri Ends in"} iftar={humanizeTimes(Maghrib)} sehri={humanizeTimes(FajrNextDay)} city={city} country={country} />
            )
    }
}
// class Timer extends Component {

//     state = {
//         city: this.props.city,
//         country: this.props.country,
//         FajrTime : "",
//         MaghribTime: "",
//         nextDayFajrTime: "",
//         FajrTimeRemaining : {
//             fHours : 0,
//             fMinutes : 0,
//             fSeconds : 0 
//         },
//         MaghribTimeRemaining : {
//             mHours : 0,
//             mMinutes : 0,
//             mSeconds : 0 
//         },
//         night: false,
//         ready: false,
//         adhanOn : false
//     }

//     setUpTime = () => {
//         const { Fajr, Maghrib, FajrNextDay } = this.props;
//         // const {utc_offset} = this.props;

//         //TODO move this somewhere up, like newPage or the direct parent as we can get the offset/tz from the dayjs obect easily
//         const utc_offset = dayjs().tz(this.props.timezone).format('Z').replace(":", "");
        
//         //splitting the time of prayer
//         const fTime = Fajr.split(/[:\s]+/); 
//         const mTime = Maghrib.split(/[:\s]+/);
//         const nextDayfTime = FajrNextDay.split(/[:\s]+/);

//         //getting time date
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = (now.getMonth() + 1).toString().padStart(2,0);
//         const day = now.getDate().toString().padStart(2,0);
        
//         //get the next day
//         const tomorrow = new Date(now);
//         tomorrow.setDate(tomorrow.getDate() + 1)
//         const nextDay = tomorrow.getDate().toString().padStart(2,0) // gives the next day. if today is the last day of the month it gives the first day of next month
//         const tMonth = (tomorrow.getMonth() + 1).toString().padStart(2,0);
//         const tYear = tomorrow.getFullYear();

//         const FajrTime = `${year}-${month}-${day}T${fTime[0]}:${fTime[1]}:00${utc_offset}`;
//         const MaghribTime = `${year}-${month}-${day}T${mTime[0]}:${mTime[1]}:00${utc_offset}`;
//         const nextDayFajrTime = `${tYear}-${tMonth}-${nextDay}T${nextDayfTime[0]}:${nextDayfTime[1]}:00${utc_offset}`;

//         this.setState({
//             FajrTime,
//             MaghribTime,
//             nextDayFajrTime
//         })
        
//     }

//     calculateTime = () => {
//         const now = moment(dayjs().tz(this.props.timezone).format("YYYY-MM-DDTHH:mm:ssZ"));
//         const momentFajrTime = moment(this.state.FajrTime);
//         const momentMaghribTime = moment(this.state.MaghribTime);
//         const nextDayMomentFajrTime = moment(this.state.nextDayFajrTime);
        
//         let FajrTimeRemaining = momentDuration(momentFajrTime.diff(now));
//         let MaghribTimeRemaining = momentDuration(momentMaghribTime.diff(now));

//         if(FajrTimeRemaining._milliseconds > 0 && MaghribTimeRemaining._milliseconds > 0){ //starting the day at 12:00 AM, coming soon fajr
//             this.setState({
//                 night: true
//             })

//             const fHours = FajrTimeRemaining.hours();
//             const fMinutes = FajrTimeRemaining.minutes();
//             const fSeconds = FajrTimeRemaining.seconds();

//             this.setState({
//                 FajrTimeRemaining : {
//                     fHours,
//                     fMinutes,
//                     fSeconds 
//                 },
//                 ready: true
//             })

//             //play adhan if the countdown is zero
//             if (fHours === 0 && fMinutes === 0 && fSeconds === 0){
//                 this.setState({adhanOn: true})
//             }

//         } else if (FajrTimeRemaining._milliseconds < 0 && MaghribTimeRemaining._milliseconds > 0){ //fajr over, coming soon maghrib
//             this.setState({
//                 night: false
//             })

//             const mHours = MaghribTimeRemaining.hours();
//             const mMinutes = MaghribTimeRemaining.minutes();
//             const mSeconds = MaghribTimeRemaining.seconds();

//             this.setState({
//                 MaghribTimeRemaining : {
//                     mHours,
//                     mMinutes,
//                     mSeconds 
//                 },
//                 ready: true
//             })

//             //play adhan if the countdown is zero
//             if (mHours === 0 && mMinutes === 0 && mSeconds === 0){
//                 this.setState({adhanOn: true})
//             }
            
//         } else if (FajrTimeRemaining._milliseconds < 0 && MaghribTimeRemaining._milliseconds < 0) { //fajr and maghrib done comong soon next day fajr
//             const nextDayFajrTimeRemaining = momentDuration(nextDayMomentFajrTime.diff(now));

//             this.setState({
//                 night: true
//             })

//             const fHours = nextDayFajrTimeRemaining.hours();
//             const fMinutes = nextDayFajrTimeRemaining.minutes();
//             const fSeconds = nextDayFajrTimeRemaining.seconds();

//             this.setState({
//                 FajrTimeRemaining : {
//                     fHours,
//                     fMinutes,
//                     fSeconds 
//                 },
//                 ready: true
//             })
//         }
//         //setting up title of the page with the time in it
//         const { fHours, fMinutes, fSeconds } = this.state.FajrTimeRemaining;
//         const { mHours, mMinutes, mSeconds } = this.state.MaghribTimeRemaining;
//         this.state.night ? document.title = `Sehri Ends in ${fHours}:${fMinutes}:${fSeconds}` : document.title = `Iftar Starts in ${mHours}:${mMinutes}:${mSeconds}`;
//     }

//     //adding zero if less than 10
//     pad = n => {
//         return n < 10 ? `0${n}` : n;
//     }

//     // plural or singuler
//     lebel = (n, label) => {
//         return n === 1 ? `${label}` : `${label}s`;
//     }

//     //define adhan
//     adhan = () =>{
//         const adhan = new Audio();
//         adhan.src = 'https://toufic.me/ex/feb/pt/audio/Adhan.mp3';
//         console.log('adhn playing')
//         adhan.play();
//         this.setState({adhanOn: false})
//     }

//     componentDidMount(){
//         this.setUpTime();
//         //this.calculateTime();
//         this.Intervar = setInterval(() => {
//             this.calculateTime()
//             if(this.state.adhanOn) this.adhan();
//         }, 1000);
//     }

//     componentWillUnmount(){
//         clearInterval(this.calculateTime)
//     }
    
//     componentDidUpdate(prevProps, prevState){
//         if(prevProps.Maghrib !== this.props.Maghrib || prevProps.Fajr !== this.props.Fajr || prevProps.nextDayFajr !== this.props.nextDayFajr){
//             this.setUpTime();
//         }
//         if(prevProps.city !== this.props.city || prevProps.country !== this.props.country){
//             this.setState({city: this.props.city})
//             this.setState({country: this.props.country});
//         }
//     }

//     render(){

//         const { night, city, country } = this.state;
//         const { fHours, fMinutes, fSeconds } = this.state.FajrTimeRemaining;
//         const { mHours, mMinutes, mSeconds } = this.state.MaghribTimeRemaining;

//         if (night){
//             return(
//                 <Fragment>
//                     <div className="timer-wrapper">
                       
//                         <div className="floating-box">
//                             <div className="heading">
//                                 <h2>Sehri Ends in</h2>
//                             </div>
//                             <div className="timer">
//                                 <div className="tm-parts hours">
//                                     <div className="tm-part">
//                                         <p>{fHours}</p>
//                                         <span className="foot">{this.lebel(fHours, 'Hour')}</span>
//                                     </div>
//                                 </div>
//                                 <div className="tm-parts minutes">
//                                     <div className="tm-part">
//                                         <p>{this.pad(fMinutes)}</p>
//                                         <span className="foot">{this.lebel(fMinutes, 'Minute')}</span>
//                                     </div>
//                                 </div> 
//                                 <div className="tm-parts seconds">
//                                     <div className="tm-part">
//                                         <p>{this.pad(fSeconds)}</p>
//                                         <span className="foot">{this.lebel(fSeconds, 'Second')}</span>
//                                     </div>
//                                 </div> 
//                             </div>
//                             <div className="footer">
//                             {city !== null && country !== null && <div className="footer-parts">
//                                     <div className="city-country">
//                                         <svg viewBox="0 0 368.553 368.553" xmlns="http://www.w3.org/2000/svg" width={15} fill="currentColor"> <path d="m184.28 0c-71.683 0-130 58.317-130 130 0 87.26 119.19 229.86 124.26 235.88 1.417 1.685 3.504 2.66 5.705 2.67h0.032c2.189 0 4.271-0.957 5.696-2.621 5.075-5.926 124.3-146.16 124.3-235.93-1e-3 -71.683-58.317-130-130-130zm0.045 349.25c-23.937-29.771-115.04-147.8-115.04-219.25 0-63.411 51.589-115 115-115s115 51.589 115 115c-1e-3 73.49-90.95 189.83-114.96 219.25z"/> <path d="m184.28 72.293c-30.476 0-55.269 24.793-55.269 55.269s24.793 55.269 55.269 55.269 55.269-24.793 55.269-55.269-24.793-55.269-55.269-55.269zm0 95.537c-22.204 0-40.269-18.064-40.269-40.269s18.064-40.269 40.269-40.269 40.269 18.064 40.269 40.269-18.066 40.269-40.269 40.269z"/> </svg>
//                                         <p>{city}<span>, {country}</span></p>
//                                     </div>
//                                 </div>}
//                                 <div className="footer-parts">
//                                     <div className="iftar">
//                                         <p>Iftar: {this.state.MaghribTime} {moment(this.state.MaghribTime).format('LT')}</p>
//                                     </div>
//                                 </div>
//                                 <div className="footer-parts">
//                                     <div className="sehri">
//                                         <p>Sehri: {moment(this.state.FajrTime).format('LT')}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </Fragment>
//             );
//         }else{
//             return(
//                 <Fragment>
//                     <div className="timer-wrapper">
                       
//                         <div className="floating-box">
//                             <div className="heading">
//                                 <h2>Iftar Starts in</h2>
//                             </div>
//                             <div className="timer">
//                                 <div className="tm-parts hours">
//                                     <div className="tm-part">
//                                         <p>{mHours}</p>
//                                         <span className="foot">{this.lebel(mHours, 'Hour')}</span>
//                                     </div>
//                                 </div>
//                                 <div className="tm-parts minutes">
//                                     <div className="tm-part">
//                                         <p>{this.pad(mMinutes)}</p>
//                                         <span className="foot">{this.lebel(mMinutes, 'Minute')}</span>
//                                     </div>
//                                 </div> 
//                                 <div className="tm-parts seconds">
//                                     <div className="tm-part">
//                                         <p>{this.pad(mSeconds)}</p>
//                                         <span className="foot">{this.lebel(mSeconds, 'Second')}</span>
//                                     </div>
//                                 </div> 
//                             </div>
//                             <div className="footer">
//                             {city !== null && country !== null && <div className="footer-parts">
//                                     <div className="city-country">
//                                         <svg viewBox="0 0 368.553 368.553" xmlns="http://www.w3.org/2000/svg" width={15} fill="currentColor"> <path d="m184.28 0c-71.683 0-130 58.317-130 130 0 87.26 119.19 229.86 124.26 235.88 1.417 1.685 3.504 2.66 5.705 2.67h0.032c2.189 0 4.271-0.957 5.696-2.621 5.075-5.926 124.3-146.16 124.3-235.93-1e-3 -71.683-58.317-130-130-130zm0.045 349.25c-23.937-29.771-115.04-147.8-115.04-219.25 0-63.411 51.589-115 115-115s115 51.589 115 115c-1e-3 73.49-90.95 189.83-114.96 219.25z"/> <path d="m184.28 72.293c-30.476 0-55.269 24.793-55.269 55.269s24.793 55.269 55.269 55.269 55.269-24.793 55.269-55.269-24.793-55.269-55.269-55.269zm0 95.537c-22.204 0-40.269-18.064-40.269-40.269s18.064-40.269 40.269-40.269 40.269 18.064 40.269 40.269-18.066 40.269-40.269 40.269z"/> </svg>
//                                          <p>{city}<span>, {country}</span></p>
//                                     </div>
//                                 </div>}
//                                 <div className="footer-parts">
//                                     <div className="iftar">
//                                         <p>Iftar: {moment(this.state.MaghribTime).format('LT')} test</p>
//                                     </div>
//                                 </div>
//                                 <div className="footer-parts">
//                                     <div className="sehri">
//                                         <p>Sehri: {moment(this.state.FajrTime).format('LT')}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </Fragment>
//             );
//         }
//     }
// }

// export default Timer;
export default Timer;