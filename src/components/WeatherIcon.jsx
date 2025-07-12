import React from 'react';
import './WeatherIcon.css';

const WeatherIcon = ({ iconCode, isDay, className }) => {
  const renderRain = () => (
    <div className="rain">
      <div className="drop"></div>
      <div className="drop"></div>
      <div className="drop"></div>
    </div>
  );

  let iconJsx;

  switch (iconCode) {
    case '01': // Céu Limpo
      iconJsx = isDay ? <div className="sun"></div> : <div className="moon"></div>;
      break;

    case '02': // Quase Limpo
    case '03': // Parcialmente Nublado
      iconJsx = (
        <>
          <div className="cloud"></div>
          <div className="cloud-dark"></div>
          {isDay ? <div className="sun sun-behind"></div> : <div className="moon moon-behind"></div>}
        </>
      );
      break;

    case '04': // Nublado
      iconJsx = <div className="cloud"></div>;
      break;

    case '50': // Nevoeiro
      iconJsx = <div className="mist"></div>;
      break;
    
    case '09': // Chuva/Garoa
    case '10':
      iconJsx = (
        <>
          <div className="cloud"></div>
          <div className="cloud-dark"></div>
          {renderRain()}
        </>
      );
      break;

    case '11': // Trovoada
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