import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

interface PrivyWrapperProps {
  appId: string;
  children: React.ReactNode;
}

export default function PrivyWrapper({ appId, children }: PrivyWrapperProps) {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['email', 'wallet', 'google', 'twitter', 'discord'],
        appearance: {
          theme: 'dark',
          accentColor: '#14F195',
          logo: '/game/assets/Benny.png',
          walletList: ['phantom', 'solflare', 'backpack', 'detected_wallets'],
        },
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
