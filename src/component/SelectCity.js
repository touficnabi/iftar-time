import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const SelectCity =() => {

    const [cityname, setCityname] = useState("");
    const [city, setCity] = useState([]);

    const onClick = (e) => {
        Cookies.set("lat", e.target.getAttribute("data-latitude"));
        Cookies.set('long', e.target.getAttribute("data-longitude"));
        Cookies.set('city', e.target.getAttribute("data-city"));
        Cookies.set('country', e.target.getAttribute("data-country"));
        window.location.reload();

    }

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        axios.get(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${cityname}`, {cancelToken: cancelToken.token}).then(res => {
            const { data: {data} } = res;
            setCity(data);
        }).catch(err => {
            if (axios.isCancel(err)) {
                console.log('Request will be passed once done typing!');
            }
        })

        return () => {
            cancelToken.cancel();
        }
    },[cityname]);

    return (
        <>
            <h1>City name</h1>
            <input type="text" onChange={e => setCityname(e.target.value)} value={cityname} />
            <ul>
                {city.map(city => <li data-latitude={city.latitude} data-longitude={city.longitude} data-city={city.name} data-country={city.country} onClick={onClick} key={city.id}>{city.name}, {city.country}</li>)}
            </ul>
        </>
    )
}

export default SelectCity;