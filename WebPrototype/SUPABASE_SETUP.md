# 🚀 Guía de Setup - Supabase para Pizza Hero

## Paso 1: Crear Proyecto Supabase

### 1.1 Crear Cuenta
1. Ve a https://supabase.com
2. Click en "Start your project"
3. Sign up con GitHub (recomendado) o email

### 1.2 Crear Proyecto
1. Click en "New Project"
2. Nombre: `pizza-hero-leaderboard`
3. Database Password: **Guarda esta contraseña** (la necesitarás)
4. Region: Elige la más cercana (ej: South America - São Paulo)
5. Plan: Free (suficiente para empezar)
6. Click "Create new project"
7. **Espera 2-3 minutos** mientras se crea

---

## Paso 2: Crear Tabla de Leaderboard

### 2.1 Ir al SQL Editor
1. En el panel izquierdo, click en "SQL Editor"
2. Click en "New query"

### 2.2 Ejecutar este SQL

```sql
-- Crear tabla de leaderboard
CREATE TABLE leaderboard (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 15),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 1000000),
  pizzas INTEGER NOT NULL CHECK (pizzas >= 0),
  grade TEXT NOT NULL CHECK (grade IN ('S', 'A', 'B', 'C', 'D', 'F')),
  accuracy DECIMAL(5,2),
  country TEXT DEFAULT 'XX',
  wallet_address TEXT, -- Para futuro Web3
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para queries rápidas
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_leaderboard_created_at ON leaderboard(created_at DESC);
CREATE INDEX idx_leaderboard_country ON leaderboard(country);

-- Habilitar Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer
CREATE POLICY "Anyone can read leaderboard"
ON leaderboard FOR SELECT
USING (true);

-- Política: Todos pueden insertar (por ahora, mejoraremos después)
CREATE POLICY "Anyone can insert scores"
ON leaderboard FOR INSERT
WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE leaderboard IS 'Global leaderboard for Pizza Hero game';
COMMENT ON COLUMN leaderboard.wallet_address IS 'Web3 wallet address for future NFT/token integration';
```

3. Click en "Run" (o presiona Ctrl+Enter)
4. Deberías ver "Success. No rows returned"

---

## Paso 3: Obtener Credenciales

### 3.1 Project URL y API Key
1. Click en "Settings" (⚙️) en el panel izquierdo
2. Click en "API"
3. Copia estos valores:

**Project URL:**
```
https://tu-proyecto-id.supabase.co
```

**anon/public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

⚠️ **IMPORTANTE:** 
- La `anon key` es segura para usar en el frontend
- NO uses la `service_role key` en el frontend (es secreta)

---

## Paso 4: Configurar en el Código

### 4.1 Crear archivo de configuración

Crea un archivo `supabase-config.js` en tu carpeta WebPrototype:

```javascript
// supabase-config.js
const SUPABASE_CONFIG = {
  url: 'TU_PROJECT_URL_AQUI',
  anonKey: 'TU_ANON_KEY_AQUI'
};
```

### 4.2 Reemplazar valores

Pega tu URL y anon key en el archivo.

---

## Paso 5: Verificar que Funciona

### 5.1 Probar en Supabase Dashboard
1. Ve a "Table Editor" en el panel izquierdo
2. Deberías ver tu tabla `leaderboard`
3. Click en "Insert row"
4. Añade un score de prueba:
   - name: "TEST CHEF"
   - score: 9999
   - pizzas: 5
   - grade: "S"
   - accuracy: 95.5
5. Click "Save"

### 5.2 Ver datos
Deberías ver tu score de prueba en la tabla.

---

## Paso 6: Seguridad Futura (Opcional)

### Para evitar spam/cheating:

```sql
-- Limitar inserts por IP (requiere Edge Functions)
CREATE OR REPLACE FUNCTION check_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Máximo 10 scores por hora por IP
  IF (
    SELECT COUNT(*) 
    FROM leaderboard 
    WHERE created_at > NOW() - INTERVAL '1 hour'
  ) > 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rate_limit_trigger
BEFORE INSERT ON leaderboard
FOR EACH ROW
EXECUTE FUNCTION check_rate_limit();
```

---

## 🎯 Siguiente Paso

Una vez que tengas:
- ✅ Proyecto creado
- ✅ Tabla creada
- ✅ URL y API Key copiadas

**Avísame y continuamos con la integración en el código del juego!**

---

## 📚 Recursos

- **Docs:** https://supabase.com/docs
- **Dashboard:** https://app.supabase.com
- **Discord:** https://discord.supabase.com (comunidad muy activa)

---

## ⚠️ Troubleshooting

**Error: "relation does not exist"**
- Asegúrate de haber ejecutado el SQL correctamente

**Error: "JWT expired"**
- Regenera tu anon key en Settings > API

**No puedo insertar datos:**
- Verifica que RLS esté configurado correctamente
- Revisa las políticas en Authentication > Policies
