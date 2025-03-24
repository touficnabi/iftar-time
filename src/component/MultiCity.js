import { CiCircleRemove } from "react-icons/ci";

const MultiCity = ({multiCities, saveCityInfo, country, handleManualLocationTrigger}) => {
    return (
        <div className="manual-location-selction">
            <h2 className='manual-location-heading'>Select your location</h2>
            <div className="multi-city-selector">
                <ul>
                    {multiCities.map(({name, state, lat, lon}) => <li key={state} onClick={() => saveCityInfo(name, country, lat, lon)}><b>{name}</b>{state}, {country.name}</li>)}  
                </ul>
            </div>
            <button className='manual-location_close-button' onClick={handleManualLocationTrigger} ><CiCircleRemove /></button>
        </div>
    )
}

export default MultiCity;