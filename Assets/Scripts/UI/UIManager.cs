using UnityEngine;
using Pisadado.Core;
using TMPro;

namespace Pisadado.UI
{
    public class UIManager : MonoBehaviour
    {
        [Header("Panels")]
        public GameObject MainMenuPanel;
        public GameObject RhythmPanel;
        public GameObject LaunchPanel;
        public GameObject ResultPanel;
        
        [Header("HUD")]
        public TextMeshProUGUI TimerText;
        public TextMeshProUGUI ScoreText;
        public TextMeshProUGUI ComboText; // Phase A
        
        // References to logic for data
        // ... (Usually via updated events)

        private void Start()
        {
            EventBus.Subscribe<GameStateChangedEvent>(OnStateChanged);
            EventBus.Subscribe<NoteHitEvent>(OnNoteHit); // To update HUD
             // Subscribe to Delivery etc
        }

        private void OnDestroy()
        {
            EventBus.Unsubscribe<GameStateChangedEvent>(OnStateChanged);
            EventBus.Unsubscribe<NoteHitEvent>(OnNoteHit);
        }

        private void Update()
        {
            if (GameManager.Instance != null)
            {
                if (TimerText != null)
                {
                    TimerText.text = $"Time: {GameManager.Instance.CurrentPhaseTimer:F1}";
                }
            }
        }

        private void OnNoteHit(NoteHitEvent evt)
        {
            // Simplified Score Update
            // Ideally GameManager or ScoreManager holds total score
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
    }
}
