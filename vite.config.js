import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { CANONICAL_KEYS, resolveCanonicalKey } from './js/services/datasetManifest.js';

const STUB_FILES = {
  'nujum-matrix.js': `
    export const bincilDatabase = {};
    export const KET_BINCIL = {};
    export const primbonMatrix = {};
    export const nujumMatrix = {};
    export const nujumDatabase = {};
    export const getNujumData = () => null;
    export const getNujumFromMatrix = () => null;
    export const getNujumFromDatabase = () => null;
  `,
  'petung-tetanen-db.js': `
    export const getPetungTetanen = () => null;
    export default {};
  `,
  'wuku-petenget-db.js': `
    export const getWukuPetenget = () => null;
    export default {};
  `,
  'omah-db.js': `
    export const NEPTU_APP_WETON = [];
    export const NEPTU_OMAH_NB = [];
    export const CEMPURI_ARAH = [];
    export const OMAH_SISA4_SET_A = [];
    export const OMAH_SISA4_SET_B = [];
    export const OMAH_SISA4_SET_C = [];
    export const OMAH_RUMUS = {};
    export const OMAH_MENURUT_SASI = [];
    export const OMAH_MENURUT_MANGSA = [];
    export const OMAH_LARANGAN_ARAH_PINDAH = [];
    export const OMAH_PILIH_LEMAH = [];
  `,
  'wayang.js': `
    export const WAYANG_CHARACTERS = {};
    export const WAYANG_MAP = {};
    export const KATEGORI_LIST = ['Pandawa', 'Punakawan', 'Anak Pandawa', 'Dewa', 'Pelengkap'];
    const _getWayangDs = (ds) => ds || (typeof globalThis !== 'undefined' && globalThis._currentWayangData) || null;
    export const getActiveWayangList = (ds) => {
      const d = _getWayangDs(ds);
      if (!d) return [];
      if (Array.isArray(d)) return d;
      if (Array.isArray(d.wayang_list)) return d.wayang_list;
      return [];
    };
    export const getActiveKategoriList = (ds) => {
      const d = _getWayangDs(ds);
      if (d && Array.isArray(d.kategori_list) && d.kategori_list.length > 0) return d.kategori_list;
      return ['Pandawa', 'Punakawan', 'Anak Pandawa', 'Dewa', 'Pelengkap'];
    };
  `,
  'pitutur.js': `
    export const QUIZ_QUESTIONS = [];
    export default {};
  `,
  'selametan.js': `
    export const TARGET_PASARAN_SELAMETAN = {};
    export const JENIS_SELAMETAN = [];
  `,
  'petung-ternak-loro-geblak.js': `
    export const weton_35 = {};
    export const WETON_35_LIST = [];
    export const KAMUS_WIWIT_TERNAK = [];
    export const KAMUS_JALARAN_LORO = [];
    export const KAMUS_GEBLAK = [];
    export const lookupWetonTernakLoroGeblak = () => null;
  `,
  'pawukon.js': `
    export const PAWUKON_LIST = [];
    export const pawukonDatabase = {};
    export const MASTER_PAWUKON = [];
    export const getPawukonData = () => null;
    export const getPawukonDetail = () => null;
  `,
  'mitologi-nusantara-db.js': `
    const _getMitoDs = (ds) => ds || (typeof globalThis !== 'undefined' && globalThis._currentMitologiData) || null;
    export const getAllMitologiNusantara = (ds) => {
      const d = _getMitoDs(ds);
      if (!d) return [];
      if (Array.isArray(d)) return d;
      if (Array.isArray(d.mitologi_list)) return d.mitologi_list;
      return [];
    };
    export const getMitologiById = (id, ds) => {
      if (!id) return null;
      const list = getAllMitologiNusantara(ds);
      return list.find(m => m && m.id === id) || null;
    };
    export const formatMitologiPlainText = (item) => {
      if (!item) return '';
      let out = '📜 ' + (item.judul || '') + '\\n';
      out += (item.judulJawa || '') + ' (' + (item.aksaraJawa || '') + ')\\n';
      out += 'Kategori: ' + (item.kategori || '') + '\\n';
      out += '====================================================\\n\\n';
      out += 'Ringkasan:\\n' + (item.ringkasan || '') + '\\n\\n';
      if (Array.isArray(item.babList)) {
        item.babList.forEach(b => {
          out += '[ ' + (b.subjudul || '') + ' ]\\n';
          out += (b.teks || '') + '\\n\\n';
        });
      }
      if (item.pesanMoral) {
        out += '💡 Falsafah & Piwulang Luhur:\\n' + item.pesanMoral + '\\n\\n';
      }
      out += 'Kadhudhah saking Mitologi Nusantara — Jagad Jawa\\nhttps://jagad-jawa.web.app';
      return out;
    };
    export const searchMitologiNusantara = (query = '', ds) => {
      const list = getAllMitologiNusantara(ds);
      const q = String(query).toLowerCase().trim();
      if (!q) return list;
      return list.filter(m =>
        (m.judul && m.judul.toLowerCase().includes(q)) ||
        (m.judulJawa && m.judulJawa.toLowerCase().includes(q)) ||
        (m.kategori && m.kategori.toLowerCase().includes(q)) ||
        (m.ringkasan && m.ringkasan.toLowerCase().includes(q))
      );
    };
    export const MITOLOGI_NUSANTARA_DB = [];
    export const KATEGORI_MITOLOGI = [];
    export const PULAU_LIST = [];
  `,
  'tumpeng.js': `
    export const TUMPENG_PARTS = [];
    export const TUMPENG_TYPES = [];
    export const MAKNA_UBARAMPE = {};
  `,
  'marriage.js': `
    export const AKSARA_PERJODOHAN = [];
    export const HASIL_I_JODOH = {};
    export const HASIL_II_JODOH = {};
    export const HASIL_III_JODOH = {};
    export const HASIL_IV_JODOH = {};
    export const HASIL_V_JODOH = {};
    export const HASIL_VI_JODOH = {};
  `,
  'ijab-db.js': `
    export const NEPTU_IJAB_DINA = [];
    export const NEPTU_IJAB_PASARAN = [];
    export const IJAB_WUKU = [];
    export const IJAB_SASI = [];
    export const IJAB_TAHUN_WINDU = [];
    export const IJAB_WETON = [];
    export const KAMUS_SURASA_IJAB = [];
    export const IJAB_TANGGAL_JAWA = [];
    export const REF_DUA_SISTEM_NEPTU = {};
  `,
  'pustaka-db.js': `
    export const PUSTAKA_DATA = {};
    export const PUSTAKA_KATEGORI = [];
    export const PUSTAKA_ENTRI = [];
    export const PUSTAKA_DATA_TERSTRUKTUR = [];
  `,
  'pustaka-digital-db.js': `
    export const NASKAH_KUNO_LIST = [];
    export const KAMUS_JAWA_INDONESIA = [];
    export const KAMUS_JAWA_SANSKERTA = [];
    export const DOKUMEN_REFERENSI_BUDAYA = [];
    export const PUSTAKA_DIGITAL_ENTRI = [];
    export const PUSTAKA_DIGITAL_KATEGORI = [];
  `,
  'pustaka-jawa-db.js': `
    export const getKautamaningLakuList = () => [];
    export const searchKautamaningLaku = () => [];
    export const getRamuanObatList = () => [];
    export const searchRamuanObat = () => [];
    export const getAjiRajahKalacakra = () => ({});
    export const PUSTAKA_JAWA_DB = {};
  `,
  'sasmitha-db.js': `
    export const SASMITHA_IMPEN = [];
    export const SASMITHA_KEDUT = [];
    export const SASMITHA_GERAHANA = [];
    export const SASMITHA_LINDU = [];
    export const SASMITHA_TEJO = [];
    export const REF_SASI_JAWA = [];
  `,
  'sinengker-db.js': `
    export const SINENGKER_DATA = {};
  `,
  'siklus-master-data.js': `
    export const hitungSiklusTahunan = () => ({});
    export const MASTER_SIKLUS_PADEWAN = [];
    export const MASTER_SIKLUS_SHIO = [];
  `,
  'shio-elemen-master-data.js': `
    export const getShioByYear = () => ({});
    export const MASTER_SHIO_DETAIL = {};
    export const MASTER_WU_XING_TAHUN = {};
    export const SHIO_DATA = [];
  `,
  'karakter-pekerjaan-master-data.js': `
    export const hitungKarakterDasar = () => ({});
    export const getWatakDina = () => ({});
    export const getWatakPasaran = () => ({});
    export const getSirikanAdhepOmah = () => ({});
    export const analisisPalenggahan = () => ({});
    export const getPekerjaanPakarti = () => ({});
    export const KARAKTER_DATA = [];
    export const PEKERJAAN_DATA = [];
  `,
  'sasi-jawa-master-data.js': `
    export const getWatakSasiJawa = () => ({});
    export const SASI_JAWA_DATA = [];
  `,
  'pranata-zodiak-data.js': `
    export const getZodiakByDate = () => ({});
    export const getPranataMangsaByDate = () => ({});
    export const PRANATA_MANGSA_DATA = [];
    export const ZODIAK_DATA = [];
  `
};

