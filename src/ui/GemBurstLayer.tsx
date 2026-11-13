'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { play } from '@/lib/sound'
import { type Burst, centerOf, useFx } from '@/store/fx'
import { GemIcon } from './icons'

function BurstView({ burst }: { burst: Burst }) {
  const done = useFx((s) => s.done)
  const reduce = useReducedMotion()
  const target = useMemo(() => {
    const el = typeof document !== 'undefined' ? document.getElementById('gem-counter') : null
    return el ? centerOf(el) : { x: window.innerWidth - 40, y: 28 }
  }, [])
  const gems = useMemo(
    () =>
      Array.from({ length: burst.count }, (_, i) => ({
        i,
        dx: (Math.random() - 0.5) * 120,
        dy: (Math.random() - 0.5) * 90 - 30,
      })),
    [burst.count],
  )

  useEffect(() => {
    if (!reduce) return
    play('gem')
    const t = setTimeout(() => done(burst.id), 50)
    return () => clearTimeout(t)
  }, [reduce, burst.id, done])

  if (reduce) return null
  return (
    <>
      {gems.map(({ i, dx, dy }) => (
        <motion.div
          key={i}
          className="pointer-events-none fixed top-0 left-0 z-[100]"
          initial={{ x: burst.x - 12, y: burst.y - 12, scale: 0.4, opacity: 0 }}
          animate={{
            x: [burst.x - 12, burst.x - 12 + dx, target.x - 12],
            y: [burst.y - 12, burst.y - 12 + dy, target.y - 12],
            scale: [0.4, 1.2, 0.6],
            opacity: [0, 1, 1],
          }}
          transition={{ duration: 0.9, delay: i * 0.06, ease: [0.2, 0.8, 0.3, 1], times: [0, 0.35, 1] }}
          onAnimationComplete={() => {
            if (i === 0) play('gem')
            if (i === gems.length - 1) done(burst.id)
          }}
        >
          <GemIcon className="size-6 drop-shadow-[0_2px_8px_rgba(255,200,61,0.7)]" />
        </motion.div>
      ))}
    </>
  )
}

/** Livello sopra tutto dove volano le gemme guadagnate. */
export function GemBurstLayer() {
  const bursts = useFx((s) => s.bursts)
  if (typeof document === 'undefined') return null
  return createPortal(
    <>
      {bursts.map((b) => (
        <BurstView key={b.id} burst={b} />
      ))}
    </>,
    document.body,
  )
}
