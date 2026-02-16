using System;
using System.Collections.Generic;
using UnityEngine;

namespace Pisadado.Core
{
    /// <summary>
    /// A simple, type-safe Event Bus for decoupled communication.
    /// Publishers fire events without knowing who is listening.
    /// Listeners subscribe to event types they care about.
    /// </summary>
    public static class EventBus
    {
        private static readonly Dictionary<Type, Delegate> _events = new Dictionary<Type, Delegate>();

        public static void Subscribe<T>(Action<T> listener)
        {
            var type = typeof(T);
            if (!_events.ContainsKey(type))
            {
                _events[type] = null;
            }
            _events[type] = Delegate.Combine(_events[type], listener);
        }

        public static void Unsubscribe<T>(Action<T> listener)
        {
            var type = typeof(T);
            if (_events.ContainsKey(type))
            {
                _events[type] = Delegate.Remove(_events[type], listener);
                if (_events[type] == null)
                {
                    _events.Remove(type);
                }
            }
        }

        public static void Publish<T>(T eventMessage)
        {
            var type = typeof(T);
            if (_events.TryGetValue(type, out var listener))
            {
                (listener as Action<T>)?.Invoke(eventMessage);
            }
        }
        
        public static void Clear()
        {
            _events.Clear();
        }
    }

    // --- Core Events Definition ---
    
    public struct GameStateChangedEvent
    {
        public GameState NewState;
    }

    public enum GameState
    {
        Bootstrap,
        MainMenu,
        PhaseRhythm,
        PhaseLaunch,
        Result
    }
}