export default defineConfig({
  root: '.',
  base: './', // Wajib relative path agar CSS/Tailwind & aset statis aman di Vercel/Pages
  server: {
    port: 3000,
    open: false,
    host: true
  },
  plugins: [
    {
      name: 'strip-database-tables-from-bundle',
      enforce: 'pre',
      load(id) {
        const basename = path.basename(id);
        const normalized = id.replace(/\\/g, '/');
        if (STUB_FILES[basename] && normalized.includes('/js/data/')) {
          return STUB_FILES[basename];
        }
      }
    },
    {
      name: 'copy-pwa-assets',
      closeBundle() {
        const distDir = path.resolve(process.cwd(), 'dist');
        if (fs.existsSync(distDir)) {
          const swSrc = path.resolve(process.cwd(), 'sw.js');
          const swDest = path.join(distDir, 'sw.js');
          if (fs.existsSync(swSrc)) {
            fs.copyFileSync(swSrc, swDest);
          }

          const manifestSrc = path.resolve(process.cwd(), 'manifest.webmanifest');
          const manifestDest = path.join(distDir, 'manifest.webmanifest');
          if (fs.existsSync(manifestSrc)) {
            fs.copyFileSync(manifestSrc, manifestDest);
          }
        }
      }
    }
  ],
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true
  }
});
