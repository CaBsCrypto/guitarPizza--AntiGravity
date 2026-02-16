using System.Collections.Generic;
using UnityEngine;

namespace Pisadado.Data
{
    [CreateAssetMenu(fileName = "New Pizza Recipe", menuName = "Pisadado/Pizza Recipe")]
    public class PizzaData : ScriptableObject
    {
        [Header("Identity")]
        public string Id;
        public string DisplayName;
        
        [Header("Requirements")]
        public List<IngredientData> RequiredIngredients;
        
        [Header("Rewards")]
        public int CompletionBonus = 500;
    }
}
