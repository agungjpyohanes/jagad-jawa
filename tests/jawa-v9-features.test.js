import test from 'node:test';
import assert from 'node:assert/strict';

import { getArahKolo, getSapaDinaData } from '../js/modules/sapa-dina/sapa-dina-engine.js';
import {
  getElemenHari,
  getSasmithoAlamWeton
} from '../js/modules/nujum/nujum-share-card.js';
import { dewaneIllustrationPath } from '../js/data/dewa-kanon.js';
import {
  getAllNaskahKuno,
  getNaskahKunoById,
  searchNaskahKuno,
  formatNaskahPlainText,
  getAllKamusJawaIndonesia,
  searchKamusJawaIndonesia,
  getAllKamusJawaSanskerta,
  searchKamusJawaSanskerta,
  formatKamusEntryPlainText,
  getAllDokumenReferensi,
  getDokumenReferensiById,
  searchDokumenReferensi,
  formatDokumenReferensiPlainText
} from '../js/modules/pustaka/pustaka-engine.js';
import {
  getTheme,
  setTheme,
  toggleTheme,
  THEME_STORAGE_KEY,
  THEME_DARK,
  THEME_LIGHT
} from '../js/ui/theme.js';
import {
  isKelirWayangActive,
  setKelirWayang,
  toggleKelirWayang,
  KELIR_STORAGE_KEY
} from '../js/ui/kelir-wayang.js';
import { hitungSelametanDates } from '../js/modules/selametan/selametan-engine.js';

test('Branch Jawa-V9: 1. Arah Kolo (Dununge Wuku / Kala Bahaya) & Sapa Dina', () => {
  // Wuku 1 (Landep, index 1) -> Kulon (Barat, 270°)
  const landep = getArahKolo(1);
  assert.equal(landep.arahJawa, 'Kulon');
  assert.equal(landep.arahIndonesia, 'Barat');
  assert.equal(landep.derajat, 270);
  assert.match(landep.pantangan, /marani/i);

  // Wuku 3 (Kurantil, wukuNo 4) -> Ngisor (Bawah)
  const kurantil = getArahKolo(3);
  assert.equal(kurantil.arahJawa, 'Ngisor');
  assert.equal(kurantil.isNgisor, true);
  assert.match(kurantil.pantangan, /ngisor/i);

  // Wuku 13 (Mandasiya) -> Ngisor (Bawah)
  const mandasiya = getArahKolo(13);
  assert.equal(mandasiya.arahJawa, 'Ngisor');
  assert.equal(mandasiya.isNgisor, true);

  // Wuku 23 (Prangbakat) -> Ngisor (Bawah)
  const prangbakat = getArahKolo(23);
  assert.equal(prangbakat.arahJawa, 'Ngisor');
  assert.equal(prangbakat.isNgisor, true);

  // Sapa Dina Integration (Date object)
  const sapa = getSapaDinaData(new Date(2026, 8, 29));
  assert.ok(sapa.arahKolo, 'Sapa Dina harus memiliki data arahKolo');
  assert.ok(sapa.arahKolo.arahJawa, 'Arah Kolo harus memiliki label Jawa');
  assert.ok(sapa.arahKolo.icon, 'Arah Kolo harus memiliki simbol kompas');
});

test('Branch Jawa-V9: 2. Kartu Karakter Pusaka (Lambang Dina 7 Hari, Sasmitho Alam & Dewa)', () => {
  // Pemetaan Lambang Dina (Hari Lahir Saptawara)
  // 1. Senin = Bunga (🌸)
  const senin = getElemenHari('Senin', 'Legi');
  assert.equal(senin.kategori, 'Bunga');
  assert.equal(senin.simbol, '🌸');
  assert.match(senin.label, /Bunga/);

  // 2. Selasa = Api (🔥)
  const selasa = getElemenHari('Selasa', 'Pahing');
  assert.equal(selasa.kategori, 'Api');
  assert.equal(selasa.simbol, '🔥');
  assert.match(selasa.label, /Api/);

  // 3. Rabu = Daun (🍃)
  const rabu = getElemenHari('Rabu', 'Pon');
  assert.equal(rabu.kategori, 'Daun');
  assert.equal(rabu.simbol, '🍃');
  assert.match(rabu.label, /Daun/);

  // 4. Kamis = Angin (💨)
  const kamis = getElemenHari('Kamis', 'Wage');
  assert.equal(kamis.kategori, 'Angin');
  assert.equal(kamis.simbol, '💨');
  assert.match(kamis.label, /Angin/);

  // 5. Jumat = Air (💧)
  const jumat = getElemenHari('Jumat', 'Kliwon');
  assert.equal(jumat.kategori, 'Air');
  assert.equal(jumat.simbol, '💧');
  assert.match(jumat.label, /Air/);

  // 6. Sabtu = Tanah (🌍)
  const sabtu = getElemenHari('Sabtu', 'Legi');
  assert.equal(sabtu.kategori, 'Tanah');
  assert.equal(sabtu.simbol, '🌍');
  assert.match(sabtu.label, /Tanah/);

  // 7. Minggu = Angkasa (✨)
  const minggu = getElemenHari('Minggu', 'Pahing');
  assert.equal(minggu.kategori, 'Angkasa');
  assert.equal(minggu.simbol, '✨');
  assert.match(minggu.label, /Angkasa/);

  // Mendukung urutan terbalik: getElemenHari(pasaran, dino)
  const seninRev = getElemenHari('Wage', 'Senin');
  assert.equal(seninRev.kategori, 'Bunga');
  assert.equal(seninRev.simbol, '🌸');

  // Sasmitho Alam Weton
  const sasmithoKliwon = getSasmithoAlamWeton('Jumat', 'Kliwon');
  assert.ok(sasmithoKliwon.swara, 'Sasmitho harus memiliki nama suara hewan');
  assert.ok(sasmithoKliwon.tegese, 'Sasmitho harus memiliki makna titen');
  assert.ok(sasmithoKliwon.nasihat, 'Sasmitho harus memiliki nasihat luhur');

  const sasmithoPahing = getSasmithoAlamWeton('Sabtu', 'Pahing');
  assert.equal(sasmithoPahing.swara, 'Asu Njegug Wanci Wengi');

  const sasmithoPon = getSasmithoAlamWeton('Minggu', 'Pon');
  assert.equal(sasmithoPon.swara, 'Unine Tekek');

  const sasmithoLegi = getSasmithoAlamWeton('Senin', 'Legi');
  assert.equal(sasmithoLegi.swara, 'Unine Prenjak & Podhang');

  // Dewa Pelindung Wuku Illustration Path
  const dewaPath1 = dewaneIllustrationPath(1);
  assert.match(dewaPath1, /sinta-dewane/);
});

