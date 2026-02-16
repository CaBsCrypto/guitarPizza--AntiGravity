using UnityEngine;
using Pisadado.Core;
using Pisadado.Data;
using System.Collections;

namespace Pisadado.PhaseB
{
    public class ClientController : MonoBehaviour
    {
        public ClientData Data;
        public Transform PlatePoint;
        
        private float _patienceTimer;
        private bool _isSatisfied = false;

        private void Start()
        {
            if (Data != null)
            {
                _patienceTimer = Data.PatienceDuration;
            }
        }

        private void Update()
        {
            if (_isSatisfied) return;

            _patienceTimer -= Time.deltaTime;
            if (_patienceTimer <= 0)
            {
                LeaveAngry();
            }
        }

        private void OnCollisionEnter2D(Collision2D collision)
        {
            if (_isSatisfied) return;
            
            PizzaProjectile pizza = collision.gameObject.GetComponent<PizzaProjectile>();
            if (pizza != null && pizza.IsLaunched)
            {
                ReceivePizza(pizza);
            }
        }

        private void ReceivePizza(PizzaProjectile pizza)
        {
            _isSatisfied = true;
            
            int score = DeliveryValidator.Validate(pizza.Payload, Data);
            bool success = score > 0;
            
            Debug.Log($"Client {Data.DisplayName} received pizza! Score: {score}");
            
            EventBus.Publish(new PizzaDeliveredEvent { Success = success, Score = score });
            
            Destroy(pizza.gameObject);
            
            StartCoroutine(LeaveRoutine());
        }

        private void LeaveAngry()
        {
            Debug.Log($"Client {Data.DisplayName} left angry!");
            EventBus.Publish(new PizzaDeliveredEvent { Success = false, Score = 0 });
            Destroy(gameObject);
        }
        
        private IEnumerator LeaveRoutine()
        {
            yield return new WaitForSeconds(1.0f);
            Destroy(gameObject);
        }
    }
}
