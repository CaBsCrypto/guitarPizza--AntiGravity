using UnityEngine;
using Pisadado.Core;

namespace Pisadado.PhaseA
{
    public class NoteObject : MonoBehaviour
    {
        public float TargetBeat;
        public int LaneIndex;
        
        // Sustained Note Properties
        public bool IsSustained { get; private set; }
        public float SustainLength { get; private set; } // In beats
        public bool IsSustaining { get; private set; }
        
        private float _spawnBeat;
        private float _startY;
        private float _endY; // The 'Hit' line Y position
        private bool _active = false;
        private float _sustainStartTime;
        private float _sustainDuration;

        // Visuals
        [SerializeField] private SpriteRenderer _renderer;
        [SerializeField] private SpriteRenderer _sustainTailRenderer; // Optional: visual for sustained part

        public void Initialize(float targetBeat, int laneIndex, float startY, float endY, bool isSustained = false, float sustainLength = 0f)
        {
            TargetBeat = targetBeat;
            LaneIndex = laneIndex;
            _startY = startY;
            _endY = endY;
            _active = true;
            IsSustained = isSustained;
            SustainLength = sustainLength;
            IsSustaining = false;
            
            // Visual setup for sustained notes
            if (IsSustained && _sustainTailRenderer != null)
            {
                _sustainTailRenderer.enabled = true;
                // Scale the tail based on sustain length
                float tailScale = sustainLength * 2f; // Adjust multiplier as needed
                _sustainTailRenderer.transform.localScale = new Vector3(1f, tailScale, 1f);
            }
            else if (_sustainTailRenderer != null)
            {
                _sustainTailRenderer.enabled = false;
            }
        }

        private void Update()
        {
            if (!_active) return;
            if (Conductor.Instance == null) return;

            // Calculate current beat from Conductor
            float currentBeat = Conductor.Instance.SongPositionInBeats;
            
            // How many beats are visible on screen? Let's say notes spawn 4 beats ahead.
            float spawnBeat = TargetBeat - 4f; // View window in beats
            
            // Normalized progress: 0 at spawn, 1 at target.
            float progress = (currentBeat - spawnBeat) / (TargetBeat - spawnBeat);
            
            // Lerp position
            float newY = Mathf.Lerp(_startY, _endY, progress);
            transform.localPosition = new Vector3(transform.localPosition.x, newY, 0);

            // Handle sustaining
            if (IsSustaining)
            {
                _sustainDuration += Time.deltaTime;
                
                // Check if sustain is complete
                float sustainBeats = Conductor.Instance.SecPerBeat * SustainLength;
                if (_sustainDuration >= sustainBeats)
                {
                    CompleteSustain();
                }
            }

            // Hide/Disable if missed (passed target by too much)
            if (currentBeat > TargetBeat + 0.5f && !IsSustaining)
            {
                // Missed
                EventBus.Publish(new NoteMissEvent { LaneIndex = LaneIndex });
                _active = false;
                gameObject.SetActive(false);
            }
        }

        public void StartSustain()
        {
            if (!IsSustained) return;
            
            IsSustaining = true;
            _sustainStartTime = Time.time;
            _sustainDuration = 0f;
            
            Debug.Log($"Started sustaining note on lane {LaneIndex}");
        }

        public void StopSustain()
        {
            if (!IsSustaining) return;
            
            bool wasComplete = _sustainDuration >= (Conductor.Instance.SecPerBeat * SustainLength);
            
            EventBus.Publish(new NoteSustainEvent
            {
                LaneIndex = LaneIndex,
                SustainDuration = _sustainDuration,
                IsComplete = wasComplete
            });
            
            IsSustaining = false;
            _active = false;
            gameObject.SetActive(false);
            
            Debug.Log($"Stopped sustaining note on lane {LaneIndex}. Complete: {wasComplete}");
        }

        private void CompleteSustain()
        {
            EventBus.Publish(new NoteSustainEvent
            {
                LaneIndex = LaneIndex,
                SustainDuration = _sustainDuration,
                IsComplete = true
            });
            
            IsSustaining = false;
            _active = false;
            gameObject.SetActive(false);
            
            Debug.Log($"Completed sustained note on lane {LaneIndex}");
        }
        
        public void Deactivate()
        {
            _active = false;
            IsSustaining = false;
            gameObject.SetActive(false);
        }
    }
}