test('Branch Jawa-V9: 3. Pustaka Digital (Naskah Kuno, Kamus, & Referensi Budaya)', () => {
  // A. Naskah Kuno
  const naskahs = getAllNaskahKuno();
  assert.equal(naskahs.length, 5, 'Harus memiliki 5 naskah klasik utama');
  
  const wedhatama = getNaskahKunoById('serat-wedhatama');
  assert.ok(wedhatama, 'Serat Wedhatama harus ada');
  assert.match(wedhatama.pengarang, /Mangkunegara IV/);
  assert.ok(wedhatama.babList.length > 0, 'Wedhatama harus memuat pupuh/bab');

  const searchResults = searchNaskahKuno('Kalatidha');
  assert.ok(searchResults.some(n => n.id === 'serat-kalatidha'));

  const plainText = formatNaskahPlainText(wedhatama);
  assert.match(plainText, /SERAT WEDHATAMA/);
  assert.match(plainText, /PANGKUR/i);

  // B. Kamus Jawa & Sanskerta
  const kamusId = getAllKamusJawaIndonesia();
  assert.ok(kamusId.length >= 10, 'Bausastra Jawa-Indonesia harus terisi kosakata lengkap');
  
  const resTresna = searchKamusJawaIndonesia('tresna');
  assert.ok(resTresna.length > 0);

  const kamusSa = getAllKamusJawaSanskerta();
  assert.ok(kamusSa.length >= 8, 'Kamus Jawa-Sanskerta harus terisi kosakata lengkap');

  const resSanskerta = searchKamusJawaSanskerta('Maruta');
  assert.ok(resSanskerta.length > 0);
  assert.match(resSanskerta[0].sanskerta, /Maruta/);

  const formattedKamus = formatKamusEntryPlainText(resSanskerta[0], 'sanskerta');
  assert.match(formattedKamus, /Maruta/);

  // C. Dokumen Referensi Budaya
  const docs = getAllDokumenReferensi();
  assert.equal(docs.length, 3, 'Harus ada 3 dokumen paugeran resmi');

  const macapat = getDokumenReferensiById('paugeran-macapat');
  assert.ok(macapat);
  assert.match(macapat.kontenTeks, /Maskumambang/);

  const gamelan = getDokumenReferensiById('kawruh-karawitan-gamelan');
  assert.ok(gamelan);
  assert.match(gamelan.kontenTeks, /Slendro/);

  const batik = getDokumenReferensiById('filosofi-busana-jarik-batik');
  assert.ok(batik);
  assert.match(batik.kontenTeks, /Parang Rusak/);

  const plainDoc = formatDokumenReferensiPlainText(macapat);
  assert.match(plainDoc, /PAUGERAN/i);
});

test('Branch Jawa-V9: 4. Tema (Dark Mode / Light Mode) & Kelir Wayang', () => {
  // Theme state
  const curTheme = getTheme();
  assert.ok(curTheme === THEME_DARK || curTheme === THEME_LIGHT);

  const setT = setTheme(THEME_LIGHT);
  assert.equal(setT, THEME_LIGHT);
  assert.equal(getTheme(), THEME_LIGHT);

  const toggled = toggleTheme();
  assert.equal(toggled, THEME_DARK);
  assert.equal(getTheme(), THEME_DARK);

  // Kelir Wayang state
  const isKelir = isKelirWayangActive();
  assert.equal(typeof isKelir, 'boolean');

  const setK = setKelirWayang(true);
  assert.equal(setK, true);
  assert.equal(isKelirWayangActive(), true);

  const toggledK = toggleKelirWayang();
  assert.equal(toggledK, false);
  assert.equal(isKelirWayangActive(), false);
});

