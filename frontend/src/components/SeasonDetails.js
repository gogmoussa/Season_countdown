import React from 'react';
import { motion } from 'framer-motion';

function SeasonDetails({ daysElapsed, daysRemaining, totalDays }) {
  return (
    <motion.div
      className="details-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      data-testid="season-details"
    >
      <div className="detail-item" data-testid="days-elapsed">
        <span className="detail-value season-heading">{daysElapsed}</span>
        <span className="detail-label season-body">Days in</span>
      </div>
      <div className="detail-item" data-testid="days-remaining">
        <span className="detail-value season-heading">{daysRemaining}</span>
        <span className="detail-label season-body">Days left</span>
      </div>
      <div className="detail-item" data-testid="total-days">
        <span className="detail-value season-heading">{totalDays}</span>
        <span className="detail-label season-body">Total days</span>
      </div>
    </motion.div>
  );
}

export default SeasonDetails;
