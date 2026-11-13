import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { AdsProvider, type AdModalProps, useAds } from '@/providers/ads'
import { type CheckoutProps, PaymentsProvider, usePayments } from '@/providers/payments'
import { useProfile } from '@/store/profile'

beforeEach(() => useProfile.getState().reset())

function FakeAd({ placement, onDone }: AdModalProps) {
  return (
    <div>
      <span>video {placement}</span>
      <button onClick={() => onDone('rewarded')}>fine video</button>
      <button onClick={() => onDone('dismissed')}>chiudi</button>
    </div>
  )
}

function FakeCheckout({ pack, onDone }: CheckoutProps) {
  return (
    <div>
      <span>acquisto {pack.gems}</span>
      <button onClick={() => onDone('success')}>conferma</button>
      <button onClick={() => onDone('cancelled')}>annulla</button>
    </div>
  )
}

describe('presa dei video', () => {
  it('showRewarded apre il video e restituisce come è andata', async () => {
    let result: string | undefined
    function Caller() {
      const ads = useAds()
      return <button onClick={async () => (result = await ads.showRewarded('save-streak'))}>apri</button>
    }
    render(
      <AdsProvider Modal={FakeAd}>
        <Caller />
      </AdsProvider>,
    )
    await userEvent.click(screen.getByText('apri'))
    expect(screen.getByText('video save-streak')).toBeInTheDocument()
    await userEvent.click(screen.getByText('fine video'))
    await act(async () => {})
    expect(result).toBe('rewarded')
    expect(screen.queryByText('video save-streak')).not.toBeInTheDocument()
  })
})

describe('presa dei pagamenti', () => {
  it('un acquisto riuscito aggiunge le gemme del pacchetto', async () => {
    let result: string | undefined
    function Caller() {
      const pay = usePayments()
      return <button onClick={async () => (result = await pay.purchase('p650'))}>compra</button>
    }
    render(
      <PaymentsProvider Checkout={FakeCheckout}>
        <Caller />
      </PaymentsProvider>,
    )
    await userEvent.click(screen.getByText('compra'))
    expect(screen.getByText('acquisto 650')).toBeInTheDocument()
    await userEvent.click(screen.getByText('conferma'))
    await act(async () => {})
    expect(result).toBe('success')
    expect(useProfile.getState().gems).toBe(50 + 650)
  })

  it('un acquisto annullato non aggiunge niente', async () => {
    function Caller() {
      const pay = usePayments()
      return <button onClick={() => pay.purchase('p120')}>compra</button>
    }
    render(
      <PaymentsProvider Checkout={FakeCheckout}>
        <Caller />
      </PaymentsProvider>,
    )
    await userEvent.click(screen.getByText('compra'))
    await userEvent.click(screen.getByText('annulla'))
    expect(useProfile.getState().gems).toBe(50)
  })
})
