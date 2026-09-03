#!/usr/bin/env node
// Lance tous les tests de tests/security/*.mjs séquentiellement (ils créent
// et suppriment des comptes/documents réels — les paralléliser risquerait
// des interférences entre tests) et résume le résultat. Voir tests/README.md
// pour les prérequis (AW_ADMIN_KEY).
import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'security');
const files = readdirSync(dir).filter((f) => f.endsWith('.test.mjs')).sort();

if (!process.env.AW_ADMIN_KEY) {
  console.error('AW_ADMIN_KEY non défini — voir tests/README.md.');
  process.exit(1);
}

console.log('Lancement de ' + files.length + ' suites de tests de sécurité contre xultra.space (production)...\n');

const results = [];
for (const file of files) {
  console.log('\n' + '='.repeat(70));
  console.log(file);
  console.log('='.repeat(70));
  const r = spawnSync('node', [path.join(dir, file)], { stdio: 'inherit', env: process.env });
  results.push({ file, ok: r.status === 0 });
}

console.log('\n' + '='.repeat(70));
console.log('RÉSUMÉ');
console.log('='.repeat(70));
let allOk = true;
for (const { file, ok } of results) {
  console.log((ok ? 'PASS' : 'FAIL') + ' — ' + file);
  if (!ok) allOk = false;
}
process.exit(allOk ? 0 : 1);
