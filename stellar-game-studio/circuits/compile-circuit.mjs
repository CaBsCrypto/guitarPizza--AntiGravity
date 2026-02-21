/**
 * compile-circuit.mjs
 *
 * Compiles the Guitar Pizza Noir circuit to an ACIR artifact JSON
 * using @noir-lang/noir_wasm (no native nargo required).
 *
 * Usage:
 *   node compile-circuit.mjs
 *   # or
 *   bun run compile-circuit.mjs
 *
 * Output:
 *   guitar_pizza_proof/target/guitar_pizza_proof.json
 *
 * The artifact is then bundled into the frontend for real browser-side
 * Noir proof generation via @noir-lang/noir_js + @noir-lang/backend_barretenberg.
 */

import { compile, createFileManager } from '@noir-lang/noir_wasm';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CIRCUIT_DIR   = resolve(__dirname, 'guitar_pizza_proof');
const SRC_FILE      = join(CIRCUIT_DIR, 'src', 'main.nr');
const OUTPUT_DIR    = join(CIRCUIT_DIR, 'target');
const OUTPUT_FILE   = join(OUTPUT_DIR, 'guitar_pizza_proof.json');

// ── Also copy to frontend src for bundling ───────────────────
const FRONTEND_ZK_DIR = resolve(__dirname, '../sgs_frontend/src/zk');
const FRONTEND_ARTIFACT = join(FRONTEND_ZK_DIR, 'guitar_pizza_proof.json');

console.log('=== Guitar Pizza — Noir Circuit Compiler ===');
console.log('Source :', SRC_FILE);
console.log('Output :', OUTPUT_FILE);
console.log('');

// Create output directories if missing
if (!existsSync(OUTPUT_DIR))    mkdirSync(OUTPUT_DIR, { recursive: true });
if (!existsSync(FRONTEND_ZK_DIR)) mkdirSync(FRONTEND_ZK_DIR, { recursive: true });

// ── Set up in-memory file manager ────────────────────────────
const fm = createFileManager(CIRCUIT_DIR);

console.log('Compiling circuit...');

try {
  const { program, warnings } = await compile(fm);

  if (warnings.length > 0) {
    console.warn('Warnings:');
    warnings.forEach(w => console.warn(' ', w));
  }

  const artifact = JSON.stringify(program, null, 2);

  writeFileSync(OUTPUT_FILE, artifact, 'utf8');
  writeFileSync(FRONTEND_ARTIFACT, artifact, 'utf8');

  console.log('');
  console.log('✅ Compilation successful!');
  console.log('   Circuit artifact written to:');
  console.log('  ', OUTPUT_FILE);
  console.log('  ', FRONTEND_ARTIFACT);

  // Print some stats
  const parsed = JSON.parse(artifact);
  if (parsed.bytecode) {
    console.log('');
    console.log('Circuit stats:');
    console.log('  Bytecode length :', Buffer.from(parsed.bytecode, 'base64').length, 'bytes');
  }
  if (parsed.abi?.parameters) {
    console.log('  Parameters      :', parsed.abi.parameters.length);
    const pub = parsed.abi.parameters.filter(p => p.visibility === 'public');
    console.log('  Public inputs   :', pub.map(p => p.name).join(', '));
  }

} catch (err) {
  console.error('');
  console.error('❌ Compilation failed:', err.message ?? err);
  process.exit(1);
}
