import React from 'react';
import { motion } from 'framer-motion';

function SeasonDetails({ daysElapsed, daysRemaining, totalDays }) {
  const items = [
    { value: daysElapsed, label: 'Days in', testId: 'days-elapsed' },
    { value: daysRemaining, label: 'Days left', testId: 'days-remaining' },
    { value: totalDays, label: 'Total', testId: 'total-days' },
  ];

  return (
    <motion.div
      className="details-row"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      data-testid="season-details"
    >
      {items.map((item, i) => (
        <React.Fragment key={item.testId}>
          <div className="detail-item" data-testid={item.testId}>
            <motion.span
              className="detail-value serif"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              {item.value}
            </motion.span>
            <span className="detail-label sans">{item.label}</span>
          </div>
          {i < items.length - 1 && <div className="detail-divider" />}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

export default SeasonDetails;
