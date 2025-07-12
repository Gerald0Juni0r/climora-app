import axios from 'axios';

const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const mapWeatherCode = (code) => {
  const weatherMap = {
    0: { description: 'Céu Limpo', icon: '01d' },
    1: { description: 'Quase Limpo', icon: '02d' },
    2: { description: 'Parcialmente Nublado', icon: '03d' },
    3: { description: 'Nublado', icon: '04d' },
    45: { description: 'Nevoeiro', icon: '50d' },
    48: { description: 'Nevoeiro Congelante', icon: '50d' },
    51: { description: 'Garoa Leve', icon: '09d' },
    53: { description: 'Garoa Moderada', icon: '09d' },
    55: { description: 'Garoa Densa', icon: '09d' },
    61: { description: 'Chuva Fraca', icon: '10d' },
    63: { description: 'Chuva Moderada', icon: '10d' },
    65: { description: 'Chuva Forte', icon: '10d' },
    71: { description: 'Neve Leve', icon: '13d' },
    73: { description: 'Neve Moderada', icon: '13d' },
    75: { description: 'Neve Forte', icon: '13d' },
    80: { description: 'Pancadas de Chuva', icon: '09d' },
    81: { description: 'Pancadas de Chuva', icon: '09d' },
    82: { description: 'Pancadas de Chuva', icon: '09d' },
    95: { description: 'Trovoada', icon: '11d' },
    96: { description: 'Trovoada com Granizo', icon: '11d' },
    99: { description: 'Trovoada com Granizo', icon: '11d' },
  };
  return weatherMap[code] || { description: 'Desconhecido', icon: '01d' };
};

export const getWeatherData = async (city) => {
  try {
    const geoResponse = await axios.get(GEO_API_URL, {
      params: { name: city, count: 1, language: 'pt' },
    });

    if (!geoResponse.data.results) {
      throw new Error('Cidade não encontrada.');
    }

    const { latitude, longitude, name } = geoResponse.data.results[0];

    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,pressure_msl,visibility,wind_speed_10m',
        hourly: 'temperature_2m,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
        wind_speed_unit: 'kmh',
      },
    });

    const { current, hourly, daily } = weatherResponse.data;

    // Estrutura de dados simplificada para evitar o erro de lógica
    const createWeatherObject = (weatherCode) => {
      const mapped = mapWeatherCode(weatherCode);
      return {
        code: weatherCode,
        description: mapped.description,
        icon: mapped.icon, // Mantido para referência futura
      };
    };

    return {
      name: name,
      current: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        visibility: current.visibility,
        wind_speed: current.wind_speed_10m,
        weather: createWeatherObject(current.weather_code),
      },
      hourly: hourly.time.map((t, i) => ({
        dt: new Date(t).getTime() / 1000,
        temp: hourly.temperature_2m[i],
        weather: createWeatherObject(hourly.weather_code[i]),
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