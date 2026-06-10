import { createContext, useContext, useState, type ReactNode } from 'react'
import { useMarketData } from '../hooks/useMarketData'
import { useKlines } from '../hooks/useKlines'
import { useGlobalData } from '../hooks/useGlobalData'
import { usePortfolio } from '../hooks/usePortfolio'
import { useFavorites } from '../hooks/useFavorites'
import { usePriceAlerts } from '../hooks/usePriceAlerts'
import { useIranMarket } from '../hooks/useIranMarket'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_USD_TO_TOMAN } from '../constants/market'
import type { TabId } from '../types'
import type { IranMarketData } from '../api/brsapi'

interface AppContextValue {
  // Navigation
  activeTab: TabId
  setActiveTab: (tab: TabId) => void

  // Market data
  cryptos: ReturnType<typeof useMarketData>['cryptos']
  metals: ReturnType<typeof useMarketData>['metals']
  currencies: ReturnType<typeof useMarketData>['currencies']
  lastUpdate: ReturnType<typeof useMarketData>['lastUpdate']
  loading: ReturnType<typeof useMarketData>['loading']
  cryptoError: ReturnType<typeof useMarketData>['cryptoError']
  metalError: ReturnType<typeof useMarketData>['metalError']
  currencyError: ReturnType<typeof useMarketData>['currencyError']
  refresh: ReturnType<typeof useMarketData>['refresh']

  // Klines
  klines: ReturnType<typeof useKlines>['klines']
  klinesLoading: ReturnType<typeof useKlines>['klinesLoading']

  // Global data
  globalData: ReturnType<typeof useGlobalData>['globalData']
  fearGreed: ReturnType<typeof useGlobalData>['fearGreed']
  globalLoading: ReturnType<typeof useGlobalData>['globalLoading']

  // Portfolio
  portfolio: ReturnType<typeof usePortfolio>['portfolio']
  addToPortfolio: ReturnType<typeof usePortfolio>['add']
  removeFromPortfolio: ReturnType<typeof usePortfolio>['remove']
  updatePortfolio: ReturnType<typeof usePortfolio>['update']

  // Favorites
  favorites: ReturnType<typeof useFavorites>['favorites']
  toggleFavorite: ReturnType<typeof useFavorites>['toggle']
  isFavorite: ReturnType<typeof useFavorites>['isFavorite']

  // Alerts
  alerts: ReturnType<typeof usePriceAlerts>['alerts']
  addAlert: ReturnType<typeof usePriceAlerts>['add']
  removeAlert: ReturnType<typeof usePriceAlerts>['remove']
  triggeredAlerts: ReturnType<typeof usePriceAlerts>['triggered']
  clearTriggeredAlerts: ReturnType<typeof usePriceAlerts>['clearTriggered']

  // Iran market (BRS API – live bazaar prices, Iran-IP only)
  iranMarket: IranMarketData | null
  iranMarketLoading: boolean

  // Settings
  usdToToman: number
  setUsdToToman: (rate: number) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [usdToToman, setUsdToToman] = useLocalStorage<number>('bazaar-usd-toman', DEFAULT_USD_TO_TOMAN)

  const marketData = useMarketData()
  const { klines, klinesLoading } = useKlines()
  const { globalData, fearGreed, globalLoading } = useGlobalData()
  const { iranMarket, iranMarketLoading } = useIranMarket()
  const { portfolio, add: addToPortfolio, remove: removeFromPortfolio, update: updatePortfolio } = usePortfolio()
  const { favorites, toggle: toggleFavorite, isFavorite } = useFavorites()
  const {
    alerts,
    add: addAlert,
    remove: removeAlert,
    triggered: triggeredAlerts,
    clearTriggered: clearTriggeredAlerts,
  } = usePriceAlerts(marketData.cryptos)

  const value: AppContextValue = {
    activeTab,
    setActiveTab,
    ...marketData,
    klines,
    klinesLoading,
    globalData,
    fearGreed,
    globalLoading,
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    updatePortfolio,
    favorites,
    toggleFavorite,
    isFavorite,
    alerts,
    addAlert,
    removeAlert,
    triggeredAlerts,
    clearTriggeredAlerts,
    iranMarket,
    iranMarketLoading,
    usdToToman,
    setUsdToToman,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
