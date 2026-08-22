import React from 'react';

interface BrandLogoProps {
  size?: number | string;
  className?: string;
  variant?: 'blue' | 'orange' | 'gradient';
  letter?: string;
}

/**
 * BrandLogo component modeled after the custom shield badge with speech bubble accents
 * and high-contrast lettermark ('S' for SamTeck Digital).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 36,
  className = '',
  variant = 'blue',
  letter = 'R',
}) => {
  const getFill = () => {
    switch (variant) {
      case 'orange':
        return '#FF6A00';
      case 'gradient':
        return 'url(#brand-logo-grad)';
      case 'blue':
      default:
        return '#0057FF';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label={`${letter} - SamTeck Digital Logo`}
    >
      <defs>
        <linearGradient id="brand-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0057FF" />
          <stop offset="100%" stopColor="#0045D8" />
        </linearGradient>
        <filter id="logo-drop-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Shield Body */}
      <path
        d="M50 3
           C53 3, 89 17, 91 21
           C93 25, 93 69, 91 75
           C88 81, 53 97, 50 97
           C47 97, 12 81, 9 75
           C7 69, 7 25, 9 21
           C11 17, 47 3, 50 3 Z"
        fill={getFill()}
        filter="url(#logo-drop-shadow)"
      />

      {/* Center Letter R in Bold Display Typography */}
      <text
        x="49"
        y="69"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="'Montserrat', system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="57"
        letterSpacing="-0.03em"
      >
        {letter}
      </text>

      {/* Top-Right Speech Bubble with 2 dots */}
      <g transform="translate(64, 15)">
        <path
          d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C10.5 22 9.1 21.7 7.8 21.1L3 23L4.4 18.5C3.5 16.7 3 14.4 3 12C3 6.5 7.5 2 12 2Z"
          fill="#0057FF"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="9.5" cy="11.5" r="1.5" fill="#FFFFFF" />
        <circle cx="14.5" cy="11.5" r="1.5" fill="#FFFFFF" />
      </g>

      {/* Bottom-Left Speech Bubble with 3 dots */}
      <g transform="translate(14, 62)">
        <path
          d="M14 2C20.5 2 26 7 26 13C26 19 20.5 24 14 24C12 24 10.1 23.5 8.5 22.6L2 25L3.8 19.8C2.7 17.8 2 15.5 2 13C2 7 7.5 2 14 2Z"
          fill="#0057FF"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="12.5" r="1.4" fill="#FFFFFF" />
        <circle cx="14" cy="12.5" r="1.4" fill="#FFFFFF" />
        <circle cx="19" cy="12.5" r="1.4" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
