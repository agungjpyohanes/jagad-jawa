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

export const TEMPLAT_DONGA_KEYAKINAN = {
  universal: {
    id: 'universal',
    nama: 'Universal & Tradisi Luhur Jawa',
    deskripsi: 'Refleksi spiritual luhur kasampurnan arwah, puji rahayu, dan penghormatan leluhur Nusantara.',
    dongaPerTahap: [
      'Donga Kasampurnan Arwah, Puji Rahayu marang Gusti Ingkang Maha Agung, sarta panyuwunan pangaksama lair batin mring sedaya kalepatan.',
      'Donga Pangruwatan Sukma, Puji Pangayoman Hyang Suksma Kawekas, sarta sedekah tulung pepadhang dalan kalanggengan.',
      'Donga Pangleburan Dosa Salira, Niyat Suci Pasrah Total marang Hyang Widhi, sarta sedekah tulodho kabecikan almarhum.',
      'Donga Kasucian Jiwa, Panyenyuwun Langgeng Mulyo ing Ngayunaning Pangeran, sarta sedekah beras sekul tulus manah.',
      'Donga Ruwah Setaun, Bakti Luhur Eling Asaling Dumadi, sarta ziarah pasarean nglestarekake sambung raket trah kulawarga.',
      'Donga Rahayu Kasampurnan, Pangruwating Panandhang Dunya, sarta panyuwunan tentrem rahayu arwah ing alam langgeng.',
      'Donga Agung Kasampurnan Linuwih, Panutup Silsilah Bakti Sewu Dina, sarta sedekah ageng nyampurnakake katentreman sejati.'
    ]
  },
  islam: {
    id: 'islam',
    nama: 'Islam Nusantara',
    deskripsi: 'Tradisi tahlil, yasinan, istighotsah, dan doa arwah.',
    dongaPerTahap: [
      'Surah Yasin, Tahlil, Donga Kubur, Donga Arwah, dan permohonan ampunan dosa almarhum/ah.',
      "Khataman Al-Qur'an / Tahlil Pitu, Donga Arwah Jamak, Istighotsah, dan sedekah pitu.",
      'Tahlil Akbar 40 Dina, Donga Husnul Khatimah, Donga Kasampurnan Iman, dan sedekah pakaian peninggalan almarhum.',
      'Tahlil Nyatus, Donga Kasampurnan Arwah, Donga Maghfirah, dan sedekah beras (beras sekul).',
      'Tahlil Mendhak Pisan, Donga Ruwah Setaun, Ziarah Makam, dan sedekah jariyah atas nama almarhum.',
      'Tahlil Mendhak Pindho, Surah Al-Mulk (Tabarak), Donga Rahayu, dan sedekah silaturahmi trah kulawarga.',
      "Tahlil Akbar Sewu, Khatam Al-Qur'an, Donga Kasampurnan Linuwih, dan Donga Pungkasan Silsilah."
    ]
  },
  kristen: {
    id: 'kristen',
    nama: 'Kristen Protestan',
    deskripsi: 'Doa penghiburan keluarga, pembacaan sabda keselamatan, dan kidung syukur kehidupan kekal.',
    dongaPerTahap: [
      'Doa Penghiburan Keluarga (Mazmur 23), Kidung Jemaat, dan doa penyerahan arwah ke dalam tangan kasih Tuhan Yang Maha Kuasa.',
      'Ibadah Penghiburan 7 Hari, Refleksi Firman (Yohanes 11:25-26), dan ucapan syukur atas karya almarhum selama hidup.',
      'Doa Penguatan Iman & Penyerahan 40 Hari (Mazmur 90), puji-pujian syukur keluarga, dan sedekah kasih bagi sesama.',
      'Ibadah Syukur 100 Hari (1 Korintus 15), refleksi damai sejahtera sorgawi, dan persekutuan doa keluarga.',
      'Peringatan 1 Tahun (Pendak Pisan), ibadah kenangan syukur, ziarah doa keluarga, dan persembahan diakonia.',
      'Peringatan 2 Tahun (Pendak Pindho), doa damai kekal dalam Kristus, dan pembaruan tekad kasih antargenerasi.',
      'Peringatan Kasampurnan (Nyewu), ibadah syukur agung keluarga besar, peneguhan janji keselamatan kekal, dan aksi kasih.'
    ]
  },
  katolik: {
    id: 'katolik',
    nama: 'Katolik',
    deskripsi: 'Doa arwah, Rosario Arwah, Litani Requiem, dan Misa Kudus peringatan arwah.',
    dongaPerTahap: [
      'Doa Arwah Hari ke-3, Rosario Arwah (Peristiwa Sedih), Litani Santo/Santa, dan doa penyerahan jiwa almarhum/ah.',
      'Doa Arwah Hari ke-7, Mazmur 130 (De Profundis), doa mohon kerahiman ilahi, dan Misa Kudus peringatan.',
      'Doa Arwah 40 Hari, Misa Requiem 40 Hari, Doa Pengampunan Jiwa di Api Penyucian, dan sedekah amal kasih.',
      'Doa Peringatan 100 Hari, Misa Syukur & Permohonan Kedamaian Abadi, Doa Santo Mikael Malaikat Agung.',
      'Misa Pendak Pisan (Peringatan 1 Tahun), doa berkat makam, dan intensi Misa Kudus keselamatan jiwa.',
      'Misa Pendak Pindho (Peringatan 2 Tahun), Rosario Syukur, dan doa persekutuan para kudus (Communio Sanctorum).',
      'Misa Kudus Arwah 1000 Hari (Nyewu), Liturgi Ekaristi syukur atas keselamatan abadi arwah di Surga mulia.'
    ]
  },
  hindu: {
    id: 'hindu',
    nama: 'Hindu Dharma',
    deskripsi: 'Pitra Puja, Pitra Yadnya, doa pengantar atma menuju kedamaian Sang Hyang Widhi Wasa.',
    dongaPerTahap: [
      'Pitra Puja 3 Hari, Gayatri Mantra, doa permohonan agar sang atma menemukan jalan tenang menuju Sang Hyang Widhi Wasa.',
      'Puja Pitra Yadnya 7 Hari, pembacaan sloka Bhagavad Gita (Adhyaya 2), dan persembahan sesaji suci penyucian rasa.',
      'Puja Pengantar Atma 40 Hari, Mantra Kedamaian (Om Shanti Shanti Shanti), permohonan ampunan atas karma wasana duniawi.',
      'Puja 100 Hari (Nyatus), doa pelepasan ikatan duniawi atma menuju alam pitara dengan damai dan terang.',
      'Pitra Puja 1 Tahun (Pendak Pisan), ziarah tirtayatra/makam, sembahyang bakti anak-cucu memuliakan leluhur.',
      'Pitra Puja 2 Tahun (Pendak Pindho), doa ketenteraman atma di alam swah loka, menjalin kesucian silsilah karma.',
      'Pitra Yadnya Puncak (Nyewu / 1000 Hari), Puja Atma Shanti Agung, permohonan moksha atau penitisan luhur yang suci.'
    ]
  },
  buddha: {
    id: 'buddha',
    nama: 'Buddha',
    deskripsi: 'Pattidana (pelimpahan jasa kebajikan), pelafalan Paritta, Sutra, dan doa kedamaian batin.',
    dongaPerTahap: [
      'Upacara Pattidana Hari ke-3, Pelafalan Paritta Karaniya Metta Sutta, dan pelimpahan jasa kebajikan untuk almarhum.',
      'Pelafalan Ti-Ratana Vandana 7 Hari, Sutra Pancasila Buddhis, dan berdana paramita untuk mendiang.',
      'Peringatan 40 Hari, Meditasi Ketenangan Batin (Samatha Bhavana), doa semoga mendiang terlahir di alam bahagia (Sugati).',
      'Pattidana 100 Hari, pembacaan Tirakuddha Sutta, pelimpahan kebajikan keluarga bagi ketenteraman arwah.',
      'Peringatan 1 Tahun (Pendak Pisan), dana makan untuk Sangha / sesama, doa keselamatan batin, dan ziarah kebajikan.',
      'Peringatan 2 Tahun (Pendak Pindho), meditasi cinta kasih (Metta Bhavana) dan pelimpahan jasa berkelanjutan.',
      'Pattidana Agung 1000 Hari (Nyewu), pelimpahan kebajikan paripurna, semoga arwah mencapai kedamaian sejati (Nibbana).'
    ]
  },
  konghucu: {
    id: 'konghucu',
    nama: 'Konghucu',
    deskripsi: 'Sembahyang arwah, pelafalan Kitab Suci, penghormatan bakti leluhur (Xiao Dao).',
    dongaPerTahap: [
      'Sembahyang Arwah Hari ke-3, doa penyerahan arwah kepada Huang Tian (Tuhan YME) dan penghormatan bakti keluarga.',
      'Sembahyang Bakti 7 Hari, pembacaan ayat suci Kitab Bakti (Xiao Jing), memohon ketenangan jiwa mendiang.',
      'Sembahyang 40 Hari, doa permohonan bimbingan kebajikan dan pelestarian budi pekerti luhur almarhum.',
      'Sembahyang Peringatan 100 Hari, ungkapan terima kasih atas warisan keteladanan budi luhur kepada keluarga.',
      'Sembahyang 1 Tahun (Pendak Pisan), ziarah makam, sembahyang di altar leluhur dengan dupa wangi dan persembahan tulus.',
      'Sembahyang 2 Tahun (Pendak Pindho), doa kesinambungan berkah leluhur bagi generasi penerus yang berbakti.',
      'Sembahyang Akbar 1000 Hari (Nyewu), penyempurnaan masa bakti berkabung, memohon arwah tenteram di haribaan Tian.'
    ]
  }
};

