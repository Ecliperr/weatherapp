import './App.css';
import { useState } from 'react';

function App() {
  const [zip1, setZip1] = useState('');
  const [zip2, setZip2] = useState('');
  const [weather1, setWeather1] = useState(null);
  const [weather2, setWeather2] = useState(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(false);

  const toggleTheme = () => {
    setTheme(!theme);
  };

  const getWeather = async (setWeather, zip) => {
    const apiKey = '6e779a45797d265c50122efd9d7015db';
    const currweatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apiKey}&units=imperial`;
    const zipUrl = `https://api.zippopotam.us/us/${zip}`

  try {
    const [currentRes, zipRes] = await Promise.all([
      fetch(currweatherUrl),
      fetch(zipUrl)
    ]);

    if (!currentRes.ok || !zipRes.ok) throw new Error('invalid ZIP or API error');

    const currentData = await currentRes.json();
    const zipData = await zipRes.json();
    const state = zipData.places[0]['state abbreviation'];
    
    const {lat, lon} = currentData.coord;
    const forecastUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;

    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) throw new Error('Failed to fetch forecast')

    const forecastData = await forecastRes.json();

    setWeather({
      ...currentData,
      state,
      forecast: forecastData.daily
    });

    setError('');
    console.log(currentData);
    
  } catch (err) {
    setWeather(null);
    setError(err.message);
  }
};
  
  return (
    <div className={`container ${theme ? 'dark' : ''}`}>
      {/* Header */}
      <h1>What's the Weather?</h1>
      <input
      type="text"
      value={zip1}
      onChange={(e) => setZip1(e.target.value)}
      placeholder='Enter ZIP code'
      />

      <button onClick={() => getWeather(setWeather1, zip1)}>Get Weather</button>

      {/* Throw error */}
      {error && <p className="error">{error}</p>}
      
      
      {/* First weather card */}
      {weather1 && (
      <>
        <div className="card-row">
          <div className='result fade-in'>
            <div className='name'>
              <h2>{weather1.name}, {weather1.state}</h2>
              <h2>{Math.round(weather1.main.temp)}°F</h2>
            </div>
            <p>{weather1.weather[0].description}</p>
            <p>Feels like: {Math.round(weather1.main.feels_like)}°F</p>

            <div className="forecast">
              {weather1.forecast.slice(1, 6).map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                  <p>High: {Math.round(day.temp.max)}°F</p>
                  <p>Low: {Math.round(day.temp.min)}°F</p>
                  <p>{day.weather[0].description}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Second weather card */}
          {weather2 && (
            <div className='result fade-in'>
              <div className='name'>
                <h2>{weather2.name}, {weather2.state}</h2>
                <h2>{Math.round(weather2.main.temp)}°F</h2>
              </div>
              <p>{weather2.weather[0].description}</p>
              <p>Feels like: {Math.round(weather2.main.feels_like)}°F</p>
              
              <div className="forecast">
              {weather2.forecast.slice(1, 6).map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                  <p>High: {Math.round(day.temp.max)}°F</p>
                  <p>Low: {Math.round(day.temp.min)}°F</p>
                  <p>{day.weather[0].description}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />
                </div>
              ))}
            </div>
            </div>
          )}
        </div>

        <input
          type="text"
          value={zip2}
          onChange={(e) => setZip2(e.target.value)}
          placeholder='Compare weather?'
        />

        <button onClick={() => getWeather(setWeather2, zip2)}>Get Weather</button>
      </>
      )}
      
      {/* Dark mode toggle */}
      <div>
        <button className="themeToggle" 
        onClick={toggleTheme} 
        title="Change Theme">
          {theme ? '☀️' : '🌙'}
        </button>
      </div>
          
    </div>
  );
}

export default App;
