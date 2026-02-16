using UnityEngine;
using System.Collections.Generic;
using Pisadado.Core;
using Pisadado.Data;

namespace Pisadado.PhaseB
{
    public class ClientSpawner : MonoBehaviour
    {
        [Header("Config")]
        public List<ClientData> PossibleClients;
        public List<Transform> SpawnPoints;
        public float SpawnInterval = 5f;
        
        [Header("Prefabs")]
        public GameObject ClientPrefab;

        private bool _active = false;
        private float _spawnTimer;

        private void Start()
        {
            EventBus.Subscribe<GameStateChangedEvent>(OnStateChanged);
        }

        private void OnDestroy()
        {
            EventBus.Unsubscribe<GameStateChangedEvent>(OnStateChanged);
        }

        private void OnStateChanged(GameStateChangedEvent evt)
        {
            if (evt.NewState == GameState.PhaseLaunch)
            {
                _active = true;
                _spawnTimer = 0f; // Spawn immediately
            }
            else
            {
                _active = false;
                CleanupClients();
            }
        }

        private void Update()
        {
            if (!_active) return;
            
            _spawnTimer -= Time.deltaTime;
            if (_spawnTimer <= 0)
            {
                SpawnClient();
                _spawnTimer = SpawnInterval;
            }
        }

        private void SpawnClient()
        {
            // Find empty spawn point
            // For MVP, just random or cycle.
            // Simplified: Random point.
            
            if (SpawnPoints.Count == 0) return;
            Transform point = SpawnPoints[Random.Range(0, SpawnPoints.Count)];
            
            // Check if occupied (very rough check)
            if (point.childCount > 0) return; 
            
            GameObject go = Instantiate(ClientPrefab, point.position, Quaternion.identity, point);
            ClientController ctrl = go.GetComponent<ClientController>();
            
            // Assign random data
            if (PossibleClients.Count > 0)
            {
                ctrl.Data = PossibleClients[Random.Range(0, PossibleClients.Count)];
            }
        }
        
        private void CleanupClients()
        {
            foreach (Transform point in SpawnPoints)
            {
                foreach (Transform child in point)
                {
                    Destroy(child.gameObject);
                }
            }
        }
    }
}