export const SELAMETAN_KULTURAL_DATA = [
  {
    idx: 0,
    nama: '3 Harian (Nelung Dina)',
    maknaKultural: 'Peringatan hari ke-3 untuk mengikhlaskan kepergian arwah dan mendoakan kelapangan di alam kelanggengan saat jasad mulai menyatu kembali dengan unsur bumi.',
    ubarampe: 'Sega gurih (uduk), ingkung ayam kampung, kedelai hitam, rempah sursur, dan jenang abang putih.',
    donga: 'Donga Kasampurnan Arwah, Puji Rahayu marang Gusti Kang Murbeng Dumadi, sarta rukun sedekah rasa ikhlas kulawarga.'
  },
  {
    idx: 1,
    nama: '7 Harian (Mitung Dina)',
    maknaKultural: 'Peringatan hari ke-7 saat proses pelepasan unsur jasmani dan arwah memohon pepadhang, ketenangan, serta ampunan dosa lahir batin.',
    ubarampe: 'Sega asahan, sayur lodeh kluwih (supaya luwih berkah), tempe bacem, apem kinca, dan pasung.',
    donga: 'Donga Pangruwatan Sukma, Puji Pangayoman Hyang Suksma Kawekas, sarta sedekah pitu tulung pepadhang alam kalanggengan.'
  },
  {
    idx: 2,
    nama: '40 Harian (Matangpuluh Dina)',
    maknaKultural: 'Peringatan hari ke-40 ketika unsur tanah, air, angin, dan api raga telah luluh sempurna; memantapkan doa ketetapan iman dan keselamatan jiwa di alam kelanggengan.',
    ubarampe: 'Sega golong (lambang tekad bulat), jajan pasar 7 macam, kolak pisang kepok, apem panggang, dan ketan kolak.',
    donga: 'Donga Pangleburan Dosa Salira, Niyat Suci Pasrah Total marang Hyang Widhi, sarta sedekah tulodho kabecikan almarhum.'
  },
  {
    idx: 3,
    nama: '100 Harian (Nyatus Dina)',
    maknaKultural: 'Peringatan hari ke-100 saat raga telah pupus tak berbekas; penyucian sukma dan pemulihan ketenteraman batin keluarga yang ditinggalkan.',
    ubarampe: 'Tumpeng megono, urap-urapan janganan klopo, iwak lele/kutuk panggang, peyek kacang, dan jenang panca warna.',
    donga: 'Donga Kasucian Jiwa, Panyenyuwun Langgeng Mulyo ing Ngayunaning Pangeran, sarta sedekah beras sekul tulus manah.'
  },
  {
    idx: 4,
    nama: 'Pendak Pisan (1 Tahun Jawa)',
    maknaKultural: 'Peringatan genap satu tahun Jawa wafatnya almarhum; ungkapan bakti luhur keluarga, ziarah membersihkan pasarean, dan mempererat tali silaturahmi trah.',
    ubarampe: 'Sega liwet komplet, opor ayam kampung, sambel goreng ati, kupat lepet, dan kembang boreh telon.',
    donga: 'Donga Ruwah Setaun, Bakti Luhur Eling Asaling Dumadi, sarta ziarah pasarean nglestarekake sambung raket trah kulawarga.'
  },
  {
    idx: 5,
    nama: 'Pendak Pindho (2 Tahun Jawa)',
    maknaKultural: 'Peringatan genap dua tahun Jawa; pelepasan keterikatan duniawi dan pemantapan doa keselamatan abadi bagi arwah di alam langgeng.',
    ubarampe: 'Sega tumpeng pungkur, ayam bakar utuh, entho-entho, jadah ketan bakar, dan wedang serbat jahe.',
    donga: 'Donga Rahayu Kasampurnan, Pangruwating Panandhang Dunya, sarta panyuwunan tentrem rahayu arwah ing alam langgeng.'
  },
  {
    idx: 6,
    nama: 'Nyewu (1000 Hari / Slametan Pungkasan)',
    maknaKultural: 'Puncak peringatan 1000 hari (slametan pungkasan); arwah diyakini telah sempurna di alam kelanggengan. Dilakukan penyempurnaan nisan/kijing dan sedekah ageng.',
    ubarampe: 'Tumpeng sewu / tumpeng robyong komplet, ingkung ayam cemani/kampung jantan, jajan pasar komplit, kembang mawar melati kenanga telon, dan bubur cawuk.',
    donga: 'Donga Agung Kasampurnan Linuwih, Panutup Silsilah Bakti Sewu Dina, sarta sedekah ageng nyampurnakake katentreman sejati.'
  }
];

