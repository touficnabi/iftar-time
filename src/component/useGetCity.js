import axios from "axios";
import { useEffect, useState } from "react";

const useGetCity = (newCon, newStates) => {

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios.get('https://www.universal-tutorial.com/api/countries/', {
            headers : {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ0bmFiaTE5OTFAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoiTllCQVZ2aV9aaG13SEo5dDY2LVBVMGRobFlDaEJfV29aR2poM25fYlpZV1VFbVMtVlNJbzlLWl8xaDFZbEhhVDdXbyJ9LCJleHAiOjE2NDkzNTI0MjF9.yQeZhPh9R_aS0BQIOIcurN2omrukO6l3MVi8ZJtsWY0",
                "Accept": "application/json"
            }
        }).then(res => {
            const { data } = res;
            setCountries(data);
        })
    }, [])

    useEffect(() => {
        
        if(newCon !== '') {
            axios.get(`https://www.universal-tutorial.com/api/states/${newCon}`, {
                headers : {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ0bmFiaTE5OTFAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoiTllCQVZ2aV9aaG13SEo5dDY2LVBVMGRobFlDaEJfV29aR2poM25fYlpZV1VFbVMtVlNJbzlLWl8xaDFZbEhhVDdXbyJ9LCJleHAiOjE2NDkzNTI0MjF9.yQeZhPh9R_aS0BQIOIcurN2omrukO6l3MVi8ZJtsWY0",
                    "Accept": "application/json"
                }
            }).then(res => {
                const { data } = res;
                setStates(data);
            })
        }

        if (newStates.length !== 0) {
            axios.get(`https://www.universal-tutorial.com/api/cities/${newStates}`, {
                headers : {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ0bmFiaTE5OTFAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoiTllCQVZ2aV9aaG13SEo5dDY2LVBVMGRobFlDaEJfV29aR2poM25fYlpZV1VFbVMtVlNJbzlLWl8xaDFZbEhhVDdXbyJ9LCJleHAiOjE2NDkzNTI0MjF9.yQeZhPh9R_aS0BQIOIcurN2omrukO6l3MVi8ZJtsWY0",
                    "Accept": "application/json"
                }
            }).then(res => {
                const { data } = res;
                if (data.length === 0) {
                    console.log('toutirfifiiii', newStates);
                    setCities([{ city_name: newStates }]);
                    return;
                }
                setCities(data);
            })
        }
        

    }, [newCon, newStates])

    return {countries, states, cities};
}

export default useGetCity;