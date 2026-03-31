'use client'

import { useEffect, useRef, useState } from 'react'

// ── Secret shortcut: Shift+T pressed 3 times within 1.5 seconds ──────────────
const SHORTCUT_KEY = 'T'
const SHORTCUT_COUNT = 3
const SHORTCUT_WINDOW_MS = 1500

type Status = 'idle' | 'loading' | 'success' | 'error'

export function InternalTestPanel() {
  const [visible, setVisible] = useState(false)
  const [pdfStatus, setPdfStatus] = useState<Status>('idle')
  const [emailStatus, setEmailStatus] = useState<Status>('idle')
  const [emailSentTo, setEmailSentTo] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const keyTimestamps = useRef<number[]>([])

  // Keyboard shortcut detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in inputs/textareas
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.shiftKey && e.key === SHORTCUT_KEY) {
        const now = Date.now()
        keyTimestamps.current = [
          ...keyTimestamps.current.filter(t => now - t < SHORTCUT_WINDOW_MS),
          now,
        ]
        if (keyTimestamps.current.length >= SHORTCUT_COUNT) {
          keyTimestamps.current = []
          setVisible(v => !v)
          // Reset statuses when toggling open
          setPdfStatus('idle')
          setEmailStatus('idle')
          setErrorMsg('')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handlePreviewPdf = async () => {
    setPdfStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/internal/test-pdf')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      // Revoke after the tab has had time to load
      setTimeout(() => URL.revokeObjectURL(url), 30_000)
      setPdfStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'PDF failed')
      setPdfStatus('error')
    }
  }

  const handleSendEmail = async () => {
    setEmailStatus('loading')
    setEmailSentTo('')
    setErrorMsg('')
    try {
      const res = await fetch('/api/internal/test-email', { method: 'POST' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`)
      setEmailSentTo(body.sentTo || '')
      setEmailStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Email failed')
      setEmailStatus('error')
    }
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '10px',
        padding: '16px 18px',
        width: '240px',
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#e0e0e0',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ color: '#b40000', fontWeight: 'bold', fontSize: '11px', letterSpacing: '0.05em' }}>
          ● INTERNAL TEST
        </span>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'none', border: 'none', color: '#666',
            cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '0 2px',
          }}
          title="Close (or press Shift+T×3 again)"
        >
          ×
        </button>
      </div>

      {/* Preview PDF */}
      <button
        onClick={handlePreviewPdf}
        disabled={pdfStatus === 'loading'}
        style={{
          width: '100%', padding: '8px 0', marginBottom: '8px',
          background: pdfStatus === 'success' ? '#1a3a1a' : '#2a2a2a',
          border: `1px solid ${pdfStatus === 'error' ? '#b40000' : pdfStatus === 'success' ? '#2d6a2d' : '#444'}`,
          borderRadius: '6px', color: pdfStatus === 'loading' ? '#666' : '#e0e0e0',
          cursor: pdfStatus === 'loading' ? 'wait' : 'pointer',
          fontSize: '12px', fontFamily: 'monospace',
        }}
      >
        {pdfStatus === 'loading' ? '⏳ Generating…' : pdfStatus === 'success' ? '✓ PDF opened' : '📄 Preview Test PDF'}
      </button>

      {/* Send Test Email */}
      <button
        onClick={handleSendEmail}
        disabled={emailStatus === 'loading'}
        style={{
          width: '100%', padding: '8px 0',
          background: emailStatus === 'success' ? '#1a3a1a' : '#2a2a2a',
          border: `1px solid ${emailStatus === 'error' ? '#b40000' : emailStatus === 'success' ? '#2d6a2d' : '#444'}`,
          borderRadius: '6px', color: emailStatus === 'loading' ? '#666' : '#e0e0e0',
          cursor: emailStatus === 'loading' ? 'wait' : 'pointer',
          fontSize: '12px', fontFamily: 'monospace',
        }}
      >
        {emailStatus === 'loading' ? '⏳ Sending…' : emailStatus === 'success' ? '✓ Email sent' : '✉ Send Test Email'}
      </button>

      {/* Feedback */}
      {emailStatus === 'success' && emailSentTo && (
        <div style={{ marginTop: '8px', color: '#5a5', fontSize: '11px' }}>
          Sent to {emailSentTo}
        </div>
      )}
      {(pdfStatus === 'error' || emailStatus === 'error') && errorMsg && (
        <div style={{ marginTop: '8px', color: '#b40000', fontSize: '11px', wordBreak: 'break-word' }}>
          {errorMsg}
        </div>
      )}

      {/* Footer hint */}
      <div style={{ marginTop: '12px', color: '#444', fontSize: '10px', borderTop: '1px solid #2a2a2a', paddingTop: '8px' }}>
        Shift+T × 3 to toggle · not visible to clients
      </div>
    </div>
  )
}