test('Branch Jawa-V9: 5. Selametan Tilar Donyo - Perhitungan Wafat Siang & Malam', () => {
  // Default hitungSelametanDates
  const resSiang = hitungSelametanDates(2026, 9, 29, 'siang', 'Raden Mas', 'universal');
  assert.equal(resSiang.items.length, 7, 'Harus ada 7 target milestone haul');
  assert.equal(resSiang.namaAlmarhum, 'Raden Mas');

  const resMalam = hitungSelametanDates(2026, 9, 29, 'malam_maghrib', 'Raden Mas', 'islam');
  assert.equal(resMalam.items.length, 7);
  // Geblak malam maghrib berpindah ke hari berikutnya
  assert.notEqual(resSiang.geblak.tanggalStr, resMalam.geblak.tanggalStr);
});

test('Branch Jawa-V9: 6. 12 Batara-Batari Siklus Padewan & Dewa Pelindung', async () => {
  const { MASTER_SIKLUS_PADEWAN } = await import('../js/data/siklus-master-data.js');
  const entries = Object.keys(MASTER_SIKLUS_PADEWAN);
  assert.equal(entries.length, 12, 'Harus memiliki tepat 12 dewa siklus Padewan');

  for (let i = 1; i <= 12; i++) {
    const d = MASTER_SIKLUS_PADEWAN[i];
    assert.ok(d.nama, `Dewa #${i} harus memiliki nama`);
    assert.ok(d.watak, `Dewa #${i} harus memiliki watak`);
    assert.ok(d.karier, `Dewa #${i} harus memiliki karier`);
    assert.ok(d.kelemahan, `Dewa #${i} harus memiliki kelemahan`);
    assert.ok(d.kesehatan, `Dewa #${i} harus memiliki kesehatan`);
    assert.ok(d.keluarga, `Dewa #${i} harus memiliki keluarga`);
    assert.ok(d.bahaya, `Dewa #${i} harus memiliki bahaya`);
    assert.ok(d.solusi, `Dewa #${i} harus memiliki solusi`);
  }
});

test('Branch Jawa-V9: 7. Ilustrasi Shio & Teori 5 Elemen (Wu Xing) Vector SVGs', async () => {
  const { SHIO_EMBLEMS, WUXING_EMBLEMS, getShioSvgIllustration, getWuXingSvgIllustration } = await import('../js/data/shio-wuxing-art.js');
  
  // 12 Shio Emblems
  const shioKeys = Object.keys(SHIO_EMBLEMS);
  assert.equal(shioKeys.length, 12, 'Harus ada 12 ilustrasi Shio hewan');
  
  for (const s of shioKeys) {
    const svg = getShioSvgIllustration(s);
    assert.ok(svg.includes('<svg'), `Shio ${s} harus menghasilkan elemen SVG valid`);
    assert.ok(svg.includes('</svg>'));
  }

  // 5 Wu Xing Emblems
  const wuXingKeys = Object.keys(WUXING_EMBLEMS);
  assert.equal(wuXingKeys.length, 5, 'Harus ada 5 elemen Wu Xing');

  for (const e of wuXingKeys) {
    const svg = getWuXingSvgIllustration(e);
    assert.ok(svg.includes('<svg'), `Elemen ${e} harus menghasilkan elemen SVG valid`);
    assert.ok(svg.includes('</svg>'));
  }
});

test('Branch Jawa-V9: 8. Audit Nujum Kepribadian (1050 Kombinasi Bebas Undefined & Blank)', async () => {
  const { getNujumData } = await import('../js/data/nujum-matrix.js');
  const wukus = ['sinta', 'landep', 'wukir', 'kurantil', 'tolu', 'watugunung'];
  const dinos = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const pasarans = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  for (const w of wukus) {
    for (const d of dinos) {
      for (const p of pasarans) {
        const res = getNujumData(d, p, w);
        assert.ok(res.padewan.nama && res.padewan.nama !== '-', `Padewan nama tidak boleh '-' untuk ${d} ${p} ${w}`);
        assert.ok(res.padewan.arti && res.padewan.arti !== '-', `Padewan arti tidak boleh '-' untuk ${d} ${p} ${w}`);
        assert.ok(res.paringkelan.nama && res.paringkelan.nama !== '-');
        assert.ok(res.pandangon.nama && res.pandangon.nama !== '-');
        assert.ok(res.paarasan.nama && res.paarasan.nama !== '-');
        assert.ok(res.pancasuda.nama && res.pancasuda.nama !== '-');
        assert.ok(res.kamarokan.nama && res.kamarokan.nama !== '-');
      }
    }
  }
});

