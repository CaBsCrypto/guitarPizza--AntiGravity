# 🎮 Cómo Conectar el Popup de Nombre al Final del Juego

## Paso Final: Conectar con Game Over

Necesitas llamar a `showNamePopup()` cuando el juego termine. Busca en tu código donde se muestra la pantalla de resultados y añade esta línea:

### Ejemplo de Integración

```javascript
// Cuando el juego termina y se calculan los resultados
function endGame() {
    // ... tu código existente para calcular score, pizzas, etc ...
    
    const finalScore = totalScore;
    const finalPizzas = pizzasCompleted;
    const finalGrade = calculateGrade(accuracy); // Tu función de grade
    const finalAccuracy = accuracy;
    
    // Mostrar pantalla de resultados
    document.getElementById('results').style.display = 'flex';
    document.getElementById('resScore').innerText = finalScore;
    document.getElementById('resPizzas').innerText = finalPizzas;
    document.getElementById('resGrade').innerText = finalGrade;
    document.getElementById('resAccuracy').innerText = finalAccuracy.toFixed(1) + '%';
    
    // ⭐ AÑADIR ESTA LÍNEA ⭐
    // Mostrar popup de nombre para el leaderboard
    showNamePopup({
        score: finalScore,
        pizzas: finalPizzas,
        grade: finalGrade,
        accuracy: finalAccuracy
    });
}
```

### Ubicación Probable

Busca en tu código por:
- `gameState = 'over'` o `gameState = 'result'`
- `results.style.display`
- Donde se actualiza `resScore`, `resPizzas`, etc.

### Ejemplo Completo

```javascript
// En tu game loop o función de game over
if (gameOver) {
    // Calcular stats finales
    const stats = {
        score: totalScore,
        pizzas: pizzasCompleted,
        grade: calculateGrade(perfectHits, totalHits),
        accuracy: (perfectHits / totalHits) * 100
    };
    
    // Actualizar UI de resultados
    updateResultsScreen(stats);
    
    // Mostrar popup de nombre
    showNamePopup(stats);
}
```

## Testing

1. **Juega una partida completa**
2. **Al terminar, deberías ver:**
   - Pantalla de resultados
   - Popup de nombre encima
3. **Ingresa tu nombre** (3-15 caracteres)
4. **Click en "SUBMIT TO LEADERBOARD"**
5. **Verifica:**
   - Console muestra: `✅ Score submitted for TU_NOMBRE`
   - Si Supabase está configurado: `✅ Score submitted to global leaderboard`
   - Leaderboard local se actualiza con tu nombre

## Debugging

Si el popup no aparece:

```javascript
// Añade esto temporalmente para probar
console.log('Game ended, showing name popup');
showNamePopup({
    score: 12345,
    pizzas: 10,
    grade: 'A',
    accuracy: 85.5
});
```

## Próximos Pasos

Una vez que el popup funcione:

1. **Configurar Supabase** (sigue SUPABASE_SETUP.md)
2. **Actualizar supabase-config.js** con tus credenciales
3. **Probar leaderboard global**
4. **(Opcional) Añadir tabs Local/Global en el leaderboard**

¿Necesitas ayuda para encontrar donde se maneja el game over en tu código?
