import { test, describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Nujum Kepribadian / Pétung Nujum Jangkep - Branch jawa-v15', () => {
  it('1. Verifikasi index.html: Tombol Hitung Nujum Lengkap / Pétung Nujum Jangkep memiliki id semantik, type=button, dan onclick', () => {
    const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
    
    // Pastikan tombol utama memiliki type="button", id="btnHitungKepribadian", dan onclick terikat
    assert.match(
      html,
      /<button[^>]*type="button"[^>]*id="btnHitungKepribadian"[^>]*onclick="hitungKepribadianLengkap\(event\)"/,
      'Tombol Hitung Nujum harus memiliki id="btnHitungKepribadian", type="button", dan onclick terikat'
    );

    // Pastikan tombol alias semantik btnPetungNujumJangkep ada
    assert.ok(
      html.includes('id="btnPetungNujumJangkep"'),
      'Tombol alias semantik id="btnPetungNujumJangkep" harus tersedia'
    );

    // Pastikan input aliases (tanggalMiyos, asmaJangkep, taunPetung, alamatManggon, alamatPakaryan) ada
    assert.ok(html.includes('id="tanggalMiyos"'), 'Input alias tanggalMiyos harus tersedia');
    assert.ok(html.includes('id="asmaJangkep"'), 'Input alias asmaJangkep harus tersedia');
    assert.ok(html.includes('id="taunPetung"'), 'Input alias taunPetung harus tersedia');
    assert.ok(html.includes('id="alamatManggon"'), 'Input alias alamatManggon harus tersedia');
    assert.ok(html.includes('id="alamatPakaryan"'), 'Input alias alamatPakaryan harus tersedia');

    // Pastikan container hasil analisis hasilKepribadianBox ada
    assert.ok(
      html.includes('id="hasilKepribadianBox"'),
      'Container hasilKepribadianBox harus tersedia di index.html'
    );
  });

  it('2. Engine & UI Nujum: Eksekusi calculateNujum membaca Tanggal Miyos, Asma Jangkep, Taun Petung, Alamat Manggon, Alamat Pakaryan tanpa bernilai null/undefined', async () => {
    // Setup simulated DOM environment
    const elements = new Map();
    const createMockElem = (id, tag = 'div', val = '') => {
      const el = {
        id,
        tagName: tag.toUpperCase(),
        value: val,
        innerText: '',
        innerHTML: '',
        style: {},
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        },
        attributes: new Map(),
        listeners: {},
        setAttribute(k, v) { this.attributes.set(k, v); },
        getAttribute(k) { return this.attributes.get(k); },
        addEventListener(event, fn) {
          if (!this.listeners[event]) this.listeners[event] = [];
          this.listeners[event].push(fn);
        },
        dispatchEvent(e) {
          if (this.listeners[e.type]) {
            this.listeners[e.type].forEach(fn => fn(e));
          }
        },
        click() {
          let defaultPrevented = false;
          const evt = {
            type: 'click',
            preventDefault() { defaultPrevented = true; },
            defaultPrevented: false
          };
          if (this.listeners['click']) {
            this.listeners['click'].forEach(fn => fn(evt));
          }
          return defaultPrevented;
        }
      };
      elements.set(id, el);
      return el;
    };

    // Form inputs via Javanese semantic IDs
    createMockElem('tanggalMiyos', 'input', '1995-08-17');
    createMockElem('asmaJangkep', 'input', 'Raden Mas Dananjaya');
    createMockElem('taunPetung', 'select', '2026');
    createMockElem('alamatManggon', 'input', 'Delanggu');
    createMockElem('alamatPakaryan', 'input', 'Gatak');

    // Standard IDs (empty to verify Javanese fallback without null/undefined)
    createMockElem('tglLahirKepribadian', 'input', '');
    createMockElem('namaKepribadian', 'input', '');
    createMockElem('tahunHitungKepribadian', 'select', '');
    createMockElem('alamatTinggal', 'input', '');
    createMockElem('alamatKerja', 'input', '');

    // Quick info badges
    createMockElem('outTanggalJawaPribadi');
    createMockElem('outHariPasaranPribadi');
    createMockElem('outNeptuWukuPribadi');
    createMockElem('outSiklusTahunanPribadi');
    createMockElem('outKarakterDasarPribadi');
    createMockElem('outSirikanAdhepOmahPribadi');

    // Result container with initial empty state and hidden class
    const outBox = createMockElem('hasilKepribadianBox', 'div');
    outBox.classList.add('hidden');
    outBox.innerHTML = '<div class="text-center py-16 text-sogan-400"><p data-i18n="nujum_empty_state">Klik tombol "Pétung Nujum Jangkep"</p></div>';

    // Buttons
    const btnHitung = createMockElem('btnPetungNujumJangkep', 'button');
    createMockElem('btnHitungKepribadian', 'button');
    createMockElem('btnPrintKepribadianLengkap', 'button');
    createMockElem('btnPrintKepribadianRingkas', 'button');

    global.window = global;
    global.window.addEventListener = (evt, fn) => {};
    global.window.removeEventListener = (evt, fn) => {};

    global.document = {
      getElementById: (id) => elements.get(id) || null,
      querySelector: (sel) => {
        if (sel.includes('btnPetungNujumJangkep') || sel.includes('btnHitungKepribadian')) {
          return elements.get('btnPetungNujumJangkep');
        }
        return null;
      },
      querySelectorAll: () => [elements.get('btnPetungNujumJangkep'), elements.get('btnHitungKepribadian')],
      createElement: (tag) => createMockElem(`mock-${Date.now()}-${Math.random()}`, tag),
      body: { appendChild: () => {}, style: {} }
    };

    const {
      calculateNujum,
      hitungKepribadianLengkap,
      initNujumEventListeners,
      renderAsesorisAgemanCardHtml,
      getInputValue
    } = await import('../js/modules/nujum/nujum-ui.js');

    // Verifikasi getInputValue tidak pernah bernilai null/undefined
    const valTgl = getInputValue('tanggalMiyos', 'tglLahirKepribadian');
    const valAsma = getInputValue('asmaJangkep', 'namaKepribadian');
    const valTaun = getInputValue('taunPetung', 'tahunHitungKepribadian');
    const valManggon = getInputValue('alamatManggon', 'alamatTinggal');
    const valPakaryan = getInputValue('alamatPakaryan', 'alamatKerja');

    assert.equal(valTgl, '1995-08-17');
    assert.equal(valAsma, 'Raden Mas Dananjaya');
    assert.equal(valTaun, '2026');
    assert.equal(valManggon, 'Delanggu');
    assert.equal(valPakaryan, 'Gatak');

    // Inisialisasi event listener
    initNujumEventListeners();

    // Trigger klik tombol calculateNujum via event listener
    btnHitung.click();
    await new Promise(r => setTimeout(r, 60));

    // Verifikasi class 'hidden' telah dihapus dari outBox
    assert.equal(outBox.classList.contains('hidden'), false, 'Class hidden harus dihapus dari hasilKepribadianBox');

    // Verifikasi DOM ter-rerender dan teks instruksi kosong hilang
    assert.ok(!outBox.innerHTML.includes('data-i18n="nujum_empty_state"'), 'Teks instruksi kosong harus digantikan oleh hasil analisis');
    
    // Verifikasi output memuat watak bincil 6 dimensi
    assert.ok(outBox.innerHTML.includes('Matriks 6 Dimensi Bincil Jawa'), 'Hasil harus memuat Matriks 6 Dimensi Bincil');
    assert.ok(outBox.innerHTML.includes('Padewan (Astawara)'), 'Hasil harus memuat Padewan');
    assert.ok(outBox.innerHTML.includes('Paringkelan (Sadwara)'), 'Hasil harus memuat Paringkelan');
    assert.ok(outBox.innerHTML.includes('Pandangon (Sangawara)'), 'Hasil harus memuat Pandangon');
    assert.ok(outBox.innerHTML.includes('Paarasan (10 Watak)'), 'Hasil harus memuat Paarasan');
    assert.ok(outBox.innerHTML.includes('Pancasuda (7 Martabat)'), 'Hasil harus memuat Pancasuda');
    assert.ok(outBox.innerHTML.includes('Kamarokan (Sosial)'), 'Hasil harus memuat Kamarokan');

    // Verifikasi watak wuku, weton & neptu
    assert.ok(outBox.innerHTML.includes('Wuku Wuye'), 'Hasil harus memuat wuku');
    assert.ok(outBox.innerHTML.includes('Kamis Pon'), 'Hasil harus memuat weton');
    assert.ok(outBox.innerHTML.includes('Neptu 15'), 'Hasil harus memuat neptu');

    // Verifikasi Faalakiah Asma Nabi
    assert.ok(outBox.innerHTML.includes('Faalakiah Asma: Nabi Yusuf'), 'Hasil harus memuat Faalakiah Nabi');

    // Verifikasi Asesoris & Ageman Busana Luhur
    assert.ok(outBox.innerHTML.includes('Asesoris &amp; Ageman Busana Luhur'), 'Hasil harus memuat kartu Asesoris & Ageman');
    assert.ok(outBox.innerHTML.includes('Watu Mulia'), 'Hasil harus memuat Watu Mulia');
    assert.ok(outBox.innerHTML.includes('Warna Ageman'), 'Hasil harus memuat Warna Ageman');
    assert.ok(outBox.innerHTML.includes('Sekar Pengasihan'), 'Hasil harus memuat Sekar Pengasihan');

    // Verifikasi Quick Info Badges terisi
    assert.equal(elements.get('outHariPasaranPribadi').innerText, 'Kamis Pon');
    assert.equal(elements.get('outNeptuWukuPribadi').innerText, 'Neptu 15 · Wuku Wuye');
  });

  it('3. Error Handling (Try-Catch): Format tanggal belum lengkap tidak menyebabkan silent failure dan error terlacak di console', async () => {
    const { calculateNujum, hitungKepribadianLengkap } = await import('../js/modules/nujum/nujum-ui.js');
    const tglInput = global.document.getElementById('tglLahirKepribadian');
    const tglMiyos = global.document.getElementById('tanggalMiyos');

    // Kasus 1: Tanggal kosong
    tglInput.value = '';
    tglMiyos.value = '';
    let caught = null;
    try {
      await calculateNujum();
    } catch (e) {
      caught = e;
    }
    assert.equal(caught, null, 'Tidak boleh throw unhandled exception saat tanggal kosong');

    // Kasus 2: Format tanggal belum lengkap / invalid (misal user baru mengetik "1995-")
    tglInput.value = '1995-';
    try {
      await calculateNujum();
    } catch (e) {
      caught = e;
    }
    assert.equal(caught, null, 'Tidak boleh throw unhandled exception saat tanggal tidak lengkap');

    // Kasus 3: Tanggal dengan angka bulan/hari out of bounds
    tglInput.value = '1995-99-99';
    try {
      await calculateNujum();
    } catch (e) {
      caught = e;
    }
    assert.equal(caught, null, 'Tidak boleh throw unhandled exception saat tanggal tidak valid');
  });
  it('4. Format Tanggal Fleksibel (01/05/1986) & Alamat Panggonan Nyambut Damel: Menghasilkan objek pasaran, neptu, dan wuku yang valid tanpa TypeError', async () => {
    const { calculateNujum, getInputValue, updateKepribadianQuickInfo } = await import('../js/modules/nujum/nujum-ui.js');
    const { getDayInfo, getTanggalJawaLengkap } = await import('../js/data/calendar.js');

    // 1. Verifikasi kalkulasi calendar engine langsung dari format 01/05/1986
    const tglRes = getTanggalJawaLengkap('01/05/1986');
    assert.ok(tglRes, 'getTanggalJawaLengkap harus mengembalikan objek');
    assert.equal(tglRes.hari, 'Kamis');
    assert.equal(tglRes.pasaran, 'Pon');
    assert.equal(tglRes.neptu, 15);
    assert.equal(tglRes.wuku, 'Kuruwelut');

    const dayInfo = getDayInfo('01/05/1986');
    assert.ok(dayInfo, 'getDayInfo harus mengembalikan objek');
    assert.equal(dayInfo.pasaran, 'Pon');
    assert.equal(dayInfo.hari, 'Kamis');
    assert.equal(dayInfo.neptu, 15);

    // 2. Setup input form dengan 01/05/1986 dan Alamat Panggonan Nyambut Damel
    const tglMiyos = global.document.getElementById('tanggalMiyos');
    const tglInput = global.document.getElementById('tglLahirKepribadian');
    tglMiyos.value = '01/05/1986';
    tglInput.value = '01/05/1986';

    const alamatPakaryan = global.document.getElementById('alamatPakaryan');
    if (alamatPakaryan) alamatPakaryan.value = 'Surakarta Hadiningrat';

    // 3. Jalankan kalkulasi dan update quick info
    updateKepribadianQuickInfo('01/05/1986');
    const elHP = global.document.getElementById('outHariPasaranPribadi');
    assert.equal(elHP.innerText, 'Kamis Pon');

    await calculateNujum();
    const outBox = global.document.getElementById('hasilKepribadianBox');
    assert.ok(outBox.innerHTML.includes('Kamis Pon'), 'Hasil harus memuat weton Kamis Pon');
    assert.ok(outBox.innerHTML.includes('Neptu 15'), 'Hasil harus memuat Neptu 15');
    assert.ok(!outBox.classList.contains('hidden'), 'Kontainer hasil tidak boleh tersembunyi');
  });
  it('5. Validasi Objek & Robust Null Check pada Paarasan / Parasan di getNujumSummaryRingkas', async () => {
    const { getNujumSummaryRingkas } = await import('../js/modules/nujum/nujum-engine.js');

    // Case A: Null / undefined arguments
    const resNull = getNujumSummaryRingkas(null);
    assert.ok(resNull, 'getNujumSummaryRingkas tidak boleh crash saat menerima null');
    assert.ok(
      resNull === "Data bincil dan ringkasan belum tersedia." ||
      resNull === "Data ringkasan nujum belum tersedia." ||
      resNull.includes("belum tersedia"),
      'Pesan null guard harus ramah dan aman'
    );

    // Case A2: Single-property bincil input returns exact formatted string
    const resSingleBincil = getNujumSummaryRingkas({
      paarasan: { nilai: 'Aras Kembang', arti: { jv: 'Wangi', id: 'Harum' } }
    });
    assert.equal(resSingleBincil, 'Paarasan: Aras Kembang - Wangi');

    // Case B: bincil / data bernilai null secara eksplisit
    const resBincilNull = getNujumSummaryRingkas({ bincil: null, data: null });
    assert.ok(resBincilNull, 'Tidak boleh throw TypeError saat bincil/data bernilai null');
    assert.ok(resBincilNull.kekuatanUtama.some(k => k.includes('Paarasan')));

    // Case C: Variasi penulisan parasan (single a)
    const resParasan = getNujumSummaryRingkas({
      data: {
        parasan: { nama: 'Lakuning Angin', arti: 'Lincah dan luwes' }
      }
    });
    assert.ok(resParasan.kekuatanUtama.some(k => k.includes('Lakuning Angin')), 'Harus mendukung nama properti parasan');

    // Case D: Variasi penulisan paarasan (double a)
    const resPaarasan = getNujumSummaryRingkas({
      data: {
        paarasan: { nama: 'Aras Kembang', arti: 'Menawan dan dikasihi' }
      }
    });
    assert.ok(resPaarasan.kekuatanUtama.some(k => k.includes('Aras Kembang')), 'Harus mendukung nama properti paarasan');
  });

  it('6. Integrasi Kamus Data Paarasan & 5 Dimensi Bincil Bilingual (27-bincil-arti-bilingual.json)', async () => {
    const {
      BINCIL_BILINGUAL_DATA,
      getBincilArtiBilingual
    } = await import('../js/data/bincil-bilingual.js');
    const { renderBincilArtiHtml } = await import('../js/modules/nujum/nujum-ui.js');

    // 1. Verifikasi kelengkapan 6 dimensi bincil
    assert.ok(BINCIL_BILINGUAL_DATA.padewan, 'Dimensi padewan harus ada');
    assert.ok(BINCIL_BILINGUAL_DATA.paringkelan, 'Dimensi paringkelan harus ada');
    assert.ok(BINCIL_BILINGUAL_DATA.pandangon, 'Dimensi pandangon harus ada');
    assert.ok(BINCIL_BILINGUAL_DATA.paarasan, 'Dimensi paarasan harus ada');
    assert.ok(BINCIL_BILINGUAL_DATA.parasan, 'Alias parasan harus ada');
    assert.ok(BINCIL_BILINGUAL_DATA.pancasuda, 'Dimensi pancasuda harus ada');
    assert.ok(BINCIL_BILINGUAL_DATA.kamarokan, 'Dimensi kamarokan harus ada');

    // 2. Verifikasi 10 watak paarasan
    assert.equal(BINCIL_BILINGUAL_DATA.paarasan.length, 10, 'Paarasan harus memiliki tepat 10 item');

    // 3. Verifikasi teks bilingual id dan jv untuk Lakuning Srengenge
    const artiSrengenge = getBincilArtiBilingual('paarasan', 'Lakuning Srengenge');
    assert.ok(artiSrengenge.id.includes('Pengertian'), 'Arti ID harus memuat Pengertian');
    assert.ok(artiSrengenge.jv.includes('Pangerten'), 'Arti JV harus memuat Pangerten');

    // 4. Verifikasi toleransi query via alias parasan
    const artiParasanAlias = getBincilArtiBilingual('parasan', 'Lakuning Srengenge');
    assert.equal(artiParasanAlias.id, artiSrengenge.id);
    assert.equal(artiParasanAlias.jv, artiSrengenge.jv);

    // 5. Verifikasi render UI bilingual renderBincilArtiHtml
    const htmlBilingual = renderBincilArtiHtml('paarasan', {
      nama: 'Lakuning Srengenge',
      arti_id: artiSrengenge.id,
      arti_jv: artiSrengenge.jv
    });

    assert.ok(htmlBilingual.includes('Pangerten'), 'HTML harus memuat teks bahasa Jawa');
    assert.ok(htmlBilingual.includes('Pengertian'), 'HTML harus memuat teks bahasa Indonesia');
    assert.ok(htmlBilingual.includes('JV'), 'HTML harus memiliki badge penanda Jawa');
    assert.ok(htmlBilingual.includes('ID'), 'HTML harus memiliki badge penanda Indonesia');

    // 6. Verifikasi render pada kata yang identik (misal: Brangasan di Padewan)
    const htmlIdentik = renderBincilArtiHtml('padewan', {
      nama: 'Brama',
      arti_id: 'Brangasan',
      arti_jv: 'Brangasan'
    });
    assert.ok(htmlIdentik.includes('Brangasan'));
    assert.ok(!htmlIdentik.includes('[JV]'), 'Kata identik tidak perlu badge ganda redundan');

    // 7. Verifikasi impor 27-bincil-arti-bilingual.json di nujum-engine.js dan hitungBincilDanWeton di nujum-ui.js
    const { bincilDataJSON, PAARASAN_DATA_JSON } = await import('../js/modules/nujum/nujum-engine.js');
    const { hitungBincilDanWeton } = await import('../js/modules/nujum/nujum-ui.js');

    assert.ok(bincilDataJSON, 'bincilDataJSON harus terimpor dengan sukses di nujum-engine.js');
    assert.ok(Array.isArray(bincilDataJSON.paarasan), 'Properti paarasan di JSON harus berupa array');
    assert.equal(bincilDataJSON.paarasan.length, 10, 'Array paarasan di JSON harus memiliki 10 item');
    assert.ok(Array.isArray(PAARASAN_DATA_JSON), 'PAARASAN_DATA_JSON harus diekstrak sebagai array aman');

    const hasilBincilWeton = hitungBincilDanWeton('Kamis', 'Pon', 'Kuruwelut');
    assert.ok(hasilBincilWeton, 'hitungBincilDanWeton harus mengembalikan objek kalkulasi bincil');
    assert.ok(hasilBincilWeton.paarasan || hasilBincilWeton.parasan, 'Objek bincil harus memuat properti paarasan/parasan');
  });

  it('7. Regression: resolveBincilFromMatrix menggunakan dataset JSON statis dan menghasilkan seluruh 6 dimensi dengan skema baku', async () => {
    const { resolveBincilFromMatrix, CANON_WUKU_NAMES, normalizeHariName, normalizePasaranName, normalizeWukuName } = await import('../js/modules/nujum/nujum-engine.js');
    const { getDbSync } = await import('../js/services/dbLoader.js');

    const matrix = getDbSync('06-bincil-matrix-bilingual.json');
    assert.ok(matrix, 'Matriks 06-bincil-matrix-bilingual.json harus dapat dibaca');
    assert.ok(typeof matrix === 'object', 'Matriks bincil berupa objek');

    // Uji normalizer
    assert.equal(normalizeHariName('Jum\'at'), 'jumat');
    assert.equal(normalizeHariName('Ngahad'), 'minggu');
    assert.equal(normalizePasaranName('Manis'), 'legi');
    assert.equal(normalizeWukuName('Kuruwelut'), 'kuruwelut');
    assert.equal(normalizeWukuName(17), 'kuruwelut');

    // Uji baris baku: Kamis Pon Kuruwelut
    const res = resolveBincilFromMatrix(matrix, 'Kamis', 'Pon', 'Kuruwelut');
    assert.ok(res, 'Baris bincil harus ditemukan');
    assert.equal(res.found, true);
    assert.equal(res.wuku, 'Kuruwelut');
    assert.equal(res.hari, 'Kamis');
    assert.equal(res.pasaran, 'Pon');

    // Uji 6 dimensi dan skema baku
    const dimensiList = ['padewan', 'paringkelan', 'pandangon', 'paarasan', 'parasan', 'pancasuda', 'kamarokan'];
    for (const dim of dimensiList) {
      assert.ok(res[dim], `Dimensi ${dim} harus tersedia`);
      assert.ok(res[dim].nama, `Dimensi ${dim} harus memiliki properti nama`);
      assert.ok(res[dim].nilai, `Dimensi ${dim} harus memiliki properti nilai`);
      assert.ok(res[dim].arti, `Dimensi ${dim} harus memiliki properti arti`);
      assert.ok(res[dim].arti_id, `Dimensi ${dim} harus memiliki properti arti_id`);
      assert.ok(res[dim].arti_jv, `Dimensi ${dim} harus memiliki properti arti_jv`);
      assert.ok(res[dim].artiBilingual, `Dimensi ${dim} harus memiliki properti artiBilingual`);
      assert.ok(res[dim].artiBilingual.id, `Dimensi ${dim} artiBilingual harus memiliki id`);
      assert.ok(res[dim].artiBilingual.jv, `Dimensi ${dim} artiBilingual harus memiliki jv`);
    }

    // Nilai akurat Kamis Pon Kuruwelut
    assert.equal(res.padewan.nama, 'Guru');
    assert.equal(res.paringkelan.nama, 'Wurukung');
    assert.equal(res.pandangon.nama, 'Wogan');
    assert.equal(res.paarasan.nama, 'Lakuning Srengenge');
    assert.equal(res.pancasuda.nama, 'Satriya Wirang');
    assert.equal(res.kamarokan.nama, 'Macan Ketawan');
  });

  it('8. Regression: getNujumSummaryRingkas tidak crash untuk data valid (17-08-1945 / nama fiktif)', async () => {
    const { getNujumSummaryRingkas, resolveBincilFromMatrix } = await import('../js/modules/nujum/nujum-engine.js');
    const { getDbSync } = await import('../js/services/dbLoader.js');
    const matrix = getDbSync('06-bincil-matrix-bilingual.json');

    // Tanggal Proklamasi 17 Agustus 1945
    const bincilRow = resolveBincilFromMatrix(matrix, 'Jumat', 'Legi', 'Kulawu');
    assert.ok(bincilRow, 'Baris bincil Jumat Legi Kulawu harus ditemukan');

    const summary = getNujumSummaryRingkas({
      nama: 'Raden Bagus Proklamator',
      d: 17,
      m: 8,
      y: 1945,
      tahunHitung: 2026,
      dino: 'Jumat',
      pas: 'Legi',
      wukuName: 'Kulawu',
      paarasan: bincilRow.paarasan,
      parasan: bincilRow.parasan,
      data: bincilRow,
      bincil: bincilRow,
      bincilMatrix: matrix
    });

    assert.ok(summary, 'Summary harus mengembalikan objek ringkasan');
    assert.ok(summary.summaryText, 'summaryText harus tersedia');
    assert.ok(summary.summaryText.includes('Paarasan'), 'summaryText harus memuat informasi Paarasan');
    assert.ok(summary.tipeKarakter, 'tipeKarakter harus tersedia');
    assert.ok(summary.kekuatanUtama && summary.kekuatanUtama.length > 0, 'kekuatanUtama harus terisi');
    assert.ok(String(summary).includes('Paarasan'), 'toString() ringkasan harus berfungsi');
  });

  it('9. Regression: Kegagalan dataset/matriks kosong atau baris tak ditemukan ditangani secara terkendali tanpa kalkulasi palsu', async () => {
    const { resolveBincilFromMatrix, getNujumSummaryRingkas } = await import('../js/modules/nujum/nujum-engine.js');

    // Matriks null / undefined / kosong harus mengembalikan null, BUKAN formula palsu
    assert.equal(resolveBincilFromMatrix(null, 'Kamis', 'Pon', 'Kuruwelut'), null);
    assert.equal(resolveBincilFromMatrix(undefined, 'Kamis', 'Pon', 'Kuruwelut'), null);
    assert.equal(resolveBincilFromMatrix({}, 'Kamis', 'Pon', 'Kuruwelut'), null);

    // Baris tidak ada di matriks harus mengembalikan null
    assert.equal(resolveBincilFromMatrix({ sinta_minggu_pahing: {} }, 'Kamis', 'Pon', 'Kuruwelut'), null);

    // getNujumSummaryRingkas dengan input null/kosong mengembalikan pesan aman tanpa exception
    assert.equal(getNujumSummaryRingkas(null), 'Data bincil dan ringkasan belum tersedia.');
    assert.equal(getNujumSummaryRingkas({}), 'Data bincil dan ringkasan belum tersedia.');
  });

  it('10. Regression: Jalur eksekusi UI hitungKepribadianLengkap memanfaatkan loader loadDomainData dan sukses saat global helper stubbed', async () => {
    const { hitungKepribadianLengkap } = await import('../js/modules/nujum/nujum-ui.js');
    const { getDbSync } = await import('../js/services/dbLoader.js');

    // Simulasikan runtime browser live di mana window.getNujumData distub / mengembalikan null
    global.window.getNujumData = () => null;

    // Pastikan input form disiapkan
    const elTgl = global.document.getElementById('tanggalMiyos');
    if (elTgl) elTgl.value = '1945-08-17';
    const elNama = global.document.getElementById('asmaJangkep');
    if (elNama) elNama.value = 'Diajeng Fiktif Lestari';

    const outBox = global.document.getElementById('hasilKepribadianBox');
    assert.ok(outBox, 'hasilKepribadianBox harus tersedia');

    // Eksekusi hitungKepribadianLengkap
    await hitungKepribadianLengkap({ preventDefault: () => {} });

    // Verifikasi state lastCalculatedData tersimpan dan bukan null
    assert.ok(global.window.lastCalculatedNujumData, 'lastCalculatedNujumData harus tersimpan dan tidak null');
    assert.ok(global.window.lastCalculatedNujumData.nujumRes, 'nujumRes harus terisi dari resolver loader');
    assert.ok(global.window.lastCalculatedNujumData.nujumRes.paarasan, 'paarasan harus terisi dengan benar');
    assert.ok(global.window.lastCalculatedNujumData.summaryRingkas, 'summaryRingkas harus terisi tanpa error null-pointer');

    // Verifikasi output DOM dirender tanpa crash
    assert.ok(!outBox.classList.contains('hidden'), 'hasilKepribadianBox harus ditampilkan');
    assert.ok(outBox.innerHTML.includes('Matriks 6 Dimensi Bincil Jawa'), 'Hasil harus memuat Matriks 6 Dimensi Bincil');
  });
});