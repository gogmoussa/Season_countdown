import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function NotificationToggle({ deviceId, season, percentage }) {
  const [enabled, setEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/preferences/${deviceId}`);
      const data = await res.json();
      setEnabled(data.enabled || false);
    } catch (e) {}
  };

  const handleToggle = async () => {
    const newState = !enabled;

    if (newState && 'Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission !== 'granted') return;
    }

    if (newState && 'Notification' in window && Notification.permission === 'denied') {
      setPermissionStatus('denied');
      return;
    }

    setEnabled(newState);

    try {
      await fetch(`${API_URL}/api/notifications/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceId, enabled: newState, frequency: 'daily' }),
      });
    } catch (e) {}

    if (newState && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Season Tracker', {
        body: `${season.charAt(0).toUpperCase() + season.slice(1)} is ${Math.round(percentage)}% complete!`,
        icon: '/favicon.ico',
      });
    }
  };

  return (
    <div data-testid="notification-toggle-container">
      <div className="notification-control">
        <div className="notification-info">
          <span className="notification-title season-body" data-testid="notification-title">
            Progress Notifications
          </span>
          <span className="notification-desc season-body" data-testid="notification-desc">
            Daily season progress updates
          </span>
        </div>
        <label className="toggle-switch" data-testid="notification-toggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
            data-testid="notification-toggle-input"
          />
          <div className={`toggle-track ${enabled ? 'active' : ''}`} />
          <div className={`toggle-thumb ${enabled ? 'active' : ''}`} />
        </label>
      </div>
      {permissionStatus === 'denied' && (
        <p className="notification-status season-body" data-testid="notification-denied-msg">
          Notifications blocked in browser settings
        </p>
      )}
    </div>
  );
}

export default NotificationToggle;
