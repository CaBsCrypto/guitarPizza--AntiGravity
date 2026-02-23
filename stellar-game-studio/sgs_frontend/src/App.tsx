import { useState } from 'react';
import { Layout } from './components/Layout';
import { GuitarPizzaGame } from './games/guitar-pizza/GuitarPizzaGame';
import { HomePage } from './pages/HomePage';
import { useWallet } from './hooks/useWallet';
import type { Page } from './types/navigation';

function App() {
  const [page, setPage] = useState<Page>('home');
  const { publicKey } = useWallet();

  const navigate = (next: Page) => setPage(next);

  return (
    <Layout currentPage={page} onNavigate={navigate}>
      {page === 'home' && <HomePage onNavigate={navigate} />}
      {page === 'game' && (
        <GuitarPizzaGame
          userAddress={publicKey ?? ''}
          onGameComplete={(_score) => navigate('home')}
          onBack={() => navigate('home')}
        />
      )}
    </Layout>
  );
}

export default App;
