import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDomainData } from '../js/services/dbLoader.js';
import {
  getWayangById,
  filterWayangList,
  getActiveWayangList,
  getActiveKategoriList
} from '../js/modules/wayang/wayang-engine.js';

test.describe('Wayang Runtime Data Integration & Getters Parity', () => {
  test.beforeEach(() => {
    delete globalThis._currentWayangData;
  });

  test('loadDomainData("wayang") loads valid wayang data into globalThis._currentWayangData', async () => {
    const data = await loadDomainData('wayang');
    assert.ok(data, 'Data wayang harus berhasil dimuat');
    assert.ok(Array.isArray(data.wayang_list), 'data.wayang_list harus berupa array');
    assert.ok(Array.isArray(data.kategori_list), 'data.kategori_list harus berupa array');
    assert.strictEqual(globalThis._currentWayangData, data, 'globalThis._currentWayangData harus terisi');
    assert.ok(data.wayang_list.length >= 25, 'Minimal 25 tokoh wayang');
  });

  test('getActiveWayangList() reads globalThis._currentWayangData when no arguments provided', async () => {
    await loadDomainData('wayang');
    const list = getActiveWayangList();
    assert.ok(Array.isArray(list), 'Harus mengembalikan array');
    assert.strictEqual(list.length, globalThis._currentWayangData.wayang_list.length);
    assert.strictEqual(list[0].id, globalThis._currentWayangData.wayang_list[0].id);
  });

  test('getActiveKategoriList() reads globalThis._currentWayangData when no arguments provided', async () => {
    await loadDomainData('wayang');
    const categories = getActiveKategoriList();
    assert.ok(Array.isArray(categories), 'Harus mengembalikan array kategori');
    assert.deepStrictEqual(categories, globalThis._currentWayangData.kategori_list);
  });

  test('getWayangById() resolves character without argument using runtime data', async () => {
    await loadDomainData('wayang');
    const arjuna = getWayangById('arjuna');
    assert.ok(arjuna, 'Arjuna harus ditemukan');
    assert.strictEqual(arjuna.id, 'arjuna');
    assert.strictEqual(arjuna.kategori, 'Pandawa');
    assert.strictEqual(arjuna.kasatriyan, 'Kasatriyan Madukara');

    const puntadewa = getWayangById('puntadewa');
    assert.ok(puntadewa);
    assert.strictEqual(puntadewa.id, 'puntadewa');

    const unknown = getWayangById('tokoh_fiktif_tidak_ada');
    assert.strictEqual(unknown, null);
  });

  test('filterWayangList() filters by category and search query using runtime data', async () => {
    await loadDomainData('wayang');
    const pandawa = filterWayangList('Pandawa');
    assert.ok(pandawa.length > 0, 'Pandawa harus memiliki anggota');
    assert.ok(pandawa.every(w => w.kategori === 'Pandawa'));

    const searchPasopati = filterWayangList('semua', 'Pasopati');
    assert.ok(searchPasopati.length >= 1, 'Pencarian Pasopati harus menemukan karakter');
    assert.ok(searchPasopati.some(w => w.id === 'arjuna'));
  });

  test('Handles raw array format in globalThis._currentWayangData', () => {
    globalThis._currentWayangData = [
      { id: 'custom_1', nama: 'Tokoh Custom 1', kategori: 'Pandawa', watak: 'Baik', pusaka: 'Keris' }
    ];

    const list = getActiveWayangList();
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].id, 'custom_1');

    const char = getWayangById('custom_1');
    assert.ok(char);
    assert.strictEqual(char.nama, 'Tokoh Custom 1');
  });
});
