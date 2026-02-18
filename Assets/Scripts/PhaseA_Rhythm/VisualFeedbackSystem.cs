using UnityEngine;
using System.Collections.Generic;
using Pisadado.Core;
using TMPro;

namespace Pisadado.PhaseA
{
    /// <summary>
    /// Centralized system for visual feedback during rhythm gameplay
    /// Handles camera shake, particles, floating text, and fire mode effects
    /// </summary>
    public class VisualFeedbackSystem : MonoBehaviour
    {
        [Header("Camera Shake")]
        public Transform CameraTransform;
        public float ShakeIntensity = 0.1f;
        public float ShakeDecay = 5f;
        
        [Header("Particles")]
        public ParticleSystem HitParticlesPrefab;
        public ParticleSystem FireModeParticlesPrefab;
        public Transform[] LanePositions; // For spawning particles at lane positions
        
        [Header("Floating Text")]
        public GameObject FloatingTextPrefab;
        public Transform FloatingTextContainer;
        
        [Header("Pizza Popup")]
        public GameObject PizzaPopupPrefab;
        public Transform PizzaPopupContainer;
        
        [Header("Fire Mode Effects")]
        public GameObject FireModeOverlay;
        public ParticleSystem[] FireModeAmbientParticles;
        
        private float _currentShake = 0f;
        private Vector3 _originalCameraPosition;
        private bool _fireModeActive = false;
        
        // Object pools
        private Queue<ParticleSystem> _particlePool = new Queue<ParticleSystem>();
        private Queue<GameObject> _textPool = new Queue<GameObject>();

        private void Start()
        {
            if (CameraTransform != null)
            {
                _originalCameraPosition = CameraTransform.localPosition;
            }
            
            // Subscribe to events
            EventBus.Subscribe<NoteHitEvent>(OnNoteHit);
            EventBus.Subscribe<ComboMilestoneEvent>(OnComboMilestone);
            EventBus.Subscribe<FireModeActivatedEvent>(OnFireModeChanged);
            EventBus.Subscribe<PizzaCompletedEvent>(OnPizzaCompleted);
            
            // Initialize fire mode as inactive
            if (FireModeOverlay != null) FireModeOverlay.SetActive(false);
            SetFireModeParticles(false);
        }

        private void OnDestroy()
        {
            EventBus.Unsubscribe<NoteHitEvent>(OnNoteHit);
            EventBus.Unsubscribe<ComboMilestoneEvent>(OnComboMilestone);
            EventBus.Unsubscribe<FireModeActivatedEvent>(OnFireModeChanged);
            EventBus.Unsubscribe<PizzaCompletedEvent>(OnPizzaCompleted);
        }

        private void Update()
        {
            // Update camera shake
            if (_currentShake > 0f)
            {
                _currentShake -= ShakeDecay * Time.deltaTime;
                _currentShake = Mathf.Max(0f, _currentShake);
                
                if (CameraTransform != null)
                {
                    Vector3 shakeOffset = Random.insideUnitSphere * _currentShake * ShakeIntensity;
                    CameraTransform.localPosition = _originalCameraPosition + shakeOffset;
                }
            }
            else if (CameraTransform != null)
            {
                CameraTransform.localPosition = _originalCameraPosition;
            }
        }

        private void OnNoteHit(NoteHitEvent evt)
        {
            // Camera shake
            float shakeAmount = evt.IsPerfect ? 0.8f : 0.4f;
            if (_fireModeActive) shakeAmount *= 1.5f;
            AddCameraShake(shakeAmount);
            
            // Particles at lane position
            if (evt.LaneIndex >= 0 && evt.LaneIndex < LanePositions.Length)
            {
                SpawnHitParticles(LanePositions[evt.LaneIndex].position, evt.IsPerfect);
            }
            
            // Floating text
            string text = evt.IsPerfect ? "DELICIOUS!" : "TASTY";
            if (_fireModeActive) text += " 🔥";
            
            if (evt.LaneIndex >= 0 && evt.LaneIndex < LanePositions.Length)
            {
                SpawnFloatingText(text, LanePositions[evt.LaneIndex].position, evt.IsPerfect);
            }
        }

