// ==========================================
// MASTER DATA ZODIAK & PRANATA MANGSA
// ==========================================

(function (root) {
  const MASTER_ZODIAK = [
    {
      id: 1,
      nama: "Aries",
      rentang: "21 Maret – 19 April",
      elemen: "Api (Ram / Domba)",
      watak: "Berani, kompetitif, penuh energi, egois, tidak sabaran.",
      peruntungan: "Keberuntungan datang saat berani mengambil inisiatif dan memimpin.",
      resiko: "Rentan celaka kecil akibat ceroboh atau terburu-buru.",
      jodoh: "Leo, Sagitarius, Gemini",
      karir: "Pengusaha, atlet, militer, pemimpin proyek."
    },
    {
      id: 2,
      nama: "Taurus",
      rentang: "20 April – 20 Mei",
      elemen: "Tanah (Bull / Banteng)",
      watak: "Stabil, sabar, pekerja keras, keras kepala, materialistis.",
      peruntungan: "Keuangan dan investasi jangka panjang membuahkan hasil manis.",
      resiko: "Terjebak di zona nyaman terlalu lama atau rugi investasi kaku.",
      jodoh: "Virgo, Capricorn, Cancer",
      karir: "Perbankan, keuangan, seni/kuliner, properti."
    },
    {
      id: 3,
      nama: "Gemini",
      rentang: "21 Mei – 20 Juni",
      elemen: "Angin (Twins / Kembar)",
      watak: "Cerdas, komunikatif, mudah adaptasi, inkonsisten, mudah bosan.",
      peruntungan: "Beruntung dalam relasi, jaringan pertemanan, dan peluang dinamis.",
      resiko: "Salah komunikasi (misunderstanding) atau kehilangan fokus (multitasking).",
      jodoh: "Libra, Aquarius, Aries",
      karir: "Jurnalis, PR, marketing, penulis."
    },
    {
      id: 4,
      nama: "Cancer",
      rentang: "21 Juni – 22 Juli",
      elemen: "Air (Crab / Kepiting)",
      watak: "Intuitif, penuh empati, protektif, moody, pendendam.",
      peruntungan: "Berkah besar dari usaha keluarga atau bisnis berbasis hunian/kenyamanan.",
      resiko: "Kecemasan berlebih dan mudah diperdaya rasa iba.",
      jodoh: "Scorpio, Pisces, Taurus",
      karir: "Psikolog, hospitality/kuliner, pendidikan, perawat."
    },
    {
      id: 5,
      nama: "Leo",
      rentang: "23 Juli – 22 Agustus",
      elemen: "Api (Lion / Singa)",
      watak: "Kharismatik, percaya diri, dermawan, haus perhatian, angkuh.",
      peruntungan: "Mudah meraih posisi puncak, kehormatan, dan pengakuan publik.",
      resiko: "Jatuh karena gengsi, gaya hidup boros, atau intrik bawahan.",
      jodoh: "Aries, Sagitarius, Libra",
      karir: "Direktur/CEO, entertainer, politisi, manajer seni."
    },
    {
      id: 6,
      nama: "Virgo",
      rentang: "23 Agustus – 22 September",
      elemen: "Tanah (Virgin / Gadis)",
      watak: "Analitis, perfeksionis, teliti, kritis berlebihan, mudah cemas.",
      peruntungan: "Kemampuan memecahkan masalah rumit mendatangkan rezeki stabil.",
      resiko: "Kelelahan mental (burnout) akibat memikirkan detail kecil.",
      jodoh: "Taurus, Capricorn, Scorpio",
      karir: "Peneliti, analis data, dokter/apoteker, akuntan."
    },
    {
      id: 7,
      nama: "Libra",
      rentang: "23 September – 22 Oktober",
      elemen: "Angin (Scales / Timbangan)",
      watak: "Diplomatis, adil, estetis, ragu-ragu, takut konflik.",
      peruntungan: "Sukses besar melalui kemitraan bisnis dan diplomasi sosial.",
      resiko: "Mengalami kerugian karena kesulitan berkata 'tidak' kepada orang lain.",
      jodoh: "Gemini, Aquarius, Leo",
      karir: "Pengacara/hakim, diplomat, desainer, konsultan."
    },
    {
      id: 8,
      nama: "Scorpio",
      rentang: "23 Oktober – 21 November",
      elemen: "Air (Scorpion / Kalajengking)",
      watak: "Fokus, misterius, berdaya juang tinggi, cemburu ekstrem, obsesif.",
      peruntungan: "Piawai mengelola sumber daya krisis dan membongkar peluang rahasia.",
      resiko: "Konflik sengit akibat dendam atau rahasia masa lalu terbongkar.",
      jodoh: "Cancer, Pisces, Virgo",
      karir: "Detektif/investigator, bedah/kedokteran, investor."
    },
    {
      id: 9,
      nama: "Sagitarius",
      rentang: "22 November – 21 Desember",
      elemen: "Api (Archer / Pemanah)",
      watak: "Optimis, petualang, berwawasan luas, ceroboh, ceplas-ceplos.",
      peruntungan: "Keberuntungan luar biasa dalam ekspansi global, ekspor, atau pendidikan.",
      resiko: "Kerugian akibat spekulasi tanpa perhitungan matang.",
      jodoh: "Aries, Leo, Aquarius",
      karir: "Akademisi, travel/ekspedisi, penerbitan, ekspor-impor."
    },
    {
      id: 10,
      nama: "Capricorn",
      rentang: "22 Desember – 19 Januari",
      elemen: "Tanah (Sea-Goat / Kambing Laut)",
      watak: "Disiplin tinggi, ambisius, realistis, kaku, dingin.",
      peruntungan: "Meraih puncak karir dan kepemilikan aset tangguh di usia matang.",
      resiko: "Krisis relasi keluarga akibat mengabaikan kehidupan personal demi kerja.",
      jodoh: "Taurus, Virgo, Pisces",
      karir: "Birokrat, arsitek, eksekutif korporasi, pengembang."
    },
    {
      id: 11,
      nama: "Aquarius",
      rentang: "20 Januari – 18 Februari",
      elemen: "Angin (Water-Bearer / Pembawa Air)",
      watak: "Visioner, inovatif, independen, pemberontak, sulit ditebak.",
      peruntungan: "Mendapat berkah besar dari temuan inovatif, teknologi, atau komunitas sosial.",
      resiko: "Diasingkan dari kelompok karena ide terlalu radikal atau sikap dingin.",
      jodoh: "Gemini, Libra, Sagitarius",
      karir: "Programmer/IT, ilmuwan, penemu, aktivis kemanusiaan."
    },
    {
      id: 12,
      nama: "Pisces",
      rentang: "19 Februari – 20 Maret",
      elemen: "Air (Fish / Ikan)",
      watak: "Empatis, artistik, spiritual, mudah terbawa perasaan, lari dari realitas.",
      peruntungan: "Karya seni, daya cipta imajinatif, dan ketajaman intuisi mendatangkan rezeki.",
      resiko: "Sering dimanfaatkan secara finansial oleh orang yang manipulatif.",
      jodoh: "Cancer, Scorpio, Capricorn",
      karir: "Musisi/seniman, spiritualis, psikoterapis, relawan."
    }
  ];

  const MASTER_PRANATA_MANGSA = [
    {
      nama: "Kasa (Kartika)",
      candrasangkala: "Sesotya murca ing embanan (Mutiara lepas dari ikatannya)",
      rentang: "22 Juni – 1 Agustus",
      watak: "Berjiwa mandiri, teguh pendirian, dan memiliki harga diri tinggi. Senang kerapian dan keteraturan, namun cenderung pendiam serta agak keras kepala jika keyakinannya diusik."
    },
    {
      nama: "Karo (Puspita)",
      candrasangkala: "Bantala rengka (Bumi merekah)",
      rentang: "2 Agustus – 24 Agustus",
      watak: "Terbuka, jujur, dan berani bicara apa adanya. Penuh semangat dan pantang menyerah, tetapi terkadang mudah tersulut emosi jika melihat ketidakadilan atau merasa dibatasi."
    },
    {
      nama: "Katelu (Manggasri)",
      candrasangkala: "Suta manut ing bapa (Anak patuh pada sang ayah)",
      rentang: "25 Agustus – 17 September",
      watak: "Berbakti, penuh rasa tanggung jawab, dan teliti dalam bekerja. Pribadinya tenang, disiplin, dan setia, meski terkadang agak kaku atau ragu mengambil risiko baru di luar kebiasaan."
    },
    {
      nama: "Kapat (Sitra)",
      candrasangkala: "Waspa kumembeng jroning kalbu (Air mata menggenang di dalam kalbu)",
      rentang: "18 September – 12 Oktober",
      watak: "Halus perasaannya, mudah berempati, dan memiliki intuisi tajam. Sangat menjaga perasaan orang lain, namun rentan terbebani kesedihan batin atau memendam kecewa sendiri."
    },
    {
      nama: "Kalima (Manggala)",
      candrasangkala: "Pancuran mas sumawur ing jagad (Pancuran emas bertabur di dunia)",
      rentang: "13 Oktober – 8 November",
      watak: "Dermawan, suka menolong sesama, dan berpikiran luas. Senang berbagi ilmu atau rezeki, berkharisma, tetapi terkadang kurang berhati-hati dalam menjaga rahasia diri."
    },
    {
      nama: "Kanem (Naya)",
      candrasangkala: "Rasa mulya kasuciyan (Rasa mulia kesucian)",
      rentang: "9 November – 21 Desember",
      watak: "Bercita-cita luhur, berwibawa, dan senang mencari kebenaran hakiki. Memiliki kepemimpinan alami dan adil, meski terkadang tampak menyendiri atau sulit didekati orang biasa."
    },
    {
      nama: "Kapitu (Palguna)",
      candrasangkala: "Wisa kentas ing maruta (Racun hanyut oleh angin)",
      rentang: "22 Desember – 2 Februari",
      watak: "Tangguh menghadapi cobaan hidup, berhati bersih, dan cepat memaafkan. Mampu meredakan perselisihan, pantang putus asa, namun adakalanya terlalu memaksakan ketahanan fisik."
    },
    {
      nama: "Kawolu (Wisaka)",
      candrasangkala: "Anjrah jroning kayun (Menyebar di dalam kehendak)",
      rentang: "3 Februari – 28/29 Februari",
      watak: "Kreatif, banyak gagasan cemerlang, dan luwes bergaul. Cepat menangkap peluang baru dan pandai meyakinkan sesama, namun mudah bosan jika rutinitas berlangsung monoton."
    },
    {
      nama: "Kasanga (Jita)",
      candrasangkala: "Wedaring wacana mulya (Terucapnya perkataan mulia)",
      rentang: "1 Maret – 25 Maret",
      watak: "Pandai bertutur kata, bijaksana, dan santun perilakunya. Nasihatnya sering dicari orang, senang mendamaikan suasana, tetapi perlu waspada agar tidak terseret perdebatan sia-sia."
    },
    {
      nama: "Kasapuluh (Srawana)",
      candrasangkala: "Gedhong mineb jroning kalbu (Gedung terkunci di dalam batin)",
      rentang: "26 Maret – 18 April",
      watak: "Penyimpan rahasia yang ulung, cermat berhitung, dan tidak tergesa-gesa. Berpendirian kukuh dan tenang di luar, namun sering kali memendam beban pikiran sendiri tanpa bercerita."
    },
    {
      nama: "Desta (Padrawana)",
      candrasangkala: "Sotya sinarawedi (Intan permata bersinar mulia)",
      rentang: "19 April – 11 Mei",
      watak: "Menawan, cerdas, berdaya pikat tinggi, dan disukai banyak kalangan. Pandai menempatkan diri dalam pergaulan terhormat, namun terkadang sedikit manja atau enggan bersusah payah."
    },
    {
      nama: "Sadha (Asuji)",
      candrasangkala: "Tirta sah saking sasana (Air pergi dari tempatnya)",
      rentang: "12 Mei – 21 Juni",
      watak: "Dinamis, suka merantau atau bepergian, berani mengambil jalan hidup mandiri. Cepat beradaptasi di lingkungan asing, teguh cita-citanya, meski sesekali merasa terasing atau kesepian."
    }
  ];

  // Helper penentu Zodiak dari tanggal & bulan lahir
  const getZodiakByDate = function (day, month) {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return MASTER_ZODIAK[0]; // Aries
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return MASTER_ZODIAK[1]; // Taurus
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return MASTER_ZODIAK[2]; // Gemini
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return MASTER_ZODIAK[3]; // Cancer
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return MASTER_ZODIAK[4]; // Leo
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return MASTER_ZODIAK[5]; // Virgo
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return MASTER_ZODIAK[6]; // Libra
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return MASTER_ZODIAK[7]; // Scorpio
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return MASTER_ZODIAK[8]; // Sagitarius
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return MASTER_ZODIAK[9]; // Capricorn
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return MASTER_ZODIAK[10]; // Aquarius
    return MASTER_ZODIAK[11]; // Pisces
  };

  // Helper penentu Pranata Mangsa dari tanggal & bulan lahir
  const getPranataMangsaByDate = function (day, month) {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    if ((m === 6 && d >= 22) || (m === 7) || (m === 8 && d <= 1)) return MASTER_PRANATA_MANGSA[0]; // Kasa
    if (m === 8 && d >= 2 && d <= 24) return MASTER_PRANATA_MANGSA[1]; // Karo
    if ((m === 8 && d >= 25) || (m === 9 && d <= 17)) return MASTER_PRANATA_MANGSA[2]; // Katelu
    if ((m === 9 && d >= 18) || (m === 10 && d <= 12)) return MASTER_PRANATA_MANGSA[3]; // Kapat
    if ((m === 10 && d >= 13) || (m === 11 && d <= 8)) return MASTER_PRANATA_MANGSA[4]; // Kalima
    if ((m === 11 && d >= 9) || (m === 12 && d <= 21)) return MASTER_PRANATA_MANGSA[5]; // Kanem
    if ((m === 12 && d >= 22) || (m === 1) || (m === 2 && d <= 2)) return MASTER_PRANATA_MANGSA[6]; // Kapitu
    if (m === 2 && d >= 3) return MASTER_PRANATA_MANGSA[7]; // Kawolu
    if (m === 3 && d >= 1 && d <= 25) return MASTER_PRANATA_MANGSA[8]; // Kasanga
    if ((m === 3 && d >= 26) || (m === 4 && d <= 18)) return MASTER_PRANATA_MANGSA[9]; // Kasapuluh
    if ((m === 4 && d >= 19) || (m === 5 && d <= 11)) return MASTER_PRANATA_MANGSA[10]; // Desta
    return MASTER_PRANATA_MANGSA[11]; // Sadha
  };

  // Global browser attachment
  root.MASTER_ZODIAK = MASTER_ZODIAK;
  root.MASTER_PRANATA_MANGSA = MASTER_PRANATA_MANGSA;
  root.getZodiakByDate = getZodiakByDate;
  root.getPranataMangsaByDate = getPranataMangsaByDate;

  // Node.js CommonJS export support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      MASTER_ZODIAK,
      MASTER_PRANATA_MANGSA,
      getZodiakByDate,
      getPranataMangsaByDate
    };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
