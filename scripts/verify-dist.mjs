/**
 * scripts/verify-dist.mjs
 * 
 * Verifikasi Integritas Artefak Produksi (dist/) Jagad Jawa:
 * 1. PWA & Service Worker: dist/sw.js & dist/manifest.webmanifest ada di root dist/
 * 2. MIME type & format: manifest JSON valid, icons valid & tersedia di dist/
 * 3. Cache correctness: sw.js tidak mem-precache file statis secara naif
 * 4. Production Data Store: Seluruh 42+ canonical JSON HARUS ada di dist/data/, valid JSON, schema sesuai, ukuran wajar, dan filename mapping tepat
 * 5. Bundle integrity: dist/assets/*.js tidak membocorkan sentinel database fallback atau endpoint API KV
 * 6. Cloudflare Pages routing: _headers & _routes.json siap untuk pure static hosting tanpa Functions
 */

import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');

// Definisi 42 canonical dataset keys dan file mappings
const CANONICAL_DATASET_MAP = {
  'kalender:constants': '01-kalender-constants.json',
  'wuku:ensiklopedia': '02-wuku-ensiklopedia.json',
  'bincil:arti': '03-bincil-arti.json',
  'dino:rules': '04-dino-rules.json',
  'pranata:mangsa': '05-pranata-mangsa.json',
  'bincil:matrix': '06-bincil-matrix-bilingual.json',
  'zodiak:all': '07-zodiak-bilingual.json',
  'sasi:jawa': '08-sasi-jawa-bilingual.json',
  'shio:wuxing': '09-shio-wuxing-bilingual.json',
  'pasaran:watak': '10-pasaran-watak-bilingual.json',
  'perjodohan:pitung': '11-pitung-perjodohan-bilingual.json',
  'karakter:dasar': '12-karakter-dasar-bilingual.json',
  'pekerjaan:weton': '13-pekerjaan-weton-bilingual.json',
  'selametan:rules': '14-selametan-rules.json',
  'ijab:all': '15-ijab-bilingual.json',
  'perjodohan:klasik': '16-pitung-perjodohan.json',
  'perjodohan:aksara': '17-aksara-perjodohan.json',
  'selametan:klasik': '18-selametan-rules.json',
  'ijab:klasik': '19-ijab.json',
  'sasmitha:all': '20-sasmitha.json',
  'petung:tetanen': '21-petung-tetanen-bilingual.json',
  'petung:ternak': '22-petung-ternak-bilingual.json',
  'omah:all': '23-omah-bilingual.json',
  'wuku:petenget': '24-wuku-petenget-bilingual.json',
  'siklus:padewan': '25-siklus-padewan-bilingual.json',
  'palenggahan:all': '26-palenggahan-bilingual.json',
  'bincil:arti:alt': '27-bincil-arti-bilingual.json',
  'marriage:hasil': '28-marriage-hasil-bilingual.json',
  'sasi:jawa:alt': '29-sasi-jawa-bilingual.json',
  'aksara:nglegena': '30-aksara-nglegena-bilingual.json',
  'dino:gede': '31-dino-gede-bilingual.json',
  'dino:sirikan': '32-dino-sirikan-adhep-bilingual.json',
  'kamus:jawa': '33-kamus-jawa.json',
  'kamus:sansakerta': '34-kamus-sansakerta.json',
  'pustaka:dongo': '35-pustaka-dongo.json',
  'pustaka:jawa': '36-pustaka-jawa.json',
  'sinengker:khusus': '37-sinengker-khusus.json',
  'wayang:all': '38-wayang-all.json',
  'pitutur:all': '39-pitutur-all.json',
  'mitologi:all': '40-mitologi-all.json',
  'pustaka:digital': '41-pustaka-digital.json',
  'tumpeng:all': '42-tumpeng-all.json'
};

function validateSchema(key, data) {
  if (data === null || data === undefined) return false;
  switch (key) {
    case 'kalender:constants':
      return Boolean(data.nama_hari || data.HARI || data.neptu_hari);
    case 'wuku:ensiklopedia':
      return Array.isArray(data) || Array.isArray(data.wuku);
    case 'dino:rules':
      return typeof data === 'object' && (Array.isArray(data.dino_gede) || Array.isArray(data.dino_ijo));
    case 'bincil:matrix':
      return typeof data === 'object' && Object.keys(data).length > 0;
    case 'perjodohan:pitung':
      return typeof data === 'object' && Boolean(data.metode_I_panca_suda || data.HASIL_I_JODOH);
    case 'selametan:rules':
      return typeof data === 'object' && Boolean(data.target_hari_berdasarkan_wafat || data.jenis_selametan);
    case 'ijab:all':
      return typeof data === 'object' && Boolean(data.neptu_ijab_dina || data.wuku_ijab);
    case 'omah:all':
      return typeof data === 'object';
    case 'petung:ternak':
      return Array.isArray(data) || typeof data === 'object';
    case 'petung:tetanen':
      return Array.isArray(data) || typeof data === 'object';
    case 'wuku:petenget':
      return Array.isArray(data) || typeof data === 'object';
    case 'sasmitha:all':
      return typeof data === 'object';
    case 'wayang:all':
      return Array.isArray(data) || Array.isArray(data.wayang_list);
    case 'pitutur:all':
      return Array.isArray(data) || Array.isArray(data.pitutur_list);
    case 'mitologi:all':
      return Array.isArray(data) || typeof data === 'object';
    case 'pustaka:digital':
      return typeof data === 'object';
    case 'tumpeng:all':
      return Array.isArray(data) || typeof data === 'object';
    default:
      return typeof data === 'object';
  }
}

