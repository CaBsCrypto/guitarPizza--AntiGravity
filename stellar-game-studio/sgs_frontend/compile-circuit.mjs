/**
 * compile-circuit.mjs
 *
 * Compiles the Guitar Pizza Noir circuit to an ACIR artifact JSON
 * using @noir-lang/noir_wasm (no native nargo required).
 *
 * Usage (from sgs_frontend/):
 *   bun run compile-circuit.mjs
 *
 * Output:
 *   ../circuits/guitar_pizza_proof/target/guitar_pizza_proof.json
 *   src/zk/guitar_pizza_proof.json   ← bundled into frontend
 */

import { createFileManager, compile } from '@noir-lang/noir_wasm';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CIRCUIT_DIR     = resolve(__dirname, '../circuits/guitar_pizza_proof');
const MAIN_NR         = join(CIRCUIT_DIR, 'src', 'main.nr');
const NARGO_TOML      = join(CIRCUIT_DIR, 'Nargo.toml');
const OUTPUT_DIR      = join(CIRCUIT_DIR, 'target');
const OUTPUT_FILE     = join(OUTPUT_DIR, 'guitar_pizza_proof.json');
const FRONTEND_ZK_DIR = resolve(__dirname, 'src/zk');
const FRONTEND_OUT    = join(FRONTEND_ZK_DIR, 'guitar_pizza_proof.json');

console.log('=== Guitar Pizza — Noir Circuit Compiler ===');
console.log('CIRCUIT_DIR:', CIRCUIT_DIR);
console.log('');

// Create output directories
if (!existsSync(OUTPUT_DIR))    mkdirSync(OUTPUT_DIR,    { recursive: true });
if (!existsSync(FRONTEND_ZK_DIR)) mkdirSync(FRONTEND_ZK_DIR, { recursive: true });

// Read source files
const nargoToml = readFileSync(NARGO_TOML, 'utf8');
const mainNr    = readFileSync(MAIN_NR, 'utf8');

console.log('Nargo.toml:', nargoToml.trim());
console.log('');
console.log('main.nr length:', mainNr.length, 'chars');
console.log('');

// noir_wasm panics on Windows absolute paths (D:\...) — use /tmp copy
// The files were pre-copied to /tmp/noir_circuit by the script
const CIRCUIT_DIR_UNIX = '/tmp/noir_circuit';
const fm = createFileManager(CIRCUIT_DIR_UNIX);

// writeFile uses relative paths from the base dir — but the files already
// exist on disk, so the OS-backed manager will read them directly via readFile.
// We just need to make sure compile() is called with the right entry point.

console.log('Compiling circuit...');

try {
  const result = await compile(fm);

  // In noir_wasm v1.0.0-beta, result structure varies
  // Try common shapes
  const program = result.program ?? result.artifact ?? result;

  if (!program || (!program.bytecode && !program.noir_version)) {
    console.error('Unexpected compile result shape:', Object.keys(result));
    process.exit(1);
  }

  const artifact = JSON.stringify(program, null, 2);

  writeFileSync(OUTPUT_FILE, artifact, 'utf8');
  writeFileSync(FRONTEND_OUT, artifact, 'utf8');

  console.log('');
  console.log('✅ Compilation successful!');
  console.log('   Artifact:', OUTPUT_FILE);
  console.log('   Frontend:', FRONTEND_OUT);

  if (program.abi?.parameters) {
    const pub = program.abi.parameters.filter(p => p.visibility === 'public');
    console.log('   Public inputs:', pub.map(p => p.name).join(', '));
  }

} catch (err) {
  console.error('');
  console.error('❌ Compilation failed:', err.message ?? err);
  process.exit(1);
}
