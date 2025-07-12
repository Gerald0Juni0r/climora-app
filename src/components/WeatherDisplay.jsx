import React from 'react';
import './WeatherDisplay.css';
import WeatherIcon from './WeatherIcon';

const WeatherDisplay = ({ current, city }) => {
  if (!current) return null;

  return (
    <div className="main-weather-card">
      <WeatherIcon
        iconCode={current.weather.icon}
        isDay={current.isDay}
        className="weather-icon-large"
      />
      <p className="temperature">{Math.round(current.temp)}°C</p>
      <p className="city-name">{city}</p>
      <p className="description">{current.weather.description}</p>
      <div className="thermal-sensation">
        Sensação térmica: {Math.round(current.feels_like)}°C
      </div>
    </div>
  );
};

export default WeatherDisplay;