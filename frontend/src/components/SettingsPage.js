import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function SettingsPage({ hemisphere, onHemisphereChange, deviceId, season, percentage }) {
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [permStatus, setPermStatus] = useState('default');
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermStatus(Notification.permission);
    }
    fetchNotifPrefs();

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const fetchNotifPrefs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/preferences/${deviceId}`);
      const data = await res.json();
      setNotifEnabled(data.enabled || false);
    } catch {}
  };

  const toggleNotif = async () => {
    const newState = !notifEnabled;

    if (newState && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        setPermStatus(perm);
        if (perm !== 'granted') return;
      }
      if (Notification.permission === 'denied') {
        setPermStatus('denied');
        return;
      }
    }

    setNotifEnabled(newState);

    try {
      await fetch(`${API_URL}/api/notifications/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceId, enabled: newState, frequency: 'daily' }),
      });
    } catch {}

    if (newState && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Season Tracker', {
        body: `${season.charAt(0).toUpperCase() + season.slice(1)} is ${Math.round(percentage)}% complete!`,
      });
    }
  };

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    }
  };

  return (
    <div className="settings-page" data-testid="settings-page">
      <motion.h2
        className="page-title serif"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Settings
      </motion.h2>

      <div className="settings-sections">
        {/* Hemisphere */}
        <motion.div
          className="settings-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="settings-section-title sans" data-testid="hemisphere-section-title">Hemisphere</h3>
          <p className="settings-section-desc sans">Select your hemisphere for accurate season tracking</p>
          <div className="hemisphere-pills" data-testid="hemisphere-toggle">
            {['north', 'south'].map(h => (
              <button
                key={h}
                className={`hemisphere-pill ${hemisphere === h ? 'active' : ''}`}
                onClick={() => onHemisphereChange(h)}
                data-testid={`hemisphere-${h}-btn`}
              >
                <span className="hemisphere-pill-icon">{h === 'north' ? '\u2191' : '\u2193'}</span>
                <span>{h === 'north' ? 'Northern' : 'Southern'}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="settings-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="settings-section-title sans" data-testid="notifications-section-title">Notifications</h3>
          <p className="settings-section-desc sans">Get daily updates about season progress</p>
          <div className="settings-row" data-testid="notification-toggle-container">
            <div className="settings-row-text">
              <span className="settings-row-label sans" data-testid="notification-title">Progress Updates</span>
              <span className="settings-row-sub sans" data-testid="notification-desc">Daily season percentage alerts</span>
            </div>
            <label className="toggle-switch" data-testid="notification-toggle">
              <input
                type="checkbox"
                checked={notifEnabled}
                onChange={toggleNotif}
                data-testid="notification-toggle-input"
              />
              <div className={`toggle-track ${notifEnabled ? 'active' : ''}`} />
              <div className={`toggle-thumb ${notifEnabled ? 'active' : ''}`} />
            </label>
          </div>
          {permStatus === 'denied' && (
            <p className="settings-warning sans" data-testid="notification-denied-msg">
              Notifications are blocked in your browser settings
            </p>
          )}
        </motion.div>

        {/* Install App */}
        <motion.div
          className="settings-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="settings-section-title sans">Install App</h3>
          <p className="settings-section-desc sans">Add Season Tracker to your home screen for a native app experience</p>
          {installPrompt ? (
            <button className="install-btn" onClick={handleInstall} data-testid="install-app-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Add to Home Screen
            </button>
          ) : (
            <div className="install-instructions sans" data-testid="install-instructions">
              <p>Open this page in your mobile browser, then:</p>
              <ul>
                <li><strong>iOS:</strong> Tap Share &rarr; Add to Home Screen</li>
                <li><strong>Android:</strong> Tap Menu &rarr; Install App</li>
              </ul>
            </div>
          )}
        </motion.div>

        {/* About */}
        <motion.div
          className="settings-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="settings-section-title sans">About</h3>
          <div className="about-info sans">
            <p>Season Tracker v1.0</p>
            <p className="about-tagline">Know where you stand in the rhythm of nature.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SettingsPage;
