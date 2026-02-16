
import React from 'react';

export const TRFlag = ({ className = "w-6 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 800"
    className={className}
    role="img"
    aria-label="Turkey Flag"
    preserveAspectRatio="none"
  >
    <rect width="1200" height="800" fill="#E30A17" />
    <circle cx="444" cy="400" r="240" fill="#ffffff" />
    <circle cx="480" cy="400" r="192" fill="#E30A17" />
    <polygon
      fill="#ffffff"
      transform="translate(688,400) rotate(-18)"
      points="0,-120 28,-38 114,-38 44,12 70,96 0,46 -70,96 -44,12 -114,-38 -28,-38"
    />
  </svg>
);

export const UKFlag = ({ className = "w-6 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 30"
    className={className}
    role="img"
    aria-label="United Kingdom Flag"
    preserveAspectRatio="none"
  >
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#t)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);