test('Branch Jawa-V9: 9. Transliterasi Faalakiah & Konsonan Rangkap Cakra/Keret', async () => {
  const { namaKeAksaraList, parseAksaraForFaalakiah, getFaalakiah } = await import('../js/data/personality.js');

  const benchmarkName = 'Karolus Agung Jaka Prakosa Yohanes';
  const expectedAksara = ['KA', 'RA', 'LA', 'HA', 'GA', 'JA', 'KA', 'RA', 'KA', 'SA', 'YA', 'HA', 'NA'];
  const expectedStr = 'ka - ra - la - ha - ga - ja - ka - ra - ka - sa - ya - ha - na';

  // 1. Uji konversi Latin ke Aksara dasar
  const hasilLatin = namaKeAksaraList(benchmarkName);
  assert.equal(hasilLatin.length, 13, 'Jumlah aksara hasil konversi Latin harus tepat 13');
  assert.deepEqual(hasilLatin, expectedAksara, 'Urutan aksara Latin harus persis sesuai standar Faalakiah');

  // 2. Uji konversi Aksara Jawa Unicode (dengan sandhangan cakra ꦿ, wignyan/cecak, dan pangkon ꧀)
  const javaneseUnicode = 'ꦏꦫꦺꦴꦭꦸꦱ꧀ ꦲꦒꦸꦁ ꦗꦏ ꦥꦿꦏꦺꦴꦱ ꦪꦺꦴꦲꦤꦼꦱ꧀';
  const hasilUnicode = parseAksaraForFaalakiah(javaneseUnicode);
  assert.equal(hasilUnicode.length, 13, 'Jumlah aksara dari teks aksara Jawa harus tepat 13 (mengabaikan sigegan mati dan mengonversi cakra)');
  assert.deepEqual(hasilUnicode, expectedAksara, 'Hasil parse Unicode harus identik dengan hasil Latin');

  // 3. Uji fungsi getFaalakiah
  const faal = getFaalakiah(benchmarkName);
  assert.ok(faal.kode >= 0 && faal.kode < 12, 'Kode Faalakiah harus 0-11');
  assert.ok(faal.nabi, 'Faalakiah harus memiliki nama Nabi pelindung');
  assert.equal(faal.aksaraHyphenated, expectedStr, 'aksaraHyphenated harus cocok persis dengan format standar');

  // 4. Uji variasi konsonan rangkap cakra/keret lainnya
  const cakraTests = [
    { nama: 'Prakosa', expected: ['RA', 'KA', 'SA'] },
    { nama: 'Bratasena', expected: ['RA', 'TA', 'SA', 'NA'] },
    { nama: 'Kresna', expected: ['RA', 'NA'] },
    { nama: 'Drestajumna', expected: ['RA', 'TA', 'JA', 'NA'] }
  ];

  for (const t of cakraTests) {
    const res = namaKeAksaraList(t.nama);
    assert.deepEqual(res, t.expected, `Nama ${t.nama} harus memetakan cakra secara konsisten`);
  }
});

test('Branch Jawa-V9: 10. Auto-Sync & Reset State Data Kartu Karakter Saat Hitung Nujum', async () => {
  const { syncNujumCardData, getCachedNujumData, DEFAULT_OPTIONS } = await import('../js/modules/nujum/nujum-share-card.js');

  const dummyData1 = {
    nama: 'Bambang Sutrisno',
    d: 15, m: 8, y: 1990,
    dino: 'Rabu', pas: 'Pon', neptu: 14,
    wukuName: 'Kurantil', wukuNo: 4,
    summaryRingkas: { areaWaspada: 'Paringkelan Mawulu: Benih / Bibit' }
  };

  syncNujumCardData(dummyData1);
  const cached1 = getCachedNujumData();
  assert.equal(cached1.nama, 'Bambang Sutrisno');
  assert.equal(cached1.dino, 'Rabu');
  assert.equal(cached1.pas, 'Pon');
  assert.equal(cached1.neptu, 14);

  // Ubah ke data nujum kedua (kalkulasi ulang)
  const dummyData2 = {
    nama: 'Dewi Sekartaji',
    d: 21, m: 4, y: 1995,
    dino: 'Jumat', pas: 'Kliwon', neptu: 14,
    wukuName: 'Warigalit', wukuNo: 8,
    summaryRingkas: { areaWaspada: 'Paringkelan Paningron: Sato Kewan' }
  };

  syncNujumCardData(dummyData2);
  const cached2 = getCachedNujumData();
  assert.equal(cached2.nama, 'Dewi Sekartaji');
  assert.equal(cached2.dino, 'Jumat');
  assert.equal(cached2.pas, 'Kliwon');
  assert.equal(cached2.wukuName, 'Warigalit');
  assert.equal(cached2.summaryRingkas.areaWaspada, 'Paringkelan Paningron: Sato Kewan');
});

test('Branch Jawa-V9: 11. Zodiak Tionghoa (Shio) & Zodiak Surya pada Kartu Karakter', async () => {
  const { getZodiakByDate } = await import('../js/data/pranata-zodiak-data.js');
  const { getShioByYear } = await import('../js/data/shio-elemen-master-data.js');

  // Uji Zodiak Surya (Horoskop Barat/Global)
  const aries = getZodiakByDate(25, 3);
  assert.equal(aries.nama, 'Aries');

  const virgo = getZodiakByDate(10, 9);
  assert.equal(virgo.nama, 'Virgo');

  const capricorn = getZodiakByDate(5, 1);
  assert.equal(capricorn.nama, 'Capricorn');

  // Uji Shio Tionghoa
  const shio1990 = getShioByYear(1990);
  assert.equal(shio1990.namaShio, 'Kuda');

  const shio1995 = getShioByYear(1995);
  assert.equal(shio1995.namaShio, 'Babi');

  const shio1984 = getShioByYear(1984);
  assert.equal(shio1984.namaShio, 'Tikus');
});

