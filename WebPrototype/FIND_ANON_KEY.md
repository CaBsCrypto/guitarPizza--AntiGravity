# 🎯 Guía Visual - Encontrar la Anon Key

## Método 1: Buscar en la página

1. **Abre tu dashboard de Supabase**: https://app.supabase.com
2. **Selecciona tu proyecto** "pizza-hero-leaderboard"
3. **Presiona `Ctrl+F`** (buscar en página)
4. **Escribe**: `anon`
5. **Verás algo como:**
   ```
   anon    public
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   [Copy] [Reveal]
   ```
6. **Click en "Copy"** o **"Reveal"** y copia el texto

---

## Método 2: Navegación manual

### Paso a paso:

1. **Dashboard de Supabase** (deberías estar aquí)
   
2. **Mira el menú de la IZQUIERDA** (sidebar negro/oscuro)

3. **Busca el ícono de engranaje** ⚙️ que dice **"Settings"**
   - Está casi al final del menú
   - Puede decir "Project Settings"

4. **Click en "Settings"**

5. **Se abre un SUBMENÚ** debajo de Settings

6. **Click en "API"** (en ese submenú)

7. **Verás una página con varias secciones:**
   - Configuration
   - **Project API keys** ← AQUÍ ESTÁ
   - JWT Settings

8. **En "Project API keys" verás 2 keys:**
   
   ```
   anon    public
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
   [Copy]
   
   service_role    secret
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
   [Copy]
   ```

9. **Copia la PRIMERA** (anon/public)

---

## Método 3: URL directa

Abre esta URL (reemplaza con tu proyecto):

```
https://app.supabase.com/project/lheprumkomyhgowrtczo/settings/api
```

Deberías ir directo a la página de API keys.

---

## ✅ Cómo saber si es la correcta

La anon key:
- ✅ Empieza con `eyJ`
- ✅ Es MUY larga (~200-300 caracteres)
- ✅ Tiene puntos `.` en el medio
- ✅ Dice "anon" o "public" al lado

---

## 🚨 Si aún no la encuentras

Mándame un screenshot de tu pantalla de Supabase y te señalo exactamente dónde está.

O dime qué ves en el menú izquierdo y te guío paso a paso.
