import axios from 'axios';
import config from "../../config";
import React, { useEffect, useState } from 'react';

const kelvinToCelcius = (temp) => {
    return (temp - 273.15).toFixed(2);
};

export default function WeatherInformation({ selectedCities }) {
    const [currentCityIndex, setCurrentCityIndex] = useState(0);
    const [currentData, setCurrentData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // function to fetch data and set it...
    const fetchWeatherReport = async (cityId) => {
        try{
            // set loading true...
            setLoading(true);
            // load data from weather API...
            const response = await axios.get(`${config.weatherAppBaseUrl}weather?appid=${config.appid}&id=${cityId}`);
            // if data found...
            if (response.data && response.data.cod === 200)
                setCurrentData(response.data);
            // set loading false...
            setLoading(false);
        }catch(error){
            // set loading false...
            setLoading(false);
            // set error true...
            setError(true);
        }
    };

    // effect to load the data from weather API
    useEffect(() => {
        // current selected city...
        let cityId = selectedCities[currentCityIndex];
        // call function to load weather report...
        fetchWeatherReport(cityId);
    }, [currentCityIndex]);

    // effect to set timeout to change city index...
    useEffect(() => {
        // set timeout to change current city index...
        const currentTimeout = setTimeout(() => {
            let newIndex = (currentCityIndex === (selectedCities.length - 1)) ? 0 : currentCityIndex + 1;
            setCurrentCityIndex(newIndex);
        }, 5000);


        return () => {
            clearTimeout(currentTimeout);
        };
    }, [currentCityIndex]);

    return (
            <div className="weather-app-container">
                <div className="weather-information">
                    {
                        (loading) ? <div>loading...</div> : (error) ? <div>There is some error while loading the weather report...</div> : <>
                            <div className="information-container">
                                <div className="title">City Name:</div>
                                <div className="information">{currentData.name}</div>
                            </div>
                            <div className="information-container">
                                <div className="title">Weather:</div>
                                <div className="information">{currentData.weather[0].description}</div>
                            </div>
                            <div className="information-container">
                                <div className="title">Temp:</div>
                                <div className="information">{kelvinToCelcius(currentData.main.temp)} Celsius</div>
                            </div>
                            <div className="information-container">
                                <div className="title">Min Temp:</div>
                                <div className="information">{kelvinToCelcius(currentData.main.temp_min)} Celsius</div>
                            </div>
                            <div className="information-container">
                                <div className="title">Max Temp:</div>
                                <div className="information">{kelvinToCelcius(currentData.main.temp_max)} Celsius</div>
                            </div>
                        </>
                    }

                </div>

                <style jsx>{`
                .weather-app-container{
                    width: 50%;
                    background-color: #ddd;
                }
                .weather-information{
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #ddd;
                }
                .information-container{
                    display: flex;
                    flex-direction: row;
                }
                .title{
                    width: 25%;
                }
            `}</style>
            </div>
    );
};