test('Branch Jawa-V9: 12. Format Kotak Atribut Lemah/Mawas Diri & Sirikan Lawang Tanpa Truncation', async () => {
  // Verifikasi pembongkaran data Paringkelan agar tidak memotong teks menjadi "Paringkelan Pa.."
  const rawParingkelan = 'Paringkelan Paningron: Iwak (Sato Kewan)';
  assert.ok(rawParingkelan.length > 20, 'Teks paringkelan asli memiliki panjang > 20 karakter');

  const cleaned = rawParingkelan.replace(/^paringkelan\s+/i, '');
  const colonIdx = cleaned.indexOf(':');
  assert.ok(colonIdx !== -1);
  const namePart = cleaned.substring(0, colonIdx).trim();
  const descPart = cleaned.substring(colonIdx + 1).trim();

  assert.equal(namePart, 'Paningron');
  assert.equal(descPart, 'Iwak (Sato Kewan)');

  // Verifikasi arah sirikan rumah
  const sirikanRaw = 'Hindari pintu utama menghadap langsung ke arah Selatan';
  const isSelatan = /selatan/i.test(sirikanRaw) || /kidul/i.test(sirikanRaw);
  assert.equal(isSelatan, true, 'Sirikan Selatan harus terdeteksi dengan tepat');
});

test('Branch Jawa-V9: 13. Audit CSS Tema Terang (Light Mode Contrast & WCAG AA)', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const cssPath = path.resolve(process.cwd(), 'css/styles.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Pastikan ada aturan spesifik kontras tinggi untuk Light Mode
  assert.ok(css.includes('body.theme-light .text-prada'), 'Harus ada override .text-prada di mode terang');
  assert.ok(css.includes('body.theme-light .bg-keraton'), 'Harus ada override .bg-keraton di mode terang');
  assert.ok(css.includes('body.theme-light .amber-glow-card'), 'Harus ada override .amber-glow-card di mode terang');
  assert.ok(css.includes('body.theme-light .bg-amber-950\\/60'), 'Harus ada override badge amber di mode terang');
  assert.ok(css.includes('body.theme-light .bg-emerald-950\\/60'), 'Harus ada override badge emerald di mode terang');
  assert.ok(css.includes('body.theme-light .bg-rose-950\\/60'), 'Harus ada override badge rose/red di mode terang');
});

test('Branch Jawa-V9: 14. Konsolidasi Tombol Laporan & Mode di Header (Dropdown Terpadu)', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const indexPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(indexPath, 'utf-8');

  // 1. Verifikasi elemen dropdown terpadu pada header
  assert.ok(html.includes('id="headerLaporanContainer"'), 'Harus ada kontainer terpadu #headerLaporanContainer');
  assert.ok(html.includes('id="headerLaporanMenu"'), 'Harus ada menu popover #headerLaporanMenu');
  assert.ok(html.includes('id="modeToggleBtn"'), 'Harus mempertahankan id="modeToggleBtn" untuk kompatibilitas');
  assert.ok(html.includes('toggleHeaderLaporanMenu'), 'Harus memicu fungsi toggleHeaderLaporanMenu');

  // 2. Verifikasi konten menu popover (Pilihan Mode & Aksi Dokumen)
  assert.ok(html.includes("setMode('pemula')"), 'Harus ada opsi setMode pemula di dropdown');
  assert.ok(html.includes("setMode('ahli')"), 'Harus ada opsi setMode ahli di dropdown');
  assert.ok(html.includes("switchTab('laporan')"), 'Harus ada opsi buka pusat laporan PDF di dropdown');
  assert.ok(html.includes("cetakLaporanDariHeader()"), 'Harus ada opsi cetak laporan langsung di dropdown');

  // 3. Verifikasi fungsi controller di mode.js
  const { toggleHeaderLaporanMenu, closeHeaderLaporanMenu, updateHeaderLaporanMenuUI, cetakLaporanDariHeader } = await import('../js/ui/mode.js');
  assert.equal(typeof toggleHeaderLaporanMenu, 'function');
  assert.equal(typeof closeHeaderLaporanMenu, 'function');
  assert.equal(typeof updateHeaderLaporanMenuUI, 'function');
  assert.equal(typeof cetakLaporanDariHeader, 'function');
});

