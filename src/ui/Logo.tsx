import { useId } from 'react'
import { cx } from '@/lib/cx'

/** Il simbolo dell'app: un punto interrogativo dorato su un globo. */
export function LogoMark({ className = 'size-9' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B6CFF" />
          <stop offset="1" stopColor="#4B2FD6" />
        </linearGradient>
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE08A" />
          <stop offset="1" stopColor="#FFB21A" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill={`url(#${id}bg)`} />
      <g fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="10">
        <circle cx="256" cy="256" r="150" />
        <ellipse cx="256" cy="256" rx="62" ry="150" />
        <path d="M110 206h292M110 306h292" />
      </g>
      <path
        d="M206 210a50 50 0 1 1 74 44c-16 9-24 19-24 36v14"
        fill="none"
        stroke={`url(#${id}gold)`}
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="256" cy="354" r="22" fill={`url(#${id}gold)`} />
    </svg>
  )
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <LogoMark className="size-9 drop-shadow-[0_4px_12px_rgba(124,92,255,0.45)]" />
      {!compact && (
        <span className="font-display text-lg leading-none font-extrabold">
          Indovina<span className="text-primary-2"> Tutto</span>
        </span>
      )}
    </span>
  )
}
