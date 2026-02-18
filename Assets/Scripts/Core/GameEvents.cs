using Pisadado.Data;
using UnityEngine;

namespace Pisadado.Core
{
    // --- Rhythm Phase Events ---
    public struct NoteHitEvent
    {
        public int LaneIndex;
        public bool IsPerfect;
        public int Score;
        public IngredientData Ingredient; // Optional: Pass what trigger
    }

    public struct NoteMissEvent
    {
        public int LaneIndex;
    }

    public struct PizzaCompletedEvent
    {
        public PizzaData Pizza;
        public int QualityScore;
    }

    // --- Combo System Events ---
    public struct ComboMilestoneEvent
    {
        public int ComboCount;
        public int Milestone; // 10, 20, 50, 100, etc.
    }

    public struct FireModeActivatedEvent
    {
        public bool IsActive;
        public int ComboCount;
    }

    // --- Sustained Notes Events ---
    public struct NoteSustainEvent
    {
        public int LaneIndex;
        public float SustainDuration;
        public bool IsComplete;
    }

    // --- Difficulty Events ---
    public struct DifficultyChangedEvent
    {
        public float DifficultyMultiplier;
        public int Level;
    }

    // --- Launch Phase Events ---
    public struct PizzaLaunchedEvent
    {
        public Vector2 Velocity;
    }
    
    public struct PizzaDeliveredEvent
    {
        public bool Success;
        public int Score;
    }
}
