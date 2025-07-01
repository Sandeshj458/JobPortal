import React from 'react';

const CircularCountdown = ({ duration, timeLeft }) => {
  const radius = 24;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (timeLeft / duration) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="absolute top-0 left-0"
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={timeLeft <= 10 ? '#f87171' : '#3b82f6'}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute text-xs font-medium text-gray-700">
        {timeLeft}s
      </span>
    </div>
  );
};

export default CircularCountdown;
