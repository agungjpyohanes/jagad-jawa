// =========================================================================
// MASTER DATA SHIO TAHUN KELAHIRAN & TEORI 5 ELEMEN (WU XING)
// Repositori: jagad-jawa
// Kamus data 12 Shio, Elemen Tetap, Karakteristik, Karir, Jodoh, Pantangan,
// serta Teori 5 Elemen (Wu Xing) berdasarkan digit tahun Masehi.
// =========================================================================

(function (root) {
  const MASTER_SHIO_DETAIL = {
    "Tikus": {
      elemenTetap: "Air",
      sifatDasar: "Cerdas, cerdik, adaptif, ambisius",
      positif: "Cepat tanggap, cermat mengelola keuangan, dan berkawan luas.",
      negatif: "Cenderung oportunis dan terkadang terlalu perhitungan.",
      karir: "Pengusaha, akuntan, kritikus, atau peneliti. Keuangan cenderung stabil.",
      jodoh: "Kerbau, Naga, Monyet",
      pantangan: "Angka sial (5, 9), arah utara, dan tahun Kuda."
    },
    "Kerbau": {
      elemenTetap: "Tanah",
      sifatDasar: "Jujur, sabar, pekerja keras, teguh",
      positif: "Sabar, dapat dipercaya, tekun, dan memiliki fisik serta mental yang kuat.",
      negatif: "Keras kepala, kolot, dan sulit menerima perubahan.",
      karir: "Pertanian, manufaktur, hukum, manajemen, dan teknik.",
      jodoh: "Tikus, Ular, Ayam",
      pantangan: "Warna merah terang, angka sial (3, 4), dan tahun Kambing."
    },
    "Macan": {
      elemenTetap: "Kayu",
      sifatDasar: "Berani, kompetitif, percaya diri, dinamis",
      positif: "Berani mengambil risiko, berjiwa pemimpin, murah hati, dan pelindung yang baik.",
      negatif: "Agresif, emosional, dan kurang sabar.",
      karir: "Militer, politik, CEO, atlet, atau entrepreneur.",
      jodoh: "Kuda, Anjing, Babi",
      pantangan: "Angka sial (6, 7, 8), arah barat daya, dan tahun Monyet."
    },
    "Kelinci": {
      elemenTetap: "Kayu",
      sifatDasar: "Lembut, elegan, penuh perhatian, diplomatis",
      positif: "Tenang, cinta damai, sopan, dan memiliki estetika tinggi.",
      negatif: "Penakut, mudah menyerah, dan tertutup (menyimpan masalah sendiri).",
      karir: "Seni, diplomat, desainer, sastra, dan perhotelan.",
      jodoh: "Kambing, Babi, Anjing",
      pantangan: "Angka sial (1, 7, 8), arah utara, dan tahun Ayam."
    },
    "Naga": {
      elemenTetap: "Tanah",
      sifatDasar: "Karismatik, bersemangat, visioner, kuat",
      positif: "Penuh energi, berwibawa, beruntung secara alami, dan visioner.",
      negatif: "Arogan, mudah mendikte orang lain, dan tidak sabaran.",
      karir: "Pemimpin perusahaan, inovator, arsitek, atau selebritas.",
      jodoh: "Tikus, Monyet, Ayam",
      pantangan: "Angka sial (3, 8), arah barat laut, dan tahun Anjing."
    },
    "Ular": {
      elemenTetap: "Api",
      sifatDasar: "Bijaksana, intuitif, analitis, misterius",
      positif: "Pemikir dalam, filosofis, misterius, dan sangat intuitif.",
      negatif: "Pencemburu, posesif, dan penuh curiga.",
      karir: "Psikolog, peneliti, filsuf, astrolog, atau diplomat.",
      jodoh: "Kerbau, Ayam",
      pantangan: "Angka sial (1, 6, 7), arah barat daya, dan tahun Babi."
    },
    "Kuda": {
      elemenTetap: "Api",
      sifatDasar: "Enerjik, mandiri, suka kebebasan, sosial",
      positif: "Energik, berjiwa bebas, antusias, dan ramah.",
      negatif: "Boros, kurang konsisten, dan mudah bosan.",
      karir: "Pariwisata, jurnalisme, pemasaran, atau dunia hiburan.",
      jodoh: "Macan, Kambing, Anjing",
      pantangan: "Angka sial (1, 5, 6), arah utara, dan tahun Tikus."
    },
    "Kambing": {
      elemenTetap: "Tanah",
      sifatDasar: "Kreatif, simpatik, tenang, artistik",
      positif: "Lembut hati, pemaaf, sangat kreatif, dan berempati tinggi.",
      negatif: "Pesimis, pencemas, dan sering ragu-ragu.",
      karir: "Seniman, musisi, desainer interior, atau pekerja sosial.",
      jodoh: "Kelinci, Kuda, Babi",
      pantangan: "Angka sial (4, 9), arah barat, dan tahun Kerbau."
    },
    "Monyet": {
      elemenTetap: "Logam",
      sifatDasar: "Jenaka, inovatif, lincah, problem solver",
      positif: "Cerdas, humoris, serba bisa, dan cepat beradaptasi.",
      negatif: "Licik, usil, dan tidak konsisten.",
      karir: "Ilmuwan, programmer, analis keuangan, atau entertainer.",
      jodoh: "Tikus, Naga",
      pantangan: "Angka sial (2, 7, 9), arah selatan, dan tahun Macan."
    },
    "Ayam": {
      elemenTetap: "Logam",
      sifatDasar: "Rapi, teliti, pekerja keras, perfeksionis",
      positif: "Rapi, terorganisir, tepat waktu, dan sangat mandiri.",
      negatif: "Terlalu blak-blakan, kritis, dan egois.",
      karir: "Keuangan, administrasi publik, kedokteran, atau koki.",
      jodoh: "Kerbau, Naga, Ular",
      pantangan: "Angka sial (1, 3, 9), arah timur, dan tahun Kelinci."
    },
    "Anjing": {
      elemenTetap: "Tanah",
      sifatDasar: "Setia, jujur, dapat diandalkan, adil",
      positif: "Sangat setia, jujur, pelindung yang adil, dan berintegritas.",
      negatif: "Pesimis, mudah cemas, dan keras kepala.",
      karir: "Penegak hukum, guru, konsultan, atau pekerja kemanusiaan.",
      jodoh: "Kelinci, Macan, Kuda",
      pantangan: "Angka sial (1, 6, 7), arah tenggara, dan tahun Naga."
    },
    "Babi": {
      elemenTetap: "Air",
      sifatDasar: "Dermawan, rajin, optimis, jujur",
      positif: "Jujur, toleran, berhati tulus, dan menikmati hidup.",
      negatif: "Naif, mudah ditipu, dan kurang kontrol diri.",
      karir: "Perhotelan, kuliner, seni, atau filantropi.",
      jodoh: "Kelinci, Kambing, Macan",
      pantangan: "Angka sial (3, 9), arah timur laut, dan tahun Ular."
    }
  };

  const MASTER_WU_XING_TAHUN = function(year) {
    let lastDigit = Math.abs(parseInt(year, 10)) % 10;
    if (lastDigit === 0 || lastDigit === 1) return { elemen: "Logam (Metal)", sifat: "Tegas, mandiri, memiliki tekad kuat, dan disiplin tinggi." };
    if (lastDigit === 2 || lastDigit === 3) return { elemen: "Air (Water)", sifat: "Pandai berkomunikasi, fleksibel, intuitif, serta mudah beradaptasi." };
    if (lastDigit === 4 || lastDigit === 5) return { elemen: "Kayu (Wood)", sifat: "Idealis, kolaboratif, memiliki moril tinggi, dan berkembang pesat." };
    if (lastDigit === 6 || lastDigit === 7) return { elemen: "Api (Fire)", sifat: "Karismatik, penuh semangat, pemimpin alami, namun terkadang impulsif." };
    return { elemen: "Tanah (Earth)", sifat: "Stabil, dapat diandalkan, praktis, dan sangat berorientasi pada keamanan." };
  };

  // Fungsi penentu Shio berdasarkan tahun lahir (siklus 12 hewan dari tahun acuan 1924 / Tahun Tikus Kayu)
  const getShioByYear = function(year) {
    const yNum = parseInt(year, 10);
    if (isNaN(yNum)) return null;

    const shioList = ["Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular", "Kuda", "Kambing", "Monyet", "Ayam", "Anjing", "Babi"];
    // 1924 adalah tahun Tikus
    let diff = (yNum - 1924) % 12;
    if (diff < 0) diff += 12;
    let namaShio = shioList[diff];
    let wuXing = (typeof MASTER_WU_XING_TAHUN === 'function') ? MASTER_WU_XING_TAHUN(yNum) : { elemen: "-", sifat: "-" };
    let detail = MASTER_SHIO_DETAIL[namaShio] || {};
    return {
      tahun: yNum,
      shio: namaShio,
      elemenTetap: detail.elemenTetap || "-",
      elemenTahun: wuXing.elemen,
      sifatElemen: wuXing.sifat,
      detail: detail
    };
  };

  // Bind ke global root & window
  root.MASTER_SHIO_DETAIL = MASTER_SHIO_DETAIL;
  root.MASTER_WU_XING_TAHUN = MASTER_WU_XING_TAHUN;
  root.getShioByYear = getShioByYear;

  if (typeof window !== 'undefined') {
    window.MASTER_SHIO_DETAIL = MASTER_SHIO_DETAIL;
    window.MASTER_WU_XING_TAHUN = MASTER_WU_XING_TAHUN;
    window.getShioByYear = getShioByYear;
  }

  // Node.js CommonJS export support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      MASTER_SHIO_DETAIL,
      MASTER_WU_XING_TAHUN,
      getShioByYear
    };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
