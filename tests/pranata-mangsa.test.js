import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getPranataMangsaLengkap } from '../js/modules/kalender/kalender-engine.js';

describe('Pranata Mangsa Agraris (Tahap 2)', () => {
  it('harus mengembalikan Mangsa Kasa untuk tanggal 1 Juli (Musim Terang / Katiga)', () => {
    const pm = getPranataMangsaLengkap(1, 7);
    assert.ok(pm.nama.includes('Kasa'));
    assert.ok(pm.musimTani.includes('Katiga'));
    assert.ok(pm.candrasangkala.includes('Sesotya murca ing embanan'));
    assert.ok(pm.pratandhaAlam.includes('Godhong'));
    assert.ok(pm.pakaryanTani.includes('palawija'));
  });

  it('harus mengembalikan Mangsa Karo untuk tanggal 10 Agustus', () => {
    const pm = getPranataMangsaLengkap(10, 8);
    assert.ok(pm.nama.includes('Karo'));
    assert.ok(pm.candrasangkala.includes('Bantala rengka'));
    assert.ok(pm.musimTani.includes('Katiga'));
  });

  it('harus mengembalikan Mangsa Kalima untuk tanggal 20 Oktober (Musim Labuh)', () => {
    const pm = getPranataMangsaLengkap(20, 10);
    assert.ok(pm.nama.includes('Kalima'));
    assert.ok(pm.candrasangkala.includes('Pancuran mas sumawur ing jagad'));
    assert.ok(pm.musimTani.includes('Labuh'));
    assert.ok(pm.pratandhaAlam.includes('Udan'));
  });

  it('harus mengembalikan Mangsa Kanem untuk tanggal 15 Desember (Musim Rendheng)', () => {
    const pm = getPranataMangsaLengkap(15, 12);
    assert.ok(pm.nama.includes('Kanem'));
    assert.ok(pm.candrasangkala.includes('Rasa mulya kasuciyan'));
    assert.ok(pm.musimTani.includes('Rendheng'));
    assert.ok(pm.pakaryanTani.includes('sawah'));
  });

  it('harus mengembalikan Mangsa Kapitu untuk tanggal 15 Januari', () => {
    const pm = getPranataMangsaLengkap(15, 1);
    assert.ok(pm.nama.includes('Kapitu'));
    assert.ok(pm.candrasangkala.includes('Wisa kentas ing maruta'));
    assert.ok(pm.musimTani.includes('Rendheng'));
  });

  it('harus mengembalikan Mangsa Kasanga untuk tanggal 10 Maret', () => {
    const pm = getPranataMangsaLengkap(10, 3);
    assert.ok(pm.nama.includes('Kasanga'));
    assert.ok(pm.candrasangkala.includes('Wedaring wacana mulya'));
  });

  it('harus mengembalikan Mangsa Desta untuk tanggal 5 Mei (Musim Mareng)', () => {
    const pm = getPranataMangsaLengkap(5, 5);
    assert.ok(pm.nama.includes('Desta'));
    assert.ok(pm.candrasangkala.includes('Sotya sinarawedi'));
    assert.ok(pm.musimTani.includes('Mareng'));
  });

  it('seluruh 12 mangsa harus memiliki struktur lengkap dan tidak undefined', () => {
    const sampleDates = [
      [1, 7],   // Kasa
      [5, 8],   // Karo
      [28, 8],  // Katelu
      [20, 9],  // Kapat
      [15, 10], // Kalima
      [20, 11], // Kanem
      [10, 1],  // Kapitu
      [10, 2],  // Kawolu
      [15, 3],  // Kasanga
      [5, 4],   // Kasadasa
      [25, 4],  // Desta
      [10, 6]   // Saddha
    ];

    for (const [d, m] of sampleDates) {
      const pm = getPranataMangsaLengkap(d, m);
      assert.ok(pm.nama, `Nama mangsa harus ada untuk tgl ${d}/${m}`);
      assert.ok(pm.candrasangkala, `Candrasangkala harus ada untuk tgl ${d}/${m}`);
      assert.ok(pm.musimTani, `Musim tani harus ada untuk tgl ${d}/${m}`);
      assert.ok(pm.pratandhaAlam, `Pratandha alam harus ada untuk tgl ${d}/${m}`);
      assert.ok(pm.pakaryanTani, `Pakaryan tani harus ada untuk tgl ${d}/${m}`);
    }
  });
});
