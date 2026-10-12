import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDomainData } from '../js/services/dbLoader.js';
import {
  getAllMitologiNusantara,
  getMitologiById,
  formatMitologiPlainText
} from '../js/data/mitologi-nusantara-db.js';

test.describe('Mitologi Runtime Data Integration & Getters Parity', () => {
  test.beforeEach(() => {
    delete globalThis._currentMitologiData;
  });

  test('loadDomainData("mitologi") loads 5 records into globalThis._currentMitologiData', async () => {
    const data = await loadDomainData('mitologi');
    assert.ok(data, 'Data mitologi harus berhasil dimuat');
    assert.ok(Array.isArray(data), 'Dataset mitologi harus berupa array');
    assert.strictEqual(data.length, 5, 'Dataset mitologi harus memiliki tepat 5 record');
    assert.strictEqual(globalThis._currentMitologiData, data, 'globalThis._currentMitologiData harus sinkron');

    const expectedIds = ['pawukon', '30wuku', 'neptu-pasaran', 'pranata-mangsa', 'hanacaraka'];
    assert.deepStrictEqual(data.map(item => item.id), expectedIds);
  });

  test('getAllMitologiNusantara() reads globalThis._currentMitologiData when called without arguments', async () => {
    await loadDomainData('mitologi');
    const list = getAllMitologiNusantara();
    assert.ok(Array.isArray(list));
    assert.strictEqual(list.length, 5);
    assert.strictEqual(list[0].id, 'pawukon');
    assert.strictEqual(list[4].id, 'hanacaraka');
  });

  test('getMitologiById() finds item in runtime dataset by id and returns null for unknown', async () => {
    await loadDomainData('mitologi');

    const pawukon = getMitologiById('pawukon');
    assert.ok(pawukon, 'Pawukon harus ditemukan');
    assert.strictEqual(pawukon.id, 'pawukon');
    assert.strictEqual(pawukon.kategori, 'Legenda Pawukon');
    assert.ok(pawukon.babList && pawukon.babList.length > 0);

    const hanacaraka = getMitologiById('hanacaraka');
    assert.ok(hanacaraka);
    assert.strictEqual(hanacaraka.id, 'hanacaraka');
    assert.strictEqual(hanacaraka.kategori, 'Sastra & Aksara');

    const notFound = getMitologiById('mitos_tidak_dikenal');
    assert.strictEqual(notFound, null);
  });

  test('formatMitologiPlainText() formats story into copyable text without returning empty string', async () => {
    await loadDomainData('mitologi');
    const item = getMitologiById('hanacaraka');
    assert.ok(item);

    const formatted = formatMitologiPlainText(item);
    assert.ok(typeof formatted === 'string');
    assert.ok(formatted.length > 100);
    assert.ok(formatted.includes('Aksara Jawa Hanacaraka'));
    assert.ok(formatted.includes('Dora'));
    assert.ok(formatted.includes('Sembada'));
    assert.ok(formatted.includes('Falsafah & Piwulang Luhur'));
  });

  test('Supports mitologi_list wrapper shape if provided', () => {
    globalThis._currentMitologiData = {
      mitologi_list: [
        { id: 'custom_m1', judul: 'Kisah Custom 1', ringkasan: 'Uji custom' }
      ]
    };

    const list = getAllMitologiNusantara();
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].id, 'custom_m1');

    const item = getMitologiById('custom_m1');
    assert.ok(item);
    assert.strictEqual(item.judul, 'Kisah Custom 1');
  });

  test('Empty dataset handling in UI renders error state and provides retry mechanism', async () => {
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

    let retryCalled = false;
    renderDataErrorState(container, {
      domain: 'mitologi',
      isSupplemental: true,
      onRetry: () => { retryCalled = true; }
    });

    assert.ok(container.innerHTML.includes('data-error-state'), 'Harus merender container .data-error-state');
    assert.ok(container.innerHTML.includes('[MITOLOGI]'), 'Harus menyebutkan domain MITOLOGI');
    assert.ok(container.innerHTML.includes('btn-retry-data'), 'Harus menyediakan tombol retry');
  });
});
