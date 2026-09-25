/**
 * Jagad Jawa — Unit Test: Pustaka Sinengker & Pustaka Jawa (Branch jawa-v5)
 * Memverifikasi integritas database pustaka jawa, sistem proteksi PIN sinengker,
 * kompas danyang direction resolver, serta naskah-naskah sakral.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getKautamaningLakuList,
  searchKautamaningLaku,
  getRamuanObatList,
  searchRamuanObat,
  getAjiRajahKalacakra
} from '../js/data/pustaka-jawa-db.js';

import {
  verifySinengkerAccess,
  cleanKelurahanName,
  resolveKompasDanyang,
  getPetaAksaraDerajat,
  getMendhemAriAriData,
  getUbarampePagerData,
  getAsenggamaSastraJendraData,
  getBodroSampirData,
  getKasedanJatiData,
  getRosoSejatiData,
  getAjiMantraSinengkerList
} from '../js/modules/sinengker/sinengker-engine.js';

test('Pustaka Jawa — Integritas Kautamaning Laku (12 Piwulang Luhur)', () => {
  const list = getKautamaningLakuList();
  assert.equal(list.length, 12, 'Wajib memuat tepat 12 butir piwulang moral Jawa');

  list.forEach((item, idx) => {
    assert.equal(item.id, idx + 1, `ID piwulang harus urut 1-12`);
    assert.ok(item.teks_jawa && item.teks_jawa.length > 5, `Teks Jawa piwulang ${item.id} harus valid`);
    assert.ok(item.makna && item.makna.length > 5, `Makna piwulang ${item.id} harus valid`);
  });

  // Uji pencarian
  const searchResult = searchKautamaningLaku('sarak');
  assert.ok(searchResult.length >= 2, 'Pencarian kata kunci sarak harus menemukan minimal 2 ajaran');

  const searchPerang = searchKautamaningLaku('Aprang Sabil');
  assert.equal(searchPerang.length, 1, 'Aprang Sabil harus ditemukan secara tepat');
});

test('Pustaka Jawa — Integritas Ramuan Obat Tradisional (10 Resep Usada)', () => {
  const ramuan = getRamuanObatList();
  assert.equal(ramuan.length, 10, 'Wajib memuat tepat 10 resep ramuan tradisional');

  const expectedPenyakit = [
    'JANTUNG',
    'PARU – PARU',
    'PENYAKIT KULIT / KUDIS',
    'SYARAF TULANG (YANG DIMINUM)',
    'SYARAF TULANG (YANG DIOLESKAN)',
    'PENYAKIT KULIT JERAWATAN',
    'JAMPI TELAT NGOMONG',
    'JAMPI KANKER',
    'JAMPI GINJAL',
    'JAMPI KORENG'
  ];

  expectedPenyakit.forEach(p => {
    const found = ramuan.find(r => r.penyakit === p);
    assert.ok(found, `Resep untuk ${p} harus tersedia`);
    assert.ok(Array.isArray(found.bahan) && found.bahan.length > 0, `Bahan untuk ${p} tidak boleh kosong`);
  });

  // Uji pencarian ramuan
  const sirihSearch = searchRamuanObat('Sirih Merah');
  assert.ok(sirihSearch.length >= 1, 'Pencarian bahan Sirih Merah harus menemukan ramuan jantung');
  assert.equal(sirihSearch[0].penyakit, 'JANTUNG');
});

test('Pustaka Jawa — Integritas Aji Rajah Kalacakra (8 Bait Pembalik Sengkala)', () => {
  const kalacakra = getAjiRajahKalacakra();
  assert.ok(kalacakra.judul, 'Judul Aji Rajah Kalacakra harus ada');
  assert.equal(kalacakra.mantra_bait.length, 8, 'Wajib memuat 8 bait mantra rajah pembalik');

  const firstBait = kalacakra.mantra_bait[0];
  assert.equal(firstBait.baris, 'YA MARAJA JARAMAYA');
  assert.ok(firstBait.arti.includes('Heh Pangrancana Mariya Luwih'));

  const lastBait = kalacakra.mantra_bait[7];
  assert.equal(lastBait.baris, 'YA SIHAMA MAHASIYA');
  assert.ok(lastBait.arti.includes('Heh Kang Dadi Hama'));
});

test('Pustaka Sinengker — Sistem Proteksi PIN & Konfirmasi Kultural', () => {
  // PIN valid: 1757, sastrajendra, kasampurnan (case-insensitive & trimmed)
  assert.equal(verifySinengkerAccess('1757'), true, 'PIN 1757 harus valid');
  assert.equal(verifySinengkerAccess('  1757  '), true, 'PIN 1757 dengan spasi harus valid');
  assert.equal(verifySinengkerAccess('sastrajendra'), true, 'Kata sandi sastrajendra harus valid');
  assert.equal(verifySinengkerAccess('SASTRAJENDRA'), true, 'Kata sandi SASTRAJENDRA (uppercase) harus valid');
  assert.equal(verifySinengkerAccess('kasampurnan'), true, 'Kata sandi kasampurnan harus valid');
  assert.equal(verifySinengkerAccess('Kasampurnan'), true, 'Kata sandi Kasampurnan (capitalized) harus valid');

  // PIN invalid (termasuk sandi lama yang telah dinonaktifkan)
  assert.equal(verifySinengkerAccess('1945'), false, 'PIN lama 1945 harus ditolak');
  assert.equal(verifySinengkerAccess('keraton'), false, 'Kata sandi lama keraton harus ditolak');
  assert.equal(verifySinengkerAccess('jagadjawa'), false, 'Kata sandi lama jagadjawa harus ditolak');
  assert.equal(verifySinengkerAccess('0000'), false, 'PIN salah harus ditolak');
  assert.equal(verifySinengkerAccess(''), false, 'PIN kosong harus ditolak');
  assert.equal(verifySinengkerAccess(null), false, 'PIN null harus ditolak');
});

test('Pustaka Sinengker — Logika Pencarian Petung Kompas Danyang Presisi 360°', () => {
  // Test pembersihan nama
  assert.equal(cleanKelurahanName('Kelurahan Kemlayan'), 'Kemlayan');
  assert.equal(cleanKelurahanName('Desa Ngemplak'), 'Ngemplak');
  assert.equal(cleanKelurahanName('Kel. Pajang'), 'Pajang');
  assert.equal(cleanKelurahanName('Ds. Balepanjang'), 'Balepanjang');

  // Uji Kasus Khusus: Gatak (GA = 333° Utara-Membarat Laut / NNW)
  const rGatak = resolveKompasDanyang('Gatak');
  assert.equal(rGatak.aksara_awal, 'GA');
  assert.equal(rGatak.sudut, 333);
  assert.equal(rGatak.derajat, 333);
  assert.equal(rGatak.derajat_presisi, '333°');
  assert.equal(rGatak.arah_key, 'lor');
  assert.ok(rGatak.watak_spiritual.length > 10, 'Watak spiritual GA harus ada');

  // 1. Arah WETAN: HA (45°), NA (63°), CA (81°), RA (99°), KA (117°), DA (135°)
  const rKemlayan = resolveKompasDanyang('Kemlayan');
  assert.equal(rKemlayan.aksara_awal, 'KA');
  assert.equal(rKemlayan.arah_key, 'wetan');
  assert.equal(rKemlayan.arah_jawa, 'Wetan');
  assert.equal(rKemlayan.sudut, 117);
  assert.equal(rKemlayan.derajat, 117);
  assert.equal(rKemlayan.derajat_kardinal, 90);

  const rCandi = resolveKompasDanyang('Candi');
  assert.equal(rCandi.aksara_awal, 'CA');
  assert.equal(rCandi.arah_key, 'wetan');
  assert.equal(rCandi.sudut, 81);

  const rRawalo = resolveKompasDanyang('Rawalo');
  assert.equal(rRawalo.aksara_awal, 'RA');
  assert.equal(rRawalo.arah_key, 'wetan');
  assert.equal(rRawalo.sudut, 99);

  const rDanukusuman = resolveKompasDanyang('Kelurahan Danukusuman');
  assert.equal(rDanukusuman.aksara_awal, 'DA');
  assert.equal(rDanukusuman.arah_key, 'wetan');
  assert.equal(rDanukusuman.sudut, 135);
  assert.equal(rDanukusuman.derajat_presisi, '135°');

  const rTegal = resolveKompasDanyang('Tegalmulyo');
  assert.equal(rTegal.aksara_awal, 'TA');
  assert.equal(rTegal.arah_key, 'kidul');
  assert.equal(rTegal.sudut, 153);

  // 2. Arah LOR: THA (9°), NGA (27°), GA (333°), BA (351°)
  const rThukulan = resolveKompasDanyang('Thukulan');
  assert.equal(rThukulan.aksara_awal, 'THA');
  assert.equal(rThukulan.arah_key, 'lor');
  assert.equal(rThukulan.sudut, 9);

  const rNgawi = resolveKompasDanyang('Ngawi');
  assert.equal(rNgawi.aksara_awal, 'NGA');
  assert.equal(rNgawi.arah_key, 'lor');
  assert.equal(rNgawi.sudut, 27);

  const rBanyumanik = resolveKompasDanyang('Banyumanik');
  assert.equal(rBanyumanik.aksara_awal, 'BA');
  assert.equal(rBanyumanik.arah_key, 'lor');
  assert.equal(rBanyumanik.sudut, 351);
  assert.equal(rBanyumanik.derajat, 351);
  assert.equal(rBanyumanik.derajat_kardinal, 0);

  const rAmbarawa = resolveKompasDanyang('Ambarawa');
  assert.equal(rAmbarawa.aksara_awal, 'HA');
  assert.equal(rAmbarawa.arah_key, 'wetan');
  assert.equal(rAmbarawa.sudut, 45);

  const rImogiri = resolveKompasDanyang('Imogiri');
  assert.equal(rImogiri.aksara_awal, 'HA');
  assert.equal(rImogiri.arah_key, 'wetan');
  assert.equal(rImogiri.sudut, 45);

  // 3. Arah KIDUL: TA (153°), SA (171°), WA (189°), LA (207°)
  const rSemarang = resolveKompasDanyang('Semarang');
  assert.equal(rSemarang.aksara_awal, 'SA');
  assert.equal(rSemarang.arah_key, 'kidul');
  assert.equal(rSemarang.sudut, 171);
  assert.equal(rSemarang.derajat, 171);
  assert.equal(rSemarang.derajat_kardinal, 180);

  const rWonogiri = resolveKompasDanyang('Wonogiri');
  assert.equal(rWonogiri.aksara_awal, 'WA');
  assert.equal(rWonogiri.arah_key, 'kidul');
  assert.equal(rWonogiri.sudut, 189);

  const rLaweyan = resolveKompasDanyang('Laweyan');
  assert.equal(rLaweyan.aksara_awal, 'LA');
  assert.equal(rLaweyan.arah_key, 'kidul');
  assert.equal(rLaweyan.sudut, 207);

  const rPajang = resolveKompasDanyang('Pajang');
  assert.equal(rPajang.aksara_awal, 'PA');
  assert.equal(rPajang.arah_key, 'kulon');
  assert.equal(rPajang.sudut, 225);

  // 4. Arah KULON: PA (225°), DHA (243°), JA (261°), YA (279°), NYA (297°), MA (315°)
  const rDlingo = resolveKompasDanyang('Dhadhap');
  assert.equal(rDlingo.aksara_awal, 'DHA');
  assert.equal(rDlingo.arah_key, 'kulon');
  assert.equal(rDlingo.sudut, 243);
  assert.equal(rDlingo.derajat, 243);
  assert.equal(rDlingo.derajat_kardinal, 270);

  const rJaten = resolveKompasDanyang('Jaten');
  assert.equal(rJaten.aksara_awal, 'JA');
  assert.equal(rJaten.arah_key, 'kulon');
  assert.equal(rJaten.sudut, 261);

  const rYogyakarta = resolveKompasDanyang('Yogyakarta');
  assert.equal(rYogyakarta.aksara_awal, 'YA');
  assert.equal(rYogyakarta.arah_key, 'kulon');
  assert.equal(rYogyakarta.sudut, 279);

  const rNyatnyono = resolveKompasDanyang('Nyatnyono');
  assert.equal(rNyatnyono.aksara_awal, 'NYA');
  assert.equal(rNyatnyono.arah_key, 'kulon');
  assert.equal(rNyatnyono.sudut, 297);

  const rMangkubumen = resolveKompasDanyang('Mangkubumen');
  assert.equal(rMangkubumen.aksara_awal, 'MA');
  assert.equal(rMangkubumen.arah_key, 'kulon');
  assert.equal(rMangkubumen.sudut, 315);

  const rGondang = resolveKompasDanyang('Gondang');
  assert.equal(rGondang.aksara_awal, 'GA');
  assert.equal(rGondang.arah_key, 'lor');
  assert.equal(rGondang.sudut, 333);

  // Uji Aksara Jawa Unicode langsung
  const rUnicodeGa = resolveKompasDanyang('ꦒ');
  assert.equal(rUnicodeGa.aksara_awal, 'GA');
  assert.equal(rUnicodeGa.sudut, 333);

  // Cek kelengkapan metadata
  assert.ok(rKemlayan.danyang_pitedah, 'Harus memuat pitedah danyang');
  assert.ok(rKemlayan.sesaji_ubarampe, 'Harus memuat sesaji ubarampe');
  assert.ok(rKemlayan.watak_spiritual, 'Harus memuat watak spiritual');
});

test('Pustaka Sinengker — Integritas Seluruh Naskah Sakral & Aji Mantra', () => {
  // 1. Mendhem Ari-Ari
  const ariAri = getMendhemAriAriData();
  assert.equal(ariAri.perlengkapan_ubarampe.length, 12, 'Wajib memuat 12 ubarampe mendhem ari-ari');
  assert.ok(ariAri.tata_cara.includes('Kendhil'), 'Tata cara mendhem ari-ari harus lengkap');

  // 2. Ubarampe Pager
  const pager = getUbarampePagerData();
  assert.equal(pager.pager_bumi.length, 9, 'Pager bumi harus memuat 9 ubarampe');
  assert.equal(pager.pager_gandhul_omah.length, 7, 'Pager gandhul omah harus memuat 7 ubarampe');
  assert.equal(pager.pantek_pager.length, 5, 'Pantek pager harus memuat 5 elemen kayu/logam');

  // 3. Asenggama & Sastra Jendra
  const asenggama = getAsenggamaSastraJendraData();
  assert.equal(asenggama.waktu_larangan_asenggama.length, 15, 'Harus memuat 15 waktu larangan asenggama');
  assert.equal(asenggama.waktu_senggama_yang_baik.length, 3, 'Harus memuat 3 waktu senggama yang baik');
  assert.ok(asenggama.mantra_saresmi_sejati.sebelum_berhubungan.length > 0);

  // 4. Bodro Sampir
  const bodro = getBodroSampirData();
  assert.equal(bodro.mantra.length, 11, 'Mantra Bodro Sampir harus memuat 11 baris');

  // 5. Kasedan Jati
  const kasedan = getKasedanJatiData();
  assert.equal(kasedan.paragraf_ajaran.length, 10, 'Kasedan Jati harus memuat 10 paragraf ajaran kesedan sejati');

  // 6. Roso Sejati
  const roso = getRosoSejatiData();
  assert.ok(roso.gandhewo.bait.length === 5, 'Bait Gandhewo harus memuat 5 baris');
  assert.ok(roso.semedi_panetepan.bacaan_1, 'Semedi Panetepan bacaan 1 harus ada');
  assert.ok(roso.sarana_praktis.kanggo_dodolan, 'Sarana praktis dodolan harus ada');

  // 7. Aji Mantra Sinengker
  const ajiList = getAjiMantraSinengkerList();
  assert.equal(ajiList.length, 3, 'Harus memuat 3 aji mantra (Condo Birowo, Semar Kawak, Waringin Sungsang)');
  const [condo, semar, waringin] = ajiList;
  assert.equal(condo.id, 'condo-birowo');
  assert.equal(semar.id, 'semar-kawak');
  assert.equal(waringin.id, 'waringin-sungsang');
});

test('Pustaka Sinengker — Matematika Lingkaran 360° & Pergeseran 18° Searah Jarum Jam', () => {
  const peta = getPetaAksaraDerajat();
  assert.equal(peta.length, 20, 'Harus memuat tepat 20 Aksara Jawa utuh');

  // Urutan Siklus Kompas Danyang Baru (Start THA ing Lor)
  const urutanAksara = [
    'THA', 'NGA', 'HA', 'NA', 'CA',
    'RA', 'KA', 'DA', 'TA', 'SA',
    'WA', 'LA', 'PA', 'DHA', 'JA',
    'YA', 'NYA', 'MA', 'GA', 'BA'
  ];

  urutanAksara.forEach((ak, idx) => {
    const item = peta[idx];
    assert.equal(item.urutan, idx + 1, `Urutan aksara ke-${idx + 1} harus valid`);
    assert.equal(item.aksara, ak, `Aksara ke-${idx + 1} harus ${ak}`);
    assert.ok(item.aksara_jawa, `Aksara Jawa ke-${idx + 1} harus ada`);
    assert.ok(item.watak_spiritual, `Watak spiritual untuk ${ak} harus ada`);
    assert.ok(item.danyang_pitedah, `Pitedah danyang untuk ${ak} harus ada`);
    assert.ok(item.sesaji_ubarampe, `Sesaji ubarampe untuk ${ak} harus ada`);
  });

  // Titik Acuan Utama: THA = 9° (Sektor 0° - 18° ing Lor / Utara)
  assert.equal(peta[0].sudut, 9, 'Titik acuan awal THA harus tepat di 9°');

  // Pergeseran 18° searah jarum jam berturut-turut
  for (let i = 0; i < 19; i++) {
    const curr = peta[i].sudut;
    const next = peta[i + 1].sudut;
    // Modulo 360° kagem memperhitungkan siklus lingkaran (cth: 351° -> 9°)
    const diff = Math.round(((next - curr + 360) % 360) * 10) / 10;
    assert.equal(diff, 18, `Pergeseran antara ${peta[i].aksara} dan ${peta[i + 1].aksara} harus tepat 18°`);
  }

  // Dari aksara terakhir (BA: 351°) ke aksara awal (THA: 9°)
  const lastSudut = peta[19].sudut; // BA = 351°
  assert.equal(lastSudut, 351, 'BA harus di 351°');
  const loopDiff = Math.round(((peta[0].sudut - lastSudut + 360) % 360) * 10) / 10;
  assert.equal(loopDiff, 18, 'Jarak siklus dari BA ke THA harus tepat 18° sehingga menutup sempurna 360°');

  // Total 20 aksara x 18° = 360°
  assert.equal(20 * 18, 360, '20 aksara x 18° harus menutup 360° secara sempurna');
});
