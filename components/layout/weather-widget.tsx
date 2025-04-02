'use client';

import { useEffect } from 'react';

const WeatherWidget = () => {
  useEffect(() => {
    if (!document.getElementById('weatherapi-script')) {
      const script = document.createElement('script');
      script.id = 'weatherapi-script';
      script.src =
        'https://www.weatherapi.com/weather/widget.ashx?loc=1389458&wid=4&tu=1&div=weatherapi-weather-widget-4';
      script.async = true;

      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="weather-widget-container">
      <div id="weatherapi-weather-widget-4" />

      
        <a
          href="https://www.weatherapi.com/weather/q/imeni-amangeldy-1389458"
        >
          10 day hour by hour Imeni Amangel'dy weather
        </a>
    </div>
  );
};

export default WeatherWidget;
