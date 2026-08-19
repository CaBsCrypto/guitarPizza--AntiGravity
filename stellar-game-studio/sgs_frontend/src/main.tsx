import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
import App from './App'
import './index.css'

import { avalanche, avalancheFuji } from 'viem/chains'

const rawPrivyId = import.meta.env.VITE_PRIVY_APP_ID || ''
const PRIVY_APP_ID = (!rawPrivyId || rawPrivyId === 'your-privy-app-id-here')
  ? 'clp0000000000000000000000'
  : rawPrivyId

const isSecure = typeof window !== 'undefined' && (
  window.isSecureContext ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.protocol === 'https:'
);

class PrivyErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('[Privy] PrivyProvider initialization skipped/failed on this connection:', error);
  }
  render() {
    if (this.state.hasError) {
      // Fallback: render App directly without PrivyProvider on error
      return <App />;
    }
    return this.props.children;
  }
}

class GlobalAppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error('[App Crash]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0a0705', color: '#f1c40f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ff4d4d' }}>🍕 Rhythm Slice — Error de Carga</h2>
          <p style={{ maxWidth: '500px', color: '#ccc', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {String(this.state.error?.message || 'Error inesperado al renderizar el juego.')}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: 'linear-gradient(180deg, #d4af37 0%, #aa8c2c 100%)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🔄 Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalAppErrorBoundary>
      {isSecure ? (
        <PrivyErrorBoundary>
          <PrivyProvider
            appId={PRIVY_APP_ID}
            config={{
              defaultChain: avalancheFuji,
              supportedChains: [avalancheFuji, avalanche],
              loginMethods: ['email', 'wallet', 'google', 'twitter', 'discord'],
              appearance: {
                theme: 'dark',
                accentColor: '#E84142',
                logo: '/game/assets/Benny.png',
              },
              embeddedWallets: {
                ethereum: {
                  createOnLogin: 'users-without-wallets',
                },
              },
            }}
          >
            <App />
          </PrivyProvider>
        </PrivyErrorBoundary>
      ) : (
        <App />
      )}
    </GlobalAppErrorBoundary>
  </React.StrictMode>,
)


