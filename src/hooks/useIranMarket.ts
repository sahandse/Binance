import { useState, useEffect, useRef } from 'react'
import { fetchIranMarket, type IranMarketData } from '../api/brsapi'
import { fetchTgjuMarket } from '../api/tgju'
import { fetchIranianCryptoPrices } from '../api/nobitex'
import { SLOW_REFRESH_MS } from '../constants/market'

export function useIranMarket() {
  const [iranMarket, setIranMarket] = useState<IranMarketData | null>(null)
  const [iranMarketLoading, setLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const load = async () => {
      try {
        // Fetch BRS (primary), TGJU (secondary), and Nobitex crypto prices in parallel
        const [brs, tgju, nobitex] = await Promise.allSettled([
          fetchIranMarket(),
          fetchTgjuMarket(),
          fetchIranianCryptoPrices(),
        ])

        if (!isMounted.current) return

        // Nobitex/Wallex crypto prices in Toman (overlays BRS crypto data)
        const nobitexPrices = nobitex.status === 'fulfilled' ? nobitex.value : {}

        if (brs.status === 'fulfilled') {
          const base = brs.value
          // Merge Nobitex prices on top of BRS crypto data
          const cryptoToman = { ...base.cryptoToman, ...nobitexPrices }

          if (tgju.status === 'fulfilled' && tgju.value) {
            const t = tgju.value
            const merged: IranMarketData = {
              usdToToman:        base.usdToToman        ?? t.usdToToman        ?? null,
              eurToToman:        base.eurToToman        ?? t.eurToToman        ?? null,
              gbpToToman:        base.gbpToToman        ?? t.gbpToToman        ?? null,
              aedToToman:        base.aedToToman        ?? t.aedToToman        ?? null,
              gold18PerGram:     base.gold18PerGram     ?? t.gold18PerGram     ?? null,
              gold24PerGram:     base.gold24PerGram     ?? t.gold24PerGram     ?? null,
              goldMeltedPerGram: base.goldMeltedPerGram ?? t.goldMeltedPerGram ?? null,
              goldMithqal:       base.goldMithqal       ?? t.goldMithqal       ?? null,
              sekkeTama:         base.sekkeTama         ?? t.sekkeTama         ?? null,
              sekkeNim:          base.sekkeNim          ?? t.sekkeNim          ?? null,
              sekkeRob:          base.sekkeRob          ?? t.sekkeRob          ?? null,
              sekkeGerami:       base.sekkeGerami       ?? t.sekkeGerami       ?? null,
              sekkeEmami:        base.sekkeEmami        ?? t.sekkeEmami        ?? null,
              cryptoToman,
              lastUpdate: base.lastUpdate,
            }
            setIranMarket(merged)
          } else {
            setIranMarket({ ...base, cryptoToman })
          }
        } else if (tgju.status === 'fulfilled' && tgju.value) {
          // BRS failed but TGJU worked
          setIranMarket({
            usdToToman: null, eurToToman: null, gbpToToman: null, aedToToman: null,
            gold18PerGram: null, gold24PerGram: null, goldMeltedPerGram: null, goldMithqal: null,
            sekkeTama: null, sekkeNim: null, sekkeRob: null, sekkeGerami: null, sekkeEmami: null,
            cryptoToman: nobitexPrices,
            ...tgju.value,
            lastUpdate: new Date(),
          })
        } else if (Object.keys(nobitexPrices).length > 0) {
          // Only Nobitex worked — still useful for crypto Toman prices
          setIranMarket(prev => prev
            ? { ...prev, cryptoToman: nobitexPrices, lastUpdate: new Date() }
            : null
          )
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
