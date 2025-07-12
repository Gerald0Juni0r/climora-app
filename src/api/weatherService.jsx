import axios from 'axios';

const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const mapWeatherCode = (code) => {
  const weatherMap = {
    0: { description: 'Céu Limpo', icon: '01' },
    1: { description: 'Quase Limpo', icon: '02' },
    2: { description: 'Parcialmente Nublado', icon: '03' },
    3: { description: 'Nublado', icon: '04' },
    45: { description: 'Nevoeiro', icon: '50' },
    48: { description: 'Nevoeiro Congelante', icon: '50' },
    51: { description: 'Garoa Leve', icon: '09' },
    53: { description: 'Garoa Moderada', icon: '09' },
    55: { description: 'Garoa Densa', icon: '09' },
    61: { description: 'Chuva Fraca', icon: '10' },
    63: { description: 'Chuva Moderada', icon: '10' },
    65: { description: 'Chuva Forte', icon: '10' },
    71: { description: 'Neve Leve', icon: '13' },
    73: { description: 'Neve Moderada', icon: '13' },
    75: { description: 'Neve Forte', icon: '13' },
    80: { description: 'Pancadas de Chuva', icon: '09' },
    81: { description: 'Pancadas de Chuva', icon: '09' },
    82: { description: 'Pancadas de Chuva', icon: '09' },
    95: { description: 'Trovoada', icon: '11' },
    96: { description: 'Trovoada com Granizo', icon: '11' },
    99: { description: 'Trovoada com Granizo', icon: '11' },
  };
  return weatherMap[code] || { description: 'Desconhecido', icon: '01' };
};

export const getWeatherData = async (city) => {
  try {
    const geoResponse = await axios.get(GEO_API_URL, {
      params: { name: city, count: 1, language: 'pt' },
    });

    if (!geoResponse.data.results) {
      throw new Error('Cidade não encontrada.');
    }

    const { latitude, longitude } = geoResponse.data.results[0];

    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,pressure_msl,visibility,wind_speed_10m,is_day',
        hourly: 'temperature_2m,weather_code,is_day',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
        wind_speed_unit: 'kmh',
      },
    });

    const { current, hourly, daily } = weatherResponse.data;

    const createWeatherObject = (weatherCode) => mapWeatherCode(weatherCode);

    // AGORA, O NOME NÃO É MAIS RETORNADO DAQUI. O App.js CUIDARÁ DISSO.
    return {
      current: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        visibility: current.visibility,
        wind_speed: current.wind_speed_10m,
        weather: createWeatherObject(current.weather_code),
        isDay: current.is_day === 1,
      },
      hourly: hourly.time.map((t, i) => ({
        dt: new Date(t).getTime() / 1000,
        temp: hourly.temperature_2m[i],
        weather: createWeatherObject(hourly.weather_code[i]),
        isDay: hourly.is_day[i] === 1,
      })),
      daily: daily.time.map((t, i) => ({
        dt: new Date(t).getTime() / 1000,
        weather: createWeatherObject(daily.weather_code[i]),
        temp: {
          max: daily.temperature_2m_max[i],
          min: daily.temperature_2m_min[i],
        },
      })),
    };
  } catch (error) {
    if (error.message.includes('not found')) {
      throw new Error('Cidade não encontrada.');
    }
    console.error("Erro ao buscar dados do clima:", error);
    throw new Error('Não foi possível obter os dados do clima.');
  }
};