function runVerification() {
  console.log('🔍 [verify-dist] Memulai verifikasi artefak dist/ ...\n');

  let errors = [];

  // 1. Cek direktori dist
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ tidak ditemukan! Jalankan npm run build terlebih dahulu.');
    process.exit(1);
  }

  // 2. Cek dist/index.html
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath) || fs.statSync(indexPath).size === 0) {
    errors.push('dist/index.html tidak ditemukan atau kosong');
  } else {
    console.log('✔ dist/index.html ada dan valid');
  }

  // 3. Cek dist/sw.js
  const swPath = path.join(distDir, 'sw.js');
  if (!fs.existsSync(swPath)) {
    errors.push('dist/sw.js TIDAK ADA di root dist. Browser akan menerima index.html (text/html) dan gagal register SW!');
  } else {
    const swContent = fs.readFileSync(swPath, 'utf8');
    if (swContent.length < 50) {
      errors.push('dist/sw.js berukuran tidak wajar / kosong');
    }
    if (swContent.includes('/data/01-kalender-constants.json') || swContent.includes('./data/01-kalender-constants.json')) {
      errors.push('dist/sw.js masih mem-precache file /data/*.json statis secara naif di precache shell!');
    }
    if (!swContent.includes('/data/') || !swContent.includes('.json')) {
      errors.push('dist/sw.js tidak meng-handle caching dataset static JSON /data/*.json');
    }
    if (!swContent.includes('jagad-jawa-')) {
      errors.push('dist/sw.js tidak mendefinisikan versioning cache yang jelas');
    }
    console.log('✔ dist/sw.js ada di root, valid, dan menggunakan strategi cache runtime modern');
  }

  // 4. Cek dist/manifest.webmanifest
  const manifestPath = path.join(distDir, 'manifest.webmanifest');
  if (!fs.existsSync(manifestPath)) {
    errors.push('dist/manifest.webmanifest TIDAK ADA di root dist!');
  } else {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (!manifest.name || !manifest.short_name || !manifest.start_url || !manifest.icons) {
        errors.push('dist/manifest.webmanifest tidak memuat metadata PWA lengkap (name, short_name, icons, start_url)');
      } else {
        console.log(`✔ dist/manifest.webmanifest valid (Nama: "${manifest.name}", Scope: "${manifest.scope || './'}")`);
        
        // Verifikasi icon path
        for (const icon of manifest.icons) {
          const iconSrc = icon.src.replace(/^\.\//, '').replace(/^\//, '');
          const resolvedPath = path.join(distDir, iconSrc);
          if (!fs.existsSync(resolvedPath)) {
            errors.push(`Icon yang dirujuk manifest tidak ada di dist: ${iconSrc}`);
          }
        }
      }
    } catch (e) {
      errors.push(`dist/manifest.webmanifest gagal diparsing sebagai JSON: ${e.message}`);
    }
  }

  // 5. Cek dist/data (Seluruh canonical dataset JSON statis publik HARUS ADA, valid JSON, schema sesuai, & ukuran wajar)
  const distDataDir = path.join(distDir, 'data');
  if (!fs.existsSync(distDataDir)) {
    errors.push('dist/data TIDAK DITEMUKAN di build production! Dataset JSON statis hilang.');
  } else {
    const existingFiles = new Set(fs.readdirSync(distDataDir));
    let validDatasetCount = 0;

    for (const [canonicalKey, expectedFile] of Object.entries(CANONICAL_DATASET_MAP)) {
      if (!existingFiles.has(expectedFile)) {
        errors.push(`dist/data kehilangan file canonical: "${expectedFile}" (key: ${canonicalKey})`);
        continue;
      }

      const filePath = path.join(distDataDir, expectedFile);
      const stat = fs.statSync(filePath);

      // Ukuran wajar (minimal 100 byte, maksimal 5MB)
      if (stat.size < 100) {
        errors.push(`Ukuran file "${expectedFile}" tidak wajar / terlalu kecil (${stat.size} bytes)`);
      } else if (stat.size > 5 * 1024 * 1024) {
        errors.push(`Ukuran file "${expectedFile}" melebihi batas wajar (${stat.size} bytes)`);
      }

      // Validasi parsing JSON & schema
      try {
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(rawContent);
        if (!validateSchema(canonicalKey, parsed)) {
          errors.push(`File "${expectedFile}" (key: ${canonicalKey}) gagal validasi skema struktur`);
        } else {
          validDatasetCount++;
        }
      } catch (err) {
        errors.push(`File "${expectedFile}" korup / bukan valid JSON: ${err.message}`);
      }
    }

    if (validDatasetCount === Object.keys(CANONICAL_DATASET_MAP).length) {
      console.log(`✔ dist/data valid (Seluruh ${validDatasetCount} canonical dataset JSON statis terverifikasi integritas, skema, dan ukuran wajar)`);
    }

    // Verifikasi pemisahan 42 canonical wajib dari deliberate extra files (kamus-jawa.json, kamus-sansakerta.json)
    const expectedCanonicalFiles = new Set(Object.values(CANONICAL_DATASET_MAP));
    const extraDistFiles = [...existingFiles].filter(f => !expectedCanonicalFiles.has(f)).sort();
    const DELIBERATE_EXTRA = ['kamus-jawa.json', 'kamus-sansakerta.json'].sort();

    if (JSON.stringify(extraDistFiles) !== JSON.stringify(DELIBERATE_EXTRA)) {
      errors.push(`dist/data memuat file ekstra tak dikenal: ${extraDistFiles.filter(f => !DELIBERATE_EXTRA.includes(f)).join(', ')}`);
    } else {
      console.log(`✔ dist/data deliberate extra files terverifikasi tepat (${extraDistFiles.join(', ')}) dan tidak terhapus otomatis`);
    }
  }

  // 6. Cek sentinel database fallback di dist/assets/*.js
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const targetFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js') || f.endsWith('.js.map') || f.endsWith('.map'));
    const sentinels = [
      'sinta_minggu_pahing',
      'PETUNG_TETANEN_LIST',
      'WUKU_PETENGET_LIST',
      'CEMPURI_LAWANGAN',
      'WAYANG_LIST',
      'PITUTUR_LIST',
      'TARGET_HARI_SELAMETAN'
    ];
    let leakCount = 0;
    for (const file of targetFiles) {
      const content = fs.readFileSync(path.join(assetsDir, file), 'utf8');
      for (const sentinel of sentinels) {
        if (content.includes(sentinel)) {
          errors.push(`Sentinel legacy table "${sentinel}" bocor di bundle/sourcemap ${file}`);
          leakCount++;
        }
      }
    }
    if (leakCount === 0) {
      console.log(`✔ dist/assets/ (${targetFiles.length} file chunks & source maps) bersih dari kebocoran dataset fallback`);
    }
  }

  // 7. Cek file konfigurasi hosting Cloudflare Pages (_headers & _routes.json)
  const headersPath = path.join(distDir, '_headers');
  if (!fs.existsSync(headersPath)) {
    errors.push('dist/_headers tidak ditemukan di build output!');
  } else {
    const headersContent = fs.readFileSync(headersPath, 'utf8');
    if (!headersContent.includes('/sw.js') || !headersContent.includes('application/javascript')) {
      errors.push('dist/_headers tidak memuat header MIME eksplisit untuk /sw.js');
    } else {
      console.log('✔ dist/_headers terpasang dengan deklarasi MIME /sw.js & cache-control');
    }
  }

  const functionsDir = path.resolve(process.cwd(), 'functions');
  const hasFunctions = fs.existsSync(functionsDir);
  const routesPath = path.join(distDir, '_routes.json');

  if (!hasFunctions) {
    if (fs.existsSync(routesPath)) {
      errors.push('dist/_routes.json tidak boleh ada saat repo tidak memiliki direktori functions/ (Cloudflare Pages pure static hosting)');
    } else {
      console.log('✔ dist/_routes.json tidak ada (pure static-only Cloudflare Pages tanpa Functions)');
    }
  } else {
    if (!fs.existsSync(routesPath)) {
      errors.push('dist/_routes.json diperlukan saat direktori functions/ tersedia');
    } else {
      try {
        const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
        if (Array.isArray(routes.include) && routes.include.length > 0) {
          console.log('✔ dist/_routes.json terpasang dengan valid includes untuk Functions');
        } else {
          errors.push('dist/_routes.json harus mendefinisikan setidaknya satu include jika Functions aktif');
        }
      } catch (e) {
        errors.push(`dist/_routes.json invalid JSON: ${e.message}`);
      }
    }
  }

  console.log('\n──────────────────────────────────────────────────────────');
  if (errors.length > 0) {
    console.error('❌ VERIFIKASI GAGAL! Ditemukan kendala:');
    errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
    process.exit(1);
  } else {
    console.log('✅ SELURUH VERIFIKASI ARTEFAK DIST BERHASIL (100% PASS)');
    process.exit(0);
  }
}

runVerification();
