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
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apiKey}&units=imperial`;
    const zipUrl = `https://api.zippopotam.us/us/${zip}`

  try {
    const [weatherRes, zipRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(zipUrl)
    ]);

    if (!weatherRes.ok || !zipRes.ok) throw new Error('invalid ZIP or API error');

    const weatherData = await weatherRes.json();
    const zipData = await zipRes.json();
    const state = zipData.places[0]['state abbreviation'];

    setWeather({
      ...weatherData,
      state
    });

    setError('');
    console.log(weatherData);
    
  } catch (err) {
    setWeather(null);
    setError(err.message);
  }
};
  
  return (
    <div className={`container ${theme ? 'dark' : ''}`}>
      {/* Header */}
      <h1>Weather App!</h1>
      <input
      type="text"
      value={zip1}
      onChange={(e) => setZip1(e.target.value)}
      placeholder='Enter ZIP code'
      />

      <button onClick={() => getWeather(setWeather1, zip1)}>Get Weather</button>

      {/* Throw error */}
      {error && <p className="error">{error}</p>}
      
      <div>

      {/* First weather card */}
      {weather1 && (
        <>
        <div className='result fade-in'>
          <span className='name'><h2>{weather1.name}, {weather1.state}</h2></span>
          <p>{weather1.weather[0].description}</p>
          <p>Temperature: {Math.round(weather1.main.temp)}°F</p>
          <p>Feels like: {Math.round(weather1.main.feels_like)}°F</p>
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

      {/* Second weather card */}
      {weather2 && (
        <div className='result fade-in'>
          <span className='name'><h2>{weather2.name}, {weather2.state}</h2></span>
          <p>{weather2.weather[0].description}</p>
          <p>Temperature: {Math.round(weather2.main.temp)}°F</p>
          <p>Feels like: {Math.round(weather2.main.feels_like)}°F</p>
        </div>
      )}
      </div>

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
