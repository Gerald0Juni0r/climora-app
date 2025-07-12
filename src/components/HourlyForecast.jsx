import React from 'react';
import './Forecast.css';
import WeatherIcon from './WeatherIcon';

const HourlyForecast = ({ hourly }) => {
  if (!hourly || hourly.length === 0) return null;

  const nowInSeconds = Date.now() / 1000;
  const startIndex = hourly.findIndex(hour => hour.dt > nowInSeconds);
  const effectiveIndex = startIndex === -1 ? 0 : startIndex;
  const next8Hours = hourly.slice(effectiveIndex, effectiveIndex + 8);

  return (
    <div className="forecast-card">
      <h3 className="forecast-title">Previsão para as próximas 8 horas</h3>
      <div className="forecast-items-container">
        {next8Hours.map((hour, index) => {
          const hourValue = new Date(hour.dt * 1000).getHours();
          const formattedHour = String(hourValue).padStart(2, '0');

          return (
            <div key={index} className="forecast-item">
              <p className="forecast-time">{formattedHour}:00</p>
              <WeatherIcon iconCode={hour.weather.icon} isDay={hour.isDay} />
              <p className="forecast-temp">{Math.round(hour.temp)}°C</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;