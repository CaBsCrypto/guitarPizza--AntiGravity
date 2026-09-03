import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { GuitarPizzaGame } from './games/guitar-pizza/GuitarPizzaGame';
import { HomePage } from './pages/HomePage';
import { MobileController } from './components/MobileController';
import { useWallet } from './hooks/useWallet';
import { HubBridgeService } from './services/HubBridgeService';
import type { Page } from './types/navigation';

const queryParamsInit = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
const isEmbed = queryParamsInit.get('embed') === '1';
const initialPage: Page = queryParamsInit.get('page') === 'home' ? 'home' : 'game';

function App() {
  const [page, setPage] = useState<Page>(initialPage);
  const { publicKey } = useWallet(); // HMR reload trigger

  useEffect(() => {
    HubBridgeService.initHubListener();
  }, []);

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

