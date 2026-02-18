using UnityEngine;

namespace Pisadado.PhaseA
{
    using Pisadado.Core;

    public class ComboSystem : MonoBehaviour
    {
        public int CurrentCombo { get; private set; }
        public int MaxCombo { get; private set; }
        public int TotalScore { get; private set; }
        public float ScoreMultiplier { get; private set; } = 1.0f;
        
        // Fire Mode
        public bool FireModeActive { get; private set; }
        private const int FIRE_MODE_THRESHOLD = 20;
        
        // Perfect Streak
        public int PerfectStreak { get; private set; }
        public int MaxPerfectStreak { get; private set; }
        
        // Stats
        public int TotalHits { get; private set; }
        public int PerfectHits { get; private set; }

        private void Start()
        {
            EventBus.Subscribe<NoteHitEvent>(OnNoteHit);
            EventBus.Subscribe<NoteMissEvent>(OnNoteMiss);
            EventBus.Subscribe<NoteSustainEvent>(OnNoteSustain);
            EventBus.Subscribe<PizzaCompletedEvent>(OnPizzaCompleted);
        }

        private void OnDestroy()
        {
            EventBus.Unsubscribe<NoteHitEvent>(OnNoteHit);
            EventBus.Unsubscribe<NoteMissEvent>(OnNoteMiss);
            EventBus.Unsubscribe<NoteSustainEvent>(OnNoteSustain);
            EventBus.Unsubscribe<PizzaCompletedEvent>(OnPizzaCompleted);
        }

        private void OnNoteHit(NoteHitEvent evt)
        {
            CurrentCombo++;
            TotalHits++;
            
            if (evt.IsPerfect)
            {
                PerfectHits++;
                PerfectStreak++;
                if (PerfectStreak > MaxPerfectStreak) MaxPerfectStreak = PerfectStreak;
            }
            else
            {
                PerfectStreak = 0;
            }
            
            if (CurrentCombo > MaxCombo) MaxCombo = CurrentCombo;

            // Check for Fire Mode activation
            if (CurrentCombo >= FIRE_MODE_THRESHOLD && !FireModeActive)
            {
                FireModeActive = true;
                EventBus.Publish(new FireModeActivatedEvent 
                { 
                    IsActive = true, 
                    ComboCount = CurrentCombo 
                });
                Debug.Log("🔥 FIRE MODE ACTIVATED! 🔥");
            }

            // Check for combo milestones
            CheckComboMilestone(CurrentCombo);

            // Calculate multiplier
            ScoreMultiplier = 1.0f + (CurrentCombo / 10f); // +0.1x every 10 combo
            if (FireModeActive) ScoreMultiplier *= 2f; // 2x in Fire Mode
            
            int finalScore = Mathf.RoundToInt(evt.Score * ScoreMultiplier);
            TotalScore += finalScore;

            Debug.Log($"Combo: {CurrentCombo} | Multiplier: {ScoreMultiplier:F1}x | Score: +{finalScore} | Total: {TotalScore}");
        }

        private void OnNoteSustain(NoteSustainEvent evt)
        {
            if (evt.IsComplete)
            {
                // Bonus for completing sustained note
                int sustainBonus = Mathf.RoundToInt(500 * ScoreMultiplier);
                TotalScore += sustainBonus;
                Debug.Log($"Sustained note completed! Bonus: +{sustainBonus}");
            }
        }

        private void OnPizzaCompleted(PizzaCompletedEvent evt)
        {
            // Add pizza completion bonus to total score
            int bonus = Mathf.RoundToInt(evt.QualityScore * ScoreMultiplier);
            TotalScore += bonus;
            Debug.Log($"🍕 Pizza Completed! Bonus: +{bonus} | Total Score: {TotalScore}");
        }

        private void OnNoteMiss(NoteMissEvent evt)
        {
            if (CurrentCombo > 0)
            {
                Debug.Log($"Combo Reset! Lost {CurrentCombo}x combo");
            }
            
            CurrentCombo = 0;
            PerfectStreak = 0;
            ScoreMultiplier = 1.0f;
            
            // Deactivate Fire Mode
            if (FireModeActive)
            {
                FireModeActive = false;
                EventBus.Publish(new FireModeActivatedEvent 
                { 
                    IsActive = false, 
                    ComboCount = 0 
                });
                Debug.Log("Fire Mode Deactivated");
            }
        }

        private void CheckComboMilestone(int combo)
        {
            // Check if we just hit a milestone
            if (combo == 10 || combo == 20 || combo == 50 || combo == 100)
            {
                EventBus.Publish(new ComboMilestoneEvent 
                { 
                    ComboCount = combo, 
                    Milestone = combo 
                });
                
                string message = combo switch
                {
                    10 => "10x COMBO!",
                    20 => "20x HEATING UP! 🔥",
                    50 => "50x ON FIRE! 🔥🔥",
                    100 => "100x CHEF GOD! 👨‍🍳",
                    _ => $"{combo}x COMBO!"
                };
                
                Debug.Log($"⭐ {message} ⭐");
            }
        }

        public float GetAccuracy()
        {
            if (TotalHits == 0) return 0f;
            return (float)PerfectHits / TotalHits * 100f;
        }
    }
}
