const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

export const formatPrice = (cents: number) => eur.format(cents / 100)
