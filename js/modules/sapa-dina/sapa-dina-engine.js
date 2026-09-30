/**
 * Jagad Jawa — Modul Domain: Sapa Dina Engine
 * Pure computation layer untuk fitur "Sapa Dina" (Ringkasan Harian).
 *
 * ─── INTEGRITAS KODE ───────────────────────────────────────────────────────
 * Modul ini HANYA membaca dari engine yang sudah stabil. Tidak ada satu pun
 * rumus perhitungan yang diubah. Semua kalkulasi didelegasikan ke:
 *   • kalender-engine.js  — getDayInfo, getTanggalJawaLengkap, evaluateDino,
 *                            checkDinoGede, getPranataMangsaLengkap
 *   • calendar.js         — HARI, PASARAN, NEPTU_HARI, NEPTU_PASARAN, GRID,
 *                            getDinoWarnaStatus
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Export utama:
 *   getSapaDinaData(date?)  →  SapaDinaPayload
 *   getDayOfYear(date?)     →  number  (digunakan sebagai seed pitutur)
 */

import {
  getDayInfo,
  getTanggalJawaLengkap,
  getPranataMangsaLengkap,
  evaluateDino,
  checkDinoGede,
  HARI,
  PASARAN,
  NEPTU_HARI,
  NEPTU_PASARAN,
  WUKU,
  DUNUNGE,
  BULAN_MASEHI,
  GRID,
  getDinoWarnaStatus
} from '../kalender/kalender-engine.js';

import { PITUTUR_LIST } from '../../data/pitutur.js';
import { getPetungTetanen } from '../../data/petung-tetanen-db.js';

// ─── NAMA HARI LENGKAP (Bahasa Indonesia, display-friendly) ──────────────────
const HARI_DISPLAY = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN_DISPLAY = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Hitung day-of-year (1–366) sebagai seed deterministik untuk pitutur harian.
 * Semua pengguna pada hari yang sama mendapatkan pitutur yang identik.
 * @param {Date} [date]
 * @returns {number}
 */
export function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Ambil pitutur harian secara deterministik berdasarkan seed.
 * Tidak bergantung pada Math.random() agar konsisten antar session.
 * @param {number} seed
 * @returns {Object} entry dari PITUTUR_LIST
 */
export function getPituturHarian(seed) {
  const list = (typeof PITUTUR_LIST !== 'undefined' && Array.isArray(PITUTUR_LIST))
    ? PITUTUR_LIST
    : [];
  if (!list.length) {
    return {
      jawa: 'Urip iku urup.',
      artiHarfiah: 'Hidup itu hendaknya menyala dan memberi manfaat bagi sesama.',
      makna: '',
      sumber: 'Falsafah Luhur Jawa'
    };
  }
  return list[Math.abs(seed) % list.length];
}

/**
 * Kamus pemetaan arah mata angin tradisional Jawa ke Bahasa Indonesia & ikon.
 */
const ARAH_TRANSLATION_MAP = {
  'Lor Wetan':    { id: 'Timur Laut',   icon: '↗', derajat: 45 },
  'Kulon':        { id: 'Barat',        icon: '←', derajat: 270 },
  'Kidul Wetan':  { id: 'Tenggara',     icon: '↘', derajat: 135 },
  'Ngisor':       { id: 'Bawah (Bumi)', icon: '⬇', derajat: null },
  'Lor Kulon':    { id: 'Barat Laut',   icon: '↖', derajat: 315 },
  'Duwur':        { id: 'Atas (Langit)',icon: '⬆', derajat: null },
  'Lor':          { id: 'Utara',        icon: '↑', derajat: 0 },
  'Kidul Kulon':  { id: 'Barat Daya',   icon: '↙', derajat: 225 },
  'Wetan':        { id: 'Timur',        icon: '→', derajat: 90 },
  'Kidul':        { id: 'Selatan',      icon: '↓', derajat: 180 }
};

/**
 * Menghitung Arah Kolo (dununge wuku / letak Kala) berdasarkan indeks wuku (0-29).
 * Pawukon membagi letak Kala pada setiap wuku sebagai pedoman mawas diri dan keselamatan.
 *
 * @param {number} wukuId — 0-based wuku index (0 = Sinta, ..., 29 = Watugunung)
 * @returns {Object}
 */
