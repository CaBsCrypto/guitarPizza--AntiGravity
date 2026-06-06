import { useState } from 'react';
import { Layout } from './components/Layout';
import { GuitarPizzaGame } from './games/guitar-pizza/GuitarPizzaGame';
import { HomePage } from './pages/HomePage';
import { MobileController } from './components/MobileController';
import { useWallet } from './hooks/useWallet';
import type { Page } from './types/navigation';

const isEmbed = new URLSearchParams(window.location.search).get('embed') === '1';

function App() {
  const [page, setPage] = useState<Page>(isEmbed ? 'game' : 'home');
  const { publicKey } = useWallet();

  const navigate = (next: Page) => setPage(next);

  // Check URL parameters for remote controller mode
  const queryParams = new URLSearchParams(window.location.search);
  const isRemoteMode = queryParams.get('mode') === 'remote';
  const roomCode = queryParams.get('room') ?? '';

  if (isRemoteMode) {
    return <MobileController roomIdFromUrl={roomCode} />;
  }

  return (
    <Layout currentPage={page} onNavigate={navigate}>
      {page === 'home' && <HomePage onNavigate={navigate} />}
      {page === 'game' && (
        <GuitarPizzaGame
          userAddress={publicKey ?? ''}
          onGameComplete={(_score) => navigate('game')}
          onBack={isEmbed ? undefined : () => navigate('home')}
          embed={isEmbed}
        />
      )}
    </Layout>
  );
}

export default App;