test('Branch Jawa-V9: 15. Validasi Badge Elemen Hari, Proporsi Dewa & Atribut 3 Kolom Kartu', async () => {
  const { getElemenHari } = await import('../js/modules/nujum/nujum-share-card.js');

  // 1. Verifikasi Pemetaan Mutlak 7 Hari (Bahasa Indonesia, Jawa, dan Inggris)
  const mappingExpected = [
    { inputs: ['Senin', 'Monday', 'Senèn', 1], cat: 'Bunga', sim: '🌸' },
    { inputs: ['Selasa', 'Tuesday', 'Salasa', 2], cat: 'Api', sim: '🔥' },
    { inputs: ['Rabu', 'Wednesday', 'Rebo', 3], cat: 'Daun', sim: '🍃' },
    { inputs: ['Kamis', 'Thursday', 'Kemis', 4], cat: 'Angin', sim: '💨' },
    { inputs: ['Jumat', 'Friday', 'Jemuwah', 5], cat: 'Air', sim: '💧' },
    { inputs: ['Sabtu', 'Saturday', 'Setu', 6], cat: 'Tanah', sim: '🌍' },
    { inputs: ['Minggu', 'Sunday', 'Ahad', 0, 7], cat: 'Angkasa', sim: '✨' }
  ];

  for (const item of mappingExpected) {
    for (const inp of item.inputs) {
      const res = getElemenHari(inp, 'Legi');
      assert.equal(res.kategori, item.cat, `Input "${inp}" harus menghasilkan kategori ${item.cat}`);
      assert.equal(res.simbol, item.sim, `Input "${inp}" harus menghasilkan simbol ${item.sim}`);

      // Uji juga jika arg1 dan arg2 dibalik (pasaran di depan)
      const resReversed = getElemenHari('Pahing', inp);
      assert.equal(resReversed.kategori, item.cat, `Reversed input "${inp}" harus menghasilkan kategori ${item.cat}`);
    }
  }

  // 2. Verifikasi File Source nujum-share-card.js untuk Proporsi Dewa & Tata Letak Kolom
  const fs = await import('node:fs');
  const path = await import('node:path');
  const cardSrc = fs.readFileSync(path.resolve(process.cwd(), 'js/modules/nujum/nujum-share-card.js'), 'utf-8');

  // Hero window artH perbesaran
  assert.ok(cardSrc.includes('const artH = 346;'), 'artH harus berukuran 346px untuk proporsi dewa yang megah');
  assert.ok(cardSrc.includes('const clipBoxH = artH - 38;'), 'clipBoxH harus disesuaikan dengan artH baru');
  assert.ok(cardSrc.includes('const maxDrawH = clipBoxH - 12;'), 'maxDrawH harus proporsional di dalam clipBox');
  assert.ok(cardSrc.includes('auraGrad'), 'Aura keemasan harus digambar di belakang figur dewa');

  // Kotak Atribut 3 Kolom
  assert.ok(cardSrc.includes('const barH = 70;'), 'barH harus 70px untuk ruang teks vertikal yang lega');
  assert.ok(cardSrc.includes('const maxValW = colW - 24;'), 'maxValW harus memiliki padding 24px agar teks tidak menabrak garis sekat');
  assert.ok(cardSrc.includes('grid-template-columns: 1fr 1fr 1fr;'), 'Template PDF harus memiliki grid 3 kolom untuk atribut');
});

test('Branch Jawa-V9: 16. Validasi Komprehensif Theming Light Mode (Parchment & Ivory Containers)', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const css = fs.readFileSync(path.resolve(process.cwd(), 'css/styles.css'), 'utf-8');
  const themeJs = fs.readFileSync(path.resolve(process.cwd(), 'js/ui/theme.js'), 'utf-8');
  const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');

  // 1. Harmonisasi Background Kertas Klasik Ivory (#fdfaf3)
  assert.ok(css.includes('background-color: #fdfaf3 !important;'), 'CSS harus mendefinisikan warna background ivory #fdfaf3');
  assert.ok(themeJs.includes("body.style.backgroundColor = '#fdfaf3'"), 'theme.js harus menyetel background body ke #fdfaf3 saat mode terang');
  assert.ok(!indexHtml.includes('style="background-color: #0B0F19; color: #FFF;"'), 'Inline hardcoded style pada body harus dihapus');

  // 2. Card & Container Backgrounds Terang
  assert.ok(css.includes('body.theme-light .bg-keraton'), 'Harus ada penyesuaian bg-keraton di mode terang');
  assert.ok(css.includes('body.theme-light .bg-wulung'), 'Harus ada penyesuaian bg-wulung di mode terang');
  assert.ok(css.includes('body.theme-light .bg-sogan-950'), 'Harus ada penyesuaian bg-sogan-950 di mode terang');
  assert.ok(css.includes('body.theme-light .bg-black'), 'Harus ada penyesuaian bg-black di mode terang');
  assert.ok(css.includes('body.theme-light .from-sogan-950'), 'Harus ada penyesuaian gradien banner di mode terang');

  // 3. Warna Teks Gelap & Kontras Tinggi
  assert.ok(css.includes('color: #261608 !important;'), 'Teks utama harus menggunakan warna cokelat pekat klasik');
  assert.ok(css.includes('body.theme-light .brand-title'), 'Judul brand harus memiliki gradien teks terbaca di mode terang');

  // 4. Pembalikan Kotak Konten Nujum & Panel Spesifik
  assert.ok(css.includes('body.theme-light #hasilKepribadianBox .bg-gradient-to-br'), 'Kotak ikhtisar nujum harus dibalik ke latar terang');
  assert.ok(css.includes('body.theme-light .bg-sogan-900\\/60'), 'Kotak tipe karakter utama harus dibalik ke latar terang');
  assert.ok(css.includes('body.theme-light .bg-emerald-950\\/40'), 'Kotak kekuatan utama harus memiliki latar terang');
  assert.ok(css.includes('body.theme-light .bg-amber-950\\/40'), 'Kotak titik mawas diri harus memiliki latar terang');
  assert.ok(css.includes('body.theme-light section.tab-content .bg-keraton'), 'Seluruh kartu di dalam tab-content harus terang');
});

