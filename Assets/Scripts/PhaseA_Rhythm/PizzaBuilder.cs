using UnityEngine;
using System.Collections.Generic;
using Pisadado.Core;
using Pisadado.Data;

namespace Pisadado.PhaseA
{
    public class PizzaBuilder : MonoBehaviour
    {
        [Header("Config")]
        public List<PizzaData> PossibleRecipes;
        
        private PizzaData _currentTargetRecipe;
        private List<IngredientData> _currentIngredients = new List<IngredientData>();
        
        // For Phase B transfer
        public static List<PizzaData> CompletedPizzas = new List<PizzaData>();

        private void Start()
        {
            EventBus.Subscribe<NoteHitEvent>(OnNoteHit);
            EventBus.Subscribe<GameStateChangedEvent>(OnStateChanged);
            
            SelectNewRecipe();
        }

        private void OnDestroy()
        {
            EventBus.Unsubscribe<NoteHitEvent>(OnNoteHit);
            EventBus.Unsubscribe<GameStateChangedEvent>(OnStateChanged);
        }

        private void OnStateChanged(GameStateChangedEvent evt)
        {
            if (evt.NewState == GameState.PhaseRhythm)
            {
                CompletedPizzas.Clear();
                SelectNewRecipe();
            }
        }

        private void SelectNewRecipe()
        {
            if (PossibleRecipes.Count == 0) return;
            _currentTargetRecipe = PossibleRecipes[Random.Range(0, PossibleRecipes.Count)];
            _currentIngredients.Clear();
            Debug.Log($"Target Recipe: {_currentTargetRecipe.DisplayName}");
        }

        private void OnNoteHit(NoteHitEvent evt)
        {
            if (evt.Ingredient == null) return; // Should pass ingredient in NoteHitEvent!

            _currentIngredients.Add(evt.Ingredient);
            
            CheckCompletion();
        }

        private void CheckCompletion()
        {
            // Simplified Logic: If we have enough ingredients, complete it.
            // Improve: Match specific ingredients to recipe.
            
            if (_currentIngredients.Count >= _currentTargetRecipe.RequiredIngredients.Count)
            {
                // Pizza Done!
                Debug.Log($"Pizza Completed: {_currentTargetRecipe.DisplayName}");
                CompletedPizzas.Add(_currentTargetRecipe);
                
                EventBus.Publish(new PizzaCompletedEvent { Pizza = _currentTargetRecipe, QualityScore = 100 });
                
                SelectNewRecipe();
            }
        }
    }
}
