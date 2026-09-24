import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const raw = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'sasmitha_parsed.json'), 'utf8'));

// Sensitive IDs in kedut
const SENSITIVE_KEDUT_IDS = new Set([48, 49, 60, 61, 62, 63, 64, 65, 66]);

function getKedutCategory(id) {
  if (id >= 1 && id <= 29) return 'Sirah & Pasuryan';
  if (id >= 30 && id <= 47) return 'Asta & Tangan';
  if (id >= 48 && id <= 59) return (id === 48 || id === 49) ? 'Wewengkon Khusus' : 'Salira & Dada';
  if (id >= 60 && id <= 66) return 'Wewengkon Khusus';
  if (id >= 67 && id <= 74) return 'Suku & Sikil';
  return 'Liyané';
}

const kedutEnriched = raw.kedut.map(k => ({
  id: k.id,
  bagian_badan: k.bagian_badan,
  wahanane: k.wahanane,
  kategori: getKedutCategory(k.id),
  is_sensitive: SENSITIVE_KEDUT_IDS.has(k.id)
}));

const impenEnriched = raw.impen.map(im => ({
  id: im.id,
  yen_ngimpi: im.yen_ngimpi,
  pratanda: im.pratanda
}));

const dbContent = `/**
 * Jagad Jawa — Database Sasmitha (Tanda Alam & Tubuh)
 * Disarikan dari sasmitha_gabungan.xlsx
 * 
 * POSISI & SIFAT MODUL:
 * Modul ini diposisikan sebagai sasmitha / tanda alam & tubuh tradisi
 * (bukan nujum matrix atau ramalan pasti, melainkan bacaan sastra tradisi budaya).
 */

export const SASMITHA_IMPEN = ${JSON.stringify(impenEnriched, null, 2)};

export const SASMITHA_KEDUT = ${JSON.stringify(kedutEnriched, null, 2)};

export const SASMITHA_GERAHANA = ${JSON.stringify(raw.gerahana_sasi, null, 2)};

export const SASMITHA_LINDU = ${JSON.stringify(raw.lindu_sasi, null, 2)};

export const SASMITHA_TEJO = ${JSON.stringify(raw.tejo_arah, null, 2)};

export const REF_SASI_JAWA = ${JSON.stringify(raw.ref_sasi_jawa, null, 2)};
`;

fs.writeFileSync(path.join(rootDir, 'js', 'data', 'sasmitha-db.js'), dbContent, 'utf8');
console.log('js/data/sasmitha-db.js generated successfully.');
