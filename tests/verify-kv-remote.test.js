import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'child_process';
import path from 'path';

const SCRIPT_PATH = path.resolve('scripts/verify-kv-remote.ps1');

test('PowerShell verify-kv-remote.ps1 - Validasi Keadaan 37 Key Lama (Sebelum Supplemental)', () => {
  const fixture = path.resolve('tests/fixtures/mock-kv-37-keys.json');
  const out = execFileSync('powershell', [
    '-ExecutionPolicy', 'Bypass',
    '-File', SCRIPT_PATH,
    '-MockJsonPath', fixture
  ], { encoding: 'utf8' });

  assert.ok(out.includes('Jumlah Key Ditemukan di Remote KV : 37'));
  assert.ok(out.includes('Ada di Remote : 37 / 37'));
  assert.ok(out.includes('Hilang        : 0'));
  assert.ok(out.includes('Sudah Terunggah : 0 / 5'));
  assert.ok(out.includes('Belum Diunggah  : 5 / 5'));
  assert.ok(out.includes('KEADAAN 37 KEY LAMA STABIL'));
});

test('PowerShell verify-kv-remote.ps1 - Validasi Keadaan 42 Key Penuh (Paritas Sempurna)', () => {
  const fixture = path.resolve('tests/fixtures/mock-kv-42-keys.json');
  const out = execFileSync('powershell', [
    '-ExecutionPolicy', 'Bypass',
    '-File', SCRIPT_PATH,
    '-MockJsonPath', fixture
  ], { encoding: 'utf8' });

  assert.ok(out.includes('Jumlah Key Ditemukan di Remote KV : 42'));
  assert.ok(out.includes('Ada di Remote : 37 / 37'));
  assert.ok(out.includes('Sudah Terunggah : 5 / 5'));
  assert.ok(out.includes('Belum Diunggah  : 0 / 5'));
  assert.ok(out.includes('PARITAS PENUH 42/42 TERCAPAI'));
});

test('PowerShell verify-kv-remote.ps1 - Validasi Singleton Object Array (Bukan 0 atau Objek Tunggal Rusak)', () => {
  const fixture = path.resolve('tests/fixtures/mock-kv-singleton.json');
  const out = execFileSync('powershell', [
    '-ExecutionPolicy', 'Bypass',
    '-File', SCRIPT_PATH,
    '-MockJsonPath', fixture
  ], { encoding: 'utf8' });

  assert.ok(out.includes('Jumlah Key Ditemukan di Remote KV : 1'));
  assert.ok(out.includes('Ada di Remote : 1 / 37'));
  assert.ok(out.includes('Hilang        : 36'));
});

test('PowerShell verify-kv-remote.ps1 - Validasi Array Kosong (0 Key)', () => {
  const fixture = path.resolve('tests/fixtures/mock-kv-empty.json');
  const out = execFileSync('powershell', [
    '-ExecutionPolicy', 'Bypass',
    '-File', SCRIPT_PATH,
    '-MockJsonPath', fixture
  ], { encoding: 'utf8' });

  assert.ok(out.includes('Jumlah Key Ditemukan di Remote KV : 0'));
  assert.ok(out.includes('Ada di Remote : 0 / 37'));
  assert.ok(out.includes('Hilang        : 37'));
});

test('PowerShell verify-kv-remote.ps1 - Penolakan Malformed / Non-Array JSON (Tidak Menyimpulkan Key Hilang)', () => {
  const fixture = path.resolve('tests/fixtures/mock-kv-malformed.json');
  let threw = false;
  try {
    execFileSync('powershell', [
      '-ExecutionPolicy', 'Bypass',
      '-File', SCRIPT_PATH,
      '-MockJsonPath', fixture
    ], { encoding: 'utf8', stdio: 'pipe' });
  } catch (err) {
    threw = true;
    const combined = (err.stdout || '') + (err.stderr || '');
    assert.ok(combined.includes('HASIL TIDAK VALID — JANGAN SIMPULKAN KEY HILANG') || combined.includes('HASIL TIDAK VALID - JANGAN SIMPULKAN KEY HILANG'));
  }
  assert.equal(threw, true, 'Harus gagal non-zero exit code saat JSON bukan root array');
});

test('PowerShell verify-kv-remote.ps1 - Penolakan Exit Code Non-Zero Wrangler (Auth / Network Failure)', () => {
  const fixture = path.resolve('tests/fixtures/mock-kv-37-keys.json');
  let threw = false;
  try {
    execFileSync('powershell', [
      '-ExecutionPolicy', 'Bypass',
      '-File', SCRIPT_PATH,
      '-MockJsonPath', fixture,
      '-MockExitCode', '1'
    ], { encoding: 'utf8', stdio: 'pipe' });
  } catch (err) {
    threw = true;
    const combined = (err.stdout || '') + (err.stderr || '');
    assert.ok(combined.includes('HASIL TIDAK VALID — JANGAN SIMPULKAN KEY HILANG') || combined.includes('HASIL TIDAK VALID - JANGAN SIMPULKAN KEY HILANG'));
  }
  assert.equal(threw, true, 'Harus gagal saat Wrangler exit code non-zero');
});
