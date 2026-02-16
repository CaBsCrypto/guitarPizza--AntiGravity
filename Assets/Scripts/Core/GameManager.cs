using UnityEngine;
using Pisadado.Input;
using System.Collections;

namespace Pisadado.Core
{
    [DefaultExecutionOrder(-100)] // Initialize before everything else
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("References")]
        [SerializeField] private InputProvider _inputProvider;
        
        private GameStateMachine _stateMachine;

        private void Awake()
        {
            if (Instance != null)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            InitializeServices();
            InitializeStateMachine();
        }

        private void InitializeServices()
        {
            Debug.Log("[GameManager] Initializing Services...");
            
            // 1. Input
            if (_inputProvider == null) _inputProvider = gameObject.AddComponent<InputProvider>();
            ServiceLocator.Register<IGameInput>(_inputProvider);
            
            // 2. Event Bus (Static, but we can wrap it if needed or just use directly)
            // No registration needed for static EventBus classes usually, unless we want to mock it.
        }

        [Header("Game Settings")]
        public float RhythmPhaseDuration = 60f;
        public float LaunchPhaseDuration = 30f;
        
        public float CurrentPhaseTimer { get; private set; }

        private void InitializeStateMachine()
        {
            _stateMachine = new GameStateMachine();
            StartCoroutine(GameLoop());
        }

        private IEnumerator GameLoop()
        {
            // 1. Bootstrap
            _stateMachine.ChangeState(GameState.Bootstrap);
            yield return null; // Wait frame

            // 2. Main Menu (Skip for MVP, go straight to game after delay)
            _stateMachine.ChangeState(GameState.MainMenu);
            yield return new WaitForSeconds(1f); // Fake loading

            // 3. Start Run
            while (true)
            {
                Debug.Log("Starting New Run...");
                
                // PHASE A: Rhythm
                _stateMachine.ChangeState(GameState.PhaseRhythm);
                CurrentPhaseTimer = RhythmPhaseDuration;
                
                while (CurrentPhaseTimer > 0)
                {
                    CurrentPhaseTimer -= Time.deltaTime;
                    yield return null;
                }

                // PHASE B: Launch
                _stateMachine.ChangeState(GameState.PhaseLaunch);
                CurrentPhaseTimer = LaunchPhaseDuration;
                
                while (CurrentPhaseTimer > 0)
                {
                    CurrentPhaseTimer -= Time.deltaTime;
                    // Check early exit if pizzas done? 
                    // For now, fixed time.
                    yield return null;
                }

                // RESULTS
                _stateMachine.ChangeState(GameState.Result);
                Debug.Log("Run Finished!");
                
                yield return new WaitForSeconds(5f); // Show results
                
                // Restart Loop
            }
        }
        
        private void OnDestroy()
        {
            ServiceLocator.Clear();
            EventBus.Clear();
        }
    }
}
