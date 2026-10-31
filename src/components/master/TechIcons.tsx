import React from "react";

export interface TechIconProps {
  className?: string;
  size?: number;
}

export const TechIcons = {
  react: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor" className={className}>
      <circle cx="0" cy="0" r="2.05" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),

  nextjs: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 180 180" fill="none" className={className}>
      <mask id="next-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180" style={{ maskType: "alpha" }}>
        <circle cx="90" cy="90" r="90" fill="currentColor" />
      </mask>
      <g mask="url(#next-mask)">
        <circle cx="90" cy="90" r="90" fill="currentColor" fillOpacity="0.15" />
        <path d="M149.508 157.143L69.8778 54H54V125.977H66.213V69.5714L137.287 161.429C141.56 160.208 145.666 158.761 149.508 157.143Z" fill="currentColor" />
        <rect x="115" y="54" width="12" height="72" fill="currentColor" />
      </g>
    </svg>
  ),

  typescript: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="currentColor" className={className}>
      <rect width="128" height="128" rx="20" fill="currentColor" fillOpacity="0.15" />
      <path d="M1.5 64C1.5 29.5 29.5 1.5 64 1.5S126.5 29.5 126.5 64 98.5 126.5 64 126.5 1.5 98.5 1.5 64z" fill="none" />
      <path d="M60.8 75.8h11.9v35.7H60.8V75.8zm-22.1 0h11.9v35.7H38.7V75.8zm11.9-8.4H38.7V56.2h34v11.2H50.6zm47 44.1c-4.4 0-8.2-.9-11.4-2.8-3.2-1.8-5.6-4.5-7.3-8l10-5.8c2.1 4.5 5.2 6.7 9.4 6.7 2.1 0 3.8-.5 5-1.5 1.2-1 1.8-2.2 1.8-3.7 0-1.2-.4-2.2-1.3-3-.9-.8-2.5-1.6-4.9-2.3l-5.7-1.8c-4.2-1.3-7.3-3.1-9.3-5.4-2-2.3-3-5.2-3-8.8 0-4.6 1.7-8.3 5.1-11.2 3.4-2.9 8-4.3 13.7-4.3 4.2 0 7.9.9 11.2 2.6 3.2 1.7 5.6 4.1 7.1 7.2l-9.6 6c-1.8-3.4-4.6-5.1-8.3-5.1-2 0-3.6.5-4.8 1.4-1.2.9-1.8 2.1-1.8 3.5 0 1.2.4 2.2 1.2 2.9.8.7 2.3 1.5 4.6 2.2l5.8 1.8c4.6 1.5 8 3.4 10.1 5.8 2.1 2.4 3.2 5.5 3.2 9.4 0 4.6-1.7 8.3-5.2 11.1-3.3 2.8-7.9 4.3-13.7 4.3z" fill="currentColor" />
    </svg>
  ),

  javascript: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="currentColor" className={className}>
      <rect width="128" height="128" rx="20" fill="currentColor" fillOpacity="0.15" />
      <path d="M67.3 102.7c2.1 3.4 5.3 5.4 9.5 5.4 4.5 0 7.4-2.3 7.4-8.7V56.2h15.4v43.5c0 14.7-8.6 21.3-22.1 21.3-12.2 0-19.4-6.4-23.1-14.7l12.9-3.6zm44.3-3.6c3.2 5.2 7.7 8.9 14.7 8.9 6.2 0 10.2-3.1 10.2-7.4 0-5.1-4.1-6.9-10.9-9.9l-3.8-1.6c-10.9-4.7-18.1-10.6-18.1-23 0-11.4 8.8-20.1 22.4-20.1 9.8 0 16.8 3.4 21.7 12.1l-11.9 7.7c-2.6-4.6-5.4-6.4-9.8-6.4-4.5 0-7.3 2.8-7.3 6.4 0 4.4 2.9 6.2 9.6 9.1l3.7 1.6c12.8 5.5 19.6 11.2 19.6 23.8 0 13.6-10.6 21.2-24.9 21.2-14 0-22.9-6.7-27.1-16.8l11.9-6.6z" fill="currentColor" />
    </svg>
  ),

  python: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="currentColor" className={className}>
      <path d="M63.7 5.1c-14.7 0-23.8 6.4-23.8 18.7v13.7h47.6v4.6H29.1C13.8 42.1 0 54.4 0 72.8c0 18.2 12.6 28.6 27.6 28.6h8.8v-12.7c0-12.7 10.8-23.9 23.8-23.9h47.6V51.1c0-12.9-10.8-24.1-23.8-24.1H60.2V18.8c0-8.2 6.4-13.7 14.7-13.7h13.7V0H63.7v5.1zm-10.8 11.2c2.8 0 5.1 2.3 5.1 5.1 0 2.8-2.3 5.1-5.1 5.1-2.8 0-5.1-2.3-5.1-5.1 0-2.8 2.3-5.1 5.1-5.1zm11.4 106.6c14.7 0 23.8-6.4 23.8-18.7V100.5H40.5v-4.6h58.4c15.3 0 29.1-12.3 29.1-30.7 0-18.2-12.6-28.6-27.6-28.6h-8.8v12.7c0 12.7-10.8 23.9-23.8 23.9H20.2v13.7c0 12.9 10.8 24.1 23.8 24.1h23.8v8.2c0 8.2-6.4 13.7-14.7 13.7H39.4v5.1h24.9v-4.6zm10.8-11.2c-2.8 0-5.1-2.3-5.1-5.1 0-2.8 2.3-5.1 5.1-5.1 2.8 0 5.1 2.3 5.1 5.1 0 2.8-2.3 5.1-5.1 5.1z" fill="currentColor" />
    </svg>
  ),

  cpp: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="currentColor" className={className}>
      <path d="M64 12C35.3 12 12 35.3 12 64s23.3 52 52 52c19.6 0 36.7-10.8 45.7-26.8l-15.6-9C88.2 90.7 77 98 64 98c-18.8 0-34-15.2-34-34s15.2-34 34-34c13 0 24.2 7.3 30.1 18l15.6-9C100.7 22.8 83.6 12 64 12zm32 46v12h12v-12h-12zm-6 3h6v6h-6v-6zm32-3v12h12v-12h-12zm-6 3h6v6h-6v-6z" fill="currentColor" />
    </svg>
  ),

  tailwind: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
    </svg>
  ),

  gsap: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),

  framer: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
    </svg>
  ),

  threejs: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M12 2L2 19.5h20L12 2z" />
      <path d="M12 2v17.5" />
      <path d="M2 19.5l10-8.5 10 8.5" />
    </svg>
  ),

  html5: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm17.6 5.5H4.9l.4 4.5h13.4l-.5 5.5-3.8 1-3.8-1-.2-2.3H8.1l.4 4.3 3.5 1 3.5-1 1-11H4.5" />
    </svg>
  ),

  css3: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm16.5 4.5H6l.3 3.5h10.4l-.4 3.5H6.6l.3 3.5h9l-.5 4.5-3.4.9-3.4-.9-.2-2H6.1l.4 3.8 5.5 1.5 5.5-1.5 1.5-14.3z" />
    </svg>
  ),

  git: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  ),

  docker: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185M23.79 10.98c-.145-.098-.55-.26-1.156-.26-.35 0-.74.053-1.147.163-.197-1.782-1.464-3.14-3.037-3.14-.14 0-.276.012-.41.037-.417-.67-1.15-1.11-1.99-1.11h-1.57v4.71h5.885c.34 0 .65.13.88.35.24.23.37.54.37.88 0 .68-.55 1.23-1.23 1.23H1.47c-.24 0-.47-.1-.64-.27-.17-.17-.27-.4-.27-.64 0-.43.14-.83.41-1.16C.38 12.5.01 13.52 0 14.65c0 4.96 4.67 8.98 10.42 8.98 4.7 0 8.7-2.67 9.94-6.38 1.94-.09 3.63-1.17 3.63-3.06 0-1.54-.76-2.7-2.2-3.21" />
    </svg>
  ),

  aws: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.8 17.5c-2.4 1.8-5.8 2.7-8.8 2.7-4.2 0-8-1.5-10.9-4-.2-.2 0-.5.3-.4 3.1 1.7 6.9 2.7 10.8 2.7 2.7 0 5.7-.7 8.4-2.1.4-.3.7.2.2.6v.5zM19.9 16c-.3-.4-2-.2-3.1 0-.3 0-.4-.2-.1-.4 1.8-1.2 4.7-1 5 0 .2 1.1-1.6 3.4-3.5 4.9-.3.2-.5.1-.3-.2.9-.8 2.2-3.5 2-4.3z" />
      <path d="M12.9 6.4c-.6-.7-1.5-1.1-2.6-1.1-2 0-3.3 1.4-3.3 3.6 0 2.2 1.3 3.6 3.3 3.6 1.1 0 2-.4 2.6-1.1v.9h1.7V5.5h-1.7v.9zm-2.4 4.8c-1.3 0-2.1-1-2.1-2.3 0-1.3.8-2.3 2.1-2.3 1.3 0 2.1 1 2.1 2.3 0 1.3-.8 2.3-2.1 2.3z" />
    </svg>
  ),

  aiml: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
      <path d="M12 22a4 4 0 0 1-4-4c0-1.95 1.4-3.58 3.25-3.93" />
      <path d="M2 12a4 4 0 0 1 4-4c1.95 0 3.58 1.4 3.93 3.25" />
      <path d="M22 12a4 4 0 0 1-4 4c-1.95 0-3.58-1.4-3.93-3.25" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="6" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="18" />
      <line x1="6" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="18" y2="12" />
    </svg>
  ),

  i18n: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),

  seo: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <polyline points="8 11 10 13 14 9" />
    </svg>
  ),

  node: ({ size = 32, className = "" }: TechIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2zm0 2.3L4.7 8.5v7l7.3 4.2 7.3-4.2v-7L12 4.3z" />
    </svg>
  ),
};
