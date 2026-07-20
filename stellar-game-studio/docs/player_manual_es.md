# 🍕 Manual del Jugador — Rhythm Slice

¡Bienvenido a la pizzería de la mafia neoyorquina de los años 80, Benny! Aquí no solo se cocina con amor, se cocina bajo la atenta y estricta mirada de **La Famiglia**. Si quieres sobrevivir y construir tu propio imperio de la masa, debes entender las reglas del juego.

---

## 🎮 1. Cómo Jugar (El Ritmo de la Cocina)

Tu objetivo en el teclado es golpear los ingredientes en el momento exacto en que pasan por la línea de corte al ritmo de la música:

*   **Ingredientes Clave (Hitos)**: 
    *   **🧀 Queso (CHE)**
    *   **🍕 Pepperoni (PEP)**
    *   **🥓 Bacon (BAC)**
    *   **🧅 Cebolla (ONI)**
*   **Trampas (Evítalas)**: Salsa derramada, ingredientes podridos y trampas de la competencia. Golpear una trampa reduce tus puntos y rompe tu racha de Fever.
*   **Fever Multiplier**: Hitea notas de forma consecutiva para activar el estado de **Fever**. Multiplica tus puntos y acelera tu producción.

---

## 🪙 2. La Economía del Padrino ($SLICE e Ingredientes)

Toda tu labor culinaria se traduce en tokens `$SLICE` y materia prima:

1.  **Termina una Canción**: Tus golpes de ingredientes caen directamente en tu inventario como materia prima fresca.
2.  **Somete tu ZK Proof**: Para evitar que la competencia falsifique puntuaciones, tu navegador generará una **Prueba de Conocimiento Cero (ZK Proof)** al finalizar cada canción. Al enviarla on-chain, Stellar verificará tu puntuación sin revelar tus inputs privados y desbloqueará tus recompensas de `$SLICE` e ingredientes.
3.  **El Horno (Baking)**: Combina tus ingredientes en recetas clásicas para hornear pizzas y venderlas a cambio de jugosas sumas de `$SLICE`.

---

## ❄️ 3. La Nevera (Previene la Descomposición)

Los ingredientes frescos no duran para siempre. En la pizzería, **los ingredientes crudos se pudren en 7 días**.

*   **Almacenamiento Clásico**: En tu inventario normal, verás un contador de tiempo. Si llega a cero, el ingrediente expira y se pierde.
*   **Congelar en la Nevera**: Entra a la pestaña **Nevera Vault** en el panel de control. Depositando tus ingredientes crudos pagando una pequeña tarifa plana de **0.5 $SLICE**, los congelarás. Los ingredientes congelados se conservan para siempre y no caducan.

---

## 🔥 4. Recetas del Horno y Leña Premium

El Horno de la Famiglia te permite hornear las siguientes pizzas:

*   **🍕 Margherita**: Requiere Queso. Se cocina en 10 segundos y te paga **15 $SLICE**.
*   **🍖 Pepperoni**: Requiere Queso y Pepperoni. Se cocina en 30 segundos y paga **40 $SLICE**.
*   **⭐ Speciale**: Requiere Queso, Pepperoni y Bacon. Se cocina en 60 segundos y paga **100 $SLICE**.
*   **🍄 Tartufo Prestigio**: Requiere Queso, Cebolla y Trufa Negra. Se cocina en 120 segundos y paga **180 $SLICE**.
*   **✨ Dolce Vita**: Requiere Queso, Higo y Caviar. Se cocina en 180 segundos y paga **250 $SLICE**.

### 🪵 Acelera la Cocina con Leña Premium:
Antes de meter la pizza al horno, selecciona tu combustible:
*   **Leña Común**: Gratis. Cocina al tiempo normal.
*   **Madera de Cerezo**: Cuesta **0.5 $SLICE**. Reduce el tiempo en un 20% y aumenta la recompensa un 10%.
*   **Madera de Mesquite**: Cuesta **1.2 $SLICE**. Reduce el tiempo de cocción en un 45% y aumenta la recompensa un 25%.

---

## 🖼️ Hornos NFT (Multiplicadores de Cocina)

Colecciona y equipa tus Hornos NFT para obtener bonificaciones pasivas permanentes en todo el juego. A mayor rareza, mayor velocidad de horneado y multiplicador de $SLICE:

1.  **The OG Oven** (Común): Bonificaciones base.
2.  **Brick Oven** (Poco Común): $-10\%$ tiempo de horneado.
3.  **Neon Oven** (Raro): $-25\%$ tiempo de horneado y $+10\%$ de recompensa en $SLICE.
4.  **Golden Capo** (Legendario): $-50\%$ tiempo de horneado y $+30\%$ de recompensa en $SLICE.

---

## 👥 5. La Famiglia (Retar a Amigos)

¿Crees que eres el cocinero más rápido de Nueva York? Reta a tu tripulación:
1.  Abre el modal de **Pizzería Clashes**.
2.  Cambia a la pestaña **La Famiglia**.
3.  Agrega la dirección pública de Stellar de tu amigo (ej. `G...`) y asígnale un alias.
4.  Presiona **Retar (⚔️)** para fijar una orden de duelo con un wager en `$SLICE`. El jugador con la prueba ZK de puntuación más alta se lleva todo el bote del escrow de forma automática.
