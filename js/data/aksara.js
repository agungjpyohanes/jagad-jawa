// Data Aksara Jawa (Hanacaraka) & Engine Transliterasi Standar
// Mematuhi Kaidah Kongres Bahasa Jawa, Sastra.org & Aksarajawa.id

const AKSARA_NGLEGENA = {
  'ha': 'ꦲ', 'na': 'ꦤ', 'ca': 'ꦕ', 'ra': 'ꦫ', 'ka': 'ꦏ',
  'da': 'ꦢ', 'ta': 'ꦠ', 'sa': 'ꦱ', 'wa': 'ꦮ', 'la': 'ꦭ',
  'pa': 'ꦥ', 'dha': 'ꦝ', 'ja': 'ꦗ', 'ya': 'ꦪ', 'nya': 'ꦚ',
  'ma': 'ꦩ', 'ga': 'ꦒ', 'ba': 'ꦧ', 'tha': 'ꦛ', 'nga': 'ꦔ'
};

const PASANGAN_MAP = {
  'ha': '꧀ꦲ', 'na': '꧀ꦤ', 'ca': '꧀ꦕ', 'ra': '꧀ꦫ', 'ka': '꧀ꦏ',
  'da': '꧀ꦢ', 'ta': '꧀ꦠ', 'sa': '꧀ꦱ', 'wa': '꧀ꦮ', 'la': '꧀ꦭ',
  'pa': '꧀ꦥ', 'dha': '꧀ꦝ', 'ja': '꧀ꦗ', 'ya': '꧀ꦪ', 'nya': '꧀ꦚ',
  'ma': '꧀ꦩ', 'ga': '꧀ꦒ', 'ba': '꧀ꦧ', 'tha': '꧀ꦛ', 'nga': '꧀ꦔ'
};

const SANDHANGAN_SWARA = {
  'wulu': { aksara: 'ꦶ', latin: 'i', nama: 'Wulu (vokal i)' },
  'suku': { aksara: 'ꦸ', latin: 'u', nama: 'Suku (vokal u)' },
  'taling': { aksara: 'ꦺ', latin: 'é', nama: 'Taling (vokal é/è)' },
  'pepet': { aksara: 'ꦼ', latin: 'e', nama: 'Pepet (vokal e)' },
  'taling_tarung': { aksara: 'ꦺꦴ', latin: 'o', nama: 'Taling Tarung (vokal o)' }
};

const SANDHANGAN_PANYIGEG = {
  'layar': { aksara: 'ꦂ', latin: 'r mati', nama: 'Layar (-r)' },
  'wignyan': { aksara: 'ꦃ', latin: 'h mati', nama: 'Wignyan (-h)' },
  'cecak': { aksara: 'ꦁ', latin: 'ng mati', nama: 'Cecak (-ng)' },
  'pangkon': { aksara: '꧀', latin: 'paten', nama: 'Pangkon (paten)' }
};

const SANDHANGAN_WYANJANA = {
  'cakra': { aksara: 'ꦿ', latin: '-ra-', nama: 'Cakra (+ra)' },
  'cakra_keret': { aksara: 'ꦽ', latin: '-re-', nama: 'Cakra Keret (+re pepet)' },
  'pengkal': { aksara: 'ꦾ', latin: '-ya-', nama: 'Pengkal (+ya)' }
};

const AKSARA_MURDA = {
  'Na': 'ꦟ', 'Ka': 'ꦑ', 'Ta': 'ꦡ', 'Sa': 'ꦰ',
  'Pa': 'ꦦ', 'Nya': 'ꦘ', 'Ga': 'ꦓ', 'Ba': 'ꦨ'
};

const AKSARA_SWARA = {
  'A': 'ꦄ', 'I': 'ꦅ', 'U': 'ꦈ', 'E': 'ꦌ', 'O': 'ꦎ'
};

