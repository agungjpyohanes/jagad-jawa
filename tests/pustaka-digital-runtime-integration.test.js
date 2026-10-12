import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDomainData } from '../js/services/dbLoader.js';
import {
  getAllNaskahKuno,
  getNaskahKunoById,
  searchNaskahKuno,
  formatNaskahPlainText,
  getAllKamusJawaIndo,
  searchKamusJawaIndo,
  getAllKamusJawaSanskerta,
  searchKamusJawaSanskerta,
  getAllDokumenReferensi,
  getDokumenReferensiById,
  searchDokumenReferensi
} from '../js/modules/pustaka/pustaka-engine.js';

test.describe('Pustaka Digital Runtime Data Integration & Getters Parity', () => {
  test.beforeEach(() => {
    delete globalThis._currentPustakaDigitalData;
  });

  test('loadDomainData("pustaka") loads pustakaDigital into globalThis._currentPustakaDigitalData with 5/71/30/3 initial counts', async () => {
    const data = await loadDomainData('pustaka');
    assert.ok(data, 'Pustaka domain data harus berhasil dimuat');
    assert.ok(data.pustakaDigital, 'pustakaDigital harus ada dalam result');
    assert.strictEqual(globalThis._currentPustakaDigitalData, data.pustakaDigital, 'globalThis._currentPustakaDigitalData harus sinkron');

    const pd = globalThis._currentPustakaDigitalData;
    assert.strictEqual(pd.naskah_kuno.length, 5, 'naskah_kuno harus berisi tepat 5');
    assert.strictEqual(pd.kamus_jawa_indonesia.length, 71, 'kamus_jawa_indonesia harus berisi tepat 71');
    assert.strictEqual(pd.kamus_jawa_sanskerta.length, 30, 'kamus_jawa_sanskerta harus berisi tepat 30');
    assert.strictEqual(pd.dokumen_referensi.length, 3, 'dokumen_referensi harus berisi tepat 3');
  });

  test('Getters read 5/71/30/3 items from runtime dataset without arguments', async () => {
    await loadDomainData('pustaka');

    const naskah = getAllNaskahKuno();
    assert.strictEqual(naskah.length, 5);

    const kamusIndo = getAllKamusJawaIndo();
    assert.strictEqual(kamusIndo.length, 71);

    const kamusSa = getAllKamusJawaSanskerta();
    assert.strictEqual(kamusSa.length, 30);

    const referensi = getAllDokumenReferensi();
    assert.strictEqual(referensi.length, 3);
  });

  test('Search and detail for Naskah Kuno work correctly on runtime dataset', async () => {
    await loadDomainData('pustaka');

    const wedhatama = getNaskahKunoById('serat-wedhatama');
    assert.ok(wedhatama, 'Serat Wedhatama harus ditemukan');
    assert.strictEqual(wedhatama.id, 'serat-wedhatama');
    assert.strictEqual(wedhatama.kategori, 'Naskah Piwulang & Moral');
    assert.ok(wedhatama.babList.length > 0);

    const plainText = formatNaskahPlainText(wedhatama);
    assert.ok(plainText.includes('SERAT WEDHATAMA'));
    assert.ok(plainText.includes('Pupuh Pangkur'));

    const searchRes = searchNaskahKuno('Zaman Edan');
    assert.ok(searchRes.length >= 1);
    assert.strictEqual(searchRes[0].id, 'serat-kalatidha');
  });

  test('Search for Kamus Jawa-Indonesia and Kamus Jawa-Sanskerta work on runtime dataset', async () => {
    await loadDomainData('pustaka');

    const searchIndo = searchKamusJawaIndo('Eling');
    assert.ok(searchIndo.length >= 1);
    assert.ok(searchIndo.some(k => k.jawa.toLowerCase().includes('eling') || k.krama.toLowerCase().includes('emut')));

    const searchSa = searchKamusJawaSanskerta('Dharma');
    assert.ok(searchSa.length >= 1);
    assert.ok(searchSa.some(k => k.sanskerta.toLowerCase().includes('dharma')));
  });

  test('Search and detail for Dokumen Referensi work on runtime dataset', async () => {
    await loadDomainData('pustaka');

    const macapat = getDokumenReferensiById('paugeran-macapat');
    assert.ok(macapat, 'Paugeran macapat harus ditemukan');
    assert.strictEqual(macapat.id, 'paugeran-macapat');
    assert.strictEqual(macapat.kategori, 'Sastra & Tembang Klasik');

    const searchRes = searchDokumenReferensi('Gamelan');
    assert.ok(searchRes.length >= 1);
    assert.strictEqual(searchRes[0].id, 'kawruh-karawitan-gamelan');
  });

  test('Error state and retry callback work properly when dataset is empty', async () => {
    const { renderDataErrorState } = await import('../js/ui/data-error-state.js');

    const container = {
      innerHTML: '',
      querySelector: (selector) => {
        if (selector === '.btn-retry-data') {
          return {
            disabled: false,
            classList: { add() {}, remove() {} },
            setAttribute() {},
            removeAttribute() {},
            querySelector() { return { className: '', textContent: '' }; },
            addEventListener() {},
            isConnected: true
          };
        }
        return null;
      }
    };

    let retryTriggered = false;
    renderDataErrorState(container, {
      domain: 'pustaka-digital',
      isSupplemental: true,
      onRetry: () => { retryTriggered = true; }
    });

    assert.ok(container.innerHTML.includes('data-error-state'), 'Harus merender kontainer error');
    assert.ok(container.innerHTML.includes('[PUSTAKA-DIGITAL]'), 'Harus menyebut domain PUSTAKA-DIGITAL');
    assert.ok(container.innerHTML.includes('btn-retry-data'), 'Harus menyediakan tombol coba lagi');
  });
});
