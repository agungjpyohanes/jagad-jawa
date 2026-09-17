// ==========================================
// MASTER DATA SASI JAWA & WATAK KELAHIRAN
// ==========================================

const MASTER_SASI_JAWA = {
  "sura": {
    sasi: "Sura", padanan: "Muharram",
    watak: "Memiliki kepribadian yang tenang, pendiam, dan tabiat yang unik (jika cerdas akan sangat menonjol kecerdasannya). Kuat dalam laku batin dan tahan uji, tetapi cenderung memendam perasaan."
  },
  "sapar": {
    sasi: "Sapar", padanan: "Safar",
    watak: "Cenderung mudah tersinggung (gampang serik) dan tergesa-gesa saat bertindak, namun mampu bersikap sangat tenang dan taktis dalam situasi tertentu."
  },
  "mulud": {
    sasi: "Mulud", padanan: "Rabi'ul-Awwal",
    watak: "Berwatak bijaksana, tekun, dan pekerja keras. Memiliki rasa hormat tinggi terhadap orang tua/leluhur serta disenangi banyak orang karena budi pekertinya."
  },
  "bakdamulud": {
    sasi: "Bakda Mulud", padanan: "Rabi'ul-Akhir",
    watak: "Berpembawaan tegas, cekatan, dan berani mengambil inisiatif. Pemikirannya terkadang sulit ditebak sehingga sempat membingungkan orang di sekitarnya."
  },
  "jumadilawal": {
    sasi: "Jumadilawal", padanan: "Jumadil-Awwal",
    watak: "Penuh percaya diri, telaten, dan sabar dalam merintis pekerjaan. Namun terkadang terlalu polos (lugu) sehingga mudah dimanfaatkan atau dianggap kurang tanggap oleh orang lain."
  },
  "jumadilakir": {
    sasi: "Jumadilakir", padanan: "Jumadil-Akhir",
    watak: "Cerdas, berani (kendel), dan tutur kata serta tata kramanya halus. Memiliki daya tarik wibawa alami dan luwes dalam pergaulan."
  },
  "rejeb": {
    sasi: "Rejeb", padanan: "Rajab",
    watak: "Rendah hati, tidak suka menyombongkan kelebihan, serta berbakat memiliki wawasan atau ilmu pengetahuan yang mendalam. Suka belajar dan hidup bersahaja."
  },
  "ruwah": {
    sasi: "Ruwah", padanan: "Sya'ban",
    watak: "Berwatak bijaksana, pandai memegang janji (tepat janji), dan pendiam. Suka menolong orang lain tanpa pamrih dan menjaga kehormatan keluarga."
  },
  "pasa": {
    sasi: "Pasa (Siyam)", padanan: "Ramadan",
    watak: "Berhati lembut, dermawan, tenang, serta taat beribadah. Cenderung tidak suka mencampuri urusan orang lain dan menyukai kedamaian batin."
  },
  "sawal": {
    sasi: "Sawal", padanan: "Syawwal",
    watak: "Teguh pada pendirian (ora gampang goyah), berani mengutarakan pendapat, dan memiliki kemauan yang keras untuk mencapai cita-citanya."
  },
  "sela": {
    sasi: "Sela (Dulkangidah)", padanan: "Dzulqa'dah",
    watak: "Memiliki tata krama yang sangat baik, santun tutur katanya, dan perilakunya terpuji. Pandai menempatkan diri serta disegani di lingkungannya."
  },
  "besar": {
    sasi: "Besar", padanan: "Dzulhijjah",
    watak: "Memiliki dinamika sifat yang fluktuatif (kadang sangat dermawan dan penyabar, namun bisa berubah tegas/keras saat terusik). Pikirannya luas dan berjiwa kepemimpinan kuat."
  }
};

const getWatakSasiJawa = function (sasiName) {
  if (!sasiName) return { sasi: "-", padanan: "-", watak: "-" };
  let clean = sasiName.toLowerCase().replace(/[^a-z]/g, '');
  for (let key in MASTER_SASI_JAWA) {
    if (clean.includes(key) || key.includes(clean)) {
      return MASTER_SASI_JAWA[key];
    }
  }
  return { sasi: sasiName, padanan: "-", watak: "-" };
};

if (typeof window !== 'undefined') {
  window.MASTER_SASI_JAWA = MASTER_SASI_JAWA;
  window.getWatakSasiJawa = getWatakSasiJawa;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MASTER_SASI_JAWA, getWatakSasiJawa };
}
