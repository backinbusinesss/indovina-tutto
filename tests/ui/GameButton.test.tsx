import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GameButton } from '@/ui/GameButton'

describe('GameButton', () => {
  it('chiama onClick quando è attivo', async () => {
    const onClick = vi.fn()
    render(<GameButton onClick={onClick}>Gioca</GameButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Gioca' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disabilitato non chiama onClick', async () => {
    const onClick = vi.fn()
    render(
      <GameButton onClick={onClick} disabled>
        Gioca
      </GameButton>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Gioca' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
