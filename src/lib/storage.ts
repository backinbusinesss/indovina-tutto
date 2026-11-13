export interface SafeStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const memory = new Map<string, string>()

function local(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

/**
 * localStorage protetto: se il browser blocca il salvataggio (navigazione
 * privata, webview senza storage) i dati restano in memoria e il gioco va avanti.
 */
export const safeStorage: SafeStorage = {
  getItem(key) {
    if (memory.has(key)) return memory.get(key) ?? null
    try {
      return local()?.getItem(key) ?? null
    } catch {
      return null
    }
  },
  setItem(key, value) {
    memory.set(key, value)
    try {
      local()?.setItem(key, value)
    } catch {
      /* resta in memoria */
    }
  },
  removeItem(key) {
    memory.delete(key)
    try {
      local()?.removeItem(key)
    } catch {
      /* niente da fare */
    }
  },
}
