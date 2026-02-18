using UnityEngine;
using Pisadado.Core;
using TMPro;
using UnityEngine.UI;

namespace Pisadado.UI
{
    public class UIManager : MonoBehaviour
    {
        [Header("Panels")]
        public GameObject MainMenuPanel;
        public GameObject RhythmPanel;
        public GameObject LaunchPanel;
        public GameObject ResultPanel;
        
        [Header("Rhythm HUD")]
        public TextMeshProUGUI TimerText;
        public TextMeshProUGUI ScoreText;
        public TextMeshProUGUI ComboText;
        public TextMeshProUGUI MultiplierText;
        public TextMeshProUGUI AccuracyText;
        
        [Header("Pizza Progress")]
        public Slider PizzaProgressBar;
        public TextMeshProUGUI PizzaCountText;
        
        [Header("Fire Mode")]
        public GameObject FireModeIndicator;
        public Image FireModeGlow;
        
        [Header("Difficulty")]
        public TextMeshProUGUI DifficultyText;
        
        // References to systems
        private PhaseA.ComboSystem _comboSystem;
        private PhaseA.PizzaBuilder _pizzaBuilder;
        
        // Animation
        private float _comboScalePulse = 1f;

        private void Start()
        {
            EventBus.Subscribe<GameStateChangedEvent>(OnStateChanged);
            EventBus.Subscribe<NoteHitEvent>(OnNoteHit);
            EventBus.Subscribe<ComboMilestoneEvent>(OnComboMilestone);
            EventBus.Subscribe<FireModeActivatedEvent>(OnFireModeChanged);
            EventBus.Subscribe<PizzaCompletedEvent>(OnPizzaCompleted);
            EventBus.Subscribe<DifficultyChangedEvent>(OnDifficultyChanged);
            
            // Find systems
            _comboSystem = FindObjectOfType<PhaseA.ComboSystem>();
            _pizzaBuilder = FindObjectOfType<PhaseA.PizzaBuilder>();
            
            // Initialize fire mode as inactive
            if (FireModeIndicator != null) FireModeIndicator.SetActive(false);
        }

        private void OnDestroy()
        {
            EventBus.Unsubscribe<GameStateChangedEvent>(OnStateChanged);
            EventBus.Unsubscribe<NoteHitEvent>(OnNoteHit);
            EventBus.Unsubscribe<ComboMilestoneEvent>(OnComboMilestone);
            EventBus.Unsubscribe<FireModeActivatedEvent>(OnFireModeChanged);
            EventBus.Unsubscribe<PizzaCompletedEvent>(OnPizzaCompleted);
            EventBus.Unsubscribe<DifficultyChangedEvent>(OnDifficultyChanged);
        }

        private void Update()
        {
            // Update timer
            if (GameManager.Instance != null && TimerText != null)
            {
                TimerText.text = $"Time: {GameManager.Instance.CurrentPhaseTimer:F1}s";
            }
            
            // Update combo system stats
            if (_comboSystem != null)
            {
                if (ScoreText != null)
                {
                    ScoreText.text = $"Score: {_comboSystem.TotalScore:N0}";
                }
                
                if (ComboText != null)
                {
                    ComboText.text = _comboSystem.CurrentCombo > 0 ? 
                        $"{_comboSystem.CurrentCombo}x" : "";
                    
                    // Animate combo text
                    _comboScalePulse = Mathf.Lerp(_comboScalePulse, 1f, Time.deltaTime * 5f);
                    ComboText.transform.localScale = Vector3.one * _comboScalePulse;
                }
                
                if (MultiplierText != null)
                {
                    if (_comboSystem.ScoreMultiplier > 1f)
                    {
                        MultiplierText.text = $"{_comboSystem.ScoreMultiplier:F1}x";
                        MultiplierText.gameObject.SetActive(true);
                    }
                    else
                    {
                        MultiplierText.gameObject.SetActive(false);
                    }
                }
                
                if (AccuracyText != null)
                {
                    float accuracy = _comboSystem.GetAccuracy();
                    AccuracyText.text = $"Accuracy: {accuracy:F1}%";
                }
            }
            
            // Update pizza progress
            if (_pizzaBuilder != null)
            {
                if (PizzaProgressBar != null)
                {
                    PizzaProgressBar.value = _pizzaBuilder.PizzaProgress;
                }
                
                if (PizzaCountText != null)
                {
                    PizzaCountText.text = $"Pizzas: {_pizzaBuilder.TotalPizzasCompleted}";
                }
            }
            
            // Animate fire mode glow
            if (FireModeGlow != null && FireModeIndicator != null && FireModeIndicator.activeSelf)
            {
                float pulse = Mathf.Sin(Time.time * 3f) * 0.5f + 0.5f;
                Color glowColor = FireModeGlow.color;
                glowColor.a = 0.5f + pulse * 0.5f;
                FireModeGlow.color = glowColor;
            }
        }

        private void OnNoteHit(NoteHitEvent evt)
        {
            // Pulse combo text
            _comboScalePulse = evt.IsPerfect ? 1.3f : 1.15f;
        }

        private void OnComboMilestone(ComboMilestoneEvent evt)
        {
            // Big pulse for milestones
            _comboScalePulse = 1.5f;
        }

        private void OnFireModeChanged(FireModeActivatedEvent evt)
        {
            if (FireModeIndicator != null)
            {
                FireModeIndicator.SetActive(evt.IsActive);
            }
        }

        private void OnPizzaCompleted(PizzaCompletedEvent evt)
        {
            // Could trigger special UI animation here
        }

        private void OnDifficultyChanged(DifficultyChangedEvent evt)
        {
            if (DifficultyText != null)
            {
                DifficultyText.text = $"Level {evt.Level} ({evt.DifficultyMultiplier:F1}x)";
            }
        }

        private void OnStateChanged(GameStateChangedEvent evt)
        {
            HideAll();
            switch (evt.NewState)
            {
                case GameState.MainMenu:
                    if (MainMenuPanel) MainMenuPanel.SetActive(true);
                    break;
                case GameState.PhaseRhythm:
                    if (RhythmPanel) RhythmPanel.SetActive(true);
                    break;
                case GameState.PhaseLaunch:
                    if (LaunchPanel) LaunchPanel.SetActive(true);
                    break;
                case GameState.Result:
                    if (ResultPanel) ResultPanel.SetActive(true);
                    UpdateResultsScreen();
                    break;
            }
        }

        private void HideAll()
        {
            if (MainMenuPanel) MainMenuPanel.SetActive(false);
            if (RhythmPanel) RhythmPanel.SetActive(false);
            if (LaunchPanel) LaunchPanel.SetActive(false);
            if (ResultPanel) ResultPanel.SetActive(false);
        }

        private void UpdateResultsScreen()
        {
            // This will be implemented in ResultsScreen.cs
            // For now, just log
            if (_comboSystem != null)
            {
                Debug.Log($"Final Score: {_comboSystem.TotalScore}");
                Debug.Log($"Max Combo: {_comboSystem.MaxCombo}");
                Debug.Log($"Accuracy: {_comboSystem.GetAccuracy():F1}%");
            }
        }
    }
}
