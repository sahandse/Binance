import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  onDismiss: () => void
  duration?: number
}

export function Toast({ message, type = 'info', onDismiss, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, duration)
    return () => clearTimeout(t)
  }, [duration, onDismiss])

  const colors: Record<string, string> = {
    info: '#3b82f6',
    success: '#00cc88',
    warning: '#ffaa00',
    error: '#ff4455',
  }

  return (
    <div
      className="toast-item"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.3s, transform 0.3s',
        background: '#1e1e26',
        border: `1px solid ${colors[type]}44`,
        borderLeft: `4px solid ${colors[type]}`,
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
      }}
      onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }}
    >
      <span style={{ color: colors[type], fontSize: '16px' }}>
        {type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}
      </span>
      <span className="text-sm text-white flex-1">{message}</span>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: ToastProps['type'] }>
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(80px + env(safe-area-inset-bottom))',
        right: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            message={t.message}
            type={t.type}
            onDismiss={() => onDismiss(t.id)}
          />
        </div>
      ))}
    </div>
  )
}
