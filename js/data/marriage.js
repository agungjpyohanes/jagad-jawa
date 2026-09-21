// Data Nujum Perjodohan (Pitung Jawa 7 Metode)

const AKSARA_PERJODOHAN = [
  { kode: 'HA',  iv: 6, vvi: 5  }, { kode: 'NA',  iv: 3, vvi: 2  },
  { kode: 'CA',  iv: 3, vvi: 3  }, { kode: 'RA',  iv: 3, vvi: 4  },
  { kode: 'KA',  iv: 3, vvi: 5  }, { kode: 'DA',  iv: 5, vvi: 6  },
  { kode: 'TA',  iv: 3, vvi: 7  }, { kode: 'SA',  iv: 3, vvi: 8  },
  { kode: 'WA',  iv: 6, vvi: 9  }, { kode: 'LA',  iv: 5, vvi: 10 },
  { kode: 'PA',  iv: 1, vvi: 11 }, { kode: 'DHA', iv: 4, vvi: 12 },
  { kode: 'JA',  iv: 3, vvi: 13 }, { kode: 'YA',  iv: 8, vvi: 14 },
  { kode: 'NYA', iv: 3, vvi: 15 }, { kode: 'MA',  iv: 5, vvi: 16 },
  { kode: 'GA',  iv: 1, vvi: 17 }, { kode: 'BA',  iv: 2, vvi: 18 },
  { kode: 'THA', iv: 4, vvi: 19 }, { kode: 'NGA', iv: 2, vvi: 20 }
];

const HASIL_I_JODOH = {
  0: { nama: 'PUNGGEL', arti: 'Padudon, Pisah/Pegat', status: 'buruk' },
  1: { nama: 'GENTHA', arti: 'Larang Anak, gampang rejeki', status: 'campur' },
  2: { nama: 'GEMBILI', arti: 'Sugih Anak, rejeki pas-pasan', status: 'buruk' },
  3: { nama: 'SRI', arti: 'Sugih Rejeki, ayem tentrem', status: 'baik' }
};

const HASIL_II_JODOH = {
  0: { nama: 'PATI', arti: 'Melarat', status: 'buruk' },
  1: { nama: 'SRI', arti: 'Sandang Pangan', status: 'baik' },
  2: { nama: 'LUNGGUH', arti: 'Kajen Kelingan', status: 'baik' },
  3: { nama: 'GEDHONG', arti: 'Tentrem Ayem', status: 'baik' },
  4: { nama: 'LARA', arti: 'Rekasa', status: 'buruk' }
};

const HASIL_III_JODOH = {
  0: { nama: 'LEBU KETIYUP ANGIN', arti: 'Kurang Begjane sarta kerep Pindah Omah', status: 'buruk' },
  1: { nama: 'WASESA SEGARA', arti: 'Jembar Budine', status: 'baik' },
  2: { nama: 'TUNGGAK SEMI', arti: 'Sugih Anak sarta tansah Lara-Laranen', status: 'campur' },
  3: { nama: 'SATRIYA WIBAWA', arti: 'Gede Begjane lan Bisa Sugih', status: 'baik' },
  4: { nama: 'SUMUR SINABA', arti: 'Bisa Dadi Pengayoman Sanak Kadang', status: 'baik' },
  5: { nama: 'SATRIYA WIRANG', arti: 'Kerep Susah kang Andadekake Melarat', status: 'buruk' },
  6: { nama: 'BUMI KAPETAK', arti: 'Dikucilkan ing wong nanging bisa Simpen Banda Donyane', status: 'campur' }
};

const HASIL_IV_JODOH = {
  0: { nama: 'PANDHAWA', arti: 'Ayem Tentrem Saklawase', status: 'baik' },
  1: { nama: 'TUNGGAK TANPA SEMI', arti: 'Sengsara Saklawase', status: 'buruk' },
  2: { nama: 'PISANG PINUNGGEL', arti: 'Pedhot Salah Sawiji', status: 'buruk' },
  3: { nama: 'LUMBUNG GUMULING', arti: 'Tansah Boros Rejekine', status: 'buruk' },
  4: { nama: 'SANGGAR WARINGIN', arti: 'Pengayoman Sanak Kadang', status: 'baik' },
  5: { nama: 'PADARINGAN KEBAK', arti: 'Rejekine Mbludak lan Sugih', status: 'baik' },
  6: { nama: 'SATRIYA LELAKU', arti: 'Kudu Giat Among Dagang', status: 'baik' }
};

const HASIL_V_JODOH = {
  0: { nama: 'LINTANG PURNAMA', arti: 'Luwih becik bakal kasembadan', status: 'baik' },
  1: { nama: 'ASIH ALAKI', arti: 'Rukun wus tunggal karepe', status: 'baik' },
  2: { nama: 'KEMARON SIH', arti: 'Kerep padudon pikirane', status: 'buruk' },
  3: { nama: 'SUKARTA', arti: 'Pakewuh jejodohane', status: 'buruk' },
  4: { nama: 'KALATUKA', arti: 'Ora becik jejodohane', status: 'buruk' },
  5: { nama: 'MANTRI SUKA', arti: 'Becik bakal antuk drajat', status: 'baik' },
  6: { nama: 'SUKA SUGIH', arti: 'Becik bakal sugih donya', status: 'baik' }
};

const HASIL_VI_JODOH = {
  0: { nama: 'LATAR', arti: 'Tansah susah', status: 'buruk' },
  1: { nama: 'LARUNG', arti: 'Gelis teka lan lunga rejekine', status: 'buruk' },
  2: { nama: 'GONDANG', arti: 'Bisa nyimpen banda donya', status: 'baik' },
  3: { nama: 'OMAH', arti: 'Bisa simpen rejeki slamet', status: 'baik' },
  4: { nama: 'BALI', arti: 'Boros rejekine', status: 'buruk' },
  5: { nama: 'PAWON', arti: 'Ora tau kekurangan pangan', status: 'baik' }
};

if (typeof window !== 'undefined') {
  window.AKSARA_PERJODOHAN = AKSARA_PERJODOHAN;
  window.HASIL_I_JODOH = HASIL_I_JODOH;
  window.HASIL_II_JODOH = HASIL_II_JODOH;
  window.HASIL_III_JODOH = HASIL_III_JODOH;
  window.HASIL_IV_JODOH = HASIL_IV_JODOH;
  window.HASIL_V_JODOH = HASIL_V_JODOH;
  window.HASIL_VI_JODOH = HASIL_VI_JODOH;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AKSARA_PERJODOHAN, HASIL_I_JODOH, HASIL_II_JODOH, HASIL_III_JODOH,
    HASIL_IV_JODOH, HASIL_V_JODOH, HASIL_VI_JODOH
  };
}

export {
  AKSARA_PERJODOHAN,
  HASIL_I_JODOH,
  HASIL_II_JODOH,
  HASIL_III_JODOH,
  HASIL_IV_JODOH,
  HASIL_V_JODOH,
  HASIL_VI_JODOH
};

