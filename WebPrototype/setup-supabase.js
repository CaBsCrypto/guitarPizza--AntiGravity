// SCRIPT DE CONFIGURACIÓN AUTOMÁTICA DE SUPABASE
// Ejecuta esto en la consola del navegador (F12) cuando estés en tu dashboard de Supabase

async function setupSupabaseLeaderboard() {
    console.log('🚀 Iniciando configuración automática...');

    // Reemplaza esto con tu anon key
    const ANON_KEY = 'PEGA_TU_ANON_KEY_AQUI';
    const PROJECT_URL = 'https://lheprumkomyhgowrtczo.supabase.co';

    if (ANON_KEY === 'PEGA_TU_ANON_KEY_AQUI') {
        console.error('❌ ERROR: Necesitas pegar tu anon key primero!');
        console.log('📖 Cómo obtenerla:');
        console.log('1. Settings ⚙️ → API');
        console.log('2. Busca "Project API keys"');
        console.log('3. Copia la key "anon" (empieza con eyJ...)');
        return;
    }

    const supabase = window.supabase.createClient(PROJECT_URL, ANON_KEY);

    // SQL para crear la tabla
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS leaderboard (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 15),
          score INTEGER NOT NULL CHECK (score >= 0 AND score <= 1000000),
          pizzas INTEGER NOT NULL CHECK (pizzas >= 0),
          grade TEXT NOT NULL CHECK (grade IN ('S', 'A', 'B', 'C', 'D', 'F')),
          accuracy DECIMAL(5,2),
          country TEXT DEFAULT 'XX',
          wallet_address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
        ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Anyone can read leaderboard" ON leaderboard;
        CREATE POLICY "Anyone can read leaderboard"
        ON leaderboard FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Anyone can insert scores" ON leaderboard;
        CREATE POLICY "Anyone can insert scores"
        ON leaderboard FOR INSERT WITH CHECK (true);
    `;

    console.log('📝 Creando tabla...');
    console.log('⚠️ NOTA: Este script no puede ejecutar SQL directamente.');
    console.log('📋 Copia el SQL de abajo y pégalo en SQL Editor:');
    console.log('---');
    console.log(createTableSQL);
    console.log('---');

    // Probar conexión
    console.log('🔌 Probando conexión...');
    const { data, error } = await supabase.from('leaderboard').select('count');

    if (error) {
        if (error.message.includes('does not exist')) {
            console.log('⚠️ La tabla no existe todavía. Ejecuta el SQL de arriba primero.');
        } else {
            console.error('❌ Error:', error.message);
        }
    } else {
        console.log('✅ ¡Conexión exitosa! La tabla existe.');
        console.log('🎉 Todo configurado correctamente!');
    }
}

// Ejecutar
setupSupabaseLeaderboard();
