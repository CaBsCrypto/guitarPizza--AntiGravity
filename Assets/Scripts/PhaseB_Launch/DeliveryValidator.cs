using Pisadado.Data;
using UnityEngine;

namespace Pisadado.PhaseB
{
    public static class DeliveryValidator
    {
        public static int Validate(PizzaData pizza, ClientData client)
        {
            if (pizza == null || client == null) return 0;
            
            int score = client.BaseReward;
            
            // Check Vegetarian
            if (client.IsVegetarian)
            {
                foreach (var ingredient in pizza.RequiredIngredients) // Note: PizzaData only has "Required", but dynamic pizza might have more?
                {
                    // For MVP, we use PizzaData definition. 
                    // ideally we'd pass the specific constructed pizza ingredients.
                    // Assuming PizzaData represents the final product for now.
                    
                    if (ingredient.Type == IngredientType.Topping_Meat)
                    {
                        return 0; // Fail
                    }
                }
            }

            // Check Preferences (Bonus)
            foreach (var pref in client.PreferredIngredients)
            {
                // Verify if pizza has it
                if (HasIngredient(pizza, pref))
                {
                    score += 50;
                }
            }
            
            // Check Dislikes (Penalty)
            foreach (var dislike in client.DislikedIngredients)
            {
                if (HasIngredient(pizza, dislike))
                {
                    score -= 50;
                }
            }

            return Mathf.Max(0, score);
        }

        private static bool HasIngredient(PizzaData pizza, IngredientType type)
        {
            foreach (var ing in pizza.RequiredIngredients)
            {
                if (ing.Type == type) return true;
            }
            return false;
        }
    }
}
