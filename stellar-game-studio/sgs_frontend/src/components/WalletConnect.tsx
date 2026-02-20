import React from 'react';
import { useWalletStandalone } from '../hooks/useWalletStandalone';
import { useWalletStore } from '../store/walletSlice';

export const WalletConnect: React.FC = () => {
    const {
        publicKey,
        isConnected,
        isConnecting,
        connect,
        disconnect
    } = useWalletStandalone();

    const shortAddress = publicKey
        ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
        : '';

    return (
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100, display: 'flex', gap: '10px' }}>
            {!isConnected ? (
                <>
                    {/* Demo Button */}
                    <button
                        onClick={() => useWalletStore.getState().setWallet('G_DEMO_USER', 'dev-demo', 'dev')}
                        disabled={isConnecting}
                        style={{
                            background: '#ccc',
                            border: '4px solid #000',
                            boxShadow: '4px 4px 0px #000',
                            color: '#000',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 'bold',
                            padding: '10px 15px',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                        }}
                        title="Play without connecting a real wallet"
                    >
                        🎭 Try Demo
                    </button>

                    {/* Real Wallet Button */}
                    <button
                        onClick={() => connect()}
                        disabled={isConnecting}
                        style={{
                            background: '#FFD700', // Gold
                            border: '4px solid #000',
                            boxShadow: '4px 4px 0px #000',
                            color: '#000',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 'bold',
                            padding: '10px 20px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            transform: 'rotate(-2deg)'
                        }}
                    >
                        {isConnecting ? 'Connecting...' : 'Connect Wallet 🔗'}
                    </button>
                </>
            ) : (
                <button
                    onClick={disconnect}
                    style={{
                        background: '#fff',
                        border: '4px solid #000',
                        boxShadow: '4px 4px 0px #000',
                        color: '#000',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 'bold',
                        padding: '10px 20px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span>🍕</span>
                    <span>{shortAddress}</span>
                </button>
            )}
        </div>
    );
};
