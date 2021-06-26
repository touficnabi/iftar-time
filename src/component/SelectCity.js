import React, { Component } from 'react'; 
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

class SelectCity extends Component{

    state={
        address: ''
    }

    handleChange = address => {
        this.setState({ address })
    }

    handleSelect = address => {
        geocodeByAddress(address)
            .then(res => {
                getLatLng(res[0])
            })
            .then(latlong => console.log('success', latlong))
            .catch(err => console.log('Error', err))
    }

    render(){
        return(
            <>
                <h1>Select city....</h1>
                <PlacesAutocomplete value={this.state.address} onChange={this.handleChange} onSelect={this.handleSelect}>
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div>
                            <input {...getInputProps({placeholder: 'Please select your city', className: 'location-search-input'}) } />
                            <div className="autocomplete-dropdown-container">
                                {loading && <h3>Loading...</h3>}
                                {suggestions.map(suggestion => (
                                    <div {...getSuggestionItemProps(suggestion, {})}>
                                        <span>suggestion.description</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>
            </>
        )
    }
}

export default SelectCity;