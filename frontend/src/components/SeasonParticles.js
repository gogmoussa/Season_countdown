import React, { useMemo } from 'react';

const PARTICLE_CONFIGS = {
  winter: { count: 35, char: '\u2022', minSize: 3, maxSize: 8, speed: [15, 30], opacity: [0.15, 0.4], drift: 40 },
  autumn: { count: 18, char: '\u2767', minSize: 10, maxSize: 20, speed: [12, 25], opacity: [0.12, 0.3], drift: 60 },
  spring: { count: 22, char: '\u2740', minSize: 8, maxSize: 16, speed: [10, 22], opacity: [0.1, 0.25], drift: 50 },
  summer: { count: 15, char: '\u2022', minSize: 3, maxSize: 6, speed: [20, 40], opacity: [0.08, 0.2], drift: 20 },
};

function SeasonParticles({ season }) {
  const config = PARTICLE_CONFIGS[season] || PARTICLE_CONFIGS.winter;

  const particles = useMemo(() => {
    return Array.from({ length: config.count }, (_, i) => {
      const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
      const opacity = config.opacity[0] + Math.random() * (config.opacity[1] - config.opacity[0]);
      const drift = (Math.random() - 0.5) * config.drift;
      return { id: i, size, left, delay, duration, opacity, drift };
    });
  }, [season, config]);

  return (
    <div className="particles-container" data-testid="season-particles" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            '--left': `${p.left}%`,
            '--size': `${p.size}px`,
            '--delay': `${p.delay}s`,
            '--duration': `${p.duration}s`,
            '--opacity': p.opacity,
            '--drift': `${p.drift}px`,
            fontSize: `${p.size}px`,
            color: 'var(--particle)',
          }}
        >
          {config.char}
        </span>
      ))}
    </div>
  );
}

export default SeasonParticles;
