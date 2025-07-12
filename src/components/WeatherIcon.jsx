import React from 'react';
import './WeatherIcon.css';

const WeatherIcon = ({ code, className, isNight }) => {
  const renderRain = () => (
    <div className="rain">
      <div className="drop"></div>
      <div className="drop"></div>
      <div className="drop"></div>
    </div>
  );

  let iconJsx;

  switch (code) {
    case 0: // Céu Limpo
      iconJsx = isNight ? <div className="moon"></div> : <div className="sun"></div>;
      break;

    case 1: // Quase Limpo
    case 2: // Parcialmente Nublado
      iconJsx = (
        <>
          <div className="cloud"></div>
          <div className="cloud-dark"></div>
          {isNight ? <div className="moon moon-behind"></div> : <div className="sun sun-behind"></div>}
        </>
      );
      break;

    case 3: // Nublado
      iconJsx = <div className="cloud"></div>;
      break;

    case 45: // Nevoeiro
    case 48:
      iconJsx = <div className="mist"></div>;
      break;
    
    case 51: // Garoa
    case 53:
    case 55:
    case 61: // Chuva
    case 63:
    case 65:
    case 80: // Pancadas de Chuva
    case 81:
    case 82:
      iconJsx = (
        <>
          <div className="cloud"></div>
          <div className="cloud-dark"></div>
          {renderRain()}
        </>
      );
      break;

    case 95: // Trovoada
    case 96:
    case 99:
      iconJsx = (
        <>
          <div className="cloud"></div>
          <div className="lightning"></div>
        </>
      );
      break;
    
    default:
      iconJsx = <div className="cloud"></div>;
      break;
  }

  return <div className={`icon-container ${className || ''}`}>{iconJsx}</div>;
};

export default WeatherIcon;