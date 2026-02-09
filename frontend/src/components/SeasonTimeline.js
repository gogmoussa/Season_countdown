import React from 'react';
import { motion } from 'framer-motion';

const SEASON_ICONS = {
  spring: '\u2740',
  summer: '\u2600',
  autumn: '\u2767',
  winter: '\u2744',
};

function SeasonTimeline({ currentSeason, hemisphere }) {
  const northSeasons = ['winter', 'spring', 'summer', 'autumn'];
  const southSeasons = ['summer', 'autumn', 'winter', 'spring'];
  const seasons = hemisphere === 'south' ? southSeasons : northSeasons;

  return (
    <motion.div
      className="timeline-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.6 }}
      data-testid="season-timeline"
    >
      <div className="timeline-track">
        {seasons.map((s, i) => {
          const isCurrent = s === currentSeason;
          const isPast = seasons.indexOf(currentSeason) > i;
          return (
            <div key={s} className="timeline-item" data-testid={`timeline-${s}`}>
              <div className={`timeline-dot ${isCurrent ? 'active' : ''} ${isPast ? 'past' : ''}`}>
                {isCurrent && (
                  <motion.div
                    className="timeline-pulse"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <span className="timeline-icon">{SEASON_ICONS[s]}</span>
              </div>
              <span className={`timeline-label sans ${isCurrent ? 'active' : ''}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
              {i < seasons.length - 1 && (
                <div className={`timeline-line ${isPast ? 'filled' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default SeasonTimeline;
