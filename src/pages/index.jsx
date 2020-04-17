import React, { useEffect, useState } from 'react';
import CitySearchInput from "../frontend/components/CitySearchInput";
import WeatherInformation from "../frontend/components/WeatherInformation";

export default function Index() {
    const [selectedCities, setSelectedCities] = useState([4435652, 5128638, 5391811]);

    const onCitiesChangeHandler = (cityId) => {
        let newCities = [...new Set([...selectedCities, cityId])];
        setSelectedCities(newCities);
    };

    return (
        <div className="main-container">
            <CitySearchInput onCitiesChangeHandler={onCitiesChangeHandler}></CitySearchInput>
            <WeatherInformation selectedCities={selectedCities}></WeatherInformation>
        </div>
    );
};