/**
 * Menghitung seluruh jadwal peringatan selametan tilar donyo.
 * Mendukung opsi pergantian hari Jawa saat terbenam matahari (bakda Maghrib)
 * dan pilihan templat doa/refleksi inklusif 6 agama resmi & tradisi Jawa.
 * 
 * @param {number} yy Tahun wafat Masehi
 * @param {number} mm Bulan wafat Masehi (1 - 12)
 * @param {number} dd Tanggal wafat Masehi (1 - 31)
 * @param {'siang' | 'malam_maghrib'} [waktuWafat='siang'] Waktu berpulang
 * @param {string} [namaAlmarhum=''] Nama almarhum / almarhumah
 * @param {string} [keyakinan='universal'] Pilihan tradisi/keyakinan
 * @returns {Object} Data geblak, daftar jadwal peringatan, dan metadata kultural
 */
export function hitungSelametanDates(yy, mm, dd, waktuWafat = 'siang', namaAlmarhum = '', keyakinan = 'universal') {
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
    tanggalMasehiAsli: tglAsliStr,
    keyakinan: keyakinan || 'universal'
  };

  const activeKeyakinan = TEMPLAT_DONGA_KEYAKINAN[keyakinan] ? keyakinan : 'universal';
  const items = [];

  JENIS_SELAMETAN.forEach(j => {
    const targetH = TARGET_HARI_SELAMETAN[hariIdx][j.idx];
    const targetP = TARGET_PASARAN_SELAMETAN[pasaranWafat][j.idx];
    const kultur = SELAMETAN_KULTURAL_DATA.find(k => k.idx === j.idx) || {
      maknaKultural: '',
      ubarampe: '',
      donga: ''
    };

    // Bangun peta doa lintas keyakinan untuk milestone ini
    const dongaKeyakinanMap = {};
    Object.keys(TEMPLAT_DONGA_KEYAKINAN).forEach(kKey => {
      dongaKeyakinanMap[kKey] = TEMPLAT_DONGA_KEYAKINAN[kKey].dongaPerTahap[j.idx] || kultur.donga;
    });

    const activeDonga = dongaKeyakinanMap[activeKeyakinan] || kultur.donga;

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
        donga: activeDonga,
        dongaUniversal: dongaKeyakinanMap['universal'] || kultur.donga,
        dongaKeyakinanMap
      });
    }
  });

  return {
    geblak,
    items,
    waktuWafat,
    namaAlmarhum: geblak.namaAlmarhum,
    keyakinan: activeKeyakinan
  };
}

export {
  TARGET_HARI_SELAMETAN,
  TARGET_PASARAN_SELAMETAN,
  JENIS_SELAMETAN
};
