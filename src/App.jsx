import React, { useState } from 'react';
import { getWeatherData } from './api/weatherService';
import './App.css';

import { FaMapMarkerAlt, FaSearch, FaWind } from 'react-icons/fa';
import { WiHumidity, WiBarometer } from 'react-icons/wi';

import WeatherDisplay from './components/WeatherDisplay';
import InfoCard from './components/InfoCard';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';

const capitalizeCity = (str) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const data = await getWeatherData(city);
      setWeather({ ...data, name: capitalizeCity(city) });
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao buscar os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="climoraapp-container">
      <header className="app-header">
        <h1>
          <i className="cloud-icon"></i>
          Climora App
        </h1>
        <p>Descubra o clima de qualquer região do mundo</p>
      </header>

      <main>
        <form className="search-bar" onSubmit={handleSearch}>
          <FaMapMarkerAlt className="search-icon-marker" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Digite o nome da cidade"
          />
          <button type="submit" aria-label="Procurar">
            <FaSearch />
          </button>
        </form>

        {loading && <p className="feedback-message">Carregando...</p>}
        {error && <p className="feedback-message error-message">{error}</p>}
        
        {weather && (
          <div className="weather-results">
            <WeatherDisplay current={weather.current} city={weather.name} />
            
            <div className="info-cards-grid">
              <InfoCard
                icon={<WiHumidity />}
                title="Umidade"
                value={`${Math.round(weather.current.humidity)}%`}
                className="card-humidity"
              />
              <InfoCard
                icon={<FaWind />}
                title="Vento (km/h)"
                value={Math.round(weather.current.wind_speed)}
                className="card-wind"
              />
              <InfoCard
                icon={<WiBarometer />}
                title="Pressão (hPa)"
                value={Math.round(weather.current.pressure)}
                className="card-pressure"
              />
               <InfoCard
                title="Visibilidade"
                value={`${Math.round(weather.current.visibility / 1000)} km`}
                className="card-visibility"
              />
            </div>
            
            <HourlyForecast hourly={weather.hourly} />
            <DailyForecast daily={weather.daily} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;