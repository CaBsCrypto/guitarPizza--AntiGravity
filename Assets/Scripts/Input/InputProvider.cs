using UnityEngine;
using System;
using UnityEngine.EventSystems;

namespace Pisadado.Input
{
    /// <summary>
    /// Concrete implementation of IGameInput.
    /// Auto-detects platform or can be forced via inspector.
    /// </summary>
    public class InputProvider : MonoBehaviour, IGameInput
    {
        // Events
        public event Action<int> OnLanePressed;
        public event Action<int> OnLaneReleased;
        public event Action<Vector2> OnLaunchDrag;
        public event Action OnLaunchRelease;

        [Header("Settings")]
        [SerializeField] private bool _forceMobileMode = false;
        
        private bool _isMobile;
        private Camera _mainCamera;

        private void Awake()
        {
            _mainCamera = Camera.main;
            _isMobile = Application.isMobilePlatform || _forceMobileMode;
        }

        private void Update()
        {
            if (_isMobile)
            {
                HandleMobileInput();
            }
            else
            {
                HandleDesktopInput();
            }
        }

        // --- Desktop Implementation (Keyboard keys for lanes) ---
        private void HandleDesktopInput()
        {
            // Phase A: Rhythm - Keys 1, 2, 3, 4 or Q, W, E, R
            if (UnityEngine.Input.GetKeyDown(KeyCode.A)) OnLanePressed?.Invoke(0);
            if (UnityEngine.Input.GetKeyDown(KeyCode.S)) OnLanePressed?.Invoke(1);
            if (UnityEngine.Input.GetKeyDown(KeyCode.K)) OnLanePressed?.Invoke(2);
            if (UnityEngine.Input.GetKeyDown(KeyCode.L)) OnLanePressed?.Invoke(3);
            
            if (UnityEngine.Input.GetKeyUp(KeyCode.A)) OnLaneReleased?.Invoke(0);
            if (UnityEngine.Input.GetKeyUp(KeyCode.S)) OnLaneReleased?.Invoke(1);
            if (UnityEngine.Input.GetKeyUp(KeyCode.K)) OnLaneReleased?.Invoke(2);
            if (UnityEngine.Input.GetKeyUp(KeyCode.L)) OnLaneReleased?.Invoke(3);

            // Phase B: Mouse Drag
            if (UnityEngine.Input.GetMouseButton(0))
            {
                 // Logic for calculating drag delta could go here or be processed by listener
                 // For now, raw mouse position delta isn't directly exposed by Input.
                 // We might pass current position or let the listener calculate delta from start.
                 // Simplified: Passing current mouse position for Drag.
                 // NOTE: Implementation depends on if we want Delta or Position.
                 // Interface said Delta, but often Position is easier to process for "Pull Back" logic.
                 // Let's invoke with Mouse Position for now, listener compares with origin.
                 OnLaunchDrag?.Invoke(UnityEngine.Input.mousePosition);
            }

            if (UnityEngine.Input.GetMouseButtonUp(0))
            {
                OnLaunchRelease?.Invoke();
            }
        }

        // --- Mobile Implementation (Multitouch) ---
        private void HandleMobileInput()
        {
            if (UnityEngine.Input.touchCount == 0) return;

            foreach (var touch in UnityEngine.Input.touches)
            {
                if (IsPointerOverUI(touch.fingerId)) continue;

                // Phase A: Simple screen division for 4 lanes
                // 0-25%, 25-50%, 50-75%, 75-100% width
                if (touch.phase == TouchPhase.Began)
                {
                    float x = touch.position.x / Screen.width;
                    int lane = -1;
                    if (x < 0.25f) lane = 0;
                    else if (x < 0.5f) lane = 1;
                    else if (x < 0.75f) lane = 2;
                    else lane = 3;

                    OnLanePressed?.Invoke(lane);
                }
                
                // Phase B: One finger drag
                if (touch.phase == TouchPhase.Moved)
                {
                    OnLaunchDrag?.Invoke(touch.position); // Sending raw position
                }
                if (touch.phase == TouchPhase.Ended)
                {
                    OnLaunchRelease?.Invoke();
                }
            }
        }

        public bool IsPointerOverUI()
        {
            // Fallback for current mouse
            return EventSystem.current != null && EventSystem.current.IsPointerOverGameObject();
        }

        private bool IsPointerOverUI(int fingerId)
        {
             return EventSystem.current != null && EventSystem.current.IsPointerOverGameObject(fingerId);
        }
    }
}
