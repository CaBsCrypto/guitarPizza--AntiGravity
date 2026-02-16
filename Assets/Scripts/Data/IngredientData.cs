using UnityEngine;

namespace Pisadado.Data
{
    public enum IngredientType
    {
        Dough,
        Sauce,
        Cheese,
        Topping_Meat,
        Topping_Veggie
    }

    [CreateAssetMenu(fileName = "New Ingredient", menuName = "Pisadado/Ingredient Data")]
    public class IngredientData : ScriptableObject
    {
        [Header("Identity")]
        public string Id;
        public string DisplayName;
        public IngredientType Type;
        
        [Header("Visuals")]
        public Sprite Icon;
        public Color DebugColor = Color.white;
        
        [Header("Gameplay Stats")]
        public int ScoreValue = 100;
        [Tooltip("Heavier ingredients require more force in Phase B?")]
        public float PhysicsWeight = 1.0f;
    }
}
