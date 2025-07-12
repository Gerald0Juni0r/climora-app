import React from 'react';
import './Forecast.css';
import WeatherIcon from './WeatherIcon';

const DailyForecast = ({ daily }) => {
  if (!daily || daily.length === 0) return null;

  const next5Days = daily.slice(1, 6);

  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    if (date.setHours(0,0,0,0) === today.setHours(0,0,0,0)) {
        return "Hoje";
    }
    return date.toLocaleDateString('pt-BR', { weekday: 'long' });
  };

  return (
    <div className="forecast-card">
      <h3 className="forecast-title">Próximos dias</h3>
      <div className="daily-items-container">
        {next5Days.map((day, index) => (
          <div key={index} className="daily-item">
            <p className="day-name">{getDayName(day.dt)}</p>
            <div className="daily-icon-group">
              <WeatherIcon code={day.weather.code} />
              <p className="day-desc">{day.weather.description}</p>
            </div>
            <p className="day-temp">
              {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;