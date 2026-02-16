using System;
using System.Collections.Generic;
using UnityEngine;

namespace Pisadado.Core
{
    /// <summary>
    /// A simple Service Locator implementation for dependency injection.
    /// This allows systems to be decoupled and testable.
    /// </summary>
    public static class ServiceLocator
    {
        private static readonly Dictionary<Type, object> _services = new Dictionary<Type, object>();

        /// <summary>
        /// Registers a service instance.
        /// </summary>
        public static void Register<T>(T service)
        {
            var type = typeof(T);
            if (_services.ContainsKey(type))
            {
                Debug.LogWarning($"Service of type {type.Name} is already registered. Overwriting.");
                _services[type] = service;
            }
            else
            {
                _services.Add(type, service);
            }
        }

        /// <summary>
        /// Retrieves a registered service instance.
        /// </summary>
        public static T Get<T>()
        {
            var type = typeof(T);
            if (!_services.ContainsKey(type))
            {
                Debug.LogError($"Service of type {type.Name} is not registered!");
                return default;
            }
            return (T)_services[type];
        }

        /// <summary>
        /// Unregisters a service.
        /// </summary>
        public static void Unregister<T>()
        {
            var type = typeof(T);
            if (_services.ContainsKey(type))
            {
                _services.Remove(type);
            }
        }
        
        /// <summary>
        /// Clears all services. Useful for testing or scene transitions.
        /// </summary>
        public static void Clear()
        {
            _services.Clear();
        }
    }
}