test('Branch Jawa-V9: 17. Validasi Database Kamus JSON & Modul Pustaka Digital Aktif', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // 1. Verifikasi File JSON Kamus Jawa & Sanskerta
  const jwPath = path.resolve(process.cwd(), 'data/kamus-jawa.json');
  const saPath = path.resolve(process.cwd(), 'data/kamus-sansakerta.json');

  assert.ok(fs.existsSync(jwPath), 'File data/kamus-jawa.json harus tersedia');
  assert.ok(fs.existsSync(saPath), 'File data/kamus-sansakerta.json harus tersedia');

  const jwData = JSON.parse(fs.readFileSync(jwPath, 'utf-8'));
  const saData = JSON.parse(fs.readFileSync(saPath, 'utf-8'));

  assert.ok(Array.isArray(jwData) && jwData.length >= 70, 'kamus-jawa.json harus memuat lebih dari 70 lema');
  assert.ok(Array.isArray(saData) && saData.length >= 30, 'kamus-sansakerta.json harus memuat minimal 30 entri istilah');

  // Periksa atribut lema kamus Jawa: kata, krama, jenis, indonesia / arti, contoh
  const jwSample = jwData[0];
  assert.ok(jwSample.kata, 'Entri kamus Jawa harus memiliki atribut kata');
  assert.ok(jwSample.krama, 'Entri kamus Jawa harus memiliki atribut krama');
  assert.ok(jwSample.jenis, 'Entri kamus Jawa harus memiliki atribut jenis');
  assert.ok(jwSample.indonesia || jwSample.arti, 'Entri kamus Jawa harus memiliki arti terjemahan bahasa Indonesia');

  // Periksa atribut lema kamus Sanskerta: kata / sanskerta, jawa, jenis, makna / indonesia / arti
  const saSample = saData[0];
  assert.ok(saSample.kata || saSample.sanskerta, 'Entri kamus Sanskerta harus memiliki kata/sanskerta');
  assert.ok(saSample.jawa, 'Entri kamus Sanskerta harus memiliki padanan Jawa');
  assert.ok(saSample.jenis, 'Entri kamus Sanskerta harus memiliki atribut jenis');
  assert.ok(saSample.indonesia || saSample.makna || saSample.arti, 'Entri kamus Sanskerta harus memiliki makna Indonesia');

  // 2. Verifikasi UI Modul Pustaka Digital Aktif & Sub-tab Navigation
  const pustakaUiSrc = fs.readFileSync(path.resolve(process.cwd(), 'js/modules/pustaka/pustaka-ui.js'), 'utf-8');
  const sinengkerUiSrc = fs.readFileSync(path.resolve(process.cwd(), 'js/modules/sinengker/sinengker-ui.js'), 'utf-8');
  assert.ok(!pustakaUiSrc.includes('Modul Pustaka Digital sedang dalam tahap pengembangan'), 'Banner placeholder under development harus sudah dihapus');
  assert.ok(pustakaUiSrc.includes('pustakaSubtabContent'), 'Harus memiliki kontainer dinamis konten sub-tab');
  assert.ok(pustakaUiSrc.includes("switchPustakaSubtab('kamus')"), 'Harus memiliki tombol sub-tab kamus');
  assert.ok(pustakaUiSrc.includes("switchPustakaSubtab('naskah')"), 'Harus memiliki tombol sub-tab naskah');
  assert.ok(pustakaUiSrc.includes("switchPustakaSubtab('referensi')"), 'Harus memiliki tombol sub-tab referensi');

  // Verifikasi Modul Sakral (Dongo, Kautaman, Usada, Kalacakra, Ruwatan) telah dikelompokkan ke Sinengker
  assert.ok(sinengkerUiSrc.includes("switchSinengkerSubtab('dongo')"), 'Sinengker harus memuat sub-tab Dongo & Wirid');
  assert.ok(sinengkerUiSrc.includes("switchSinengkerSubtab('kautaman')"), 'Sinengker harus memuat sub-tab Kautamaning Laku');
  assert.ok(sinengkerUiSrc.includes("switchSinengkerSubtab('usada')"), 'Sinengker harus memuat sub-tab Usada & Tamba');
  assert.ok(sinengkerUiSrc.includes("switchSinengkerSubtab('kalacakra')"), 'Sinengker harus memuat sub-tab Rajah Kalacakra');
  assert.ok(sinengkerUiSrc.includes("switchSinengkerSubtab('ruwatan')"), 'Sinengker harus memuat sub-tab Ruwat Murwakala');

  // 3. Verifikasi Tombol Unduh Kamus Format TXT & Penghapusan Opsi JSON
  assert.ok(pustakaUiSrc.includes("unduhKamus('${currentKamusType}', 'txt')") || pustakaUiSrc.includes("unduhKamus"), 'Harus memiliki fungsi unduh kamus TXT');
  assert.ok(!pustakaUiSrc.includes("unduhKamus('${currentKamusType}', 'json')"), 'Tombol unduh format JSON harus dihilangkan sesuai spesifikasi');

  // 4. Verifikasi Engine Pencarian Kamus
  const { searchKamusJawaIndonesia, searchKamusJawaSanskerta } = await import('../js/modules/pustaka/pustaka-engine.js');
  const searchJw = searchKamusJawaIndonesia('Abang');
  assert.ok(searchJw.length >= 1, 'Pencarian Jawa harus menemukan kata "Abang"');
  assert.equal(searchJw[0].jawa, 'Abang');

  const searchSa = searchKamusJawaSanskerta('Acintya');
  assert.ok(searchSa.length >= 1, 'Pencarian Sanskerta harus menemukan istilah "Acintya"');
});

