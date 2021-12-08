import { useMount } from 'ahooks';
import * as React from 'react';
import { useState } from 'react';
import { WeatherForecast } from '../csts';

export function FetchData() {
    const [forecasts, setForecasts] = useState<WeatherForecast[] | undefined>(undefined);

    const populateWeatherData = async () => {
        const response = await fetch('weatherforecast');
        const data = await response.json() as WeatherForecast[];
        setForecasts(data);
    }

    useMount(() => {
        populateWeatherData();
    });

    const renderForecastsTable = (forecasts: WeatherForecast[]) => {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map((forecast: WeatherForecast) =>
                        <tr key={forecast.date.toString()}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }


    let contents = forecasts
        ? renderForecastsTable(forecasts)
        : <p><em>Loading...</em></p>;


    return (
        <div>
            <h1 id="tabelLabel" >Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
            <button type="button" className="btn btn-primary" onClick={populateWeatherData}>Reload</button>
        </div>
    );
}
