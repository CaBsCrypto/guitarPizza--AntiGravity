using UnityEngine;
using Pisadado.Core;

namespace Pisadado.PhaseB
{
    [RequireComponent(typeof(Rigidbody2D), typeof(CircleCollider2D))]
    public class PizzaProjectile : MonoBehaviour
    {
        public bool IsLaunched { get; private set; } = false;
        public PizzaData Payload { get; private set; }
        
        private Rigidbody2D _rb;

        public void Initialize(PizzaData data)
        {
            Payload = data;
        }

        private void Awake()
        {
            _rb = GetComponent<Rigidbody2D>();
            _rb.isKinematic = true; // Wait for launch
        }

        public void Launch(Vector2 force)
        {
            IsLaunched = true;
            _rb.isKinematic = false;
            _rb.AddForce(force, ForceMode2D.Impulse);
            
            // Spin effect
            _rb.AddTorque(-force.x * 0.5f);
            
            EventBus.Publish(new PizzaLaunchedEvent { Velocity = force });
        }

        private void OnCollisionEnter2D(Collision2D collision)
        {
            if (!IsLaunched) return;
            
            // Check for Client or Obstacle
            // Simplified: Destroy on any impact for now
            // Implementation of client logic will handle the "Success" part.
            
            // Destroy(gameObject, 0.5f); // Let it linger a bit
        }
    }
}
