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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
  </React.StrictMode>,
)


