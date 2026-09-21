/**
 * Jagad Jawa — Modul Domain: Selametan Engine (Pengetan Tilar Donyo)
 * Pure calculation functions untuk menentukan hari, pasaran, dan tanggal
 * upacara pengetan tilar donyo (3 harian, 7 harian, 40 harian, 100 harian,
 * mendhak pisan, mendhak pindho, dan nyewu).
 * 
 * Dilengkapi dukungan konvensi waktu wafat bakda Maghrib (surup) dan
 * panduan kultural ubarampe serta doa tradisi.
 * Bebas dari ketergantungan DOM.
 */

import {
  TARGET_HARI_SELAMETAN,
  TARGET_PASARAN_SELAMETAN,
  JENIS_SELAMETAN
} from '../../data/selametan.js';
import { HARI, PASARAN, BULAN_MASEHI, getDayInfo, getNeptu } from '../kalender/kalender-engine.js';

export const SELAMETAN_KULTURAL_DATA = [
  {
    idx: 0,
    nama: '3 Harian (Nelung Dina)',
    maknaKultural: 'Peringatan hari ke-3 untuk mengikhlaskan kepergian arwah dan mendoakan kelapangan di alam kubur saat jasad mulai menyatu dengan bumi.',
    ubarampe: 'Sega gurih (uduk), ingkung ayam kampung, kedelai hitam, rempah sursur, dan jenang abang putih.',
    donga: 'Surah Yasin, Tahlil, dan doa khusus arwah (Donga Kubur).'
  },
  {
    idx: 1,
    nama: '7 Harian (Mitung Dina)',
    maknaKultural: 'Peringatan hari ke-7 saat proses pelepasan unsur jasmani dan arwah memohon ampunan dosa lahir batin.',
    ubarampe: 'Sega asahan, sayur lodeh kluwih (supaya luwih berkah), tempe bacem, apem kinca, dan pasung.',
    donga: "Khataman Al-Qur'an / Tahlil Pitu, Donga Arwah Jamak, dan sedekah pitu."
  },
  {
    idx: 2,
    nama: '40 Harian (Matangpuluh Dina)',
    maknaKultural: 'Peringatan hari ke-40 ketika unsur tanah, air, angin, dan api raga telah luluh sempurna; mendoakan ketetapan iman di alam barzakh.',
    ubarampe: 'Sega golong (lambang tekad bulat), jajan pasar 7 macam, kolak pisang kepok, apem panggang, dan ketan kolak.',
    donga: 'Tahlil Akbar 40 Dina, Donga Husnul Khatimah, dan sedekah pakaian peninggalan almarhum.'
  },
  {
    idx: 3,
    nama: '100 Harian (Nyatus Dina)',
    maknaKultural: 'Peringatan hari ke-100 saat raga telah pupus tak berbekas; penyucian arwah dan ketenangan keluarga yang ditinggalkan.',
    ubarampe: 'Tumpeng megono, urap-urapan janganan klopo, iwak lele/kutuk panggang, peyek kacang, dan jenang panca warna.',
    donga: 'Tahlil Nyatus, Donga Kasampurnan Arwah, dan sedekah beras (beras sekul).'
  },
  {
    idx: 4,
    nama: 'Pendak Pisan (1 Tahun Jawa)',
    maknaKultural: 'Peringatan genap satu tahun Jawa wafatnya almarhum; ungkapan bakti keluarga dan ziarah membersihkan pasarean.',
    ubarampe: 'Sega liwet komplet, opor ayam kampung, sambel goreng ati, kupat lepet, dan kembang boreh telon.',
    donga: 'Tahlil Mendhak, Donga Ruwah Setaun, dan sedekah jariyah atas nama almarhum.'
  },
  {
    idx: 5,
    nama: 'Pendak Pindho (2 Tahun Jawa)',
    maknaKultural: 'Peringatan genap dua tahun Jawa; pelepasan keterikatan duniawi dan pemantapan doa keselamatan abadi.',
    ubarampe: 'Sega tumpeng pungkur, ayam bakar utuh, entho-entho, jadah ketan bakar, dan wedang serbat jahe.',
    donga: 'Tahlil Mendhak Pindho, Surat Tabarak (Al-Mulk), dan Donga Rahayu.'
  },
  {
    idx: 6,
    nama: 'Nyewu (1000 Hari / Slametan Pungkasan)',
    maknaKultural: 'Puncak peringatan 1000 hari (slametan pungkasan); arwah diyakini telah sempurna di alam kelanggengan. Dilakukan penyempurnaan nisan/kijing dan sedekah ageng.',
    ubarampe: 'Tumpeng sewu / tumpeng robyong komplet, ingkung ayam cemani/kampung jantan, jajan pasar komplit, kembang mawar melati kenanga telon, dan bubur cawuk.',
    donga: "Tahlil Akbar Sewu, Khatam Al-Qur'an, Donga Kasampurnan Linuwih, dan Donga Pungkasan Silsilah."
  }
];

