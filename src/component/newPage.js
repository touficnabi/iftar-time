import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Timer from './Timer';
import Loading from './Loading';
import '../styles/_reset.css';
import '../styles/_page.css';

const Page1 = ({city, country, lat, long}) => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [utc_offset, setUtc_offset] = useState(null);
    const [Fajr, setFajr] = useState(null);
    const [Maghrib, setMaghrib] = useState(null);
    const [FajrNextDay, setFajrNextDay] = useState(null);

    useEffect(() => {
        const now   = new Date() //moment();
        const year  = now.getFullYear(); //now.year();
        const month = now.getMonth() + 1; //now.month() + 1;
        const day   = now.getDate() - 1; //now.day();

        const utc_offset = now.toString().match(/([-+][0-9]+)\s/)[1];

        let url = `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${long}&method=2&month=${month}&year=${year}`;
        console.log(url);
        axios.get(url)
                .then(resp => {
                    const { data } = resp.data;
                    const { Fajr, Maghrib } = data[day].timings;
                    const FajrNextDay = data[day].timings.Fajr;

                    setFajr(Fajr);
                    setMaghrib(Maghrib);
                    setFajrNextDay(FajrNextDay);
                    setUtc_offset(utc_offset);
                    setIsLoaded(true);
                })


    }, [city, country, lat, long]);


    if (isLoaded) {
        return (
            <>
                <div className="content">
                    <Timer Fajr={Fajr} Maghrib={Maghrib} FajrNextDay={FajrNextDay} utc_offset={utc_offset} city={city} country={country} />
                </div>
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