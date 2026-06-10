import { useState, useCallback } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { BottomNav } from './components/BottomNav'
import { Header } from './components/Header'
import { TickerBar } from './components/TickerBar'
import { ToastContainer } from './components/Toast'
import { Dashboard } from './pages/Dashboard'
import { CryptoPage } from './pages/CryptoPage'
import { GoldPage } from './pages/GoldPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ToolsPage } from './pages/ToolsPage'
import type { TabId } from './types'

interface ToastEntry {
  id: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
}

function AppInner() {
  const { activeTab, setActiveTab, cryptos, loading, lastUpdate, refresh, triggeredAlerts, clearTriggeredAlerts } = useApp()
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const addToast = useCallback((message: string, type: ToastEntry['type'] = 'info') => {
    const id = Date.now().toString(36)
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Show triggered alerts as toasts
  if (triggeredAlerts.length > 0) {
    triggeredAlerts.forEach(a => {
      addToast(`هشدار: ${a.nameFA} به قیمت هدف رسید!`, 'warning')
    })
    clearTriggeredAlerts()
  }

  const pageTitle: Record<TabId, string> = {
    home: 'بازار زنده',
    crypto: 'رمزارزها',
    gold: 'طلا و ارز',
    portfolio: 'پورتفولیو',
    tools: 'ابزارها',
  }

  return (
    <div style={{ background: '#0c0c0e', minHeight: '100vh' }}>
      <Header
        lastUpdate={lastUpdate}
        loading={loading}
        onRefresh={refresh}
        title={pageTitle[activeTab]}
      />

      {activeTab === 'home' && <TickerBar cryptos={cryptos} />}

      <main className="max-w-2xl mx-auto">
        {activeTab === 'home' && <Dashboard />}
        {activeTab === 'crypto' && <CryptoPage />}
        {activeTab === 'gold' && <GoldPage />}
        {activeTab === 'portfolio' && <PortfolioPage />}
        {activeTab === 'tools' && <ToolsPage />}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
