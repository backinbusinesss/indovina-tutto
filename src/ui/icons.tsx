import { useId } from 'react'

export function GemIcon({ className = 'size-5' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset="0.55" stopColor="#FFC83D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path d="M6.2 3.5h11.6l4 5.6L12 20.8 2.2 9.1z" fill={`url(#${id})`} stroke="#B97800" strokeWidth="0.8" strokeLinejoin="round" />
      <path
        d="M2.4 9.1h19.2M8.6 3.6 12 9.1l3.4-5.5M12 9.1v11.5M7.3 9.1 12 20.6l4.7-11.5"
        fill="none"
        stroke="#FFF6D8"
        strokeOpacity="0.75"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FlameIcon({ className = 'size-5', lit = true }: { className?: string; lit?: boolean }) {
  const id = useId()
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={lit ? '#FF3D2E' : '#5A6090'} />
          <stop offset="0.6" stopColor={lit ? '#FF7A1A' : '#7A80B0'} />
          <stop offset="1" stopColor={lit ? '#FFC83D' : '#A3A9D1'} />
        </linearGradient>
      </defs>
      <path
        d="M12 22c-4.4 0-7.5-3-7.5-7.2 0-3.1 1.8-5.4 3.5-7.3.9-1 1.9-2.1 2.3-3.6.1-.5.7-.7 1.1-.3 2 1.9 3.1 4 3.3 6 .7-.6 1.2-1.4 1.4-2.3.1-.5.8-.7 1.1-.2 1.6 2.1 2.3 4.6 2.3 7.6C19.5 19 16.4 22 12 22Z"
        fill={`url(#${id})`}
      />
      <path d="M12 21c-2 0-3.4-1.4-3.4-3.3 0-1.8 1.3-2.9 2.3-4 .4-.5 1-.4 1.3.1.5.9 1.4 1.4 2 2.3.5.6.8 1.2.8 1.9C15 19.6 13.8 21 12 21Z" fill={lit ? '#FFE9A8' : '#C5C9E6'} opacity="0.9" />
    </svg>
  )
}
