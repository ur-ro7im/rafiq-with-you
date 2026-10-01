const TICKS = Array.from({ length: 36 }, (_, i) => i * 10);

export default function Compass({ bearing, heading }) {
  const dialAngle = heading == null ? 0 : -heading;

  return (
    <svg
      className="compass"
      viewBox="0 0 200 200"
      role="img"
      aria-label={`اتجاه القبلة ${Math.round(bearing)} درجة`}
    >
      <circle cx="100" cy="100" r="94" className="compass-ring" />
      <g transform={`rotate(${dialAngle} 100 100)`} className="compass-dial">
        {TICKS.map((deg) => (
          <line
            key={deg}
            x1="100"
            y1="10"
            x2="100"
            y2={deg % 90 === 0 ? 24 : 17}
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
        <text x="100" y="42" textAnchor="middle" className="compass-n">
          N
        </text>
        <g transform={`rotate(${bearing} 100 100)`}>
          <path
            d="M100 30 L110 100 L100 92 L90 100 Z"
            className="compass-needle"
          />
          <circle cx="100" cy="24" r="5" className="compass-kaaba" />
        </g>
      </g>
      <circle cx="100" cy="100" r="5" className="compass-pin" />
    </svg>
  );
}
