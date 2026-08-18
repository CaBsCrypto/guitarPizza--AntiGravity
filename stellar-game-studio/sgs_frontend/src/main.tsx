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
    console.warn('[Privy] Failed to initialize PrivyProvider (likely non-HTTPS LAN connection):', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.children;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
          ...(isSecure ? {
            embeddedWallets: {
              ethereum: {
                createOnLogin: 'users-without-wallets',
              },
            },
          } : {}),
        }}
      >
        <App />
      </PrivyProvider>
    </PrivyErrorBoundary>
  </React.StrictMode>,
)