const ANGKA_JAWA = {
  '0': '꧐', '1': '꧑', '2': '꧒', '3': '꧓', '4': '꧔',
  '5': '꧕', '6': '꧖', '7': '꧗', '8': '꧘', '9': '꧙'
};

const PADA_JAWA = {
  'lingsa': { aksara: '꧈', nama: 'Pada Lingsa (Koma)' },
  'lungsi': { aksara: '꧉', nama: 'Pada Lungsi (Titik)' },
  'pangkat': { aksara: '꧇', nama: 'Pada Pangkat (Titik Dua / Pengapit Angka)' }
};

// Pemetaan Dasar Konsonan Latin -> Aksara Base
const CONSONANT_BASE = {
  'ng': 'ꦔ', 'ny': 'ꦚ', 'dh': 'ꦝ', 'th': 'ꦛ',
  'h': 'ꦲ', 'n': 'ꦤ', 'c': 'ꦕ', 'r': 'ꦫ', 'k': 'ꦏ',
  'd': 'ꦢ', 't': 'ꦠ', 's': 'ꦱ', 'w': 'ꦮ', 'l': 'ꦭ',
  'p': 'ꦥ', 'j': 'ꦗ', 'y': 'ꦪ', 'm': 'ꦩ', 'g': 'ꦒ', 'b': 'ꦧ'
};

const VOWEL_LIST = ['a', 'i', 'u', 'e', 'é', 'è', 'o'];

/**
 * Engine Transliterasi Latin ke Aksara Jawa
 * Mengimplementasikan aturan Kongres Bahasa Jawa:
 * 1. Pasangan otomatis di tengah kata jika konsonan mati bertemu konsonan berikutnya
 * 2. Pangkon hanya di akhir kata penutup kalimat atau sebelum jeda/tanda baca
 * 3. Panyigeg wanda: -r -> Layar (ꦂ), -h -> Wignyan (ꦃ), -ng -> Cecak (ꦁ)
 * 4. Wyanjana: C + r -> Cakra (ꦿ), C + re (pepet) -> Cakra Keret (ꦽ), C + y -> Pengkal (ꦾ)
 * 5. Vokal khusus: 're' pepet mandiri -> Pa Cerek (ꦉ), 'le' pepet -> Nga Lelet (ꦊ)
 * 6. Fonem ganda: dh (ꦝ), th (ꦛ), ny (ꦚ), ng (ꦔ)
 */
