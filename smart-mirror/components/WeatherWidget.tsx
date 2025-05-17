'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloud,
  faSun,
  faCloudRain,
  faSnowflake,
  faSmog,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';

type WeatherData = {
  name: string;
  weather: {
    main: string;
    description: string;
  }[];
  main: {
    temp: number;
  };
};

const getWeatherIcon = (main: string) => {
  switch (main.toLowerCase()) {
    case 'clouds':
      return faCloud;
    case 'clear':
      return faSun;
    case 'rain':
      return faCloudRain;
    case 'snow':
      return faSnowflake;
    case 'thunderstorm':
      return faBolt;
    case 'mist':
    case 'haze':
    case 'fog':
      return faSmog;
    default:
      return faSun;
  }
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather');
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const data: WeatherData = await res.json();
        setWeather(data);
      } catch (error) {
        console.error('Weather fetch failed:', error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 3 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const icon = weather ? getWeatherIcon(weather.weather[0].main) : null;

  return (
    <div className="weather-widget">
      <style jsx>{`
        .weather-widget {
          width: 100%;
          max-width: 20rem;
          padding: 1.5rem;
          border-radius: 1.5rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
          position: relative;
          overflow: hidden;
          color: white;
        }

        .weather-widget::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.15)
          );
          z-index: 0;
          pointer-events: none;
        }

        .shimmer-text {
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(200, 230, 255, 0.5) 30%,
            rgba(255, 255, 255, 0.9) 70%,
            rgba(180, 220, 255, 0.4) 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shimmer 6s linear infinite;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }

        .divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.2);
          margin: 1rem 0;
        }
      `}</style>

      {!weather ? (
        <p className="animate-pulse text-lg text-center z-10 relative">Loading weather...</p>
      ) : (
        <div className="space-y-6 z-10 relative">
          <p className="shimmer-text text-xl text-center">{weather.name}</p>

          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div className="space-y-1">
              <p className="shimmer-text text-5xl leading-none">
                {Math.round(weather.main.temp - 273.15)}°C
              </p>
              <p className="capitalize text-sm text-gray-200 tracking-wide">
                {weather.weather[0].description}
              </p>
            </div>
            <FontAwesomeIcon
              icon={icon!}
              className="text-6xl text-blue-200 drop-shadow-xl self-center"
            />
          </div>

          <div className="divider" />
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;