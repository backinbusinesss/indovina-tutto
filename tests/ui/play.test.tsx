import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Question } from '@/engine/types'
import { AnswerGrid } from '@/ui/play/AnswerGrid'
import { SaveStreakModal } from '@/ui/play/SaveStreakModal'

afterEach(() => vi.useRealTimers())

const q: Question = {
  defId: 'capitali:of:IT',
  category: 'capitali',
  difficulty: 1,
  prompt: "Qual è la capitale dell'Italia?",
  options: [
    { id: 'a', label: 'Milano' },
    { id: 'b', label: 'Roma' },
    { id: 'c', label: 'Napoli' },
    { id: 'd', label: 'Torino' },
  ],
  correct: 'b',
  layout: 'text',
}

const base = {
  open: true,
  streak: 12,
  cost: 10,
  canVideo: true,
  gems: 100,
  paused: false,
  onVideo: vi.fn(),
  onGems: vi.fn(),
  onDecline: vi.fn(),
}

describe('SaveStreakModal', () => {
  it('mostra il costo del salvataggio', () => {
    render(<SaveStreakModal {...base} cost={20} />)
    expect(screen.getByRole('button', { name: /usa 20 gemme/i })).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('il video è disattivato se già usato', () => {
    render(<SaveStreakModal {...base} canVideo={false} />)
    expect(screen.getByRole('button', { name: /video/i })).toBeDisabled()
  })

  it('dopo 10 secondi lascia perdere da solo', () => {
    vi.useFakeTimers()
    const onDecline = vi.fn()
    render(<SaveStreakModal {...base} onDecline={onDecline} />)
    act(() => vi.advanceTimersByTime(9_000))
    expect(onDecline).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1_500))
    expect(onDecline).toHaveBeenCalledTimes(1)
  })

  it('in pausa (negozio o video aperti) non scade', () => {
    vi.useFakeTimers()
    const onDecline = vi.fn()
    render(<SaveStreakModal {...base} paused onDecline={onDecline} />)
    act(() => vi.advanceTimersByTime(30_000))
    expect(onDecline).not.toHaveBeenCalled()
  })

  it('i pulsanti chiamano le azioni giuste', () => {
    const onVideo = vi.fn()
    const onGems = vi.fn()
    const onDecline = vi.fn()
    render(<SaveStreakModal {...base} onVideo={onVideo} onGems={onGems} onDecline={onDecline} />)
    fireEvent.click(screen.getByRole('button', { name: /video/i }))
    fireEvent.click(screen.getByRole('button', { name: /usa 10 gemme/i }))
    fireEvent.click(screen.getByRole('button', { name: /lascia perdere/i }))
    expect(onVideo).toHaveBeenCalledTimes(1)
    expect(onGems).toHaveBeenCalledTimes(1)
    expect(onDecline).toHaveBeenCalledTimes(1)
  })
})

describe('AnswerGrid', () => {
  it('il tasto 2 sceglie la risposta B', () => {
    const onAnswer = vi.fn()
    render(<AnswerGrid question={q} hidden={[]} chosen={null} revealed={false} onAnswer={onAnswer} />)
    fireEvent.keyDown(window, { key: '2' })
    expect(onAnswer).toHaveBeenCalledWith('b')
  })

  it('due tocchi rapidi contano una volta sola', () => {
    const onAnswer = vi.fn()
    render(<AnswerGrid question={q} hidden={[]} chosen={null} revealed={false} onAnswer={onAnswer} />)
    fireEvent.click(screen.getByRole('button', { name: /milano/i }))
    fireEvent.click(screen.getByRole('button', { name: /roma/i }))
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith('a')
  })

  it('le risposte nascoste dal 50/50 non si possono scegliere', () => {
    const onAnswer = vi.fn()
    render(<AnswerGrid question={q} hidden={['a', 'c']} chosen={null} revealed={false} onAnswer={onAnswer} />)
    expect(screen.queryByRole('button', { name: /milano/i })).toBeNull()
    fireEvent.keyDown(window, { key: '1' })
    expect(onAnswer).not.toHaveBeenCalled()
  })
})