function transliterateLatinToJawa(rawText) {
  if (!rawText) return '';

  let text = rawText
    .replace(/[\r\n]+/g, '\n')
    .replace(/ĕ/g, 'e')
    .replace(/ê/g, 'e');

  let result = '';
  let i = 0;
  const len = text.length;

  // Helper untuk mengecek apakah karakter adalah vokal
  function isVowel(ch) {
    return ch ? VOWEL_LIST.includes(ch.toLowerCase()) : false;
  }

  // Helper untuk mengecek vokal 'e' pepet vs 'é' taling
  function getSandhanganVowel(v) {
    const low = v.toLowerCase();
    if (low === 'i') return 'ꦶ';
    if (low === 'u') return 'ꦸ';
    if (low === 'e') return 'ꦼ'; // pepet
    if (low === 'é' || low === 'è') return 'ꦺ'; // taling
    if (low === 'o') return 'ꦺꦴ'; // taling tarung
    return ''; // 'a' tidak perlu sandhangan
  }

  while (i < len) {
    const ch = text[i];
    const low = ch.toLowerCase();

    // 1. Spasi, Baris Baru, dan Tanda Baca
    if (ch === ' ' || ch === '\t') {
      result += ' ';
      i++;
      continue;
    }
    if (ch === '\n') {
      result += '\n';
      i++;
      continue;
    }
    if (ch === ',') {
      result += '꧈ ';
      i++;
      continue;
    }
    if (ch === '.') {
      result += '꧉ ';
      i++;
      continue;
    }
    if (ch === ':' || ch === ';') {
      result += '꧇';
      i++;
      continue;
    }
    if (ch >= '0' && ch <= '9') {
      result += ANGKA_JAWA[ch] || ch;
      i++;
      continue;
    }

    // 2. Vokal Khusus & Suku Kata Mandiri (Pa Cerek & Nga Lelet)
    // Suku kata 're' pepet mandiri (di awal kata atau setelah spasi/vokal)
    if (low === 'r' && (text[i + 1] === 'e' || text[i + 1] === 'E') && !['é', 'è'].includes(text[i + 1])) {
      const prevChar = i > 0 ? text[i - 1].toLowerCase() : ' ';
      if (!prevChar.match(/[a-z]/) || isVowel(prevChar)) {
        result += 'ꦉ'; // Pa Cerek
        i += 2;
        continue;
      }
    }
    // Suku kata 'le' pepet mandiri
    if (low === 'l' && (text[i + 1] === 'e' || text[i + 1] === 'E') && !['é', 'è'].includes(text[i + 1])) {
      const prevChar = i > 0 ? text[i - 1].toLowerCase() : ' ';
      if (!prevChar.match(/[a-z]/) || isVowel(prevChar)) {
        result += 'ꦊ'; // Nga Lelet
        i += 2;
        continue;
      }
    }

    // 3. Vokal Mandiri (di awal kata atau setelah vokal lain)
    if (isVowel(low)) {
      const prevChar = i > 0 ? text[i - 1].toLowerCase() : ' ';
      const isStart = !prevChar.match(/[a-z]/) || isVowel(prevChar);

      if (isStart) {
        // Vokal berdiri sendiri menggunakan aksara 'ha' + sandhangan
        if (low === 'a') result += 'ꦲ';
        else if (low === 'i') result += 'ꦲꦶ';
        else if (low === 'u') result += 'ꦲꦸ';
        else if (low === 'e') result += 'ꦲꦼ';
        else if (low === 'é' || low === 'è') result += 'ꦲꦺ';
        else if (low === 'o') result += 'ꦲꦺꦴ';
        i++;
        continue;
      }
    }

    // 4. Deteksi Konsonan (Mulai dengan fonem ganda 2 karakter lalu 1 karakter)
    let c = '';
    let cLen = 0;
    const two = text.substring(i, i + 2).toLowerCase();
    if (CONSONANT_BASE[two]) {
      c = two;
      cLen = 2;
    } else if (CONSONANT_BASE[low]) {
      c = low;
      cLen = 1;
    }

    if (c) {
      const baseAksara = CONSONANT_BASE[c];
      const afterC = text.substring(i + cLen);
      const nextChar = afterC.length > 0 ? afterC[0].toLowerCase() : '';
      const next2Char = afterC.length > 1 ? afterC.substring(0, 2).toLowerCase() : '';

      // 4a. Cek Sandhangan Wyanjana: Konsonan + 'r' (Cakra) / 're' (Cakra Keret)
      if (nextChar === 'r' && afterC.length > 1) {
        const afterR = afterC[1].toLowerCase();
        if (afterR === 'e' && !['é', 'è'].includes(afterC[1])) {
          // Konsonan + Cakra Keret (kre, tre, pre)
          result += baseAksara + 'ꦽ';
          i += cLen + 2;
          continue;
        } else if (isVowel(afterR)) {
          // Konsonan + Cakra + vokal (kra, kri, kru, kro)
          const sv = getSandhanganVowel(afterR);
          result += baseAksara + 'ꦿ' + sv;
          i += cLen + 2;
          continue;
        }
      }

      // 4b. Cek Sandhangan Wyanjana: Konsonan + 'y' (Pengkal)
      if (nextChar === 'y' && afterC.length > 1) {
        const afterY = afterC[1].toLowerCase();
        if (isVowel(afterY)) {
          // Konsonan + Pengkal + vokal (kya, dya, mya)
          const sv = getSandhanganVowel(afterY);
          result += baseAksara + 'ꦾ' + sv;
          i += cLen + 2;
          continue;
        }
      }

      // 4c. Konsonan Hidup Biasa (diikuti vokal)
      if (isVowel(nextChar)) {
        const sv = getSandhanganVowel(nextChar);
        result += baseAksara + sv;
        i += cLen + 1;
        continue;
      }

      // 4d. Konsonan Mati (Sigeg)
      // Periksa apakah ini sigeg panyigeg: -r (layar), -h (wignyan), -ng (cecak)
      // Syarat panyigeg: jika tidak diikuti vokal (atau di akhir kata / sebelum konsonan lain)
      if (c === 'r') {
        result += 'ꦂ'; // Layar
        i += cLen;
        continue;
      }
      if (c === 'h') {
        result += 'ꦃ'; // Wignyan
        i += cLen;
        continue;
      }
      if (c === 'ng') {
        result += 'ꦁ'; // Cecak
        i += cLen;
        continue;
      }

      // 4e. Konsonan Mati Lainnya (Bukan r, h, ng):
      // Cek apakah bertemu konsonan berikutnya (di tengah kata atau antarkata) -> PASANGAN!
      // Cek apakah karakter berikutnya adalah konsonan (hidup atau gugus)
      let nextCons = '';
      if (CONSONANT_BASE[next2Char]) {
        nextCons = next2Char;
      } else if (CONSONANT_BASE[nextChar]) {
        nextCons = nextChar;
      }

      if (nextCons) {
        // Konsonan mati bertemu konsonan berikutnya:
        // Tulis konsonan mati + Pangkon (U+A9C0) sehingga konsonan berikutnya otomatis menjadi pasangan!
        // Contoh: 'k' mati + 't' -> ꦏ + ꧀ + ꦠ = ꦏ꧀ꦠ (pasangan ta)
        result += baseAksara + '꧀';
        i += cLen;
        continue;
      } else {
        // Konsonan mati di akhir kata, sebelum spasi, tanda baca, atau akhir kalimat -> PANGKON
        result += baseAksara + '꧀';
        i += cLen;
        continue;
      }
    }

    // Karakter lain yang tidak terpetakan (simbol, tanda kurung, dsb)
    result += ch;
    i++;
  }

  return result;
}

