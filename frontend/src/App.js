import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SeasonProgress from './components/SeasonProgress';
import AffirmationCard from './components/AffirmationCard';
import SeasonDetails from './components/SeasonDetails';
import NotificationToggle from './components/NotificationToggle';
import HemisphereToggle from './components/HemisphereToggle';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function detectHemisphere() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const southernTimezones = [
      'Australia', 'Antarctica', 'Pacific/Auckland', 'Pacific/Fiji',
      'America/Buenos_Aires', 'America/Sao_Paulo', 'America/Santiago',
      'Africa/Johannesburg', 'Africa/Harare', 'Indian/Madagascar',
    ];
    if (southernTimezones.some(s => tz.includes(s))) return 'south';
  } catch (e) {}
  return 'north';
}

function generateDeviceId() {
  let id = localStorage.getItem('season_tracker_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('season_tracker_device_id', id);
  }
  return id;
}

function App() {
  const [seasonData, setSeasonData] = useState(null);
  const [hemisphere, setHemisphere] = useState(() => {
    const saved = localStorage.getItem('season_tracker_hemisphere');
    return saved || detectHemisphere();
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSeason = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/season?hemisphere=${hemisphere}`);
      if (!res.ok) throw new Error('Failed to fetch season data');
      const data = await res.json();
      setSeasonData(data);
      setError(null);
    } catch (err) {
      setError('Could not load season data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [hemisphere]);

  useEffect(() => {
    fetchSeason();
  }, [fetchSeason]);

  useEffect(() => {
    localStorage.setItem('season_tracker_hemisphere', hemisphere);
  }, [hemisphere]);

  const handleHemisphereChange = (h) => {
    setHemisphere(h);
  };

  const season = seasonData?.season || 'spring';

  return (
    <div className="app-container" data-season={season} data-testid="app-container">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            className="loader-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="loading-indicator"
          >
            <div className="loader-ring" />
            <p className="season-body" style={{ marginTop: '1.5rem', fontWeight: 300, opacity: 0.6 }}>
              Detecting your season...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            className="error-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="error-message"
          >
            <p className="season-body">{error}</p>
            <button onClick={fetchSeason} className="retry-btn" data-testid="retry-button">
              Try Again
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={season}
            className="main-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            data-testid="main-content"
          >
            <header className="app-header">
              <motion.p
                className="season-body header-label"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                data-testid="header-label"
              >
                You are in
              </motion.p>
              <motion.h1
                className="season-heading season-title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                data-testid="season-title"
              >
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </motion.h1>
              <motion.p
                className="season-body date-range"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                data-testid="season-date-range"
              >
                {seasonData.start_date} — {seasonData.end_date}
              </motion.p>
            </header>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <SeasonProgress
                percentage={seasonData.percentage_complete}
                season={season}
              />
            </motion.div>

            <SeasonDetails
              daysElapsed={seasonData.days_elapsed}
              daysRemaining={seasonData.days_remaining}
              totalDays={seasonData.total_days}
            />

            <AffirmationCard
              affirmation={seasonData.affirmation}
              onRefresh={fetchSeason}
            />

            <div className="bottom-controls">
              <HemisphereToggle
                hemisphere={hemisphere}
                onChange={handleHemisphereChange}
              />
              <NotificationToggle
                deviceId={generateDeviceId()}
                season={season}
                percentage={seasonData.percentage_complete}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
