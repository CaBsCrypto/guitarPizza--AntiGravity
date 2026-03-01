import { useWalletStandalone } from '../hooks/useWalletStandalone';
import { useSliceBalance } from '../hooks/useSliceBalance';
import './WalletStandalone.css';

export function WalletStandalone() {
  const {
    publicKey,
    isConnected,
    isConnecting,
    error,
    isWalletAvailable,
    network,
    connect,
    disconnect,
  } = useWalletStandalone();

  const { balance } = useSliceBalance();

  const address = typeof publicKey === 'string' ? publicKey : '';
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="wallet-standalone">
      {/* $SLICE balance chip — visible only when wallet is connected */}
      {isConnected && balance !== null && (
        <div className="slice-balance-chip">
          🍕 {balance % 1 === 0 ? balance.toFixed(0) : balance.toFixed(2)} $SLICE
        </div>
      )}

      {!isConnected ? (
        <button
          className="wallet-standalone-button"
          onClick={() => connect().catch(() => undefined)}
          disabled={!isWalletAvailable || isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <button className="wallet-standalone-button" onClick={disconnect}>
          {shortAddress}
        </button>
      )}

      {/* Demo Mode Button (Only visible when not connected) */}
      {!isConnected && (
        <button
          className="wallet-standalone-button"
          style={{
            marginLeft: '10px',
            background: '#ccc',
            color: '#333',
            borderColor: '#999'
          }}
          onClick={() => {
            import('../store/walletSlice').then(({ useWalletStore }) => {
              useWalletStore.getState().setWallet('G_DEMO_USER', 'dev-demo', 'dev');
            });
          }}
          title="Play without connecting a real wallet"
        >
          🎭 Demo
        </button>
      )}

      {network && <div className="wallet-standalone-network">{network}</div>}

      {!isWalletAvailable && (
        <div className="wallet-standalone-error">Wallet connection is only available in the browser.</div>
      )}
      {error && <div className="wallet-standalone-error">{error}</div>}
    </div>
  );
}
