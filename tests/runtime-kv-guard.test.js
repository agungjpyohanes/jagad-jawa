import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Guard Test — Static JSON Runtime & KV/API Decoupling', () => {
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  const distAssetsDir = path.join(distDir, 'assets');

  it('1. dist/assets/ bundles tidak boleh memuat endpoint /api/data/', () => {
    assert.ok(fs.existsSync(distAssetsDir), 'Folder dist/assets/ harus ada setelah build');
    const jsFiles = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.js'));
    assert.ok(jsFiles.length > 0, 'Harus ada file JS hasil bundle di dist/assets/');

    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf8');
      assert.ok(
        !content.includes('/api/data/'),
        `Bundle "${file}" tidak boleh memanggil atau mereferensikan endpoint "/api/data/"`
      );
    }
  });

  it('2. dist/assets/ bundles tidak boleh membaca env.JAGAD_JAWA_DATA atau env.*KV', () => {
    const jsFiles = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.js'));
    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf8');
      assert.ok(
        !content.includes('JAGAD_JAWA_DATA'),
        `Bundle "${file}" tidak boleh memuat referensi KV binding "JAGAD_JAWA_DATA"`
      );
      assert.ok(
        !content.includes('env.KV') && !content.includes('env.DATA_KV'),
        `Bundle "${file}" tidak boleh memuat referensi env.*KV`
      );
    }
  });

  it('3. dist/assets/ bundles tidak boleh memuat fallback dataset JS tabel penuh', () => {
    const jsFiles = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.js'));
    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf8');
      assert.ok(
        !content.includes('__JAGAD_JAWA_FALLBACK_TABLE_PAYLOAD__'),
        `Bundle "${file}" tidak boleh memuat fallback in-memory dataset payload`
      );
    }
  });

  it('4. wrangler.toml tidak boleh memiliki binding kv_namespaces', () => {
    const wranglerPath = path.join(rootDir, 'wrangler.toml');
    const wranglerContent = fs.readFileSync(wranglerPath, 'utf8');
    assert.ok(
      !wranglerContent.includes('kv_namespaces'),
      'wrangler.toml tidak boleh mendefinisikan binding kv_namespaces'
    );
    assert.ok(
      !wranglerContent.includes('JAGAD_JAWA_DATA'),
      'wrangler.toml tidak boleh memiliki referensi JAGAD_JAWA_DATA'
    );
  });

  it('5. _routes.json tidak ada jika tidak ada folder functions/ (pure static hosting)', () => {
    const functionsDir = path.join(rootDir, 'functions');
    const hasFunctions = fs.existsSync(functionsDir);
    const routesSources = [
      path.join(rootDir, 'public/_routes.json'),
      path.join(distDir, '_routes.json')
    ];

    if (!hasFunctions) {
      for (const routePath of routesSources) {
        assert.ok(
          !fs.existsSync(routePath),
          `File "${routePath}" tidak boleh ada saat repo tidak memiliki functions/ (mencegah invalid include: [] pada Cloudflare Pages)`
        );
      }
    } else {
      for (const routePath of routesSources) {
        assert.ok(fs.existsSync(routePath), `File routes "${routePath}" harus ada saat functions/ ada`);
        const parsed = JSON.parse(fs.readFileSync(routePath, 'utf8'));
        assert.ok(
          Array.isArray(parsed.include) && parsed.include.length > 0,
          `_routes.json (${routePath}) harus memiliki setidaknya satu include jika Functions aktif`
        );
      }
    }
  });

  it('6. Tidak ada folder functions/ di root project', () => {
    const functionsDir = path.join(rootDir, 'functions');
    assert.ok(!fs.existsSync(functionsDir), 'Direktori functions/ harus dihilangkan dari root deployment');
  });

  it('7. Seluruh 42+ dataset JSON statis tersedia di dist/data/', () => {
    const distDataDir = path.join(distDir, 'data');
    assert.ok(fs.existsSync(distDataDir), 'Direktori dist/data/ harus ada');
    const files = fs.readdirSync(distDataDir).filter(f => f.endsWith('.json'));
    assert.ok(files.length >= 42, `dist/data/ harus memuat minimal 42 dataset JSON statis, ditemukan: ${files.length}`);
  });
});
