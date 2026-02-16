using UnityEngine;

namespace Pisadado.PhaseA
{
    public class NoteObject : MonoBehaviour
    {
        public float TargetBeat;
        public int LaneIndex;
        
        private float _spawnBeat;
        private float _startY;
        private float _endY; // The 'Hit' line Y position
        private bool _active = false;

        // Visuals
        [SerializeField] private SpriteRenderer _renderer;

        public void Initialize(float targetBeat, int laneIndex, float startY, float endY)
        {
            TargetBeat = targetBeat;
            LaneIndex = laneIndex;
            _startY = startY;
            _endY = endY;
            _active = true;
            
            // Optional: Set sprite based on ingredient type if passed
        }

        private void Update()
        {
            if (!_active) return;
            if (Conductor.Instance == null) return;

            // Calculate current beat from Conductor
            float currentBeat = Conductor.Instance.SongPositionInBeats;
            
            // How many beats are visible on screen? Let's say notes spawn 4 beats ahead.
            // Note: This logic belongs in LaneController/Spawner conceptually, 
            // but for simple movement, keeping it self-contained or driven by controller is key.
            // Better Approach: NoteController/LaneController updates the position.
            // But for MVP readiness, let's put simple interpolation here.
            
            // Let's assume we want the note to reach _endY at TargetBeat.
            // And it spawns at, say, TargetBeat - 4.
            float spawnBeat = TargetBeat - 4f; // View window in beats
            
            // Normalized progress: 0 at spawn, 1 at target.
            float progress = (currentBeat - spawnBeat) / (TargetBeat - spawnBeat);
            
            // Lerp position
            float newY = Mathf.Lerp(_startY, _endY, progress);
            transform.localPosition = new Vector3(transform.localPosition.x, newY, 0);

            // Hide/Disable if missed (passed target by too much)
            if (currentBeat > TargetBeat + 0.5f)
            {
                // Missed
                // Notify controller?
                _active = false;
                gameObject.SetActive(false); // Quick pool return simulation
            }
        }
        
        public void Deactivate()
        {
            _active = false;
            gameObject.SetActive(false);
        }
    }
}