export function getArahKolo(wukuId) {
  const wId = (typeof wukuId === 'number' && wukuId >= 0 && wukuId < 30) ? wukuId : 0;
  const arahJawa = (Array.isArray(DUNUNGE) && DUNUNGE[wId]) ? DUNUNGE[wId] : 'Lor Wetan';
  const meta = ARAH_TRANSLATION_MAP[arahJawa] || { id: arahJawa, icon: '🧭', derajat: 0 };
  const wukuNo = wId + 1;
  const isNgisor = (wukuNo === 4 || wukuNo === 14 || wukuNo === 24);
  const isDuwur = (arahJawa === 'Duwur');

  let pantangan = `Aja marani dununge Kala (${arahJawa}) sajroning pitung dina lumampahing wuku iki.`;
  if (isNgisor) {
    pantangan = `Wuku kaping ${wukuNo} (${WUKU[wId]}): Kala ana ing ngisor, aja marani dununge wuku! Prayogi ngati-ati tumrap pakaryan bumi / lemah.`;
  } else if (isDuwur) {
    pantangan = `Kala ana ing dhuwur (langit), prayogi ngedohi lelungan adoh inggil utawa lelayaran ing dhuwur.`;
  }

  return {
    wukuId: wId,
    wukuNo,
    wukuName: WUKU[wId] || '',
    arahJawa,
    arahIndonesia: meta.id,
    icon: meta.icon,
    derajat: meta.derajat,
    isNgisor,
    isDuwur,
    pantangan,
    tegese: `Dununge Kala miturut Pawukon mapan ing arah ${arahJawa} (${meta.id}).`,
    labelDisplay: `${arahJawa} (${meta.id})`
  };
}

/**
 * Susun status Dino Ijo / Dino Abang / Dino Gede beserta label khusus.
 * Mendelegasikan sepenuhnya ke getDinoWarnaStatus dan checkDinoGede.
 *
 * @param {number} wukuId    — 0-based wuku index
 * @param {number} weekdayId — 0=Minggu ... 6=Sabtu
 * @param {number} pasaranId — 0=Legi ... 4=Kliwon
 * @param {number} hd        — hari Hijriyah (untuk deteksi 1 Sura)
 * @param {number} hm        — bulan Hijriyah
 * @returns {Object}
 */
function buildDinoStatus(wukuId, weekdayId, pasaranId, hd, hm) {
  const dinoName    = HARI[weekdayId];
  const pasaranName = PASARAN[pasaranId];
  const wukuName    = WUKU[wukuId];

  // Ambil kode grid (untuk getDinoWarnaStatus)
  const gridRow  = (GRID[wukuId] && GRID[wukuId][weekdayId]) ? GRID[wukuId][weekdayId] : ['', 'G', 0];
  const gridCode = gridRow[0] || '';

  // Status Ijo / Abang dari database CSV (via getDinoWarnaStatus)
  const warnaStatus = getDinoWarnaStatus(dinoName, pasaranName, wukuName, weekdayId === 0, false, gridCode);

  // Deteksi label khusus Dino Gede (Anggara Kasih, Jumat Kliwon, 1 Sura)
  const gedeCheck = checkDinoGede(wukuId, weekdayId, pasaranId, hd, hm);

  // Gabungkan: isGede dari checkDinoGede lebih otoratif
  const isGede   = gedeCheck.isGede || warnaStatus.isGede;
  const gedeLabel = gedeCheck.label || (warnaStatus.isGede ? 'Dino Gede' : '');

  // Label Khusus Kosmik
  let specialLabel = '';
  if (gedeCheck.isSatuSura)      specialLabel = '🌙 1 Sura — Tahun Baru Jawa';
  else if (gedeCheck.isAnggaraKasih) specialLabel = '✦ Anggara Kasih (Selasa Kliwon)';
  else if (gedeCheck.isJumatKliwon)  specialLabel = '✦ Jumat Kliwon — Dina Sakral';
  else if (isGede)                    specialLabel = '★ Dino Gede';

  return {
    isIjo:        warnaStatus.isIjo,
    isAbang:      !warnaStatus.isIjo,
    isGede,
    label:        warnaStatus.label,
    gedeLabel,
    specialLabel,
    badgeHtml:    warnaStatus.badgeHtml,
    statusColor:  warnaStatus.isIjo ? 'ijo' : 'abang',
    // Untuk text-only share
    statusText:   warnaStatus.isIjo ? 'Dino Ijo / Becik ✓' : 'Dino Abang / Ala ✗',
  };
}

