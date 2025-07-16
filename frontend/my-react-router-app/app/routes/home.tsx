import type { Route } from "./+types/home";
import React, { useState, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Weather Web openweathermap" },
    { name: "description", content: "Weather Dashboard UI" },
  ];
}


// Helper to get emoji for weather condition
function getWeatherEmoji(main: string) {
  switch (main) {
    case 'Thunderstorm': return '⛈️';
    case 'Drizzle': return '🌦️';
    case 'Rain': return '🌧️';
    case 'Snow': return '❄️';
    case 'Clear': return '☀️';
    case 'Clouds': return '☁️';
    case 'Mist':
    case 'Smoke':
    case 'Haze':
    case 'Dust':
    case 'Fog':
    case 'Sand':
    case 'Ash':
    case 'Squall':
    case 'Tornado': return '🌫️';
    default: return '❓';
  }
}

export default function Home() {
  const [city, setCity] = useState("Purwokerto Selatan");
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hydration-safe: Only set formattedDate on client
  const [formattedDate, setFormattedDate] = useState("");
  useEffect(() => {
    // Inject Google Fonts link for Poppins (client only)
    if (!document.getElementById('poppins-font')) {
      const link = document.createElement('link');
      link.id = 'poppins-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
    // Format date on client only
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let dateStr = "";
    if (weather && typeof weather.timezone === 'number') {
      const nowUTC = new Date(Date.now() + new Date().getTimezoneOffset() * 60000);
      const cityTime = new Date(nowUTC.getTime() + weather.timezone * 1000);
      dateStr = `${days[cityTime.getDay()]}, ${cityTime.getDate()} ${months[cityTime.getMonth()]} ${cityTime.getFullYear()}`;
    } else {
      const today = new Date();
      dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    }
    setFormattedDate(dateStr);
  }, [weather]);

  // Fetch weather data from OpenWeatherMap
  async function fetchWeather(cityName: string) {
    setLoading(true);
    setError("");
    // Do not clear weather here, only update on success
    try {
      const apiKey = "f907ec0c0612a0eed3c5332f8397c475";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
      setCity(data.name);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather");
      // Do not clear weather, keep showing previous data
    } finally {
      setLoading(false);
    }
  }

  // Handle search submit
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      fetchWeather(search.trim());
      setSearch(""); // Clear input after search
    }
  }

  // Optionally, fetch weather for default city on mount
  React.useEffect(() => {
    fetchWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    return (
        <>
            <style>{`
                input::placeholder {
                    color: #888;
                }
            `}</style>
            <div style={{ display: "flex", minHeight: "100vh", background: "#f6fbff", fontFamily: "'Poppins', sans-serif" }}>
                {/* Main Content */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Top Bar */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 40px 0 40px" }}>
                        {/* City and Date centered */}
                        <div style={{ textAlign: "center", fontWeight: 600, fontSize: 20, color: "#222" }}>
                            {city} &mdash; {formattedDate}
                        </div>
                    </div>
                    {/* Main Content */}
                    <main style={{ flex: 1, padding: 40 }}>
                        <div className="dashboard-cards-row" style={{ display: 'flex', justifyContent: 'center' }}>
                            {/* Weather & Temperature Card */}
                            <section className="weather-card" style={{ maxWidth: 350, width: '100%', background: 'linear-gradient(135deg, #5b5be6 0%, #6a8cff 100%)', borderRadius: 24, boxShadow: '0 4px 24px rgba(90,110,255,0.10)', padding: '32px 24px 24px 24px', color: '#fff', position: 'relative', minHeight: 480 }}>
                                {/* Search bar styled like the image */}
                                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 24, padding: '4px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', margin: '0 auto 24px auto', maxWidth: 270, width: '100%', position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            background: 'transparent',
                                            fontSize: 18,
                                            color: '#222',
                                            flex: 1,
                                            padding: '8px 0 8px 0',
                                            fontFamily: 'inherit',
                                        }}
                                    />
                                    <button type="submit" style={{
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }} aria-label="search">
                                        <svg width="24" height="24" fill="none" stroke="#5b5be6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                    </button>
                                </form>
                                <div className="weather-card-header" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                    {/* Optionally, add weather icon here for more similarity */}
                                </div>
                                {loading ? (
                                  <div style={{padding: 24, textAlign: 'center'}}>Loading...</div>
                                ) : error ? (
                                  <div style={{padding: 24, color: 'red', textAlign: 'center'}}>{error}</div>
                                ) : weather ? (
                                  <>
                                    {/* Emoji Icon */}
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 64, marginBottom: 12 }}>
                                      <span className="weather-card-icon" role="img" aria-label="weather">
                                        {weather.weather && weather.weather[0] && getWeatherEmoji(weather.weather[0].main)}
                                      </span>
                                    </div>
                                    {/* Temperature */}
                                    <div style={{ textAlign: 'center', fontSize: 48, fontWeight: 600, marginBottom: 8 }}>
                                      {Math.round(weather.main.temp - 273.15)}°C
                                    </div>
                                    {/* Weather Details */}
                                    <div className="weather-card-details" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 24 }}>
                                      <div style={{ textAlign: 'center' }}>PRESSURE<br /><span style={{ fontWeight: 500 }}>{weather.main.pressure} mb</span></div>
                                      <div style={{ textAlign: 'center' }}>WIND<br /><span style={{ fontWeight: 500 }}>{weather.wind.speed} m/s</span></div>
                                      <div style={{ textAlign: 'center' }}>VISIBILITY<br /><span style={{ fontWeight: 500 }}>{weather.visibility / 1000} km</span></div>
                                      <div style={{ textAlign: 'center' }}>HUMIDITY<br /><span style={{ fontWeight: 500 }}>{weather.main.humidity}%</span></div>
                                    </div>
                                  </>
                                ) : (
                                  <div style={{padding: 24, textAlign: 'center'}}>No data</div>
                                )}



                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
