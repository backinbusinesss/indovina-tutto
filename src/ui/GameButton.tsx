'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cx } from '@/lib/cx'

export type GameButtonVariant = 'primary' | 'secondary' | 'gem' | 'ok' | 'ghost'
export type GameButtonSize = 'sm' | 'md' | 'lg'

const SIZE: Record<GameButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-base',
  lg: 'h-14 px-6 text-lg',
}

export interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GameButtonVariant
  size?: GameButtonSize
  block?: boolean
}

/** Pulsante "da gioco": ha uno spessore sotto che sparisce quando lo premi. */
export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(function GameButton(
  { variant = 'primary', size = 'md', block, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('btn-game', `btn-${variant}`, SIZE[size], block && 'w-full', className)}
      {...props}
    />
  )
})