/**
 * @typedef {Object} SapaDinaPayload
 * @property {string} hariDisplay       — "Selasa"
 * @property {string} pasaranDisplay    — "Kliwon"
 * @property {string} wetonDisplay      — "Selasa Kliwon"
 * @property {number} neptu             — 14
 * @property {string} neptuBreakdown    — "Selasa (3) + Kliwon (8) = 14"
 * @property {string} wukuDisplay       — "Kulawu"
 * @property {number} wukuNo            — 28
 * @property {string} bulanJawa         — "Ruwah"
 * @property {number} tglJawa           — 29
 * @property {number} tahunAJ           — angka tahun Anno Javanico
 * @property {string} tahunSiklus       — "Jimakir"
 * @property {Object} pranata           — { nama, rentang, musimTani, candrasangkala }
 * @property {Object} dinoStatus        — { isIjo, isAbang, isGede, label, specialLabel, statusColor, ... }
 * @property {Object} pitutur           — { jawa, artiHarfiah, makna, sumber }
 * @property {string} tanggalMasehiStr  — "23 September 2026"
 * @property {string} hariTanggalStr    — "Selasa, 23 September 2026"
 * @property {string} isoDate           — "2026-09-23"
 */

/**
 * Fungsi publik utama: kumpulkan seluruh data Sapa Dina untuk hari ini (atau tanggal tertentu).
 * Semua kalkulasi berat didelegasikan ke engine yang sudah ada.
 *
 * @param {Date} [date=new Date()]
 * @returns {SapaDinaPayload}
 */
export function getSapaDinaData(date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  // ── Kalkulasi dasar dari engine ─────────────────────────────────────────
  const info       = getDayInfo(y, m, d);
  const tglLengkap = getTanggalJawaLengkap(y, m, d);
  const pranata    = getPranataMangsaLengkap(d, m);

  const { weekdayId, pasaranId, wukuId, hijri } = info;
  const [hd, hm]  = hijri; // tanggal & bulan Hijriyah untuk 1 Sura check

  // ── Status Dino ──────────────────────────────────────────────────────────
  const dinoStatus = buildDinoStatus(wukuId, weekdayId, pasaranId, hd, hm);

  // ── Pitutur Harian (deterministik) ───────────────────────────────────────
  const dayOfYear = getDayOfYear(date);
  const pitutur   = getPituturHarian(dayOfYear);

  // ── String Tanggal Display ───────────────────────────────────────────────
  const tanggalMasehiStr = `${d} ${BULAN_DISPLAY[m - 1]} ${y}`;
  const hariDisplay      = HARI_DISPLAY[weekdayId] || tglLengkap.dino;
  const hariTanggalStr   = `${hariDisplay}, ${tanggalMasehiStr}`;

  const pad = n => String(n).padStart(2, '0');
  const isoDate = `${y}-${pad(m)}-${pad(d)}`;

  // ── Neptu Breakdown ───────────────────────────────────────────────────────
  const neptuHari    = NEPTU_HARI[weekdayId] || 0;
  const neptuPasaran = NEPTU_PASARAN[pasaranId] || 0;
  const neptu        = neptuHari + neptuPasaran;
  const neptuBreakdown = `${tglLengkap.dino} (${neptuHari}) + ${tglLengkap.pas} (${neptuPasaran}) = ${neptu}`;

  return {
    // Weton & Neptu
    hariDisplay,
    pasaranDisplay:  tglLengkap.pas,
    wetonDisplay:    `${tglLengkap.dino} ${tglLengkap.pas}`,
    neptu,
    neptuBreakdown,

    // Wuku & Tanggal Jawa
    wukuDisplay:   tglLengkap.wukuName,
    wukuNo:        tglLengkap.wukuNo,
    bulanJawa:     tglLengkap.bulanJawa,
    tglJawa:       tglLengkap.tglJawa,
    tahunAJ:       tglLengkap.tahunAJ,
    tahunSiklus:   tglLengkap.tahunSiklus,
    namaWindu:     tglLengkap.namaWindu,

    // Pranata Mangsa
    pranata: {
      nama:            pranata.nama,
      rentang:         pranata.rentang,
      musimTani:       pranata.musimTani,
      candrasangkala:  pranata.candrasangkala,
      pratandhaAlam:   pranata.pratandhaAlam
    },

    // Petung Tetanen Tradisional (CSV Baru)
    petungTetanen: getPetungTetanen(tglLengkap.dino, tglLengkap.pas),

    // Arah Kolo (Kosmologi Pawukon / Dununge Kala)
    arahKolo: getArahKolo(wukuId),

    // Dino Status
    dinoStatus,

    // Pitutur Luhur
    pitutur,

    // String display
    tanggalMasehiStr,
    hariTanggalStr,
    isoDate,
    dayOfYear
  };
}
