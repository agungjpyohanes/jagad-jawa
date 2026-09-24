import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

const ijab = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'ijab_parsed.json'), 'utf8'));

const ijabJs = `/**
 * Database Petung Ijab (Pernikahan Tradisi Jawa)
 * Disarikan dari ijab_petung_cleaned.xlsx
 * PERHATIAN: Sistem Neptu di sini KHUSUS untuk Ijab, terpisah dari Neptu Kalender standar.
 */

export const NEPTU_IJAB_DINA = ${JSON.stringify(ijab.neptu_ijab_dina, null, 2)};

export const NEPTU_IJAB_PASARAN = ${JSON.stringify(ijab.neptu_ijab_pasaran, null, 2)};

export const IJAB_WUKU = ${JSON.stringify(ijab.ijab_wuku, null, 2)};

export const IJAB_SASI = ${JSON.stringify(ijab.ijab_sasi, null, 2)};

export const IJAB_TAHUN_WINDU = ${JSON.stringify(ijab.ijab_tahun_windu, null, 2)};

export const IJAB_WETON = ${JSON.stringify(ijab.ijab_weton, null, 2)};

export const KAMUS_SURASA_IJAB = ${JSON.stringify(ijab.kamus_surasa_ijab, null, 2)};

export const IJAB_TANGGAL_JAWA = ${JSON.stringify(ijab.ijab_tanggal_jawa, null, 2)};

export const REF_DUA_SISTEM_NEPTU = ${JSON.stringify(ijab.ref_dua_sistem_neptu, null, 2)};
`;

fs.writeFileSync(path.join(rootDir, 'js', 'data', 'ijab-db.js'), ijabJs, 'utf8');
console.log('js/data/ijab-db.js generated successfully.');

const omah = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'omah_parsed.json'), 'utf8'));

const omahJs = `/**
 * Database Petung Omah & Cempuri (Pembangunan, Pindah Rumah, & Lawangan)
 * Disarikan dari petung_omah_cempuri_cleaned.xlsx
 */

export const NEPTU_APP_WETON = ${JSON.stringify(omah.neptu_app_weton, null, 2)};

export const NEPTU_OMAH_NB = ${JSON.stringify(omah.neptu_omah_nb, null, 2)};

export const CEMPURI_LAWANGAN = ${JSON.stringify(omah.cempuri_lawangan, null, 2)};

export const CEMPURI_ARAH = ${JSON.stringify(omah.cempuri_arah, null, 2)};

export const OMAH_SISA4_SET_A = ${JSON.stringify(omah.omah_sisa4_set_a, null, 2)};

export const OMAH_SISA4_SET_B = ${JSON.stringify(omah.omah_sisa4_set_b, null, 2)};

export const OMAH_SISA4_SET_C = ${JSON.stringify(omah.omah_sisa4_set_c, null, 2)};

export const OMAH_RUMUS = ${JSON.stringify(omah.omah_rumus, null, 2)};

export const OMAH_MENURUT_SASI = ${JSON.stringify(omah.omah_menurut_sasi, null, 2)};

export const OMAH_MENURUT_MANGSA = ${JSON.stringify(omah.omah_menurut_mangsa, null, 2)};

export const OMAH_LARANGAN_ARAH_PINDAH = ${JSON.stringify(omah.omah_larangan_arah_pindah, null, 2)};

export const OMAH_PILIH_LEMAH = ${JSON.stringify(omah.omah_pilih_lemah, null, 2)};
`;

fs.writeFileSync(path.join(rootDir, 'js', 'data', 'omah-db.js'), omahJs, 'utf8');
console.log('js/data/omah-db.js generated successfully.');
