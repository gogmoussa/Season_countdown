import React from 'react';
import { motion } from 'framer-motion';

function InstallPrompt({ onDismiss }) {
  return (
    <motion.div
      className="install-banner"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      data-testid="install-banner"
    >
      <div className="install-banner-content">
        <div className="install-banner-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div className="install-banner-text">
          <strong className="sans">Install Season Tracker</strong>
          <span className="sans">Add to home screen for the full experience</span>
        </div>
      </div>
      <button className="install-banner-close" onClick={onDismiss} data-testid="install-banner-dismiss">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
}

export default InstallPrompt;
