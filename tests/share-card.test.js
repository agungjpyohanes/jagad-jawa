import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  buildWhatsAppShareText,
  getCulturalQuote
} from '../js/modules/kalender/share-card.js';

describe('Share Card Weton & WhatsApp Formatter (Tahap 2)', () => {
  it('harus menghasilkan kutipan budaya luhur yang konsisten', () => {
    const q1 = getCulturalQuote(12345);
    const q2 = getCulturalQuote(12345);
    assert.strictEqual(q1.jawa, q2.jawa);
    assert.ok(q1.jawa.length > 0);
    assert.ok(q1.arti.length > 0);
  });

  it('harus menyusun teks WhatsApp lengkap dengan weton, neptu, pawukon, dan pranata mangsa', () => {
    const text = buildWhatsAppShareText(2026, 9, 19);
    assert.ok(text.includes('WETON & PETUNGAN JAWA'));
    assert.ok(text.includes('19 September 2026'));
    assert.ok(text.includes('Setu Wage') || text.includes('Weton'));
    assert.ok(text.includes('Neptu:'));
    assert.ok(text.includes('Pranata Mangsa:'));
    assert.ok(text.includes('Pitutur Luhur:'));
    assert.ok(text.includes('jagad-jawa.web.app'));
  });
});
