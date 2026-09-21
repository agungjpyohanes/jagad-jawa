import test from 'node:test';
import assert from 'node:assert/strict';
import { SANDHANGAN_GUIDE_DATA, AKSARA_QUIZ_QUESTIONS } from '../js/modules/aksara/aksara-ui.js';
import { DISCLAIMER_ETIS_WAYANG } from '../js/modules/wayang/wayang-ui.js';
import { getPituturList, getQuizQuestions, getPituturHariIni } from '../js/modules/pitutur/pitutur-ui.js';

test('Aksara & Kebudayaan - Materi Sandhangan Visual', () => {
  assert.ok(SANDHANGAN_GUIDE_DATA);
  assert.equal(SANDHANGAN_GUIDE_DATA.swara.length, 5, 'Harus ada 5 sandhangan swara (Wulu, Suku, Taling, Taling Tarung, Pepet)');
  assert.equal(SANDHANGAN_GUIDE_DATA.panyigeg.length, 4, 'Harus ada 4 sandhangan panyigeg (Wignyan, Layar, Cecak, Pangkon)');
  assert.equal(SANDHANGAN_GUIDE_DATA.wyanjana.length, 3, 'Harus ada 3 sandhangan wyanjana (Cakra, Cakra Keret, Pengkal)');
  assert.equal(SANDHANGAN_GUIDE_DATA.khusus.length, 2, 'Harus ada 2 fonem khusus (Pa Cerek, Nga Lelet)');

  // Verifikasi setiap item memiliki nama, aksara, latin, dan contoh
  [...SANDHANGAN_GUIDE_DATA.swara, ...SANDHANGAN_GUIDE_DATA.panyigeg, ...SANDHANGAN_GUIDE_DATA.wyanjana].forEach(item => {
    assert.ok(item.nama, 'Harus memiliki nama');
    assert.ok(item.aksara, 'Harus memiliki karakter aksara');
    assert.ok(item.latin, 'Harus memiliki latin fonetis');
    assert.ok(item.tuladha, 'Harus memiliki contoh kata');
  });
});

test('Aksara & Kebudayaan - Bank Soal Kuis Aksara Jawa', () => {
  assert.equal(AKSARA_QUIZ_QUESTIONS.length, 10, 'Harus memiliki 10 soal kuis aksara');

  AKSARA_QUIZ_QUESTIONS.forEach((q, idx) => {
    assert.ok(q.q && q.q.length > 5, `Soal ${idx + 1} harus memiliki teks pertanyaan`);
    assert.equal(q.opts.length, 4, `Soal ${idx + 1} harus memiliki 4 pilihan ganda`);
    assert.ok(q.correct >= 0 && q.correct <= 3, `Soal ${idx + 1} harus memiliki indeks jawaban benar 0-3`);
    assert.ok(q.penjelasan && q.penjelasan.length > 5, `Soal ${idx + 1} harus memiliki penjelasan kaidah`);
  });
});

test('Aksara & Kebudayaan - Pitutur Luhur & Bank Soal Budaya', () => {
  const pituturList = getPituturList();
  assert.ok(pituturList.length >= 10, 'Harus memiliki koleksi pitutur luhur');
  pituturList.slice(0, 5).forEach(p => {
    assert.ok(p.jawa, 'Harus ada teks Latin');
    assert.ok(p.aksara, 'Harus ada aksara Jawa');
    assert.ok(p.artiHarfiah, 'Harus ada arti harfiah');
    assert.ok(p.makna, 'Harus ada makna filosofis');
    assert.ok(p.sumber, 'Harus ada rujukan sumber');
  });

  const quizQuestions = getQuizQuestions();
  assert.ok(quizQuestions.length >= 5, 'Harus memiliki bank soal budaya');

  // Pengujian Pitutur Hari Ini (deterministik berbasis tanggal)
  const todayPitutur = getPituturHariIni(new Date(2026, 8, 21));
  assert.ok(todayPitutur, 'Harus mengembalikan pitutur hari ini');
  assert.ok(todayPitutur.jawa, 'Harus memiliki teks Latin');
  assert.ok(todayPitutur.aksara, 'Harus memiliki aksara Jawa');
  const sameDayPitutur = getPituturHariIni(new Date(2026, 8, 21));
  assert.deepEqual(todayPitutur, sameDayPitutur, 'Hari yang sama harus menghasilkan pitutur yang konsisten');
});

test('Wayang Purwa - Penegasan Etika Kultural (Non-Stereotip)', () => {
  assert.ok(DISCLAIMER_ETIS_WAYANG);
  assert.ok(DISCLAIMER_ETIS_WAYANG.includes('alegori moral'));
  assert.ok(DISCLAIMER_ETIS_WAYANG.includes('Asta Brata'));
  assert.ok(DISCLAIMER_ETIS_WAYANG.includes('stereotip'));
});
