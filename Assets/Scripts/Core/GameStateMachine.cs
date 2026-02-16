using UnityEngine;

namespace Pisadado.Core
{
    public class GameStateMachine
    {
        public GameState CurrentState { get; private set; }

        public void ChangeState(GameState newState)
        {
            if (CurrentState == newState) return;

            Debug.Log($"[GameStateMachine] Changing State: {CurrentState} -> {newState}");
            CurrentState = newState;

            // Notify systems
            EventBus.Publish(new GameStateChangedEvent { NewState = newState });

            // Handle specific transition logic here if needed
            // Or delegate to a State Handler class
        }
    }
}