/**
 * Menghitung seluruh jadwal peringatan selametan tilar donyo.
 * Mendukung opsi pergantian hari Jawa saat terbenam matahari (bakda Maghrib).
 * 
 * @param {number} yy Tahun wafat Masehi
 * @param {number} mm Bulan wafat Masehi (1 - 12)
 * @param {number} dd Tanggal wafat Masehi (1 - 31)
 * @param {'siang' | 'malam_maghrib'} [waktuWafat='siang'] Waktu berpulang
 * @param {string} [namaAlmarhum=''] Nama almarhum / almarhumah
 * @returns {Object} Data geblak, daftar jadwal peringatan, dan metadata kultural
 */
export function hitungSelametanDates(yy, mm, dd, waktuWafat = 'siang', namaAlmarhum = '') {
  // Jika wafat bakda maghrib (surup), hari Jawa berganti ke hari berikutnya
  const baseDate = new Date(Date.UTC(yy, mm - 1, dd));
  const isMalam = waktuWafat === 'malam_maghrib';
  
  const calcDate = new Date(baseDate);
  if (isMalam) {
    calcDate.setUTCDate(calcDate.getUTCDate() + 1);
  }

  const calcY = calcDate.getUTCFullYear();
  const calcM = calcDate.getUTCMonth() + 1;
  const calcD = calcDate.getUTCDate();

  const info = getDayInfo(calcY, calcM, calcD);
  const hariWafat = HARI[info.weekdayId];
  const pasaranWafat = PASARAN[info.pasaranId];
  const hariIdx = info.weekdayId;
  const neptuTotal = getNeptu(hariWafat, pasaranWafat);

  const tglAsliStr = `${dd} ${BULAN_MASEHI[mm - 1]} ${yy}`;
  const geblakStr = `${calcD} ${BULAN_MASEHI[calcM - 1]} ${calcY}`;

  const geblak = {
    tahun: calcY,
    bulan: calcM,
    tanggal: calcD,
    hari: hariWafat,
    pasaran: pasaranWafat,
    neptu: neptuTotal,
    tanggalStr: geblakStr,
    waktuWafat,
    namaAlmarhum: (namaAlmarhum || '').trim(),
    tanggalMasehiAsli: tglAsliStr
  };

  const items = [];

  JENIS_SELAMETAN.forEach(j => {
    const targetH = TARGET_HARI_SELAMETAN[hariIdx][j.idx];
    const targetP = TARGET_PASARAN_SELAMETAN[pasaranWafat][j.idx];
    const kultur = SELAMETAN_KULTURAL_DATA.find(k => k.idx === j.idx) || {
      maknaKultural: '',
      ubarampe: '',
      donga: ''
    };

    let bestDate = null;
    for (let delta = 0; delta <= 25; delta++) {
      for (const sign of (delta === 0 ? [0] : [1, -1])) {
        const check = new Date(calcDate);
        check.setUTCDate(calcDate.getUTCDate() + j.approx + sign * delta);
        const chkInfo = getDayInfo(check.getUTCFullYear(), check.getUTCMonth() + 1, check.getUTCDate());
        if (HARI[chkInfo.weekdayId] === targetH && PASARAN[chkInfo.pasaranId] === targetP) {
          bestDate = check;
          break;
        }
      }
      if (bestDate) break;
    }

    if (bestDate) {
      const diffDays = Math.round((bestDate.getTime() - calcDate.getTime()) / 86400000);
      const resY = bestDate.getUTCFullYear();
      const resM = bestDate.getUTCMonth() + 1;
      const resD = bestDate.getUTCDate();
      const dateStr = `${resD} ${BULAN_MASEHI[resM - 1]} ${resY}`;
      const isoDate = `${resY}-${String(resM).padStart(2, '0')}-${String(resD).padStart(2, '0')}`;

      items.push({
        id: `selametan-${j.idx}`,
        nama: j.nama,
        approx: j.approx,
        targetH,
        targetP,
        targetWeton: `${targetH} ${targetP}`,
        tahun: resY,
        bulan: resM,
        tanggal: resD,
        dateStr,
        isoDate,
        diffDays,
        maknaKultural: kultur.maknaKultural,
        ubarampe: kultur.ubarampe,
        donga: kultur.donga
      });
    }
  });

  return {
    geblak,
    items,
    waktuWafat,
    namaAlmarhum: geblak.namaAlmarhum
  };
}

export {
  TARGET_HARI_SELAMETAN,
  TARGET_PASARAN_SELAMETAN,
  JENIS_SELAMETAN
};
