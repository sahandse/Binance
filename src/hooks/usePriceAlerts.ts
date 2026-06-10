import { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { PriceAlert, CryptoPrice } from '../types'

export function usePriceAlerts(cryptos: CryptoPrice[]) {
  const [alerts, setAlerts] = useLocalStorage<PriceAlert[]>('bazaar-alerts', [])
  const [triggered, setTriggered] = useState<PriceAlert[]>([])
  const checkedRef = useRef<Set<string>>(new Set())

  const add = (alert: Omit<PriceAlert, 'id' | 'triggered'>) => {
    setAlerts([...alerts, { ...alert, id: Date.now().toString(36), triggered: false }])
  }

  const remove = (id: string) => setAlerts(alerts.filter(a => a.id !== id))

  const clearTriggered = () => setTriggered([])

  useEffect(() => {
    if (cryptos.length === 0) return
    const nowTriggered: PriceAlert[] = []
    const updated = alerts.map(alert => {
      if (alert.triggered || checkedRef.current.has(alert.id)) return alert
      const crypto = cryptos.find(c => c.symbol === alert.symbol)
      if (!crypto) return alert
      const hit = alert.direction === 'above'
        ? crypto.price >= alert.targetPrice
        : crypto.price <= alert.targetPrice
      if (hit) {
        checkedRef.current.add(alert.id)
        nowTriggered.push({ ...alert, triggered: true })
        return { ...alert, triggered: true }
      }
      return alert
    })
    if (nowTriggered.length > 0) {
      setAlerts(updated)
      setTriggered(prev => [...prev, ...nowTriggered])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cryptos])

  return { alerts, add, remove, triggered, clearTriggered }
}
