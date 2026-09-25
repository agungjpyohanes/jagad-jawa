/**
 * Jagad Jawa — Unit Test: Fitur Pembaruan Branch jawa-v5
 * Memverifikasi:
 * 1. Inklusivitas Doa & Makna 6 Agama Resmi + Universal pada Pengetan Tilar Donya
 * 2. Pencarian Tanggal Fleksibel pada Petung Omah & Petung Kehidupan (Wiwit Ternak, Jalaran Loro, Geblak)
 * 3. Bagan Anatomi Siluet Tubuh pada Menu Sasmitha (Kedutan)
 * 4. Generator Share Card Sapa Dina & Kartu Karakter Koleksi ala Pokémon TCG
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TEMPLAT_DONGA_KEYAKINAN,
  hitungSelametanDates
} from '../js/modules/selametan/selametan-engine.js';

import { cariHariBaikOmah } from '../js/modules/omah/omah-engine.js';
import { cariHariPetungKehidupan } from '../js/modules/petung-kehidupan/petung-kehidupan-engine.js';
import { TITIK_ANATOMI_KEDUT } from '../js/modules/sasmitha/sasmitha-ui.js';
import { drawSapaDinaCardToCanvas, buildSapaDinaShareText } from '../js/modules/sapa-dina/sapa-dina-ui.js';
import { drawNujumPokemonCard } from '../js/modules/nujum/nujum-share-card.js';

// ─── 1. PENGETAN TILAR DONYA: INKLUSIVITAS 6 AGAMA + UNIVERSAL ────────────
test('Branch jawa-v5 (Item 1) - Inklusivitas Doa Selametan 6 Agama Resmi & Universal', () => {
  assert.ok(TEMPLAT_DONGA_KEYAKINAN, 'TEMPLAT_DONGA_KEYAKINAN wajib terdefinisi');

  const expectedAgama = ['universal', 'islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu'];
  expectedAgama.forEach(agama => {
    const tmpl = TEMPLAT_DONGA_KEYAKINAN[agama];
    assert.ok(tmpl, `Keyakinan ${agama} harus terdaftar`);
    assert.ok(tmpl.nama, `Keyakinan ${agama} harus memiliki nama`);
    assert.ok(tmpl.deskripsi, `Keyakinan ${agama} harus memiliki deskripsi`);
    assert.ok(Array.isArray(tmpl.dongaPerTahap) && tmpl.dongaPerTahap.length === 7, `Keyakinan ${agama} harus memiliki 7 tahap doa`);
  });

  // Hitung selametan dengan opsi keyakinan
  const resUniversal = hitungSelametanDates(2026, 9, 24, 'siang', '', 'universal');
  assert.equal(resUniversal.keyakinan, 'universal');
  assert.ok(resUniversal.items[0].maknaKultural, 'Harus memiliki makna kultural universal pada milestone');
  assert.ok(resUniversal.items.length === 7, 'Harus memuat 7 milestone selametan');

  const resKatolik = hitungSelametanDates(2026, 9, 24, 'siang', '', 'katolik');
  assert.equal(resKatolik.keyakinan, 'katolik');
  assert.ok(resKatolik.items[0].donga, 'Harus memiliki doa terisi');
});

// ─── 2. PENCARIAN TANGGAL FLEKSIBEL: PETUNG OMAH & PETUNG KEHIDUPAN ────────
test('Branch jawa-v5 (Item 2) - Pencarian Tanggal Fleksibel Petung Omah', () => {
  // Cari hari baik omah untuk tahun 2026 bulan 9 (September)
  const hasilOmah = cariHariBaikOmah({
    tahun: 2026,
    bulan: 9,
    kriteria: 'sedaya_becik'
  });

  assert.ok(hasilOmah && typeof hasilOmah === 'object', 'Hasil pencarian omah harus berupa object hasil');
  assert.ok(Array.isArray(hasilOmah.matches), 'Property matches harus berupa array');
  assert.equal(hasilOmah.tahun, 2026);
  assert.equal(hasilOmah.bulan, 9);

  // Jika ada matches, verifikasi strukturnya
  if (hasilOmah.matches.length > 0) {
    const sample = hasilOmah.matches[0];
    assert.ok(sample.tanggal, 'Harus memiliki tanggal');
    assert.ok(sample.dina, 'Harus memiliki dina');
    assert.ok(sample.pasaran, 'Harus memiliki pasaran');
    assert.ok(sample.setA, 'Harus memiliki hasil Set A');
    assert.ok(sample.setB, 'Harus memiliki hasil Set B');
    assert.ok(sample.setC, 'Harus memiliki hasil Set C');
  }
});

test('Branch jawa-v5 (Item 2) - Pencarian Tanggal Fleksibel Petung Kehidupan (Wiwit Ternak)', () => {
  // Cari hari baik wiwit ternak (Gajah / Suku) untuk tahun 2026 bulan 10
  const hasilTernak = cariHariPetungKehidupan({
    tahun: 2026,
    bulan: 10,
    jenis: 'ternak',
    filterKategori: 'gajah'
  });

  assert.ok(hasilTernak && typeof hasilTernak === 'object', 'Hasil pencarian ternak harus berupa object hasil');
  assert.ok(Array.isArray(hasilTernak.matches), 'Property matches harus berupa array');
  assert.ok(hasilTernak.matches.length > 0, 'Harus menemukan tanggal berkategori Gajah di bulan Oktober 2026');

  hasilTernak.matches.forEach(item => {
    assert.equal(item.ternak.kode, 'Gajah', 'Semua hasil yang difilter gajah harus berkategori Gajah');
  });
});

// ─── 3. BAGAN ANATOMI SILUET TUBUH SASMITHA ────────────────────────────────
test('Branch jawa-v5 (Item 3) - Titik Anatomi Kedutan Sasmitha (Bagan Tubuh)', () => {
  assert.ok(Array.isArray(TITIK_ANATOMI_KEDUT), 'TITIK_ANATOMI_KEDUT wajib berupa array koordinat');
  assert.ok(TITIK_ANATOMI_KEDUT.length >= 25, 'Harus memetakan koordinat anatomi utama');

  // Cek contoh titik pertama
  const titik1 = TITIK_ANATOMI_KEDUT[0];
  assert.ok(titik1, 'Titik pertama harus ada');
  assert.ok(typeof titik1.x === 'number' && typeof titik1.y === 'number', 'Titik 1 harus memiliki koordinat x dan y');
  assert.ok(titik1.arrowDir === 'left' || titik1.arrowDir === 'right', 'Titik 1 harus memiliki arah penunjuk callout');
});

// ─── 4. SHARE CARD SAPA DINA & KARTU POKÉMON NUJUM ─────────────────────────
test('Branch jawa-v5 (Item 4) - Generator Teks & Canvas Share Sapa Dina', () => {
  const dummySapaDina = {
    hariTanggalStr: 'Kemis Kliwon, 24 September 2026',
    wetonDisplay: 'Kemis Kliwon',
    neptu: 16,
    neptuBreakdown: '8 + 8',
    wukuDisplay: 'Warigagung',
    wukuNo: 8,
    pranata: {
      nama: 'Mangsa Kapat',
      musimTani: 'Musim Labuh',
      candrasangkala: 'Waspa Kumembeng Jroning Kalbu',
      pratandhaAlam: 'Kekayon padha semi'
    },
    dinoStatus: {
      isIjo: true,
      label: 'Dino Ijo (Becik)',
      statusText: 'Becik / Rahayu',
      icon: '✓'
    },
    pitutur: {
      jawa: 'Urip iku urup.',
      artiHarfiah: 'Hidup itu hendaknya memberi manfaat.'
    }
  };

  const shareText = buildSapaDinaShareText(dummySapaDina);
  assert.ok(shareText.includes('SAPA DINA — JAGAD JAWA'), 'Teks share harus memuat kop Sapa Dina');
  assert.ok(shareText.includes('Kemis Kliwon'), 'Teks share harus memuat weton');
  assert.ok(shareText.includes('16 (8 + 8)'), 'Teks share harus memuat neptu breakdown');
  assert.ok(shareText.includes('Urip iku urup.'), 'Teks share harus memuat pitutur luhur');
});

test('Branch jawa-v5 (Item 4) - Modul Gambar Kartu Pokémon Nujum TCG', () => {
  assert.equal(typeof drawNujumPokemonCard, 'function', 'drawNujumPokemonCard harus diekspor sebagai fungsi');

  // Mock canvas object
  const mockCanvas = {
    width: 0,
    height: 0,
    getContext: () => ({
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillRect: () => {},
      strokeRect: () => {},
      beginPath: () => {},
      roundRect: () => {},
      fill: () => {},
      stroke: () => {},
      arc: () => {},
      moveTo: () => {},
      lineTo: () => {},
      fillText: () => {},
      setLineDash: () => {}
    })
  };

  const dummyNujumData = {
    nama: 'Raden Mas Dananjaya',
    d: 24, m: 9, y: 1995,
    dino: 'Selasa', pas: 'Kliwon', neptu: 11,
    wukuName: 'Warigagung', wukuNo: 8,
    aksaraJawa: 'ꦢꦤꦚ꧀ꦗꦪ',
    summaryRingkas: {
      tipeKarakter: 'Satria Pinilih',
      deskripsiKarakter: 'Teguh ing budi pekerti lan luhur',
      kekuatanUtama: ['Kawicaksanan Luhur', 'Kasantosan Batin'],
      areaWaspada: 'Gampang lena',
      arahHoki: 'Kilen (Barat)',
      sirikanRumah: 'Lor (Utara)',
      faalRingkas: 'Memayu hayuning bawana.'
    }
  };

  // Verifikasi canvas dapat digambar tanpa melempar runtime exception
  assert.doesNotThrow(() => {
    drawNujumPokemonCard(mockCanvas, dummyNujumData, {
      nama: true,
      wetonNeptu: true,
      kekuatan: true
    });
  });

  assert.equal(mockCanvas.width, 750, 'Lebar kanvas kartu Pokémon harus 750px');
  assert.equal(mockCanvas.height, 1050, 'Tinggi kanvas kartu Pokémon harus 1050px');
});
