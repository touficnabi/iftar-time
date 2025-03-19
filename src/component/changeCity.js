import Select from "react-dropdown-select";
import { CiCircleRemove } from "react-icons/ci";

const ChangeCity = ({
    error, 
    geoLoading, 
    countries, 
    fetchCities, 
    country,
    cityLoading,
    cities,
    selectedCity,
    setSelectedCity,
    handleManualLocationSelection,
    handleManualLocationTrigger
}) => {
    return (
        <>
            <div className={`manual-location-selction`}>
                <h2 className='manual-location-heading'>Select your location</h2>
                {error && <h3 className='error'>{error}</h3>}
                {geoLoading
                ? <div className='manual-location-geo-loading'>Loading info...</div>
                : (
                    <div className="container">
                        {countries && <select onChange={e  => fetchCities(e.target.value)} value={JSON.stringify(country)} name="country" id="country">
                            <option>Select a country</option>
                            {countries.map(country => (
                                <option key={country.iso3} value={JSON.stringify({name: country.country, code: country.iso2})}>{country.country}</option>
                            ))}
                        </select>}
                        {cityLoading && <div className='city-loading'>Loading cities...</div>}
                        {/* {cities && <Select options={cities} loading onChange={(values) => setSelectedCity(values)} />} */}
                        {cities && <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                            <option>Select your city</option> 
                            {cities.map(city => (
                                <option key={city.value} value={city.value}>{city.value}</option>
                            ))}
                        </select>}

                        {<button disabled={selectedCity ? false : true} onClick={handleManualLocationSelection}>Confirm</button>}
                    </div>
                )}
                <button className='manual-location_close-button' onClick={handleManualLocationTrigger} ><CiCircleRemove /></button>
            </div>
        </>
    )
}

export default ChangeCity;