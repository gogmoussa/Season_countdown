import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AffirmationCard({ affirmation, onRefresh }) {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    onRefresh();
    setTimeout(() => setIsSpinning(false), 600);
  };

  return (
    <motion.div
      className="affirmation-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      data-testid="affirmation-card"
    >
      <div className="affirmation-accent-line" />
      <div className="affirmation-content">
        <span className="affirmation-label sans">Daily Affirmation</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={affirmation}
            className="affirmation-text serif"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            data-testid="affirmation-text"
          >
            {affirmation}
          </motion.p>
        </AnimatePresence>
      </div>
      <button
        className="refresh-btn"
        onClick={handleRefresh}
        aria-label="Get new affirmation"
        data-testid="refresh-affirmation-btn"
      >
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isSpinning ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
        </motion.svg>
      </button>
    </motion.div>
  );
}

export default AffirmationCard;