if (typeof window !== 'undefined') {
  window.AKSARA_NGLEGENA = AKSARA_NGLEGENA;
  window.PASANGAN_MAP = PASANGAN_MAP;
  window.SANDHANGAN_SWARA = SANDHANGAN_SWARA;
  window.SANDHANGAN_PANYIGEG = SANDHANGAN_PANYIGEG;
  window.SANDHANGAN_WYANJANA = SANDHANGAN_WYANJANA;
  window.AKSARA_MURDA = AKSARA_MURDA;
  window.AKSARA_SWARA = AKSARA_SWARA;
  window.ANGKA_JAWA = ANGKA_JAWA;
  window.PADA_JAWA = PADA_JAWA;
  window.transliterateLatinToJawa = transliterateLatinToJawa;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AKSARA_NGLEGENA, PASANGAN_MAP, SANDHANGAN_SWARA, SANDHANGAN_PANYIGEG,
    SANDHANGAN_WYANJANA, AKSARA_MURDA, AKSARA_SWARA, ANGKA_JAWA, PADA_JAWA,
    transliterateLatinToJawa
  };
}

export {
  AKSARA_NGLEGENA,
  PASANGAN_MAP,
  SANDHANGAN_SWARA,
  SANDHANGAN_PANYIGEG,
  SANDHANGAN_WYANJANA,
  AKSARA_MURDA,
  AKSARA_SWARA,
  ANGKA_JAWA,
  PADA_JAWA,
  transliterateLatinToJawa
};


