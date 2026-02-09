import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import SeasonProgress from './components/SeasonProgress';
import AffirmationCard from './components/AffirmationCard';
import SeasonDetails from './components/SeasonDetails';
import SeasonTimeline from './components/SeasonTimeline';
import SeasonParticles from './components/SeasonParticles';
import BottomNav from './components/BottomNav';
import SeasonsPage from './components/SeasonsPage';
import SettingsPage from './components/SettingsPage';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function detectHemisphere() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const southern = [
      'Australia', 'Antarctica', 'Pacific/Auckland', 'Pacific/Fiji',
      'America/Buenos_Aires', 'America/Sao_Paulo', 'America/Santiago',
      'Africa/Johannesburg', 'Africa/Harare', 'Indian/Madagascar',
    ];
    if (southern.some(s => tz.includes(s))) return 'south';
  } catch {}
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

const SEASON_GREETINGS = {
  spring: 'Embrace the bloom',
  summer: 'Bask in the light',
  autumn: 'Savor the change',
  winter: 'Find your stillness',
};

function App() {
  const [seasonData, setSeasonData] = useState(null);
  const [hemisphere, setHemisphere] = useState(() => {
    return localStorage.getItem('season_tracker_hemisphere') || detectHemisphere();
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const fetchSeason = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/season?hemisphere=${hemisphere}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSeasonData(data);
      setError(null);
    } catch {
      setError('Could not load season data.');
    } finally {
      setLoading(false);
    }
  }, [hemisphere]);

  useEffect(() => { fetchSeason(); }, [fetchSeason]);
  useEffect(() => { localStorage.setItem('season_tracker_hemisphere', hemisphere); }, [hemisphere]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('install_dismissed');
      if (!dismissed) setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismissInstall = () => {
    setShowInstall(false);
    localStorage.setItem('install_dismissed', 'true');
  };

  const season = seasonData?.season || 'spring';

  return (
    <LayoutGroup>
      <div className="app-shell" data-season={season} data-testid="app-container">
        <SeasonParticles season={season} />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              className="loader-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-testid="loading-indicator"
            >
              <div className="loader-content">
                <motion.div
                  className="loader-icon serif"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  {'\u2744'}
                </motion.div>
                <p className="loader-text sans">Reading the seasons...</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              className="error-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-testid="error-message"
            >
              <p className="sans">{error}</p>
              <button onClick={fetchSeason} className="retry-btn sans" data-testid="retry-button">
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              className="app-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence mode="wait">
                {activeTab === 'home' && (
                  <motion.div
                    key="home"
                    className="page home-page"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    data-testid="main-content"
                  >
                    <header className="home-header">
                      <motion.p
                        className="greeting-text sans"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        data-testid="header-label"
                      >
                        {SEASON_GREETINGS[season]}
                      </motion.p>
                      <motion.h1
                        className="season-name serif"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        data-testid="season-title"
                      >
                        {season.charAt(0).toUpperCase() + season.slice(1)}
                      </motion.h1>
                      <motion.p
                        className="date-range sans"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        data-testid="season-date-range"
                      >
                        {seasonData.start_date} — {seasonData.end_date}
                      </motion.p>
                    </header>

                    <SeasonProgress
                      percentage={seasonData.percentage_complete}
                      season={season}
                    />

                    <SeasonDetails
                      daysElapsed={seasonData.days_elapsed}
                      daysRemaining={seasonData.days_remaining}
                      totalDays={seasonData.total_days}
                    />

                    <AffirmationCard
                      affirmation={seasonData.affirmation}
                      onRefresh={fetchSeason}
                    />

                    <SeasonTimeline
                      currentSeason={season}
                      hemisphere={hemisphere}
                    />
                  </motion.div>
                )}

                {activeTab === 'seasons' && (
                  <motion.div
                    key="seasons"
                    className="page"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SeasonsPage
                      hemisphere={hemisphere}
                      currentSeason={season}
                    />
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    className="page"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SettingsPage
                      hemisphere={hemisphere}
                      onHemisphereChange={setHemisphere}
                      deviceId={generateDeviceId()}
                      season={season}
                      percentage={seasonData.percentage_complete}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence>
          {showInstall && (
            <InstallPrompt onDismiss={dismissInstall} />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

export default App;
