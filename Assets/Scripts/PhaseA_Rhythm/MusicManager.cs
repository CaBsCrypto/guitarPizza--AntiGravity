using UnityEngine;
using Pisadado.Core;
using System.Collections;

namespace Pisadado.PhaseA
{
    /// <summary>
    /// Handles background music and dynamic audio effects based on player performance.
    /// reacts to hits and misses via EventBus.
    /// </summary>
    [RequireComponent(typeof(AudioSource))]
    public class MusicManager : MonoBehaviour
    {
        public static MusicManager Instance { get; private set; }

        [Header("Settings")]
        public float PitchRecoverySpeed = 2f;
        public float FilterRecoverySpeed = 500f;
        public float BaseFilterFrequency = 20000f;
        public float MissFilterFrequency = 800f;
        
        [Header("Audio Effects")]
        public AudioSource MusicSource;
        public AudioLowPassFilter LowPassFilter;
        
        [Header("SFX")]
        public AudioClip MissScratchSfx;
        public AudioSource SfxSource;

        private float _targetPitch = 1f;
        private float _targetFilterFreq = 20000f;
        private Coroutine _scratchCoroutine;

        private void Awake()
        {
            Instance = this;
            if (MusicSource == null) MusicSource = GetComponent<AudioSource>();
            if (LowPassFilter == null) LowPassFilter = GetComponent<AudioLowPassFilter>();
            
            _targetFilterFreq = BaseFilterFrequency;
        }

        private void Start()
        {
            EventBus.Subscribe<NoteMissEvent>(OnNoteMiss);
            EventBus.Subscribe<NoteHitEvent>(OnNoteHit);
        }

        private void OnDestroy()
        {
            EventBus.Unsubscribe<NoteMissEvent>(OnNoteMiss);
            EventBus.Unsubscribe<NoteHitEvent>(OnNoteHit);
        }

        private void Update()
        {
            // Smoothly recover pitch
            if (MusicSource.pitch != _targetPitch)
            {
                MusicSource.pitch = Mathf.MoveTowards(MusicSource.pitch, _targetPitch, PitchRecoverySpeed * Time.deltaTime);
                if (Mathf.Approximately(MusicSource.pitch, _targetPitch)) _targetPitch = 1f;
            }

            // Smoothly recover filter
            if (LowPassFilter != null && LowPassFilter.cutoffFrequency != _targetFilterFreq)
            {
                LowPassFilter.cutoffFrequency = Mathf.MoveTowards(LowPassFilter.cutoffFrequency, _targetFilterFreq, FilterRecoverySpeed * Time.deltaTime);
            }
        }

        private void OnNoteMiss(NoteMissEvent evt)
        {
            // Apply Vinyl Scratch / Pitch Dip
            MusicSource.pitch = 0.8f;
            _targetPitch = 1f;

            // Apply Muffling
            _targetFilterFreq = MissFilterFrequency;

            // Play Scratch SFX
            if (SfxSource != null && MissScratchSfx != null)
            {
                SfxSource.PlayOneShot(MissScratchSfx, 0.5f);
            }
            
            Debug.Log("<color=red>MusicManager: Miss detected! Applying failure effects.</color>");
        }

        private void OnNoteHit(NoteHitEvent evt)
        {
            // Gradual recovery
            _targetFilterFreq = BaseFilterFrequency;
        }
    }
}
