using UnityEngine;
using Pisadado.Core;
using Pisadado.Input;
using System.Collections.Generic;

namespace Pisadado.PhaseA
{
    public class LaneController : MonoBehaviour
    {
        [Header("Config")]
        public int LaneIndex;
        public KeyCode DebugKey; // Backup for direct testing
        public Transform SpawnPoint;
        public Transform HitPoint;
        public GameObject NotePrefab;
        
        [Header("Judgement Windows (in Beats)")]
        public float PerfectWindow = 0.05f;
        public float GoodWindow = 0.15f;
        
        private List<NoteObject> _activeNotes = new List<NoteObject>();
        private IGameInput _input;

        private void Start()
        {
            _input = ServiceLocator.Get<IGameInput>();
            if (_input != null)
            {
                _input.OnLanePressed += HandleLanePressed;
            }
        }

        private void OnDestroy()
        {
            if (_input != null)
            {
                _input.OnLanePressed -= HandleLanePressed;
            }
        }

        public void SpawnNote(float targetBeat)
        {
            // In a real scenario, use an Object Pool here!
            GameObject go = Instantiate(NotePrefab, SpawnPoint.position, Quaternion.identity, transform);
            NoteObject note = go.GetComponent<NoteObject>();
            
            // Calculate start and end Y in local space or world space depending on setup
            // Assuming local space for simplicity
            float startY = SpawnPoint.localPosition.y;
            float endY = HitPoint.localPosition.y;
            
            note.Initialize(targetBeat, LaneIndex, startY, endY);
            _activeNotes.Add(note);
        }

        private void HandleLanePressed(int laneIndex)
        {
            if (laneIndex != LaneIndex) return;

            CheckForHit();
        }

        private void Update()
        {
            // Optional: Keyboard fallback if InputProvider isn't ready or for quick test
            if (UnityEngine.Input.GetKeyDown(DebugKey)) HandleLanePressed(LaneIndex);
            
            // Cleanup missed notes
            // Iterating backwards to safely remove
            for (int i = _activeNotes.Count - 1; i >= 0; i--)
            {
                if (!_activeNotes[i].gameObject.activeSelf)
                {
                    _activeNotes.RemoveAt(i);
                }
            }
        }

        private void CheckForHit()
        {
            float currentBeat = Conductor.Instance.SongPositionInBeats;
            
            // Find closest note
            NoteObject closestNote = null;
            float minDiff = float.MaxValue;
            
            foreach (var note in _activeNotes)
            {
                float diff = Mathf.Abs(currentBeat - note.TargetBeat);
                if (diff < minDiff)
                {
                    minDiff = diff;
                    closestNote = note;
                }
            }

            if (closestNote != null)
            {
                // Verify if within hit window
                if (minDiff <= GoodWindow)
                {
                    // Hit!
                    bool isPerfect = minDiff <= PerfectWindow;
                    Debug.Log($"Hit on Lane {LaneIndex}! Perfect: {isPerfect} (Diff: {minDiff})");
                    
                    closestNote.Deactivate();
                    _activeNotes.Remove(closestNote);
                    
                    // TODO: Notify ScoreManager / ComboSystem
                    EventBus.Publish(new NoteHitEvent { 
                        LaneIndex = LaneIndex, 
                        IsPerfect = isPerfect, 
                        Score = isPerfect ? 300 : 100 
                    });
                }
                else
                {
                    Debug.Log($"Missed on Lane {LaneIndex} - Too early/late (Diff: {minDiff})");
                    // Penalize? Reset combo?
                }
            }
        }
    }

    public struct NoteHitEvent
    {
        public int LaneIndex;
        public bool IsPerfect;
        public int Score;
    }
}
