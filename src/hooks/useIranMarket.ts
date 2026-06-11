import { useState, useEffect, useRef } from 'react'
import { fetchIranMarket, type IranMarketData } from '../api/brsapi'
import { fetchTgjuMarket } from '../api/tgju'
import { SLOW_REFRESH_MS } from '../constants/market'

export function useIranMarket() {
  const [iranMarket, setIranMarket] = useState<IranMarketData | null>(null)
  const [iranMarketLoading, setLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const load = async () => {
      try {
        // Fetch BRS (primary) and TGJU (secondary) in parallel
        const [brs, tgju] = await Promise.allSettled([
          fetchIranMarket(),
          fetchTgjuMarket(),
        ])

        if (!isMounted.current) return

        if (brs.status === 'fulfilled') {
          const base = brs.value
          // Fill any nulls in BRS data with TGJU values
          if (tgju.status === 'fulfilled' && tgju.value) {
            const t = tgju.value
            const merged: IranMarketData = {
              usdToToman:       base.usdToToman       ?? t.usdToToman       ?? null,
              eurToToman:       base.eurToToman       ?? t.eurToToman       ?? null,
              gbpToToman:       base.gbpToToman       ?? t.gbpToToman       ?? null,
              aedToToman:       base.aedToToman       ?? t.aedToToman       ?? null,
              gold18PerGram:    base.gold18PerGram    ?? t.gold18PerGram    ?? null,
              gold24PerGram:    base.gold24PerGram    ?? t.gold24PerGram    ?? null,
              goldMeltedPerGram:base.goldMeltedPerGram?? t.goldMeltedPerGram?? null,
              goldMithqal:      base.goldMithqal      ?? t.goldMithqal      ?? null,
              sekkeTama:        base.sekkeTama        ?? t.sekkeTama        ?? null,
              sekkeNim:         base.sekkeNim         ?? t.sekkeNim         ?? null,
              sekkeRob:         base.sekkeRob         ?? t.sekkeRob         ?? null,
              sekkeGerami:      base.sekkeGerami      ?? t.sekkeGerami      ?? null,
              sekkeEmami:       base.sekkeEmami       ?? t.sekkeEmami       ?? null,
              cryptoToman:      base.cryptoToman,
              lastUpdate:       base.lastUpdate,
            }
            setIranMarket(merged)
          } else {
            setIranMarket(base)
          }
        } else if (tgju.status === 'fulfilled' && tgju.value) {
          // BRS failed but TGJU worked — use TGJU data with empty cryptoToman
          setIranMarket({
            usdToToman: null, eurToToman: null, gbpToToman: null, aedToToman: null,
            gold18PerGram: null, gold24PerGram: null, goldMeltedPerGram: null, goldMithqal: null,
            sekkeTama: null, sekkeNim: null, sekkeRob: null, sekkeGerami: null, sekkeEmami: null,
            cryptoToman: {},
            ...tgju.value,
            lastUpdate: new Date(),
          })
        }
      } catch { /* silently ignore — all APIs are Iran-IP restricted */ }
      finally {
        if (isMounted.current) setLoading(false)
      }
    }

    load()
    const interval = setInterval(() => {
      if (!document.hidden) load()
    }, SLOW_REFRESH_MS)

    return () => {
      isMounted.current = false
      clearInterval(interval)
    }
  }, [])

  return { iranMarket, iranMarketLoading }
}
