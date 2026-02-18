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
        
        [Header("Pizza Progress")]
        public int HitsPerPizza = 20;
        public int PizzaCompletionBonus = 1000;
        
        private int _currentHitCount = 0;
        private PizzaData _currentTargetRecipe;
        private List<IngredientData> _currentIngredients = new List<IngredientData>();
        
        // For Phase B transfer
        public static List<PizzaData> CompletedPizzas = new List<PizzaData>();
        
        // Stats
        public int TotalPizzasCompleted { get; private set; }
        public float PizzaProgress => (float)_currentHitCount / HitsPerPizza;

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
                TotalPizzasCompleted = 0;
                _currentHitCount = 0;
                SelectNewRecipe();
            }
        }

        private void SelectNewRecipe()
        {
            if (PossibleRecipes.Count == 0) return;
            _currentTargetRecipe = PossibleRecipes[Random.Range(0, PossibleRecipes.Count)];
            _currentIngredients.Clear();
            _currentHitCount = 0;
            Debug.Log($"New Pizza Order: {_currentTargetRecipe.DisplayName}");
        }

        private void OnNoteHit(NoteHitEvent evt)
        {
            // Count any hit towards pizza progress
            _currentHitCount++;
            
            // Optional: Track ingredient for visual feedback
            if (evt.Ingredient != null)
            {
                _currentIngredients.Add(evt.Ingredient);
            }
            
            // Check if pizza is complete
            if (_currentHitCount >= HitsPerPizza)
            {
                CompletePizza();
            }
        }

        private void CompletePizza()
        {
            TotalPizzasCompleted++;
            
            Debug.Log($"🍕 ORDER UP! Pizza #{TotalPizzasCompleted} Completed: {_currentTargetRecipe.DisplayName}");
            
            // Add to completed pizzas for Phase B
            CompletedPizzas.Add(_currentTargetRecipe);
            
            // Publish event with bonus score
            EventBus.Publish(new PizzaCompletedEvent 
            { 
                Pizza = _currentTargetRecipe, 
                QualityScore = PizzaCompletionBonus 
            });
            
            // Start next pizza
            SelectNewRecipe();
        }

        public int GetCurrentHitCount() => _currentHitCount;
        public int GetRemainingHits() => HitsPerPizza - _currentHitCount;
    }
}
