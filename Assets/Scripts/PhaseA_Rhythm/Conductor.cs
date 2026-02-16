using UnityEngine;
using Pisadado.Core;

namespace Pisadado.PhaseA
{
    /// <summary>
    /// The Conductor tracks the song position and synchronizes game logic to the beat.
    /// Uses AudioSettings.dspTime for high precision.
    /// </summary>
    public class Conductor : MonoBehaviour
    {
        public static Conductor Instance { get; private set; }

        [Header("Audio Settings")]
        public float SongBpm = 120f;
        public float SecPerBeat;
        public float SongPosition;
        public float SongPositionInBeats;
        public float DspSongTime;
        public float FirstBeatOffset = 0f;

        [Header("Audio Source")]
        public AudioSource MusicSource;

        private bool _isPlaying = false;
        
        public event System.Action<float> OnBeat; // float = beat number

        private void Awake()
        {
            Instance = this;
            SecPerBeat = 60f / SongBpm;
        }

        public void Play()
        {
            if (MusicSource == null) return;
            
            _isPlaying = true;
            DspSongTime = (float)AudioSettings.dspTime;
            MusicSource.Play();
        }

        public void Stop()
        {
            _isPlaying = false;
            MusicSource.Stop();
        }

        private void Update()
        {
            if (!_isPlaying) return;

            // Calculate position in seconds
            SongPosition = (float)(AudioSettings.dspTime - DspSongTime) - FirstBeatOffset;

            // Calculate position in beats
            float previousBeat = SongPositionInBeats;
            SongPositionInBeats = SongPosition / SecPerBeat;

            // Check for integer beat crossing (simplified)
            if ((int)SongPositionInBeats > (int)previousBeat)
            {
                OnBeat?.Invoke(SongPositionInBeats);
            }
        }
        
        public float GetAudioSourceTime()
        {
            return MusicSource.time;
        }
    }
}
