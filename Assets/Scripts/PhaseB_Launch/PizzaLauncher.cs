using UnityEngine;
using Pisadado.Core;
using Pisadado.Input;
using Pisadado.Data;

namespace Pisadado.PhaseB
{
    public class PizzaLauncher : MonoBehaviour
    {
        [Header("References")]
        public Transform LaunchPoint;
        public GameObject PizzaPrefab;
        public TrajectoryPredictor Trajectory;
        
        [Header("Physics Config")]
        public float ForceMultiplier = 15f;
        public float MaxForce = 20f;
        
        private IGameInput _input;
        private Vector2 _dragStartPos;
        private Vector2 _currentDragPos;
        private bool _isDragging = false;
        
        // Current ammo
        private PizzaData _loadedPizza;

        private void Start()
        {
            _input = ServiceLocator.Get<IGameInput>();
            if (_input != null)
            {
                _input.OnLaunchDrag += HandleDrag;
                _input.OnLaunchRelease += HandleRelease;
            }
            
            // Subscribe to state change to "Reload"
            EventBus.Subscribe<GameStateChangedEvent>(OnGameStateChanged);
        }

        private void OnDestroy()
        {
            if (_input != null)
            {
                _input.OnLaunchDrag -= HandleDrag;
                _input.OnLaunchRelease -= HandleRelease;
            }
            EventBus.Unsubscribe<GameStateChangedEvent>(OnGameStateChanged);
        }

        private void OnGameStateChanged(GameStateChangedEvent evt)
        {
            if (evt.NewState == GameState.PhaseLaunch)
            {
                LoadNextPizza();
            }
        }

        private void LoadNextPizza()
        {
            // Get from Phase A stash (mock for now)
            // TODO: Pull from PizzaBuilder.CompletedPizzas
            if (PizzaBuilder.CompletedPizzas.Count > 0)
            {
                _loadedPizza = PizzaBuilder.CompletedPizzas[0];
                PizzaBuilder.CompletedPizzas.RemoveAt(0);
                Debug.Log($"Loaded Pizza: {_loadedPizza.DisplayName}");
            }
            else
            {
                Debug.LogWarning("No pizzas allowed! Giving default.");
            }
        }

        private Vector2 _currentForce;

        private void HandleDrag(Vector2 screenPos)
        {
            if (Camera.main == null) return;
            
            Vector2 worldPos = Camera.main.ScreenToWorldPoint(screenPos);
            
            if (!_isDragging)
            {
                _isDragging = true;
                _dragStartPos = LaunchPoint.position; 
            }
            
            Vector2 pullVector = (Vector2)LaunchPoint.position - worldPos;
            
            // Clamp
            if (pullVector.magnitude > 2.0f)
            {
                pullVector = pullVector.normalized * 2.0f;
            }
            
            _currentForce = pullVector * ForceMultiplier;
            
            // Visualization
            Trajectory.ShowTrajectory(LaunchPoint.position, _currentForce, 1.0f, 0f); 
        }

        private void HandleRelease()
        {
            if (!_isDragging) return;
            _isDragging = false;
            Trajectory.Hide();
            
            if (_loadedPizza == null) return; // Can't launch nothing

            GameObject projGo = Instantiate(PizzaPrefab, LaunchPoint.position, Quaternion.identity);
            PizzaProjectile proj = projGo.GetComponent<PizzaProjectile>();
            
            proj.Initialize(_loadedPizza);
            proj.Launch(_currentForce);
            
            _loadedPizza = null;
            // Try load next?
            LoadNextPizza();
        }
    }
}
