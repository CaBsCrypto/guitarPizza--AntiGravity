using UnityEngine;
using Pisadado.Core;
using System.Collections.Generic;

namespace Pisadado.PhaseA
{
    public class NoteSpawner : MonoBehaviour
    {
        public List<LaneController> Lanes;
        
        [Header("Spawn Settings")]
        public float SpawnAheadBeats = 4f;
        public float Bpm = 120f;
        
        private float _nextSpawnBeat = 0;
        private bool _spawning = false;

        private void Start()
        {
            // Subscribe to game state to start spawning
            EventBus.Subscribe<GameStateChangedEvent>(OnGameStateChanged);
        }

        private void OnDestroy()
        {
            EventBus.Unsubscribe<GameStateChangedEvent>(OnGameStateChanged);
        }

        private void OnGameStateChanged(GameStateChangedEvent evt)
        {
            if (evt.NewState == GameState.PhaseRhythm)
            {
                _spawning = true;
                _nextSpawnBeat = Mathf.Ceil(Conductor.Instance.SongPositionInBeats) + 1;
            }
            else
            {
                _spawning = false;
            }
        }

        private void Update()
        {
            if (!_spawning) return;
            
            // Logic: Spawn notes ahead of time
            // Simple Test: Spawn a note every beat, random lane
            
            float currentBeat = Conductor.Instance.SongPositionInBeats;
            
            if (currentBeat + SpawnAheadBeats >= _nextSpawnBeat)
            {
                SpawnNote(_nextSpawnBeat);
                _nextSpawnBeat += 1f; // Next beat
            }
        }

        private void SpawnNote(float targetBeat)
        {
            int laneIndex = Random.Range(0, Lanes.Count);
            if (Lanes[laneIndex] != null)
            {
                Lanes[laneIndex].SpawnNote(targetBeat);
            }
        }
    }
}
