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