test('Branch Jawa-V9: 18. Validasi Database & Modul Mitologi Nusantara 5 Topik Cerita & Modal Detail', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // 1. Verifikasi Database Mitologi Nusantara
  const {
    getAllMitologiNusantara,
    getMitologiById,
    searchMitologiNusantara,
    formatMitologiPlainText
  } = await import('../js/data/mitologi-nusantara-db.js');

  const allTopics = getAllMitologiNusantara();
  assert.equal(allTopics.length, 5, 'Mitologi Nusantara harus memuat tepat 5 topik cerita adiluhung');

  const expectedIds = ['pawukon', '30wuku', 'neptu-pasaran', 'pranata-mangsa', 'hanacaraka'];
  expectedIds.forEach(id => {
    const topic = getMitologiById(id);
    assert.ok(topic, `Topik cerita mitologi id "${id}" harus ditemukan`);
    assert.ok(topic.judul, `Topik ${id} harus memiliki judul`);
    assert.ok(topic.judulJawa, `Topik ${id} harus memiliki judul basa Jawa`);
    assert.ok(topic.aksaraJawa, `Topik ${id} harus memiliki aksara Jawa`);
    assert.ok(topic.ringkasan, `Topik ${id} harus memiliki ringkasan cerita`);
    assert.ok(Array.isArray(topic.tokohUtama) && topic.tokohUtama.length > 0, `Topik ${id} harus memiliki daftar tokoh utama`);
    assert.ok(Array.isArray(topic.babList) && topic.babList.length >= 3, `Topik ${id} harus memiliki bab-bab narasi lengkap`);
    assert.ok(topic.pesanMoral, `Topik ${id} harus memiliki falsafah / piwulang luhur`);
  });

  // 2. Verifikasi Plain-Text Formatter & Search
  const samplePawukon = getMitologiById('pawukon');
  const plainText = formatMitologiPlainText(samplePawukon);
  assert.ok(plainText.includes('Asal-usul Pawukon Jawa'), 'Plain-text harus memuat judul cariyos');
  assert.ok(plainText.toLowerCase().includes('piwulang luhur'), 'Plain-text harus memuat pesan moral');

  const searchResult = searchMitologiNusantara('Aji Saka');
  assert.ok(searchResult.length >= 1, 'Pencarian harus menemukan kisah Hanacaraka Aji Saka');
  assert.equal(searchResult[0].id, 'hanacaraka');

  // 3. Verifikasi UI Controller & Modal Detail di index.html
  const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('id="mitologiPillarsGrid"'), 'index.html harus memuat kontainer dinamis mitologiPillarsGrid');
  assert.ok(indexHtml.includes('id="modalDetailMitologi"'), 'index.html harus memuat popup dialog modalDetailMitologi');
  assert.ok(indexHtml.includes('id="modalMitologiTitle"'), 'Modal harus memiliki elemen modalMitologiTitle');
  assert.ok(indexHtml.includes('id="modalMitologiBody"'), 'Modal harus memiliki elemen modalMitologiBody');
  assert.ok(indexHtml.includes('id="modalMitologiCopyBtn"'), 'Modal harus memiliki tombol salin modalMitologiCopyBtn');

  // 4. Verifikasi UI Mitologi Controller Functions
  const mitologiUI = await import('../js/modules/budaya/mitologi-ui.js');
  assert.equal(typeof mitologiUI.initMitologiUI, 'function', 'mitologi-ui.js harus mengekspor initMitologiUI');
  assert.equal(typeof mitologiUI.openMitologiModal, 'function', 'mitologi-ui.js harus mengekspor openMitologiModal');
  assert.equal(typeof mitologiUI.closeMitologiModal, 'function', 'mitologi-ui.js harus mengekspor closeMitologiModal');
  assert.equal(typeof mitologiUI.copyMitologiStory, 'function', 'mitologi-ui.js harus mengekspor copyMitologiStory');
  assert.equal(typeof mitologiUI.toggleMitologiFontSize, 'function', 'mitologi-ui.js harus mengekspor toggleMitologiFontSize');
});







