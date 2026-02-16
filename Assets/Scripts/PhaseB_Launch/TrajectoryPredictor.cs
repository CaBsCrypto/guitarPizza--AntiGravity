using UnityEngine;

namespace Pisadado.PhaseB
{
    [RequireComponent(typeof(LineRenderer))]
    public class TrajectoryPredictor : MonoBehaviour
    {
        [Header("Config")]
        public int Resolution = 30;
        public float TimeStep = 0.1f;
        
        private LineRenderer _lineRenderer;

        private void Awake()
        {
            _lineRenderer = GetComponent<LineRenderer>();
        }

        public void ShowTrajectory(Vector2 startPos, Vector2 force, float mass, float drag)
        {
            _lineRenderer.enabled = true;
            Vector3[] points = new Vector3[Resolution];
            Vector2 velocity = force / mass;
            
            // Simple Euler integration for prediction
            // Note: Unity physics is complex, this is an approximation.
            // For Arcade feel, it's usually "close enough".
            
            Vector2 currentPos = startPos;
            
            for (int i = 0; i < Resolution; i++)
            {
                points[i] = currentPos;
                
                // v = v + a*t
                // p = p + v*t
                
                // Apply Gravity
                velocity += Physics2D.gravity * TimeStep;
                // Apply Drag (simplified linear)
                velocity *= (1f - drag * TimeStep);
                
                currentPos += velocity * TimeStep;
            }

            _lineRenderer.positionCount = Resolution;
            _lineRenderer.SetPositions(points);
        }

        public void Hide()
        {
            _lineRenderer.enabled = false;
        }
    }
}
