import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const SEASON_META = {
  spring: { icon: '\u2740', months: 'Mar 20 — Jun 20', desc: 'Renewal & Growth' },
  summer: { icon: '\u2600', months: 'Jun 21 — Sep 22', desc: 'Abundance & Energy' },
  autumn: { icon: '\u2767', months: 'Sep 23 — Dec 20', desc: 'Harvest & Reflection' },
  winter: { icon: '\u2744', months: 'Dec 21 — Mar 19', desc: 'Rest & Restoration' },
};

function SeasonsPage({ hemisphere, currentSeason }) {
  const [allSeasons, setAllSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSeasons();
  }, [hemisphere]);

  const fetchAllSeasons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/season?hemisphere=${hemisphere}`);
      const current = await res.json();

      const seasonOrder = ['spring', 'summer', 'autumn', 'winter'];
      const currentIdx = seasonOrder.indexOf(current.season);

      const seasons = seasonOrder.map((name, i) => {
        if (name === current.season) {
          return { ...current, ...SEASON_META[name] };
        }
        const isPast = i < currentIdx;
        return {
          season: name,
          percentage_complete: isPast ? 100 : 0,
          days_remaining: isPast ? 0 : '—',
          total_days: SEASON_META[name].months,
          ...SEASON_META[name],
        };
      });

      setAllSeasons(seasons);
    } catch {
      setAllSeasons([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loader" data-testid="seasons-loading">
        <div className="loader-ring" />
      </div>
    );
  }

  return (
    <div className="seasons-page" data-testid="seasons-page">
      <motion.h2
        className="page-title serif"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        All Seasons
      </motion.h2>
      <p className="page-subtitle sans">
        {hemisphere === 'north' ? 'Northern' : 'Southern'} Hemisphere
      </p>

      <div className="seasons-grid">
        {allSeasons.map((s, i) => {
          const isCurrent = s.season === currentSeason;
          return (
            <motion.div
              key={s.season}
              className={`season-card ${isCurrent ? 'current' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              data-testid={`season-card-${s.season}`}
            >
              {isCurrent && <div className="current-badge sans" data-testid="current-season-badge">Now</div>}
              <div className="season-card-header">
                <span className="season-card-icon">{s.icon}</span>
                <div>
                  <h3 className="season-card-name serif">{s.season.charAt(0).toUpperCase() + s.season.slice(1)}</h3>
                  <p className="season-card-desc sans">{s.desc}</p>
                </div>
              </div>
              <div className="season-card-progress">
                <div className="season-bar-track">
                  <motion.div
                    className="season-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percentage_complete}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    style={{ background: 'var(--accent)' }}
                  />
                </div>
                <span className="season-bar-percent sans">
                  {typeof s.percentage_complete === 'number' ? `${Math.round(s.percentage_complete)}%` : '—'}
                </span>
              </div>
              <p className="season-card-months sans">{s.months}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default SeasonsPage;
