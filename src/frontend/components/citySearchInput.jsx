import axios from "axios";
import config from "../../config";
import React, { useState } from 'react';


export default function CitySearchInput({ onCitiesChangeHandler }) {
    const [inputvalue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);

    let searchCities = async () => {
        try {
            // call the search functionality...
            if (inputvalue.length <= 0) {
                return;
            }
            // set error false
            setError(false);
            // set Loading false
            setLoading(true);
            // call api and load data...
            let cities = await axios.get(`${config.apiBaseUrl}search/cities?q=${inputvalue}`);
            // set the found cities...
            if (cities.data && cities.data.length > 0)
                setSearchedCities(cities.data);
            // set Loading false
            setLoading(false);
        } catch (error) {
            // set Loading false
            setLoading(false);
            // set error true
            setError(true);
        }
    };

    const resetParam = () => {
        setSearchedCities([]);
        setError(false);
        setLoading(false);
        setInputValue("");
    };

    const onChangeHandler = (e) => {
        setInputValue(e.target.value);
        searchCities();
    };

    const onClickHandler = (cityId) => {
        onCitiesChangeHandler(cityId);
        // reset params...
        resetParam();
    }

    return (
        <div className="input-container">
            <input type="text" value={inputvalue} onChange={onChangeHandler} />
            {
                (loading) ? <div>Loading...</div> : (error) ? <div>There is some error while searching the city.</div> : (searchedCities.length > 0 && inputvalue.length > 0) ? <ul>
                    {
                        searchedCities.map((city, i) => <li key={i} onClick={(e) => { e.preventDefault(); onClickHandler(city.id) }}>{city.name}</li>)
                    }
                </ul> : (inputvalue.length > 0) ? <div>We could not find the matching results, please consider changing the keyword.</div> : ""
            }

            <style jsx>{`
                    input{
                        display: flex;
                        width: 50%;
                        height: 50px;
                        font-size: 24px;
                        position: relative;
                    }
                    ul{
                        display: flex;
                        flex-direction: column;
                        margin: 0;
                        padding: 0;
                        background-color: white;
                        color: #495c7f;
                        width: 50%;
                        position: absolute;
                    }
                    li {
                        list-style: none;
                        height: 30px;
                        margin: 2px 0 0 0;
                        background-color: #eff3fa;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        padding: 0 0 0 10px;
                    }
            `}</style>
        </div>
    );
};