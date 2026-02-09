import React from 'react';
import { motion } from 'framer-motion';

function AffirmationCard({ affirmation, onRefresh }) {
  return (
    <motion.div
      className="affirmation-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      data-testid="affirmation-card"
    >
      <span className="affirmation-quote-mark">"</span>
      <p className="affirmation-text" data-testid="affirmation-text">
        {affirmation}
      </p>
      <div className="affirmation-refresh">
        <button
          className="refresh-btn"
          onClick={onRefresh}
          aria-label="Get new affirmation"
          data-testid="refresh-affirmation-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default AffirmationCard;
