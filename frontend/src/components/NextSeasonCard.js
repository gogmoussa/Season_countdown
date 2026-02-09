import React from 'react';
import { motion } from 'framer-motion';

const SEASON_ORDER_NORTH = ['spring', 'summer', 'autumn', 'winter'];
const SEASON_ICONS = { spring: '\u2740', summer: '\u2600', autumn: '\u2767', winter: '\u2744' };

function NextSeasonCard({ currentSeason, daysRemaining }) {
  const idx = SEASON_ORDER_NORTH.indexOf(currentSeason);
  const next = SEASON_ORDER_NORTH[(idx + 1) % 4];
  const nextName = next.charAt(0).toUpperCase() + next.slice(1);

  return (
    <motion.div
      className="next-season-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      data-testid="next-season-card"
    >
      <div className="next-season-left">
        <span className="next-season-icon">{SEASON_ICONS[next]}</span>
        <div>
          <span className="next-season-label sans">Next up</span>
          <span className="next-season-name serif">{nextName}</span>
        </div>
      </div>
      <div className="next-season-countdown" data-testid="next-season-countdown">
        <span className="countdown-value serif">{daysRemaining}</span>
        <span className="countdown-label sans">days away</span>
      </div>
    </motion.div>
  );
}

export default NextSeasonCard;
