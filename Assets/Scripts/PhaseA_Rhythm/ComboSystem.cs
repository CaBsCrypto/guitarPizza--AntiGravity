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

        private void Start()
        {
            EventBus.Subscribe<NoteHitEvent>(OnNoteHit);
            EventBus.Subscribe<NoteMissEvent>(OnNoteMiss);
        }

        private void OnDestroy()
        {
            EventBus.Unsubscribe<NoteHitEvent>(OnNoteHit);
            EventBus.Unsubscribe<NoteMissEvent>(OnNoteMiss);
        }

        private void OnNoteHit(NoteHitEvent evt)
        {
            CurrentCombo++;
            if (CurrentCombo > MaxCombo) MaxCombo = CurrentCombo;

            // Simple Multiplier Logic
            ScoreMultiplier = 1.0f + (CurrentCombo / 10f); // +0.1x every 10 combo
            
            int finalScore = Mathf.RoundToInt(evt.Score * ScoreMultiplier);
            TotalScore += finalScore;

            // Check specific logic like Perfect Streak if needed
            
            Debug.Log($"Combo: {CurrentCombo} | Score: {TotalScore}");
        }

        private void OnNoteMiss(NoteMissEvent evt)
        {
            if (CurrentCombo > 0)
            {
                Debug.Log("Combo Reset!");
            }
            CurrentCombo = 0;
            ScoreMultiplier = 1.0f;
        }
    }
}
