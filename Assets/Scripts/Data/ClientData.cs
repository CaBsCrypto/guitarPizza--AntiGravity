using System.Collections.Generic;
using UnityEngine;

namespace Pisadado.Data
{
    [CreateAssetMenu(fileName = "New Client", menuName = "Pisadado/Client Data")]
    public class ClientData : ScriptableObject
    {
        public string Id;
        public string DisplayName;
        public Sprite Portrait;
        
        [Header("Preferences")]
        public List<IngredientType> PreferredIngredients; // Bonus
        public List<IngredientType> DislikedIngredients; // Penalty
        public bool IsVegetarian; // No Meat allowed
        
        [Header("Stats")]
        public float PatienceDuration = 10f;
        public int BaseReward = 100;
    }
}
