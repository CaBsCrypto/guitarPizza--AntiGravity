using UnityEngine;
using Pisadado.Core;
using TMPro;
using UnityEngine.UI;

namespace Pisadado.UI
{
    /// <summary>
    /// Results screen showing final stats and grade
    /// </summary>
    public class ResultsScreen : MonoBehaviour
    {
        [Header("Stats Display")]
        public TextMeshProUGUI GradeText;
        public TextMeshProUGUI ScoreText;
        public TextMeshProUGUI BestScoreText;
        public TextMeshProUGUI MaxComboText;
        public TextMeshProUGUI PizzasCompletedText;
        public TextMeshProUGUI AccuracyText;
        public TextMeshProUGUI PerfectHitsText;
        
        [Header("New Record")]
        public GameObject NewRecordBanner;
        
        [Header("Buttons")]
        public Button RestartButton;
        public Button MainMenuButton;
        
        private PhaseA.ComboSystem _comboSystem;
        private PhaseA.PizzaBuilder _pizzaBuilder;
        
        private int _previousHighScore = 0;

        private void Start()
        {
            // Find systems
            _comboSystem = FindObjectOfType<PhaseA.ComboSystem>();
            _pizzaBuilder = FindObjectOfType<PhaseA.PizzaBuilder>();
            
            // Load previous high score
            _previousHighScore = PlayerPrefs.GetInt("HighScore", 0);
            
            // Setup buttons
            if (RestartButton != null)
            {
                RestartButton.onClick.AddListener(OnRestartClicked);
            }
            
            if (MainMenuButton != null)
            {
                MainMenuButton.onClick.AddListener(OnMainMenuClicked);
            }
            
            // Hide new record banner initially
            if (NewRecordBanner != null)
            {
                NewRecordBanner.SetActive(false);
            }
        }

        private void OnEnable()
        {
            // Update stats when screen becomes active
            UpdateStats();
        }

        private void UpdateStats()
        {
            if (_comboSystem == null) return;
            
            int finalScore = _comboSystem.TotalScore;
            int maxCombo = _comboSystem.MaxCombo;
            float accuracy = _comboSystem.GetAccuracy();
            int perfectHits = _comboSystem.PerfectHits;
            int totalHits = _comboSystem.TotalHits;
            int pizzasCompleted = _pizzaBuilder != null ? _pizzaBuilder.TotalPizzasCompleted : 0;
            
            // Calculate grade
            string grade = CalculateGrade(accuracy, maxCombo);
            
            // Update UI
            if (GradeText != null)
            {
                GradeText.text = grade;
                GradeText.color = GetGradeColor(grade);
            }
            
            if (ScoreText != null)
            {
                ScoreText.text = finalScore.ToString("N0");
            }
            
            if (MaxComboText != null)
            {
                MaxComboText.text = maxCombo.ToString();
            }
            
            if (PizzasCompletedText != null)
            {
                PizzasCompletedText.text = pizzasCompleted.ToString();
            }
            
            if (AccuracyText != null)
            {
                AccuracyText.text = $"{accuracy:F1}%";
            }
            
            if (PerfectHitsText != null)
            {
                PerfectHitsText.text = $"{perfectHits}/{totalHits}";
            }
            
            // Check for new high score
            bool isNewRecord = finalScore > _previousHighScore;
            if (isNewRecord)
            {
                PlayerPrefs.SetInt("HighScore", finalScore);
                PlayerPrefs.Save();
                
                if (NewRecordBanner != null)
                {
                    NewRecordBanner.SetActive(true);
                }
            }
            
            if (BestScoreText != null)
            {
                int bestScore = Mathf.Max(finalScore, _previousHighScore);
                BestScoreText.text = bestScore.ToString("N0");
            }
        }

        private string CalculateGrade(float accuracy, int maxCombo)
        {
            // Grade based on accuracy and combo
            if (accuracy >= 95f && maxCombo >= 50)
                return "S";
            else if (accuracy >= 90f && maxCombo >= 30)
                return "A";
            else if (accuracy >= 80f && maxCombo >= 20)
                return "B";
            else if (accuracy >= 70f && maxCombo >= 10)
                return "C";
            else if (accuracy >= 60f)
                return "D";
            else
                return "F";
        }

        private Color GetGradeColor(string grade)
        {
            return grade switch
            {
                "S" => new Color(1f, 0.84f, 0f), // Gold
                "A" => new Color(0.2f, 1f, 0.2f), // Green
                "B" => new Color(0.3f, 0.7f, 1f), // Blue
                "C" => new Color(1f, 0.7f, 0.2f), // Orange
                "D" => new Color(1f, 0.5f, 0.2f), // Dark Orange
                "F" => new Color(1f, 0.2f, 0.2f), // Red
                _ => Color.white
            };
        }

        private void OnRestartClicked()
        {
            // Restart the game loop
            // This would typically reload the scene or restart the game manager
            Debug.Log("Restart clicked - would restart game");
            // UnityEngine.SceneManagement.SceneManager.LoadScene(0);
        }

        private void OnMainMenuClicked()
        {
            // Return to main menu
            Debug.Log("Main menu clicked");
            // Could change game state to MainMenu
        }
    }
}
