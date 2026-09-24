import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const raw = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'ternak_parsed.json'), 'utf8'));

// Build weton_35 map: weton_35[dina][pasaran]
const weton35Map = {};

// Helper tombo extraction
function extractTombo(tegese) {
  if (!tegese) return 'Karesikan, panyuwunan pangaksama, lan tamba medis.';
  const lower = tegese.toLowerCase();
  if (lower.includes('tombone')) {
    const parts = tegese.split(/tombone/i);
    return parts[1].replace(/^[\s:]+/, '').trim();
  }
  return 'Tamba medis lan panyuwunan pangayoman marang Gusti.';
}

// Practical advice for livestock
function getLivestockAdvice(kode) {
  switch (kode) {
    case 'Gajah':
      return 'Dinten ingkang saé sanget kanggé miwiti ngopeni ternak ageng (sapi, maesa/kebo) utawi komersial. Rejeki dipunpitados gampil tumangkar.';
    case 'Suku':
      return 'Cocok sanget kanggé ternak ingkang dipuntujokaken supados rikat rembaka utawi manak (mendo/wedhus, menda, ayam, unggas).';
    case 'Watu':
      return 'Karakter kuwat lan awèt. Prayogi kanggé kéwan gladhèn, narik kreta/bajak, utawi investasi jangka panjang.';
    case 'Buto':
      return 'Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna.';
    default:
      return 'Jagi karesikan lan kasehatan kandhang.';
  }
}

// Badge color for livestock
function getLivestockBadge(kode) {
  switch (kode) {
    case 'Gajah':
      return { color: 'emerald', label: 'Gajah (Becik Sanget)' };
    case 'Suku':
      return { color: 'teal', label: 'Suku (Rikat Manak)' };
    case 'Watu':
      return { color: 'stone', label: 'Watu (Kukuh Santosa)' };
    case 'Buto':
      return { color: 'amber', label: 'Buto (Perlu Prayitna)' };
    default:
      return { color: 'stone', label: kode };
  }
}

// Wiradat 40 dina for geblak
function getGeblakWiradat(kode, tegese) {
  if (kode === 'Gunung') {
    return 'Kulawarga ingkang katilaran pinaringan kekiyatan mangun kamulyan. Wiradat donga 40 dinten tansah dipunlestantunaken minangka bekti tumrap leluhur.';
  }
  if (kode === 'Segara') {
    return 'Kados jembaring samodra, kulawarga dipunsuwun jembar dhadhanipun, ikhlas, lan nyawiji ing dalem donga wiradat 40 dinten tanpa pedhot.';
  }
  return 'Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.';
}

raw.weton_35.forEach(r => {
  if (!weton35Map[r.dina]) {
    weton35Map[r.dina] = {};
  }
  weton35Map[r.dina][r.pasaran] = {
    id: r.id,
    dina: r.dina,
    pasaran: r.pasaran,
    neptu_dina: r.neptu_dina,
    neptu_pasaran: r.neptu_pasaran,
    neptu_jumlah: r.neptu_jumlah,
    ternak: {
      kode: r.wiwit_ternak,
      tegese: r.tegese_ternak,
      status_ringkas: r.wiwit_ternak === 'Gajah' || r.wiwit_ternak === 'Suku' ? 'Becik' : (r.wiwit_ternak === 'Watu' ? 'Normal' : 'Ala'),
      badge: getLivestockBadge(r.wiwit_ternak),
      saran_praktis: getLivestockAdvice(r.wiwit_ternak)
    },
    loro: {
      kode: r.jalaran_loro,
      tegese: r.tegese_loro,
      tombone: extractTombo(r.tegese_loro),
      disclaimer_medis: 'Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit).'
    },
    geblak: {
      kode: r.petung_geblak,
      tegese: r.tegese_geblak,
      fokus_ditinggal: (r.petung_geblak === 'Gunung')
        ? 'Kulawarga ingkang katilaran pikantuk kamulyan lan katentreman.'
        : ((r.petung_geblak === 'Segara')
          ? 'Kulawarga dipunsuwun jembar manahipun lan tabah ngadhepi pacobaning gesang.'
          : 'Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.'),
      wiradat_40_dina: getGeblakWiradat(r.petung_geblak, r.tegese_geblak),
      disclaimer_adat: 'Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak.'
    }
  };
});

const fileContent = `/**
 * Jagad Jawa — Database Petung Ternak, Loro, & Geblak
 * Disarikan dari petung_ternak_loro_geblak.xlsx
 * 
 * CATATAN PENTING:
 * 1. Menggunakan NEPTU APP standar (bukan neptu ijab).
 * 2. Lookup utama melalui struktur weton_35[dina][pasaran].
 */

export const weton_35 = ${JSON.stringify(weton35Map, null, 2)};

export const WETON_35_LIST = ${JSON.stringify(raw.weton_35, null, 2)};

export const KAMUS_WIWIT_TERNAK = ${JSON.stringify(raw.kamus_wiwit_ternak, null, 2)};

export const KAMUS_JALARAN_LORO = ${JSON.stringify(raw.kamus_jalaran_loro, null, 2)};

export const KAMUS_GEBLAK = ${JSON.stringify(raw.kamus_geblak, null, 2)};

export const REF_NEPTU_APP = ${JSON.stringify(raw.ref_neptu_app, null, 2)};

/**
 * Helper lookup langsung berdasarkan dina & pasaran
 * @param {string} dina - Nama hari (e.g. "Minggu", "Senin")
 * @param {string} pasaran - Nama pasaran (e.g. "Pon", "Wage")
 * @returns {object|null}
 */
export function lookupWetonTernakLoroGeblak(dina, pasaran) {
  if (!dina || !pasaran) return null;
  const dNorm = Object.keys(weton_35).find(k => k.toLowerCase() === String(dina).trim().toLowerCase());
  if (!dNorm) return null;
  const pNorm = Object.keys(weton_35[dNorm]).find(k => k.toLowerCase() === String(pasaran).trim().toLowerCase());
  if (!pNorm) return null;
  return weton_35[dNorm][pNorm];
}
`;

fs.writeFileSync(path.join(rootDir, 'js', 'data', 'petung-ternak-loro-geblak.js'), fileContent, 'utf8');
console.log('js/data/petung-ternak-loro-geblak.js generated successfully.');
