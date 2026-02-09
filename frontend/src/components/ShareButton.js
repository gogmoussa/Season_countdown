import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ShareButton({ season, percentage, daysRemaining }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const seasonName = season.charAt(0).toUpperCase() + season.slice(1);
    const text = `${seasonName} is ${Math.round(percentage)}% complete with ${daysRemaining} days remaining. Track your seasons at`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Season Tracker', text, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <motion.button
      className="share-btn"
      onClick={handleShare}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      data-testid="share-button"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="copied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Copied!
          </motion.span>
        ) : (
          <motion.span key="share" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Share
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default ShareButton;
