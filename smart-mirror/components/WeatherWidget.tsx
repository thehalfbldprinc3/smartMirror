'use client';

import { useEffect, useState } from 'react';

type WeatherData = {
  name: string;
  weather: {
    description: string;
  }[];
  main: {
    temp: number;
  };
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather');
        if (!res.ok) {
          throw new Error(`Failed to fetch weather: ${res.statusText}`);
        }
        const data: WeatherData = await res.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
  }, []);

  if (!weather) return <div>Loading weather...</div>;

  return (
    <div className="bg-primary p-4 rounded-lg shadow-md text-white">
      <h2 className="text-lg font-semibold">🌤️ {weather.name}</h2>
      <p className="text-sm">{weather.weather[0].description}</p>
      <p className="text-2xl font-bold">
        {Math.round(weather.main.temp - 273.15)}°C
      </p>
    </div>
  );
};

export default WeatherWidget;