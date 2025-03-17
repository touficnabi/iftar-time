import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Timer from './Timer';
import Loading from './Loading';
import useMethods from '../hooks/useMethods';
import Footer from './Footer';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const Page1 = ({getInfoFromCity, city, country, lat, long}) => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [utc_offset, setUtc_offset] = useState(null);
    const [timezone, setTimezone] = useState(null);
    const [Fajr, setFajr] = useState(null);
    const [Maghrib, setMaghrib] = useState(null);
    const [FajrNextDay, setFajrNextDay] = useState(null);
    const [date, setDate] = useState(null);
    const {methods, defaultMethod} = useMethods(lat, long);
    const [method, setMethod] = useState(defaultMethod);

    const handleUpdateMethod = e => {
        setMethod(e.target.value);
        Cookies.set('method', e.target.value);
    }  

    const getTimingInfo = (url, controller) => {
        //TODO use day,js for local time instead of the machine time :: https://stackoverflow.com/questions/15141762/how-to-initialize-a-javascript-date-to-a-particular-time-zone

        const now   = new Date() //moment();
        const year  = now.getFullYear(); //now.year();
        const month = now.getMonth() + 1; //now.month() + 1;
        // const day   = now.getDate() - 1; //now.day(); //array index in the api response starts from 0 so we need to extract one day to get the right date from the api response
 
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1); //this gives the next day | if today is the last day of the month, it gives the first day of the next month
        const nextDay = tomorrow.getDate() - 1; //array index in the api response starts from 0 so we need to extract one day to get the right date from the api response
 
        const utc_offset = now.toString().match(/([-+][0-9]+)\s/)[1];
        setIsLoaded(false);
        axios.get(url, {
            signal: controller.signal,
            params: {
                month,
                year,
            }
        })
        .then(resp => {
            const { data } = resp.data;
            const day = +dayjs().tz(data[0].meta.timezone).date() - 1; //array index in the api response starts from 0 so we need to extract one day to get the right date from the api response
            const { Fajr, Maghrib } = data[day].timings;
            const {hijri} = data[day].date;
            const FajrNextDay = data[nextDay].timings.Fajr;

            setFajr(Fajr);
            setMaghrib(Maghrib);
            setFajrNextDay(FajrNextDay);
            setDate(hijri);
            setUtc_offset(utc_offset);
            setTimezone(data[day].meta.timezone);
            setIsLoaded(true);
        })
        .catch(err => {
            if (err.message !== "canceled" ) {
                console.log('prayer timing error', err);
                setError(err)
            }
        })
    }
    
    useEffect(() => {
        const controller = new AbortController();
        //setting updated defaultMethod to the method
        setMethod(defaultMethod);
        getTimingInfo(`https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${long}&method=${method}`, controller);

        //set up initial method from the hook or cookie
        // const cookieMethod = Cookies.get('method');
        // if (cookieMethod){
        //     cookieMethod !== null && setMethod(cookieMethod);
        // } else {
        //     setMethod(defaultMethod);
        //     defaultMethod !== null && Cookies.set('method', defaultMethod);
        // }
        // method === null && setMethod(defaultMethod);

        return () => controller.abort();

    }, [getInfoFromCity, city, defaultMethod, country, lat, long, method]);


    if (error) return <h3 className='error'>There was an error. Please refresh the page!</h3>

    if (isLoaded) {
        return (
            <>
                {/* <div className="content"> */}
                    <Timer Fajr={Fajr} Maghrib={Maghrib} FajrNextDay={FajrNextDay} date={date} utc_offset={utc_offset} timezone={timezone} city={city} country={country} />
                    <Footer Fajr={Fajr} Maghrib={Maghrib} date={date}  methods={methods} setMethod={handleUpdateMethod} defaultMethod={method} />
                {/* </div> */}
            </>
        )
    }
    return <Loading />

}


export default Page1;

// class Page1 extends Component {
//     state = {
//         isLoaded: false,
//         utc_offset: null,
//         Fajr: null,
//         Maghrib: null,
//         FajrNextDay: null,
//         city: this.props.city,
//         country: this.props.country
//     }

//     //adding zero if less than 10
//     pad = n => {
//         return n < 10 ? `0${n}` : n;
//     }

//     componentDidMount(){
//         const now   = new Date() //moment();
//         const year  = now.getFullYear(); //now.year();
//         const month = now.getMonth() + 1; //now.month() + 1;
//         const day   = now.getDate() - 1; //now.day();

//         //calcaulate timezoneOffet
//         const utc_offset = now.toString().match(/([-+][0-9]+)\s/)[1];
//         // const offset = now.getTimezoneOffset(),
//         // sign         = offset < 0 ? '+' : '-',
//         // tzHours      = this.pad(Math.floor(Math.abs(offset/60))),
//         // tzMinutes    = this.pad(Math.abs(offset%60)),
//         // utc_offset   = `${sign}${tzHours}${tzMinutes}`;

//         const {lat, long} = this.props;

//         axios.get(`https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${long}&method=2&month=${month}&year=${year}`)
//                 .then(resp => {
//                     console.log(resp.data.data)
//                     const { data } = resp.data;
//                     const { Fajr, Maghrib } = data[day].timings;
//                     const FajrNextDay = data[day].timings.Fajr;

//                     //setting the state according to the data
//                     this.setState({
//                         utc_offset,
//                         Fajr,
//                         Maghrib,
//                         FajrNextDay,
//                         isLoaded: true
//                     })
//                 })
//     }

//     render() {
//         const { isLoaded, Fajr, Maghrib, FajrNextDay, utc_offset, city, country_name } = this.state;
        
//         if (isLoaded){
//             return(
//                 <>
//                     <div className="content">
//                         <Timer Fajr={Fajr} Maghrib={Maghrib} FajrNextDay={FajrNextDay} utc_offset={utc_offset} city={city} country={country_name} />
//                     </div>
//                 </>
//             )
//         }
//         return(
//             <Loading />
//         )
//     }
// }

// export default Page1;