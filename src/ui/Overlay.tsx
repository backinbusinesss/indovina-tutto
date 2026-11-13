'use client'

import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '@/lib/cx'

interface OverlayProps {
  open: boolean
  title?: string
  /** se manca, la finestra non si chiude con Esc né toccando fuori */
  onClose?: () => void
  children: ReactNode
  className?: string
  /** livello di sovrapposizione (il negozio si apre sopra "Salva la streak") */
  z?: number
}

function useEscape(open: boolean, onClose?: () => void) {
  useEffect(() => {
    if (!open || !onClose) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
}

function useAutofocus(open: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (open) ref.current?.focus()
  }, [open])
  return ref
}

function Portal({ children }: { children: ReactNode }) {
  if (typeof document === 'undefined') return null
  return createPortal(children, document.body)
}

/** Finestra al centro dello schermo. */
export function Modal({ open, title, onClose, children, className, z = 50 }: OverlayProps) {
  const titleId = useId()
  const ref = useAutofocus(open)
  useEscape(open, onClose)
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: z }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#05071a]/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <motion.div
              ref={ref}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              className={cx('card relative w-full max-w-sm p-6 outline-none', className)}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              {title && (
                <h2 id={titleId} className="sr-only">
                  {title}
                </h2>
              )}
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}

/** Pannello che sale dal basso. */
export function Sheet({ open, title, onClose, children, className, z = 60 }: OverlayProps) {
  const titleId = useId()
  const ref = useAutofocus(open)
  useEscape(open, onClose)
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-end justify-center"
            style={{ zIndex: z }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#05071a]/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <motion.div
              ref={ref}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              className={cx(
                'relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-line bg-bg px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-card outline-none',
                className,
              )}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-line-strong" aria-hidden="true" />
              {title && (
                <h2 id={titleId} className="mb-3 text-center text-xl font-extrabold">
                  {title}
                </h2>
              )}
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
