import React from 'react';

interface OnboardingModalProps {
  showOnboarding: boolean;
  onboardingStep: number;
  setOnboardingStep: React.Dispatch<React.SetStateAction<number>>;
  language: 'es' | 'en';
  dismissOnboarding: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  showOnboarding,
  onboardingStep,
  setOnboardingStep,
  language,
  dismissOnboarding,
}) => {
  if (!showOnboarding) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10,0,0,0.88)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Card */}
      <div
        style={{
          background: 'linear-gradient(160deg, #1a0000 0%, #0d0000 100%)',
          border: '2px solid #d4af37',
          borderRadius: '20px',
          padding: '2rem 1.5rem 1.5rem',
          maxWidth: '320px',
          width: '100%',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.15)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Gold accent top line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
            borderRadius: '0 0 3px 3px',
          }}
        />

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '1.5rem' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === onboardingStep ? '20px' : '7px',
                height: '7px',
                borderRadius: '4px',
                background: i === onboardingStep ? '#d4af37' : 'rgba(212,175,55,0.25)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Step content */}
        {onboardingStep === 0 && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))' }}>🎸🍕</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: '#d4af37', letterSpacing: '0.06em', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              {language === 'es' ? 'Bienvenido, Mafioso' : 'Welcome, Mafioso'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#ccc', lineHeight: '1.55', fontFamily: 'var(--font-body)' }}>
              {language === 'es'
                ? 'Guitar Pizza es un juego de ritmo on-chain. Cocina pizzas al ritmo de la música, acumula puntos y gana recompensas reales en la blockchain de Stellar.'
                : 'Guitar Pizza is an on-chain rhythm game. Cook pizzas to the beat, rack up points, and earn real rewards on the Stellar blockchain.'}
            </div>
          </>
        )}

        {onboardingStep === 1 && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))' }}>⛓️🏆</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: '#d4af37', letterSpacing: '0.06em', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              {language === 'es' ? 'Gana $SLICE & NFTs' : 'Earn $SLICE & NFTs'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#ccc', lineHeight: '1.55', fontFamily: 'var(--font-body)' }}>
              {language === 'es'
                ? 'Cada partida te acerca a tokens $SLICE y NFTs de ingredientes raros. Completa misiones diarias, rompe récords y gana Tickets de Torneo.'
                : 'Every session brings you closer to $SLICE tokens and rare ingredient NFTs. Complete daily quests, break records, and earn Tournament Tickets.'}
            </div>
            {/* Mini reward showcase */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginTop: '0.8rem' }}>
              {['🍄 Truffle', '🍇 Grape', '🎟️ Ticket', '🔥 Streak'].map((label) => (
                <div key={label} style={{ fontSize: '0.55rem', color: '#d4af37', fontFamily: 'monospace', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem' }}>{label.split(' ')[0]}</div>
                  <div style={{ opacity: 0.7 }}>{label.split(' ')[1]}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {onboardingStep === 2 && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))' }}>🔑✨</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: '#d4af37', letterSpacing: '0.06em', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              {language === 'es' ? 'Conecta tu Wallet' : 'Connect your Wallet'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#ccc', lineHeight: '1.55', fontFamily: 'var(--font-body)' }}>
              {language === 'es'
                ? 'Conecta una wallet Stellar (Freighter, Albedo, xBull) para guardar tus logros on-chain. ¡Puedes jugar sin wallet, pero no ganarás tokens!'
                : 'Connect a Stellar wallet (Freighter, Albedo, xBull) to save your achievements on-chain. You can play without one, but you won\'t earn tokens!'}
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.6rem', fontFamily: 'monospace', color: '#888', border: '1px dashed rgba(212,175,55,0.3)', borderRadius: '8px', padding: '0.5rem' }}>
              {language === 'es' ? '💡 Red: Stellar Testnet (gratis para probar)' : '💡 Network: Stellar Testnet (free to try)'}
            </div>
          </>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.8rem', justifyContent: 'center' }}>
          {/* Skip */}
          <button
            onClick={dismissOnboarding}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color: '#888',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {language === 'es' ? 'Saltar' : 'Skip'}
          </button>

          {/* Next / Done */}
          <button
            onClick={() => {
              if (onboardingStep < 2) {
                setOnboardingStep((s) => s + 1);
              } else {
                dismissOnboarding();
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #d4af37, #8B6914)',
              border: 'none',
              borderRadius: '8px',
              color: '#1a0000',
              fontSize: '0.78rem',
              fontWeight: 'bold',
              fontFamily: 'var(--font-display)',
              padding: '0.55rem 1.4rem',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(212,175,55,0.4)',
            }}
          >
            {onboardingStep < 2
              ? language === 'es'
                ? 'Siguiente →'
                : 'Next →'
              : language === 'es'
              ? '¡Empezar! 🍕'
              : "Let's Cook! 🍕"}
          </button>
        </div>

        {/* Step counter */}
        <div style={{ marginTop: '0.8rem', fontSize: '0.52rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
          {onboardingStep + 1} / 3 — GUITAR PIZZA • SOROBAN ZK EDITION
        </div>
      </div>
    </div>
  );
};
