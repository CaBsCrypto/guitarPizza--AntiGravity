using UnityEngine;
using System;

namespace Pisadado.Input
{
    /// <summary>
    /// Abstraction for all game input.
    /// Gameplay systems should ONLY listen to this interface.
    /// No direct Unity Input calls allowed in gameplay scripts.
    /// </summary>
    public interface IGameInput
    {
        // Phase A: Rhythm
        event Action<int> OnLanePressed; // Lane index 0-3
        event Action<int> OnLaneReleased;
        
        // Phase B: Launch
        event Action<Vector2> OnLaunchDrag; // Delta drag
        event Action OnLaunchRelease;
        
        // General
        bool IsPointerOverUI();
    }
}
