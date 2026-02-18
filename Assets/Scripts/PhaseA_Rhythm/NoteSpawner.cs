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
        
        [Header("Difficulty Settings")]
        public float InitialDifficultyMultiplier = 0.6f; // 60% speed
        public float MaxDifficultyMultiplier = 1.5f; // 150% speed
        public float DifficultyIncreaseInterval = 10f; // Increase every 10 seconds
        public float DifficultyIncreaseAmount = 0.1f; // +10% each interval
        
        [Header("Sustained Notes")]
        [Range(0f, 1f)]
        public float SustainedNoteProbability = 0.2f; // 20% chance
        public float MinSustainLength = 1f; // In beats
        public float MaxSustainLength = 3f; // In beats
        
        private float _nextSpawnBeat = 0;
        private bool _spawning = false;
        private float _currentDifficultyMultiplier;
        private float _difficultyTimer = 0f;
        private int _difficultyLevel = 0;
        
        // Collision prevention
        private Dictionary<int, float> _lastSpawnBeatPerLane = new Dictionary<int, float>();

        private void Start()
        {
            // Subscribe to game state to start spawning
            EventBus.Subscribe<GameStateChangedEvent>(OnGameStateChanged);
            _currentDifficultyMultiplier = InitialDifficultyMultiplier;
            
            // Initialize lane tracking
            for (int i = 0; i < Lanes.Count; i++)
            {
                _lastSpawnBeatPerLane[i] = -999f;
            }
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
                _currentDifficultyMultiplier = InitialDifficultyMultiplier;
                _difficultyTimer = 0f;
                _difficultyLevel = 0;
                
                // Reset lane tracking
                foreach (int key in _lastSpawnBeatPerLane.Keys)
                {
                    _lastSpawnBeatPerLane[key] = -999f;
                }
            }
            else
            {
                _spawning = false;
            }
        }

        private void Update()
        {
            if (!_spawning) return;
            
            // Update difficulty over time
            _difficultyTimer += Time.deltaTime;
            if (_difficultyTimer >= DifficultyIncreaseInterval)
            {
                _difficultyTimer = 0f;
                IncreaseDifficulty();
            }
            
            // Logic: Spawn notes ahead of time
            float currentBeat = Conductor.Instance.SongPositionInBeats;
            
            // Adjust spawn rate based on difficulty
            float adjustedSpawnAhead = SpawnAheadBeats / _currentDifficultyMultiplier;
            
            if (currentBeat + adjustedSpawnAhead >= _nextSpawnBeat)
            {
                SpawnNote(_nextSpawnBeat);
                
                // Variable beat intervals for more dynamic gameplay
                float[] beatIntervals = { 0.5f, 0.5f, 0.25f, 1f };
                float interval = beatIntervals[Random.Range(0, beatIntervals.Length)];
                _nextSpawnBeat += interval / _currentDifficultyMultiplier;
            }
        }

        private void IncreaseDifficulty()
        {
            if (_currentDifficultyMultiplier >= MaxDifficultyMultiplier) return;
            
            _currentDifficultyMultiplier = Mathf.Min(
                _currentDifficultyMultiplier + DifficultyIncreaseAmount,
                MaxDifficultyMultiplier
            );
            
            _difficultyLevel++;
            
            EventBus.Publish(new DifficultyChangedEvent
            {
                DifficultyMultiplier = _currentDifficultyMultiplier,
                Level = _difficultyLevel
            });
            
            Debug.Log($"Difficulty increased! Level {_difficultyLevel} - Multiplier: {_currentDifficultyMultiplier:F1}x");
        }

        private void SpawnNote(float targetBeat)
        {
            // Select random lane
            int laneIndex = Random.Range(0, Lanes.Count);
            
            // Check for collision - prevent spawning too close to previous note in same lane
            float minSpacing = 1.5f; // Minimum beats between notes in same lane
            if (_lastSpawnBeatPerLane.ContainsKey(laneIndex))
            {
                float timeSinceLastSpawn = targetBeat - _lastSpawnBeatPerLane[laneIndex];
                if (timeSinceLastSpawn < minSpacing)
                {
                    // Try another lane
                    List<int> availableLanes = new List<int>();
                    for (int i = 0; i < Lanes.Count; i++)
                    {
                        float spacing = targetBeat - _lastSpawnBeatPerLane[i];
                        if (spacing >= minSpacing)
                        {
                            availableLanes.Add(i);
                        }
                    }
                    
                    if (availableLanes.Count > 0)
                    {
                        laneIndex = availableLanes[Random.Range(0, availableLanes.Count)];
                    }
                    else
                    {
                        // Skip this spawn if all lanes are too crowded
                        return;
                    }
                }
            }
            
            // Determine if this should be a sustained note
            bool isSustained = Random.value < SustainedNoteProbability;
            float sustainLength = 0f;
            
            if (isSustained)
            {
                sustainLength = Random.Range(MinSustainLength, MaxSustainLength);
            }
            
            // Spawn the note
            if (Lanes[laneIndex] != null)
            {
                Lanes[laneIndex].SpawnNote(targetBeat, isSustained, sustainLength);
                _lastSpawnBeatPerLane[laneIndex] = targetBeat;
            }
        }
    }
}
