import React from 'react';

function HemisphereToggle({ hemisphere, onChange }) {
  return (
    <div className="hemisphere-control" data-testid="hemisphere-toggle">
      <span className="hemisphere-label season-body">Hemisphere</span>
      <div className="hemisphere-toggle-group">
        <div className={`hemisphere-slider ${hemisphere}`} />
        <button
          className={`hemisphere-btn ${hemisphere === 'north' ? 'active' : ''}`}
          onClick={() => onChange('north')}
          data-testid="hemisphere-north-btn"
        >
          Northern
        </button>
        <button
          className={`hemisphere-btn ${hemisphere === 'south' ? 'active' : ''}`}
          onClick={() => onChange('south')}
          data-testid="hemisphere-south-btn"
        >
          Southern
        </button>
      </div>
    </div>
  );
}

export default HemisphereToggle;
