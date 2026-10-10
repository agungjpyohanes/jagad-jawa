import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import { SUPPLEMENTAL_KEYS, OLD_37_KEYS } from '../scripts/kv-export-supplemental.mjs';
import { CANONICAL_KEYS } from '../js/services/datasetManifest.js';

describe('Tooling Payload Supplemental Integrity & Key Isolation', () => {
  const rootDir = process.cwd();
  const publicDataDir = path.resolve(rootDir, 'public/data');
  const payloadPath = path.resolve(rootDir, 'kv-export/wrangler-kv-supplemental-payload.json');

  it('1. SUPPLEMENTAL_KEYS tepat berisi 5 key canonical yang ditentukan', () => {
    assert.equal(SUPPLEMENTAL_KEYS.length, 5, 'SUPPLEMENTAL_KEYS harus tepat berjumlah 5');
    const expected = [
      'wayang:all',
      'pitutur:all',
      'mitologi:all',
      'pustaka:digital',
      'tumpeng:all'
    ];
    assert.deepEqual([...SUPPLEMENTAL_KEYS].sort(), [...expected].sort());
  });

  it('2. Tidak ada duplikasi dalam daftar SUPPLEMENTAL_KEYS', () => {
    const uniqueKeys = new Set(SUPPLEMENTAL_KEYS);
    assert.equal(uniqueKeys.size, SUPPLEMENTAL_KEYS.length, 'Daftar supplemental tidak boleh memiliki duplikat');
  });

  it('3. Tidak satu pun dari 37 key lama masuk ke dalam SUPPLEMENTAL_KEYS', () => {
    const oldSet = new Set(OLD_37_KEYS);
    assert.equal(OLD_37_KEYS.length, 37, 'OLD_37_KEYS harus tepat berjumlah 37 key');
    for (const key of SUPPLEMENTAL_KEYS) {
      assert.equal(
        oldSet.has(key),
        false,
        `Key supplemental "${key}" dilarang keras berada dalam 37 key lama!`
      );
    }
  });

  it('4. Setiap key supplemental memiliki file payload lokal valid dengan hash SHA-256 non-kosong', () => {
    for (const key of SUPPLEMENTAL_KEYS) {
      const meta = CANONICAL_KEYS[key];
      assert.ok(meta, `Key "${key}" harus terdaftar di CANONICAL_KEYS`);
      const filePath = path.join(publicDataDir, meta.filename);
      assert.ok(fs.existsSync(filePath), `File payload fisik "${meta.filename}" harus ada`);

      const raw = fs.readFileSync(filePath, 'utf8');
      assert.ok(raw && raw.length > 0, `File ${meta.filename} tidak boleh kosong`);

      const parsed = JSON.parse(raw);
      assert.equal(typeof parsed, 'object', `Parsed JSON harus berupa object/array`);

      const sha = crypto.createHash('sha256').update(raw).digest('hex');
      assert.equal(sha.length, 64, `SHA-256 harus 64 digit hex string`);
    }
  });

  it('5. File payload wrangler-kv-supplemental-payload.json tepat memuat 5 key dan 0 key lama', () => {
    assert.ok(fs.existsSync(payloadPath), `File ${payloadPath} harus ada`);
    const raw = fs.readFileSync(payloadPath, 'utf8');
    const payloadItems = JSON.parse(raw);

    assert.ok(Array.isArray(payloadItems), 'Payload harus berupa array JSON');
    assert.equal(payloadItems.length, 5, 'Payload harus tepat berisi 5 item');

    const payloadKeyList = payloadItems.map(item => item.key);
    const oldSet = new Set(OLD_37_KEYS);

    // Assert tepat 5 key
    const expected = [
      'wayang:all',
      'pitutur:all',
      'mitologi:all',
      'pustaka:digital',
      'tumpeng:all'
    ];
    assert.deepEqual([...payloadKeyList].sort(), [...expected].sort());

    // Assert 0 key lama
    for (const k of payloadKeyList) {
      assert.equal(oldSet.has(k), false, `Payload supplemental bocor key lama: "${k}"`);
      assert.ok(itemValueValid(payloadItems.find(it => it.key === k)), `Value untuk ${k} harus valid JSON serialized`);
    }
  });

  function itemValueValid(item) {
    if (!item || typeof item.value !== 'string') return false;
    try {
      const p = JSON.parse(item.value);
      return p !== null && typeof p === 'object';
    } catch {
      return false;
    }
  }
});
