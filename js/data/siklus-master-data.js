// ==========================================
// MASTER DATA SIKLUS TAHUNAN (SHIO & PADEWAN)
// Repositori: jagad-jawa
// Sumber: draft_database_nujum - siklus_shio.csv & siklus_padewan.csv
// Sistem: Perhitungan Berdasarkan Usia/Umur (umur % 12)
// ==========================================

(function (root) {
  const MASTER_SIKLUS_SHIO = {
    1: { shio: "Kelinci", tegese: "Wiraswasta jangan main spekulasi karena kurang gigih dalam berjuang / bersaing, manja dan ketergantungan" },
    2: { shio: "Harimau", tegese: "Banyak yang memperalat, waspada, keras dan angkuh" },
    3: { shio: "Kerbau", tegese: "Gampang bingung dan tidak dapat berkosentrasi" },
    4: { shio: "Tikus", tegese: "Waspada, hemat, Berhati - hati dan teliti dengan orang lain" },
    5: { shio: "Sapi", tegese: "Ramah, senang bergurau, serius dan percayadiri" },
    6: { shio: "Jago", tegese: "Senang mencampuri urusan orang lain dan sombong" },
    7: { shio: "Anjing", tegese: "Cemburu, ramah dan disukai banyak orang" },
    8: { shio: "Kera", tegese: "Kata - katanya sejuk didengar dan senang menyendiri" },
    9: { shio: "Kambing", tegese: "Ragu - ragu kalau terpaksa bisa nekat" },
    10: { shio: "Kuda", tegese: "Bijaksana, pandai dan baik hati" },
    11: { shio: "Ular", tegese: "Tenang, disiplin dan tahu kewajiban" },
    12: { shio: "Naga", tegese: "Cemburu, keras hati tetapi welas asih dan sosial" }
  };

  const MASTER_SIKLUS_PADEWAN = {
    1: {
      nama: "Batara Suryo", dewa: "Sang Hyang Surya / Batara Suryo",
      watak: "Manja, sangat bergantung pada orang lain, kadang berani nekat, firasatnya tajam dan terang hatinya (walaupun matanya belum melihat).",
      karier: "Disenangi oleh atasan jika beruntung. Bagi wiraswasta jangan berspekulasi dahulu karena kurang gigih dalam berjuang dan kurang berani bersaing; keberuntungan banyak bersumber dari kebaikan orang lain.",
      kelemahan: "Kurang mandiri, kurang gigih berjuang, kurang berani bersaing, sangat bergantung pada orang lain.",
      kesehatan: "Takut air, rentan sakit panas/demam.",
      keluarga: "Bila bertemu jodoh pada siklus usia ini akan banyak anak, kehidupan rumah tangga tentram dan lebih betah tinggal di rumah.",
      bahaya: "Rentan difitnah orang karena ada yang iri hati; hindari spekulasi usaha.",
      solusi: "Mengandalkan ketajaman firasat dan kejernihan hati; berhati-hati dalam pergaulan agar tidak memicu rasa iri dengki.",
      gambar: "assets/wayang/surakarta/batara_surya.png"
    },
    2: {
      nama: "Batara Bromo", dewa: "Sang Hyang Brahma / Batara Bromo",
      watak: "Ingin berkuasa, keras hati, angkuh, berani membuat terobosan gagasan pembaharuan.",
      karier: "Karier cepat menanjak, segala usaha mendapat dukungan pejabat tinggi karena gagasannya dinilai berani membawa pembaharuan. Namun rawan diperalat untuk kesuksesan pihak lain.",
      kelemahan: "Angkuh, terlalu mudah percaya kepada orang/pejabat yang bermaksud memanfaatkan kewibawaan dan gagasannya.",
      kesehatan: "Fisik kuat dan tidak mudah terserang penyakit.",
      keluarga: "Bila bertemu jodoh pada usia ini hidupnya rukun dan menjadi pasangan suami-istri (pasutri) teladan.",
      bahaya: "Mudah terkena senjata atau benda tajam (pisau, pedang, keris); rawan diperalat pejabat/atasan yang memiliki kepentingan terselubung.",
      solusi: "Harus waspada pada usia ini, jangan terlalu percaya kepada orang lain, cermati motif dukungan pihak atasan agar tidak menyesal di kemudian hari.",
      gambar: "assets/wayang/surakarta/gunungan.png"
    },
    3: {
      nama: "Batara Durga", dewa: "Batari Durga / Dewi Durga",
      watak: "Gampang bingung, sulit berkonsentrasi, seolah kehilangan gairah hidup, bangkit bila terdesak kebutuhan/keluarga, pekerja tak kenal lelah dan lupa waktu.",
      karier: "Karier terhambat/berhenti, karya tidak dihargai bahkan diakui sebagai gagasan atasan; berisiko mutasi atau dirumahkan. Dalam wiraswasta sering ribut dengan pelanggan nakal; hasil kerja sedikit dan sering hanya dijanjikan.",
      kelemahan: "Sering bingung, hilang fokus, mudah diperdaya/ditipu, hasil kerja keras sering diambil pihak lain.",
      kesehatan: "Rentan terkena batuk, sakit dada, kepala berat, dan sakit perut; peka terhadap udara malam dan air.",
      keluarga: "Jika bertemu jodoh pada usia ini harus sangat berhati-hati karena kehidupan rumah tangga rawan serba susah dan dipenuhi kebingungan.",
      bahaya: "Sering ditipu dan diperalat, risiko terjerat utang atau mengalami kecelakaan kerja/fisik, dianggap berbahaya oleh pimpinan.",
      solusi: "Mendekatkan diri dan pasrah kepada Allah SWT Yang Maha Tahu; jaga stamina dari angin malam dan hindari jeratan utang piutang.",
      gambar: "assets/wayang/surakarta/batari_durga.png"
    },
    4: {
      nama: "Batara Asmoro", dewa: "Sang Hyang Kamajaya / Batara Asmoro",
      watak: "Selalu waspada, hemat, gemar menabung, perasa (terbakar api asmara/cinta), berorientasi mengumpulkan uang demi masa depan.",
      karier: "Rezeki tetap mengalir lancar meski diganggu; berkeinginan cepat kaya akibat pengalaman masa lalu; gigih menabung untuk kemandirian finansial keluarga.",
      kelemahan: "Bisa terjebak kerakusan, watak tamak dan terlalu pelit; uang yang dipinjamkan ke orang lain tidak akan kembali.",
      kesehatan: "Gangguan sistem pencernaan dan panas dalam.",
      keluarga: "Bila bertemu jodoh pada usia ini akan dikaruniai banyak anak, kehidupan perkawinan rukun, tentram, dan berbahagia.",
      bahaya: "Sering difitnah, dirongrong, ditipu, dan dirampok; bahaya besar jika berseteru dengan pejabat tinggi (bisa menjadi buron).",
      solusi: "Jangan meminjamkan uang sembarangan; jangan menentang arus kekuasaan atau bermusuhan dengan orang berpangkat tinggi.",
      gambar: "assets/wayang/surakarta/batara_kamajaya.png"
    },
    5: {
      nama: "Batara Isworo", dewa: "Sang Hyang Iswara / Batara Guru (Siwa)",
      watak: "Ramah, senang bergurau, serius, percaya diri tinggi; namun rentan menjadi tamak karena segala keinginan selalu mendapat kemudahan.",
      karier: "Masa puncak kejayaan emas; rencana dan usaha berjalan mulus dan sukses; memperoleh kedudukan terhormat (berlambang Sapi Andini).",
      kelemahan: "Cenderung tamak dan berpotensi boros/menghamburkan harta kekayaan jika tidak mawas diri.",
      kesehatan: "Rentan tekanan darah tinggi (hipertensi) dan diabetes (kencing manis); dianjurkan rutin berolahraga.",
      keluarga: "Sangat tepat bertemu jodoh pada masa ini karena berada di puncak kejayaan hidup.",
      bahaya: "Godaan seks dan asmara terlarang saat perjalanan jauh; jebakan di depan jalan hidup; kehilangan kesempatan emas jika harta dihamburkan hingga jatuh merana.",
      solusi: "Jangan menghamburkan harta; tetap konsisten pada tujuan hidup dan jangan mudah berbelok arah; jaga kesehatan dengan olahraga; bila jatuh perlu sarana ruwatan.",
      gambar: "assets/wayang/surakarta/batara_guru.png"
    },
    6: {
      nama: "Batari Nogogini", dewa: "Batari Nagagini & Batara Antaboga",
      watak: "Suka mencampuri urusan orang lain, sombong (terbawa watak masa lalu), namun bertambah umur akan matang budi pekertinya, tegas, berwibawa, dan cepat tanggap akan kekeliruan.",
      karier: "Sering meninggalkan rumah karena tuntutan tugas dan pekerjaan dinas; rawan terseret masalah orang lain dalam perputaran keuangan.",
      kelemahan: "Suka menyombongkan diri, ikut campur masalah keuangan pihak lain sehingga ikut terseret kasus.",
      kesehatan: "Kelemahan pada area mata, pusing kepala, dan mudah masuk angin (karena sifat alam bawah tanah/kegelapan).",
      keluarga: "Dalam hubungan perkawinan dapat hidup rukun, meskipun sering diterpa gosip, fitnah, atau terpisah jarak dinas.",
      bahaya: "Gampang terkena godaan seks; adanya musuh tersembunyi, teror surat kaleng, dan fitnah rekan sekerja.",
      solusi: "Jangan ikut campur urusan finansial orang lain; jaga kesehatan mata dan istirahat cukup; bentengi diri dari godaan syahwat di luar rumah.",
      gambar: "assets/wayang/surakarta/gunungan.png"
    },
    7: {
      nama: "Batara Komojoyo", dewa: "Batara Kamajaya & Batari Ratih (Kamaratih)",
      watak: "Ramah, disenangi pergaulan, penuh kasih sayang dan kesetiaan, bertanggung jawab penuh menjaga amanah, memiliki sifat cemburu tinggi.",
      karier: "Karier menanjak mulus; disayangi pimpinan bila berstatus pegawai/abdi negara; jaringan relasi bisnis luas dan kuat bila berwiraswasta.",
      kelemahan: "Rasa cemburu yang berlebihan, sangat protektif terhadap apa yang menjadi tanggung jawabnya.",
      kesehatan: "Kondisi fisik prima dan bugar; hanya ada gangguan batuk ringan sesekali.",
      keluarga: "Sangat harmonis; perjumpaan dengan pria/wanita idaman akan cepat berlanjut ke jenjang pernikahan yang langgeng.",
      bahaya: "Bahaya kecelakaan fisik terjatuh dari tempat tinggi (memanjat tangga/pohon/bangunan).",
      solusi: "Kelola rasa cemburu menjadi dedikasi profesional; selalu berhati-hati saat beraktivitas di ketinggian.",
      gambar: "assets/wayang/surakarta/batara_kamajaya.png"
    },
    8: {
      nama: "Batari Sri", dewa: "Batari Sri (Dewi Kemakmuran & Pangan)",
      watak: "Tutur katanya sejuk didengar, berhati pemurah dan welas asih, teguh pendirian, namun batinnya sering dirundung kesedihan dan suka menyendiri.",
      karier: "Sebenarnya potensi rezekinya melimpah, namun karena terlampau dermawan sering kali justru kekurangan uang untuk kebutuhan sendiri hingga harus banting tulang ekstra.",
      kelemahan: "Terlalu boros demi menolong orang lain; ada kecenderungan lari dari kenyataan atau menghindar dari masalah yang membuat bingung.",
      kesehatan: "Rentan gangguan organ pernapasan dan kardiovaskular: radang paru-paru dan gangguan jantung.",
      keluarga: "Pertemuan dengan lawan jenis pada siklus usia ini kelanjutannya kurang baik atau rawan membawa duka.",
      bahaya: "Sering berpindah-pindah tempat tinggal/kerja; beban pikiran menumpuk; kerugian finansial akibat terlalu murah hati.",
      solusi: "Selesaikan setiap persoalan hidup dengan tuntas dan bijaksana, jangan melarikan diri dari realitas; jaga kesehatan paru-paru dan jantung.",
      gambar: "assets/wayang/surakarta/gunungan.png"
    },
    9: {
      nama: "Batara Bayu", dewa: "Sang Hyang Bayu (Dewa Angin)",
      watak: "Dinamis, pantang menyerah, tidak betah berdiam diri, terus berpacu dengan waktu; memiliki sifat peragu namun bisa sangat nekat bila terdesak.",
      karier: "Peluang sukses besar berada di luar rumah (mobilitas tinggi); dagang dan usaha berkembang pesat melalui perjalanan dan pergaulan dinamis.",
      kelemahan: "Sikap ragu-ragu yang tiba-tiba berujung nekat; sering melupakan waktu dan keluarga di rumah karena sibuk di luar.",
      kesehatan: "Gangguan pencernaan/perut, sakit kepala (pusing), dan panas dalam.",
      keluarga: "Bagi yang masih lajang, jodoh akan dipertemukan di tengah perjalanan dinas/mobilitas luar rumah.",
      bahaya: "Godaan pergaulan bebas di luar rumah; bahaya kecelakaan lalu lintas saat mengemudikan kendaraan (memegang setir mobil) akibat keraguan.",
      solusi: "Tingkatkan ketakwaan kepada Tuhan dan senantiasa ingat keluarga di rumah; jangan menyetir kendaraan saat bimbang atau lelah.",
      gambar: "assets/wayang/surakarta/batara_bayu.png"
    },
    10: {
      nama: "Batara Wisnu", dewa: "Sang Hyang Wisnu",
      watak: "Bijaksana, berilmu luas, berhati mulia, dewasa, luwes berbicara dan persuasif; namun memiliki keteguhan luar biasa (tidak mau didikte bagai kuda sembrani).",
      karier: "Karier dan bisnis berkembang gemilang; sangat cocok menjadi negosiator, diplomat, delegasi organisasi atau pembicara tingkat nasional dan internasional.",
      kelemahan: "Keras kepala mempertahankan prinsipnya; mendadak tampak bingung/kehilangan akal bila diterpa rasa rindu mendalam kepada keluarga.",
      kesehatan: "Rentan gangguan jantung dan paru-paru akibat kelelahan kerja diplomasi.",
      keluarga: "Bagi yang belum menikah akan dipertemukan dengan jodohnya dalam perjalanan tugas/dinas.",
      bahaya: "Konflik atau persaingan terselubung dengan rekan seprofesi; bahaya besar/celaka jika mengingkari kesepakatan atau janji kerja.",
      solusi: "Pegang teguh janji dan integritas profesional; jaga ritme kerja agar organ kardiovaskular tetap sehat; rawat ikatan batin dengan keluarga.",
      gambar: "assets/wayang/surakarta/batara_wisnu.png"
    },
    11: {
      nama: "Batara Endro", dewa: "Sang Hyang Indra / Batara Endro",
      watak: "Tenang, cinta damai, sadar kewajiban, taat disiplin; merasa berkecukupan dan tidak menuntut banyak hal; sigap bila diberi penugasan.",
      karier: "Rezeki stabil dan kerap datang sendiri tanpa bersusah payah mencari ke tempat jauh; sewaktu-waktu memperoleh rezeki tak terduga dalam jumlah besar.",
      kelemahan: "Cenderung pasif, gemar tidur, bermalas-malasan dan enggan bepergian jauh jika tidak ditugaskan.",
      kesehatan: "Rentan terserang rematik, anemia (lesu darah); dianjurkan aktif senam pagi dan olahraga teratur.",
      keluarga: "Bagi yang lajang agak sulit mendapatkan jodoh pada siklus ini karena sikap jiwanya tertutup dan pasif.",
      bahaya: "Bahaya perampokan atau pencurian bila suka memamerkan perhiasan/harta; menjadi sasaran kedengkian orang yang iri atas keberhasilannya.",
      solusi: "Hindari gaya hidup pamer kekayaan (hedonis); aktifkan raga dengan olahraga teratur; buka diri dalam pergaulan agar memudahkan jodoh.",
      gambar: "assets/wayang/surakarta/batara_indra.png"
    },
    12: {
      nama: "Batara Yomodipati", dewa: "Sang Hyang Yamadipati / Batara Yomodipati",
      watak: "Disiplin tinggi, welas asih, sosial, pemurah, memiliki kepasrahan batin yang tinggi; namun keras hati dan pencemburu.",
      karier: "Rentan menunda-nunda pekerjaan sehingga tugas menumpuk dan menimbulkan kebingungan; menghadapi persimpangan batin antara ketaatan dan kesenangan semu.",
      kelemahan: "Mudah cemburu, suka menunda tugas pekerjaan jika lengah, bingung menghadapi godaan duniawi yang menyesatkan.",
      kesehatan: "Bila jatuh sakit pada periode ini sangat sulit disembuhkan; saatnya berserah diri sepenuhnya kepada takdir Ilahi.",
      keluarga: "Bagi yang belum menikah akan menjadi pasangan yang sangat harmonis, meskipun resepsi pernikahan mungkin tertunda pelaksanaannya.",
      bahaya: "Godaan kemaksiatan/bujukan iblis; bahaya kecelakaan fatal yang berisiko cedera permanen hingga mengancam keselamatan nyawa.",
      solusi: "Senantiasa memohon petunjuk dan perlindungan Allah SWT; jauhi kemaksiatan dan kesenangan fana; ekstra waspada terhadap keselamatan fisik.",
      gambar: "assets/wayang/surakarta/gunungan.png"
    }
  };

  const hitungSiklusTahunan = function(umur) {
    let u = parseInt(umur, 10);
    if (isNaN(u) || u < 0) u = 0;
    let sisa = u % 12;
    let siklusNo = (sisa === 0) ? 12 : sisa;
    return {
      umur: u,
      siklusNo: siklusNo,
      shio: MASTER_SIKLUS_SHIO[siklusNo] || { shio: "-", tegese: "-" },
      padewan: MASTER_SIKLUS_PADEWAN[siklusNo] || {
        nama: "-", dewa: "-", watak: "-", karier: "-",
        kelemahan: "-", kesehatan: "-", keluarga: "-",
        bahaya: "-", solusi: "-", gambar: "assets/wayang/surakarta/gunungan.png"
      }
    };
  };

  // Bind to global window/root
  root.MASTER_SIKLUS_SHIO = MASTER_SIKLUS_SHIO;
  root.MASTER_SIKLUS_PADEWAN = MASTER_SIKLUS_PADEWAN;
  root.hitungSiklusTahunan = hitungSiklusTahunan;

  // Node.js CommonJS export support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      MASTER_SIKLUS_SHIO,
      MASTER_SIKLUS_PADEWAN,
      hitungSiklusTahunan
    };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