        private void OnComboMilestone(ComboMilestoneEvent evt)
        {
            string message = evt.Milestone switch
            {
                10 => "10x COMBO!",
                20 => "20x HEATING UP! 🔥",
                50 => "50x ON FIRE! 🔥🔥",
                100 => "100x CHEF GOD! 👨‍🍳",
                _ => $"{evt.Milestone}x COMBO!"
            };
            
            // Spawn centered floating text for milestones
            Vector3 centerPosition = CameraTransform != null ? 
                CameraTransform.position + Vector3.forward * 5f : 
                Vector3.zero;
            
            SpawnFloatingText(message, centerPosition, true, 2f);
            AddCameraShake(1.5f);
        }

        private void OnFireModeChanged(FireModeActivatedEvent evt)
        {
            _fireModeActive = evt.IsActive;
            
            if (FireModeOverlay != null)
            {
                FireModeOverlay.SetActive(evt.IsActive);
            }
            
            SetFireModeParticles(evt.IsActive);
            
            if (evt.IsActive)
            {
                AddCameraShake(2f);
            }
        }

        private void OnPizzaCompleted(PizzaCompletedEvent evt)
        {
            // Big celebration!
            AddCameraShake(2f);
            
            // Spawn pizza popup
            if (PizzaPopupPrefab != null && PizzaPopupContainer != null)
            {
                GameObject popup = Instantiate(PizzaPopupPrefab, PizzaPopupContainer);
                // Popup should have its own animation/destroy logic
            }
            
            // Confetti particles
            for (int i = 0; i < LanePositions.Length; i++)
            {
                SpawnHitParticles(LanePositions[i].position, true);
            }
            
            // Big text
            Vector3 centerPosition = CameraTransform != null ? 
                CameraTransform.position + Vector3.forward * 5f : 
                Vector3.zero;
            SpawnFloatingText("ORDER UP! 🍕", centerPosition, true, 2.5f);
        }

        public void AddCameraShake(float amount)
        {
            _currentShake += amount;
        }

        private void SpawnHitParticles(Vector3 position, bool isPerfect)
        {
            if (HitParticlesPrefab == null) return;
            
            ParticleSystem particles = Instantiate(HitParticlesPrefab, position, Quaternion.identity);
            
            // Customize based on perfect hit
            var main = particles.main;
            if (isPerfect)
            {
                main.startColor = new Color(1f, 0.84f, 0f); // Gold
                main.startSize = 0.5f;
            }
            else
            {
                main.startColor = Color.white;
                main.startSize = 0.3f;
            }
            
            particles.Play();
            Destroy(particles.gameObject, particles.main.duration + 1f);
        }

        private void SpawnFloatingText(string text, Vector3 position, bool isPerfect, float scale = 1f)
        {
            if (FloatingTextPrefab == null || FloatingTextContainer == null) return;
            
            GameObject textObj = Instantiate(FloatingTextPrefab, position, Quaternion.identity, FloatingTextContainer);
            
            TextMeshPro tmp = textObj.GetComponent<TextMeshPro>();
            if (tmp != null)
            {
                tmp.text = text;
                tmp.fontSize = isPerfect ? 8f * scale : 6f * scale;
                tmp.color = isPerfect ? new Color(1f, 0.84f, 0f) : Color.white;
            }
            
            // Simple upward animation (could be improved with DOTween or Animation)
            FloatingTextAnimator animator = textObj.AddComponent<FloatingTextAnimator>();
            animator.Initialize(2f);
        }

        private void SetFireModeParticles(bool active)
        {
            if (FireModeAmbientParticles == null) return;
            
            foreach (var particles in FireModeAmbientParticles)
            {
                if (particles != null)
                {
                    if (active)
                    {
                        particles.Play();
                    }
                    else
                    {
                        particles.Stop();
                    }
                }
            }
        }
    }

    /// <summary>
    /// Simple component to animate floating text
    /// </summary>
    public class FloatingTextAnimator : MonoBehaviour
    {
        private float _lifetime;
        private float _timer;
        private Vector3 _velocity = Vector3.up * 2f;
        private TextMeshPro _text;

        public void Initialize(float lifetime)
        {
            _lifetime = lifetime;
            _text = GetComponent<TextMeshPro>();
        }

        private void Update()
        {
            _timer += Time.deltaTime;
            
            // Move upward
            transform.position += _velocity * Time.deltaTime;
            
            // Fade out
            if (_text != null)
            {
                float alpha = 1f - (_timer / _lifetime);
                Color color = _text.color;
                color.a = alpha;
                _text.color = color;
            }
            
            // Destroy when done
            if (_timer >= _lifetime)
            {
                Destroy(gameObject);
            }
        }
    }
}
