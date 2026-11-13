import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { CANONICAL_KEYS, resolveCanonicalKey } from './js/services/datasetManifest.js';

const STUB_FILES = {
  'nujum-matrix.js': `
    import { BINCIL_BILINGUAL_DATA, getBincilArtiBilingual } from './bincil-bilingual.js';
    export { BINCIL_BILINGUAL_DATA, getBincilArtiBilingual };
    export const bincilDatabase = {};
    export const KET_BINCIL = {};
    export const primbonMatrix = {};
    export const nujumMatrix = {};
    export const nujumDatabase = {};
    export const getNujumData = () => ({
      found: true,
      wuku: 'Kuruwelut',
      dino: 'Kamis',
      pasaran: 'Pon',
      padewan: { nama: 'Guru', arti: 'Memberi percobaan, lelemeran', arti_id: 'Memberi percobaan, lelemeran', arti_jv: 'Maringi coban, lelemeran', artiBilingual: { id: 'Memberi percobaan, lelemeran', jv: 'Maringi coban, lelemeran' } },
      paringkelan: { nama: 'Wurukung', arti: 'Lengah', arti_id: 'Lengah', arti_jv: 'Lengah', artiBilingual: { id: 'Lengah', jv: 'Lengah' } },
      pandangon: { nama: 'Wogan', arti: 'Tekun, hemat dan kuat pendirian', arti_id: 'Tekun, hemat dan kuat pendirian', arti_jv: 'Tekun, hemat lan kuwat pendirian', artiBilingual: { id: 'Tekun, hemat dan kuat pendirian', jv: 'Tekun, hemat lan kuwat pendirian' } },
      paarasan: { nama: 'Lakuning Srengenge', arti: 'Pengertian, manis bicaranya, kreatif, selalu kalah bertengkar dan jangan banyak makan', arti_id: 'Pengertian, manis bicaranya, kreatif, selalu kalah bertengkar dan jangan banyak makan', arti_jv: 'Pangerten, manis wicaranipun, kreatif, tansah kalah padu lan mboten akeh mangan', artiBilingual: { id: 'Pengertian, manis bicaranya, kreatif, selalu kalah bertengkar dan jangan banyak makan', jv: 'Pangerten, manis wicaranipun, kreatif, tansah kalah padu lan mboten akeh mangan' } },
      parasan: { nama: 'Lakuning Srengenge', arti: 'Pengertian, manis bicaranya, kreatif, selalu kalah bertengkar dan jangan banyak makan', arti_id: 'Pengertian, manis bicaranya, kreatif, selalu kalah bertengkar dan jangan banyak makan', arti_jv: 'Pangerten, manis wicaranipun, kreatif, tansah kalah padu lan mboten akeh mangan', artiBilingual: { id: 'Pengertian, manis bicaranya, kreatif, selalu kalah bertengkar dan jangan banyak makan', jv: 'Pangerten, manis wicaranipun, kreatif, tansah kalah padu lan mboten akeh mangan' } },
      pancasuda: { nama: 'Satriya Wirang', arti: 'Dimanapun selalu dipermalukan walau beritikad baik dan banyak halangan', arti_id: 'Dimanapun selalu dipermalukan walau beritikad baik dan banyak halangan', arti_jv: 'Ing pundi kemawon tansah dipermalukne sanajan niat sae lan akeh alangan', artiBilingual: { id: 'Dimanapun selalu dipermalukan walau beritikad baik dan banyak halangan', jv: 'Ing pundi kemawon tansah dipermalukne sanajan niat sae lan akeh alangan' } },
      kamarokan: { nama: 'Macan Ketawan', arti: 'Cukupan, disegani tetapi juga dijauhi orang, sering kehilangan, ada niat jelek', arti_id: 'Cukupan, disegani tetapi juga dijauhi orang, sering kehilangan, ada niat jelek', arti_jv: 'Cukupan, disegani nanging ugi dijauhi wong, sering kelangan, wonten niat ala', artiBilingual: { id: 'Cukupan, disegani tetapi juga dijauhi orang, sering kehilangan, ada niat jelek', jv: 'Cukupan, disegani nanging ugi dijauhi wong, sering kelangan, wonten niat ala' } }
    });
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
      out += 'Kadhudhah saking Mitologi Nusantara — Jagad Jawa\\nhttps://jagad-jawa.pages.dev';
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
    sourcemap: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const nid = id.replace(/\\/g, '/');
          if (nid.includes('/modules/sinengker/')) return 'sinengker-chunk';
          if (nid.includes('/modules/pustaka/')) return 'pustaka-chunk';
          if (nid.includes('/modules/sasmitha/')) return 'sasmitha-chunk';
          if (nid.includes('/modules/omah/')) return 'omah-chunk';
          if (nid.includes('/modules/petung-kehidupan/')) return 'petung-kehidupan-chunk';
          if (nid.includes('/modules/ijab/')) return 'ijab-chunk';
          if (nid.includes('/modules/budaya/')) return 'budaya-chunk';
          if (nid.includes('/modules/nujum/')) return 'nujum-chunk';
        }
      }
    }
  }
});
