// =========================================================================
// MASTER DATA KARAKTER DASAR, DINA, PASARAN, SIRIKAN, PALENGGAHAN & PEKERJAAN
// Repositori: jagad-jawa
// Sumber: draft_database_nujum - karakter_dasar.csv, dina.csv, pasaran.csv, pekerjaan.csv, pakarti_rejeki.csv
// =========================================================================

(function (root) {
  // 1. MASTER KARAKTER DASAR (1 s.d. 9 Berdasarkan Penjumlahan Seluruh Digit Tanggal Lahir)
  const MASTER_KARAKTER_DASAR = {
    1: {
      tipe: "Leader",
      ringkasan: "Pemimpin berorientasi aksi, pragmatis, cepat, fokus hasil dan materi, namun lemah dalam pembinaan serta enggan dikritik.",
      kekuatan: "• Tergesa-gesa dan tidak sabaran\n• To The Point, blak-blakan / terbuka\n• Cepat marah tetapi suka damai (kemarahannya tidak dipendam)\n• Aura leadership besar, tetapi lemah dalam pembinaan\n• Egosentris (egois), senang tampil di depan\n• Suka dengan sistem / cara-cara yang baru\n• Jago menjual dan jago melobby\n• Praktis, pragmatis, orientasi ke materi\n• Punya prinsip yang keras, tidak bisa bekerja di bawah orang lain",
      kelemahan: "Tidak suka dikritik / dilampaui / dibantah, gengsi besar",
      negosiasi: "Disanjung, diperhatikan dan dilayani",
      sikap: "Belajar tentang leadership, lebih sabar dan mau menerima pendapat / saran orang lain",
      motto: "Aku datang... aku buktikan... aku menang! Dan terbukti dalam bentuk materi."
    },
    2: {
      tipe: "Diplomat",
      ringkasan: "Sosok konvensional, santun, cinta damai, setia dan tekun di balik layar, namun ragu mengambil keputusan serta takut risiko/perubahan.",
      kekuatan: "• Konvensional, tradisional\n• Halus, sopan santun, memelihara etika\n• Sangat sulit untuk membuat keputusan\n• Peka dengan situasi sekitarnya\n• Suka dengan hal-hal yang filosofis dan religius\n• Bermain di balik layar\n• Suka damai, tidak suka keributan dan mencampuri urusan orang lain\n• Tekun, bisa melakukan hal membosankan secara berulang-ulang\n• Loyalitas, setia sampai akhir",
      kelemahan: "Sulit membuat keputusan, takut perubahan, kurang berani mengambil risiko",
      negosiasi: "Disanjung, dilayani, diperhatikan dan dibuka paradigma berpikirnya",
      sikap: "Berani tampil dan lebih berani mengambil risiko",
      motto: "Hidup adalah untuk dinikmati, masih bisa enak-enak begini, mengapa harus berubah?"
    },
    3: {
      tipe: "Analisis",
      ringkasan: "Sosok perfeksionis estetis, analitis dan kritis, gemar menolong namun teoritis dan sangat sensitif terhadap perhatian serta penghargaan.",
      kekuatan: "• Perfeksionis, sangat menyukai keindahan/estetika\n• Senang menolong, penasihat yang baik\n• Analitis, teliti, kritis, dan berorientasi data\n• Sering mengandalkan teori dan konseptual\n• Sangat sensitif, butuh perhatian dan penghargaan tinggi\n• Menjaga gengsi dan penampilan luar\n• Terkadang ragu dalam eksekusi praktis di lapangan",
      kelemahan: "Sensitif, terlalu teoritis, mudah tersinggung jika kurang dihargai",
      negosiasi: "Diberi apresiasi tulus, diakui karya dan ketelitiannya",
      sikap: "Lebih praktis, kurangi overthinking, dan berani eksekusi langsung",
      motto: "Segala sesuatu harus tertata sempurna, indah, dan akurat."
    },
    4: {
      tipe: "Realis",
      ringkasan: "Praktis, realistis, berpijak pada kenyataan dan efisiensi tindakan.",
      kekuatan: "• Berpijak pada kenyataan (realistis)\n• Sangat menghargai efisiensi dan waktu\n• Solutif dalam menghadapi kendala teknis\n• Tidak mudah percaya pada hal abstrak tanpa bukti nyata",
      kelemahan: "Kurang memiliki visi jangka panjang yang imajinatif",
      negosiasi: "Berikan bukti nyata, data empiris, dan hasil konkret",
      sikap: "Buka diri terhadap inovasi dan pemikiran baru di luar kebiasaan",
      motto: "Bukti nyata di depan mata lebih berarti daripada sejuta teori."
    },
    5: {
      tipe: "Adventurer",
      ringkasan: "Dinamis, menyukai kebebasan, petualang, adaptif terhadap perubahan.",
      kekuatan: "• Dinamis, energik, dan tidak betah diam\n• Menyukai petualangan dan tantangan baru\n• Cepat beradaptasi dengan lingkungan asing\n• Berjiwa bebas dan kreatif",
      kelemahan: "Mudah bosan, kurang disiplin pada rutinitas ketat",
      negosiasi: "Berikan keleluasaan gerak dan hindari aturan birokrasi kaku",
      sikap: "Tingkatkan ketekunan dan fokus pada satu tujuan akhir",
      motto: "Hidup adalah kebebasan untuk menjelajah dan menemukan."
    },
    6: {
      tipe: "Idealis",
      ringkasan: "Memiliki cita-cita luhur, berpegang teguh pada prinsip, nilai moral, dan keyakinan.",
      kekuatan: "• Memiliki cita-cita luhur dan standar moral tinggi\n• Setia pada prinsip hidup dan keyakinan\n• Membela kebenaran dengan penuh semangat\n• Memiliki integritas batin yang kuat",
      kelemahan: "Terkadang terlalu kaku, sulit berkompromi dengan realitas praktis",
      negosiasi: "Gugah nilai etika, moral, dan misi luhur perjuangannya",
      sikap: "Lebih fleksibel memahami sudut pandang orang lain tanpa kehilangan prinsip",
      motto: "Prinsip hidup dan kebenaran adalah segalanya."
    },
    7: {
      tipe: "Edukatif",
      ringkasan: "Berorientasi pada pembelajaran, bimbingan, pencerahan, dan penyebaran ilmu pengetahuan.",
      kekuatan: "• Suka membagikan ilmu, membimbing, dan mencerahkan\n• Sabar dalam mendidik dan mengarahkan sesama\n• Berwawasan luas dan gemar membaca/belajar\n• Menjadi rujukan nasihat bagi orang lain",
      kelemahan: "Terkadang tampak menggurui atau terlalu banyak bicara teori",
      negosiasi: "Hargai pengetahuannya dan ajak berdiskusi secara bijak",
      sikap: "Imbangi teori dengan praktik nyata yang membumi",
      motto: "Ilmu yang bermanfaat adalah pelita bagi kehidupan."
    },
    8: {
      tipe: "Eksekutor",
      ringkasan: "Pekerja keras, gigih, berorientasi hasil nyata, tangguh menghadapi tekanan eksekusi.",
      kekuatan: "• Pekerja keras yang sangat tangguh di bawah tekanan\n• Berorientasi pada hasil nyata dan penyelesaian tugas\n• Disiplin, fokus, dan pantang menyerah\n• Handal dalam menggerakkan operasional",
      kelemahan: "Keras kepala, terkadang mengabaikan aspek perasaan orang lain",
      negosiasi: "Berikan target yang jelas, wewenang, dan kejelasan hasil",
      sikap: "Tingkatkan empati dan kelembutan dalam berinteraksi sosial",
      motto: "Kerja tuntas, hasil nyata, tanpa banyak alasan."
    },
    9: {
      tipe: "Entertainer",
      ringkasan: "Komunikatif, ekspresif, ceria, memiliki daya tarik sosial dan menghibur sesama.",
      kekuatan: "• Komunikatif, ekspresif, dan ceria\n• Memiliki daya tarik sosial yang kuat di tengah keramaian\n• Mampu mencairkan suasana dan menghibur orang lain\n• Mudah diterima di berbagai kalangan",
      kelemahan: "Mudah terdistraksi, kurang sabar dalam hal detail teknis",
      negosiasi: "Gunakan pendekatan yang menyenangkan, santai, dan penuh antusiasme",
      sikap: "Tingkatkan kedisiplinan dan ketelitian dalam mengelola urusan penting",
      motto: "Hidup harus membawa keceriaan dan kebahagiaan bagi sesama."
    }
  };
  if (typeof window !== 'undefined') {
    window.MASTER_KARAKTER_DASAR = MASTER_KARAKTER_DASAR;
  }

  // 2. MASTER DINA (WATAK HARI LAHIR MASEHI: SENIN s.d. MINGGU)
  const MASTER_DINA = {
    "senin": { 
      nama_masehi: "Senin", 
      lambang: "Kembang", 
      watak: "Selalu berubah, indah dan banyak mendapatkan simpati", 
      watak_utama: "Selalu berubah, indah dan banyak mendapatkan simpati", 
      deskripsi: "Selalu berubah, indah dan banyak mendapatkan simpati, cenderung narsis & posesif, ceria serta humoris.", 
      profesi: "Seni hiburan, presenter/host, public relations, performer.",
      rekomendasi_profesi: "Seni hiburan, presenter/host, public relations, performer."
    },
    "selasa": { 
      nama_masehi: "Selasa", 
      lambang: "Geni", 
      watak: "Pemarah dan pencemburu, luas pergaulannya", 
      watak_utama: "Pemarah dan pencemburu, luas pergaulannya", 
      deskripsi: "Pemarah dan pencemburu, kharismatik, disegani karena berjiwa pemimpin, percaya diri tinggi.", 
      profesi: "Politik, orator/juru bicara, perdagangan, wirausaha/pebisnis handal.",
      rekomendasi_profesi: "Politik, orator/juru bicara, perdagangan, wirausaha/pebisnis handal."
    },
    "rabu": { 
      nama_masehi: "Rabu", 
      lambang: "Godhong", 
      watak: "Pendiam, pemomong dan penyabar", 
      watak_utama: "Pendiam, pemomong dan penyabar", 
      deskripsi: "Pendiam, pemomong, penyabar, namun memiliki keteguhan batin yang kuat dalam membimbing sesama.", 
      profesi: "Pendidik, pengayom, konselor, pekerja sosial.",
      rekomendasi_profesi: "Pendidik, pengayom, konselor, pekerja sosial."
    },
    "kamis": { 
      nama_masehi: "Kamis", 
      lambang: "Angin", 
      watak: "Sangar menakutkan, pekerja keras tangguh", 
      watak_utama: "Sangar menakutkan, pekerja keras tangguh", 
      deskripsi: "Sangar menakutkan, pekerja keras yang tangguh, memiliki daya juang tinggi menghadapi rintangan.", 
      profesi: "Militer, kepolisian, pengamanan, pemimpin lapangan.",
      rekomendasi_profesi: "Militer, kepolisian, pengamanan, pemimpin lapangan."
    },
    "jumat": { 
      nama_masehi: "Jumat", 
      lambang: "Banyu", 
      watak: "Enerjik mengagumkan, diam-diam menghanyutkan", 
      watak_utama: "Enerjik mengagumkan, diam-diam menghanyutkan", 
      deskripsi: "Enerjik mengagumkan, tenang di luar namun diam-diam menghanyutkan dalam pencapaian visi.", 
      profesi: "Diplomat, negosiator, seniman, analis strategis.",
      rekomendasi_profesi: "Diplomat, negosiator, seniman, analis strategis."
    },
    "sabtu": { 
      nama_masehi: "Sabtu", 
      lambang: "Lemah", 
      watak: "Membuat orang merasa senang, susah ditebak", 
      watak_utama: "Membuat orang merasa senang, susah ditebak", 
      deskripsi: "Membuat orang merasa senang, karakternya tenang bagai tanah, namun isi hatinya susah ditebak.", 
      profesi: "Agraria, properti, pengelola aset, wirausaha.",
      rekomendasi_profesi: "Agraria, properti, pengelola aset, wirausaha."
    },
    "minggu": { 
      nama_masehi: "Minggu", 
      lambang: "Angkasa", 
      watak: "Tekun mandiri, berwibawa, wawasan luas", 
      watak_utama: "Tekun mandiri, berwibawa, wawasan luas", 
      deskripsi: "Tekun mandiri, berwibawa tinggi, memiliki wawasan luas seluas angkasa.", 
      profesi: "Tokoh publik, akademisi, pimpinan tertinggi, pemikir.",
      rekomendasi_profesi: "Tokoh publik, akademisi, pimpinan tertinggi, pemikir."
    }
  };

  // 3. MASTER PASARAN (WATAK PASARAN JAWA: LEGI, PAHING, PON, WAGE, KLIWON)
  const MASTER_PASARAN = {
    "legi": { 
      nama_pasaran: "Legi", 
      lambang: "Bulan / Manis", 
      watak: "Suka mengalah, ikhlas, pemaaf, murah rejeki", 
      watak_utama: "Suka mengalah, ikhlas, pemaaf, murah rejeki", 
      deskripsi: "Suka mengalah, ikhlas, pemaaf, murah rejeki, disenangi dalam lingkungan sosial.", 
      rejeki: "Rejeki mengalir lancar dari berbagai arah dan mudah mendapatkan kepercayaan.",
      catatan_rejeki_nasib: "Rejeki mengalir lancar dari berbagai arah dan mudah mendapatkan kepercayaan."
    },
    "pahing": { 
      nama_pasaran: "Pahing", 
      lambang: "Kepodang / Abritan", 
      watak: "Bicaranya diterima banyak orang, mandiri & teguh pendirian", 
      watak_utama: "Bicaranya diterima banyak orang, mandiri & teguh pendirian", 
      deskripsi: "Bicaranya banyak diterima orang lain, suka tinggal di rumah, jalan pikiran berbeda dari umum.", 
      rejeki: "Rejekinya cukup dan senantiasa berkecukupan.",
      catatan_rejeki_nasib: "Rejekinya cukup dan senantiasa berkecukupan."
    },
    "pon": { 
      nama_pasaran: "Pon", 
      lambang: "Kencana (Emas) / Jenean", 
      watak: "Bijaksana, berpengaruh, berwibawa, sukses", 
      watak_utama: "Bijaksana, berpengaruh, berwibawa, sukses", 
      deskripsi: "Bijaksana, berpengaruh, berwibawa, memiliki potensi besar dalam hal kepemimpinan dan finansial.", 
      rejeki: "Potensi rejeki besar, mandiri dan mampu mengelola aset dengan baik.",
      catatan_rejeki_nasib: "Potensi rejeki besar, mandiri dan mampu mengelola aset dengan baik."
    },
    "wage": { 
      nama_pasaran: "Wage", 
      lambang: "Dandang (Gagak) / Cemengan", 
      watak: "Menarik namun berkarakter angkuh, setia dan penurut", 
      watak_utama: "Menarik namun berkarakter angkuh, setia dan penurut", 
      deskripsi: "Berdaya tarik memikat tapi cenderung angkuh, loyalitas tinggi, penurut namun kaku.", 
      rejeki: "Perlu dibantu orang lain dalam mencari nafkah; rentan mendapat fitnah.",
      catatan_rejeki_nasib: "Perlu dibantu orang lain dalam mencari nafkah; rentan mendapat fitnah."
    },
    "kliwon": { 
      nama_pasaran: "Kliwon", 
      lambang: "Kumbang / Kasih", 
      watak: "pandai berbicara, pemaaf, sabar namun pendendam", 
      watak_utama: "pandai berbicara, pemaaf, sabar namun pendendam", 
      deskripsi: "Pandai berbicara, pemaaf, sabar, namun bisa menyimpan dendam jika disakiti mendalam.", 
      rejeki: "Rejeki pas-pasangan, butuh kerja ekstra dan kehati-hatian dalam bermitra.",
      catatan_rejeki_nasib: "Rejeki pas-pasangan, butuh kerja ekstra dan kehati-hatian dalam bermitra."
    }
  };

  // 4. SIRIKAN ADHEP OMAH (PANTANGAN ARAH HADAP RUMAH)
  const MASTER_SIRIKAN_NEPTU = {
    7: "KULON / BARAT", 11: "KULON / BARAT", 15: "KULON / BARAT",
    8: "LOR / UTARA", 12: "LOR / UTARA", 16: "LOR / UTARA",
    9: "WETAN / TIMUR", 13: "WETAN / TIMUR", 17: "WETAN / TIMUR",
    10: "KIDUL / SELATAN", 14: "KIDUL / SELATAN", 18: "KIDUL / SELATAN"
  };

  const MASTER_SIRIKAN_DINA = {
    "kamis": "WETAN / TIMUR", "sabtu": "WETAN / TIMUR", "senin": "WETAN / TIMUR",
    "jumat": "KIDUL / SELATAN", "minggu": "KIDUL / SELATAN", "selasa": "KIDUL / SELATAN",
    "rabu": "KULON / BARAT"
  };

  // 5. MASTER AKSARA FAAL & PALENGGAHAN / PEDAMELAN (20 AKSARA CARAKAN BAKU)
  const LIST_AKSARA_CARAKAN = [
    { kode: "HA", neptu: 1 },
    { kode: "NA", neptu: 2 },
    { kode: "CA", neptu: 3 },
    { kode: "RA", neptu: 4 },
    { kode: "KA", neptu: 5 },
    { kode: "DA", neptu: 6 },
    { kode: "TA", neptu: 7 },
    { kode: "SA", neptu: 8 },
    { kode: "WA", neptu: 9 },
    { kode: "LA", neptu: 10 },
    { kode: "PA", neptu: 11 },
    { kode: "DHA", neptu: 12 },
    { kode: "JA", neptu: 13 },
    { kode: "YA", neptu: 14 },
    { kode: "NYA", neptu: 15 },
    { kode: "MA", neptu: 16 },
    { kode: "GA", neptu: 17 },
    { kode: "BA", neptu: 18 },
    { kode: "THA", neptu: 19 },
    { kode: "NGA", neptu: 20 }
  ];

  const MASTER_AKSARA_FAAL = {
    "HA": 1, "NA": 2, "CA": 3, "RA": 4, "KA": 5, "DA": 6, "TA": 7, "SA": 8, "WA": 9, "LA": 10,
    "PA": 11, "DHA": 12, "JA": 13, "YA": 14, "NYA": 15, "MA": 16, "GA": 17, "BA": 18, "THA": 19, "NGA": 20
  };

  const MASTER_PALENGGAHAN = {
    1: { surasa: "SONYA", tegese: "Ngalami kahanan rekasa / keprihatinan" },
    2: { surasa: "AGOTHO", tegese: "Ngalami kahanan rekasa / keprihatinan" },
    3: { surasa: "GEDHONG", tegese: "Kajen kelingan (Dihormati, eling marang kautaman)" },
    4: { surasa: "PANDHITA", tegese: "Kajen kelingan (Watak mandita, linuhung)" },
    5: { surasa: "RATU", tegese: "Kajen kelingan (Kamulyan, kawibawan luhur)" }
  };

  // 6. MASTER PEKERJAAN & PAKARTI (35 KOMBINASI WETON DINO & PASARAN)
  const MASTER_PEKERJAAN = [
    { dino: "Minggu", pasaran: "Pahing", rejeki: "Wadhuk", badan: "Dubur", pakaryan: "Sangat cocok menjadi TUKANG KAYU atau BERDAGANG KLONTHONG dan BUAH - BUAHAN" },
    { dino: "Senin", pasaran: "Pon", rejeki: "Wadhuk", badan: "Cangkem", pakaryan: "Sebaiknya berjualan MAKANAN , IKAN - IKANAN atau DAGING (rojo koyo)" },
    { dino: "Selasa", pasaran: "Wage", rejeki: "Cucuk", badan: "Silit", pakaryan: "Sebaiknya BERDAGANG HEWAN (Blantik) dan lebih baik lagi bertapa agar dapat menjadi seorang PARANORMAL" },
    { dino: "Rabu", pasaran: "Kliwon", rejeki: "Silit", badan: "Silit", pakaryan: "Sebaiknya BERDAGANG HEWAN (Blantik) dan lebih baik lagi bertapa agar dapat menjadi seorang PARANORMAL" },
    { dino: "Kamis", pasaran: "Legi", rejeki: "Cucuk", badan: "Tangan", pakaryan: "Sebaiknya menjadi KEMASAN (poro) dan berjualan BERAS (hasil bumi)" },
    { dino: "Jumat", pasaran: "Pahing", rejeki: "Silit", badan: "Silit", pakaryan: "Sebaiknya BERDAGANG HEWAN (Blantik) dan lebih baik lagi bertapa agar dapat menjadi seorang PARANORMAL" },
    { dino: "Sabtu", pasaran: "Pon", rejeki: "Cucuk", badan: "Tungkak", pakaryan: "Baik menjadi seorang INTERTAINER (artis) dapat juga BETERNAK dan berjualan KLONTHONG tetapi jangan berlebihan" },
    { dino: "Minggu", pasaran: "Wage", rejeki: "Silit", badan: "Mata", pakaryan: "Baik menjadi tukang CELEP atau MENYOGA dan berdagang KAIN atau MINYAK dan BERAS tetapi jangan berlebihan" },
    { dino: "Senin", pasaran: "Kliwon", rejeki: "Silit", badan: "Kuping", pakaryan: "Sebaiknya menjadi PENJAHIT , PENATU atau BERDAGANG KAIN / KONVEKSI" },
    { dino: "Selasa", pasaran: "Legi", rejeki: "Wadhuk", badan: "Tungkak", pakaryan: "Baik menjadi seorang INTERTAINER (artis) dapat juga BETERNAK dan berjualan KLONTHONG tetapi jangan berlebihan" },
    { dino: "Rabu", pasaran: "Pahing", rejeki: "Cucuk", badan: "Tungkak", pakaryan: "Baik menjadi seorang INTERTAINER (artis) dapat juga BETERNAK dan berjualan KLONTHONG tetapi jangan berlebihan" },
    { dino: "Kamis", pasaran: "Pon", rejeki: "Silit", badan: "Silit", pakaryan: "Sebaiknya BERDAGANG HEWAN (Blantik) dan lebih baik lagi bertapa agar dapat menjadi seorang PARANORMAL" },
    { dino: "Jumat", pasaran: "Wage", rejeki: "Cucuk", badan: "Irung", pakaryan: "Pantasnya menjadi PEMIMPIN dibidang usaha PETERNAKAN dan berdagang KUSEN PINTU(mebel) atau BESI" },
    { dino: "Sabtu", pasaran: "Kliwon", rejeki: "Wadhuk", badan: "Mata", pakaryan: "Baik menjadi tukang CELEP atau MENYOGA dan berdagang KAIN atau MINYAK dan BERAS tetapi jangan berlebihan" },
    { dino: "Minggu", pasaran: "Legi", rejeki: "Cucuk", badan: "Irung", pakaryan: "Pantasnya menjadi PEMIMPIN dibidang usaha PETERNAKAN dan berdagang KUSEN PINTU(mebel) atau BESI" },
    { dino: "Senin", pasaran: "Pahing", rejeki: "Cucuk", badan: "Tangan", pakaryan: "Sebaiknya menjadi KEMASAN (poro) dan berjualan BERAS (hasil bumi)" },
    { dino: "Selasa", pasaran: "Pon", rejeki: "Cucuk", badan: "Irung", pakaryan: "Pantasnya menjadi PEMIMPIN dibidang usaha PETERNAKAN dan berdagang KUSEN PINTU(mebel) atau BESI" },
    { dino: "Rabu", pasaran: "Wage", rejeki: "Wadhuk", badan: "Cangkem", pakaryan: "Sebaiknya berjualan MAKANAN , IKAN - IKANAN atau DAGING (rojo koyo)" },
    { dino: "Kamis", pasaran: "Kliwon", rejeki: "Cucuk", badan: "Tungkak", pakaryan: "Baik menjadi seorang INTERTAINER (artis) dapat juga BETERNAK dan berjualan KLONTHONG tetapi jangan berlebihan" },
    { dino: "Jumat", pasaran: "Legi", rejeki: "Wadhuk", badan: "Cangkem", pakaryan: "Sebaiknya berjualan MAKANAN , IKAN - IKANAN atau DAGING (rojo koyo)" },
    { dino: "Sabtu", pasaran: "Pahing", rejeki: "Silit", badan: "Irung", pakaryan: "Pantasnya menjadi PEMIMPIN dibidang usaha PETERNAKAN dan berdagang KUSEN PINTU(mebel) atau BESI" },
    { dino: "Minggu", pasaran: "Pon", rejeki: "Silit", badan: "Kuping", pakaryan: "Sebaiknya menjadi PENJAHIT , PENATU atau BERDAGANG KAIN / KONVEKSI" },
    { dino: "Senin", pasaran: "Wage", rejeki: "Wadhuk", badan: "Tungkak", pakaryan: "Baik menjadi seorang INTERTAINER (artis) dapat juga BETERNAK dan berjualan KLONTHONG tetapi jangan berlebihan" },
    { dino: "Selasa", pasaran: "Kliwon", rejeki: "Wadhuk", badan: "Cangkem", pakaryan: "Sebaiknya berjualan MAKANAN , IKAN - IKANAN atau DAGING (rojo koyo)" },
    { dino: "Rabu", pasaran: "Legi", rejeki: "Silit", badan: "Kuping", pakaryan: "Sebaiknya menjadi PENJAHIT , PENATU atau BERDAGANG KAIN / KONVEKSI" },
    { dino: "Kamis", pasaran: "Pahing", rejeki: "Wadhuk", badan: "Mata", pakaryan: "Baik menjadi tukang CELEP atau MENYOGA dan berdagang KAIN atau MINYAK dan BERAS tetapi jangan berlebihan" },
    { dino: "Jumat", pasaran: "Pon", rejeki: "Cucuk", badan: "Tangan", pakaryan: "Sebaiknya menjadi KEMASAN (poro) dan berjualan BERAS (hasil bumi)" },
    { dino: "Sabtu", pasaran: "Wage", rejeki: "Cucuk", badan: "Tangan", pakaryan: "Sebaiknya menjadi KEMASAN (poro) dan berjualan BERAS (hasil bumi)" },
    { dino: "Minggu", pasaran: "Kliwon", rejeki: "Cucuk", badan: "Tangan", pakaryan: "Sebaiknya menjadi KEMASAN (poro) dan berjualan BERAS (hasil bumi)" },
    { dino: "Senin", pasaran: "Legi", rejeki: "Silit", badan: "Mata", pakaryan: "Baik menjadi tukang CELEP atau MENYOGA dan berdagang KAIN atau MINYAK dan BERAS tetapi jangan berlebihan" },
    { dino: "Selasa", pasaran: "Pahing", rejeki: "Silit", badan: "Kuping", pakaryan: "Sebaiknya menjadi PENJAHIT , PENATU atau BERDAGANG KAIN / KONVEKSI" },
    { dino: "Rabu", pasaran: "Pon", rejeki: "Wadhuk", badan: "Dubur", pakaryan: "Sangat cocok menjadi TUKANG KAYU atau BERDAGANG KLONTHONG dan BUAH - BUAHAN" },
    { dino: "Kamis", pasaran: "Wage", rejeki: "Silit", badan: "Kuping", pakaryan: "Sebaiknya menjadi PENJAHIT , PENATU atau BERDAGANG KAIN / KONVEKSI" },
    { dino: "Jumat", pasaran: "Kliwon", rejeki: "Wadhuk", badan: "Dubur", pakaryan: "Sangat cocok menjadi TUKANG KAYU atau BERDAGANG KLONTHONG dan BUAH - BUAHAN" },
    { dino: "Sabtu", pasaran: "Legi", rejeki: "Wadhuk", badan: "Dubur", pakaryan: "Sangat cocok menjadi TUKANG KAYU atau BERDAGANG KLONTHONG dan BUAH - BUAHAN" }
  ];

  // 7. MASTER PAKARTI REJEKI
  const MASTER_PAKARTI_REJEKI = {
    "cucuk": "Cucuk itu dapat mencari, tapi tidak dapat menyimpan.",
    "wadhuk": "Wadhuk itu adalah tempat makanan. Maka mestinya dapat untuk menyimpan.",
    "silit": "Silit ini pintar mencari namun menampung dari buangannya waduk. Namun membuangnya juga tetap."
  };

  // 8. MASTER PAKARTI BADAN (FILOSOFI ANGGOTA TUBUH)
  const MASTER_PAKARTI_BADAN = {
    "dubur": "Dubur itu organ yang berfungsi untuk menahan dan mengeluarkan sisa; maknanya, orangnya memiliki watak yang sangat tertutup, pandai menyimpan rahasia rapat-rapat, namun kadang bisa sangat tegas/tertutup pendiriannya.",
    "cangkem": "Cangkem itu alat untuk berbicara dan menyampaikan isi perut; maknanya, orangnya pandai berucap, komunikatif, lancar dalam pergaulan, namun harus berhati-hati agar tidak asal bicara (ceplas-ceplos).",
    "silit": "Silit itu bagian pembuangan yang sifatnya mengunci dan menyaring; maknanya, orangnya sangat hati-hati, waspada, pandai menjaga diri dari hal-hal tersembunyi, serta ulet dalam menyimpan prinsip hidup.",
    "tangan": "Tangan itu alat untuk bekerja, meraih, dan berbuat; maknanya, orangnya bertipe pekerja keras, cekatan, terampil, dan menggantungkan kemajuan hidupnya dari hasil usaha dan keringatnya sendiri.",
    "tungkak": "Tungkak itu bagian bawah yang menjadi tumpuan seluruh berat badan; maknanya, orangnya memiliki pendirian yang sangat kokoh, tahan banting, tahan menghadapi tekanan hidup, dan memiliki prinsip yang teguh.",
    "mata": "Mata itu alat untuk melihat dan mengamati keadaan; maknanya, orangnya memiliki ketajaman insting, jeli melihat peluang, waspada terhadap lingkungan, dan memiliki pandangan hidup yang luas/visioner.",
    "kuping": "Kuping itu alat untuk mendengar suara dari luar; maknanya, orangnya pendengar yang baik, peka terhadap informasi atau nasihat orang lain, serta mudah memahami situasi sosial di sekitarnya.",
    "irung": "Irung itu alat untuk bernapas dan mencium bau; maknanya, orangnya memiliki kepekaan batin atau intuisi yang tajam, harga diri yang tinggi, serta cepat tanggap terhadap gelagat atau perubahan situasi."
  };

  if (typeof window !== 'undefined') {
    window.MASTER_PAKARTI_BADAN = MASTER_PAKARTI_BADAN;
    window.MASTER_PAKARTI_REJEKI = MASTER_PAKARTI_REJEKI;
  }

  // 9. FUNGSI KALKULATOR & LOOKUP
  /**
   * hitungKarakterDasar
   * Menghitung Karakter Dasar (1 s.d. 9) berdasarkan penjumlahan seluruh digit Tanggal + Bulan + Tahun Masehi.
   * Contoh: 1 Mei 1986 -> '01/05/1986' -> 1 + 5 + 1 + 9 + 8 + 6 = 30 -> 30 % 9 = 3 (Tipe: Analisis).
   * Jika sisa === 0, maka no_karakter adalah 9.
   */
  const hitungKarakterDasar = function (tglStr, blnStr, thnStr) {
    let combined = `${tglStr}${blnStr !== undefined ? blnStr : ''}${thnStr !== undefined ? thnStr : ''}`.replace(/\D/g, '');
    let digits = combined.split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);
    let sisa = sum % 9;
    let noKarakter = (sisa === 0) ? 9 : sisa;
    const lookup = (typeof MASTER_KARAKTER_DASAR !== 'undefined') ? MASTER_KARAKTER_DASAR : (root.MASTER_KARAKTER_DASAR || (typeof window !== 'undefined' ? window.MASTER_KARAKTER_DASAR : {}));
    return {
      totalSum: sum,
      formulaStr: digits.join(' + '),
      noKarakter: noKarakter,
      data: lookup[noKarakter] || {
        tipe: "-", ringkasan: "-", kekuatan: "-", kelemahan: "-", negosiasi: "-", sikap: "-", motto: "-"
      }
    };
  };

  const getPakartiBadanArtinya = function (namaBadan) {
    if (!namaBadan) return "-";
    let key = namaBadan.trim().toLowerCase();
    const lookup = (typeof MASTER_PAKARTI_BADAN !== 'undefined') ? MASTER_PAKARTI_BADAN : (root.MASTER_PAKARTI_BADAN || (typeof window !== 'undefined' ? window.MASTER_PAKARTI_BADAN : {}));
    return lookup[key] || namaBadan;
  };

  if (typeof window !== 'undefined') {
    window.hitungKarakterDasar = hitungKarakterDasar;
    window.getPakartiBadanArtinya = getPakartiBadanArtinya;
  }

  function parseAksaraFromWord(word) {
    if (!word || typeof word !== 'string') {
      return { firstAksara: "HA", lastAksara: "HA", firstLabel: "H", lastLabel: "H" };
    }
    const clean = word.trim().replace(/[^a-zA-Z]/g, '');
    if (!clean) {
      return { firstAksara: "HA", lastAksara: "HA", firstLabel: "H", lastLabel: "H" };
    }
    const up = clean.toUpperCase();

    // 1. First aksara detection (check 3-letter & 2-letter digraphs first)
    let firstAksara = "HA";
    let firstLabel = clean.charAt(0);
    if (up.startsWith("NGA")) {
      firstAksara = "NGA";
      firstLabel = clean.substring(0, 3);
    } else if (up.startsWith("NG")) {
      firstAksara = "NGA";
      firstLabel = clean.substring(0, 2);
    } else if (up.startsWith("NYA")) {
      firstAksara = "NYA";
      firstLabel = clean.substring(0, 3);
    } else if (up.startsWith("NY")) {
      firstAksara = "NYA";
      firstLabel = clean.substring(0, 2);
    } else if (up.startsWith("DHA")) {
      firstAksara = "DHA";
      firstLabel = clean.substring(0, 3);
    } else if (up.startsWith("DH")) {
      firstAksara = "DHA";
      firstLabel = clean.substring(0, 2);
    } else if (up.startsWith("THA")) {
      firstAksara = "THA";
      firstLabel = clean.substring(0, 3);
    } else if (up.startsWith("TH")) {
      firstAksara = "THA";
      firstLabel = clean.substring(0, 2);
    } else {
      const c = up.charAt(0);
      firstLabel = clean.charAt(0);
      if (['A', 'I', 'U', 'E', 'O'].includes(c)) firstAksara = "HA";
      else if (c === 'N') firstAksara = "NA";
      else if (c === 'C') firstAksara = "CA";
      else if (c === 'R') firstAksara = "RA";
      else if (c === 'K' || c === 'Q') firstAksara = "KA";
      else if (c === 'D') firstAksara = "DA";
      else if (c === 'T') firstAksara = "TA";
      else if (c === 'S' || c === 'Z' || c === 'X') firstAksara = "SA";
      else if (c === 'W') firstAksara = "WA";
      else if (c === 'L') firstAksara = "LA";
      else if (c === 'P' || c === 'F' || c === 'V') firstAksara = "PA";
      else if (c === 'J') firstAksara = "JA";
      else if (c === 'Y') firstAksara = "YA";
      else if (c === 'M') firstAksara = "MA";
      else if (c === 'G') firstAksara = "GA";
      else if (c === 'B') firstAksara = "BA";
      else firstAksara = "HA";
    }

    // 2. Last aksara detection (check 2-letter digraphs first)
    let lastAksara = "HA";
    let lastLabel = clean.charAt(clean.length - 1);
    if (up.endsWith("NG")) {
      lastAksara = "NGA";
      lastLabel = clean.slice(-2);
    } else if (up.endsWith("NY")) {
      lastAksara = "NYA";
      lastLabel = clean.slice(-2);
    } else if (up.endsWith("DH")) {
      lastAksara = "DHA";
      lastLabel = clean.slice(-2);
    } else if (up.endsWith("TH")) {
      lastAksara = "THA";
      lastLabel = clean.slice(-2);
    } else {
      const c = up.charAt(up.length - 1);
      lastLabel = clean.charAt(clean.length - 1);
      if (['A', 'I', 'U', 'E', 'O'].includes(c)) lastAksara = "HA";
      else if (c === 'N') lastAksara = "NA";
      else if (c === 'C') lastAksara = "CA";
      else if (c === 'R') lastAksara = "RA";
      else if (c === 'K' || c === 'Q') lastAksara = "KA";
      else if (c === 'D') lastAksara = "DA";
      else if (c === 'T') lastAksara = "TA";
      else if (c === 'S' || c === 'Z' || c === 'X') lastAksara = "SA";
      else if (c === 'W') lastAksara = "WA";
      else if (c === 'L') lastAksara = "LA";
      else if (c === 'P' || c === 'F' || c === 'V') lastAksara = "PA";
      else if (c === 'J') lastAksara = "JA";
      else if (c === 'Y') lastAksara = "YA";
      else if (c === 'M') lastAksara = "MA";
      else if (c === 'G') lastAksara = "GA";
      else if (c === 'B') lastAksara = "BA";
      else lastAksara = "HA";
    }

    return { firstAksara, lastAksara, firstLabel, lastLabel };
  }

  function getAksaraFromChar(char) {
    if (!char) return "HA";
    let c = String(char).trim().toUpperCase();
    if (['A', 'I', 'U', 'E', 'O'].includes(c)) return "HA";
    if (c === 'NG' || c === 'NGA') return "NGA";
    if (c === 'NY' || c === 'NYA') return "NYA";
    if (c === 'DH' || c === 'DHA') return "DHA";
    if (c === 'TH' || c === 'THA') return "THA";
    if (c === 'N') return "NA";
    if (c === 'K' || c === 'Q') return "KA";
    if (c === 'T') return "TA";
    if (c === 'Z' || c === 'X' || c === 'S') return "SA";
    if (c === 'C') return "CA";
    if (c === 'R') return "RA";
    if (c === 'D') return "DA";
    if (c === 'W') return "WA";
    if (c === 'L') return "LA";
    if (c === 'P' || c === 'F' || c === 'V') return "PA";
    if (c === 'J') return "JA";
    if (c === 'Y') return "YA";
    if (c === 'M') return "MA";
    if (c === 'G') return "GA";
    if (c === 'B') return "BA";
    return "HA";
  }

  /**
   * analisisPalenggahan
   * Menghitung nilai Palenggahan (Tempat Tinggal) atau Pedamelan (Tempat Kerja)
   * Berdasarkan kombinasi 4 huruf:
   * 1. Huruf Depan Nama Desa/Tempat
   * 2. Huruf Belakang Nama Desa/Tempat
   * 3. Huruf Depan Nama Orang
   * 4. Huruf Belakang Nama Orang
   * Total Neptu = Neptu(Depan Desa) + Neptu(Belakang Desa) + Neptu(Depan Orang) + Neptu(Belakang Orang)
   * Modulo 5: sisa === 0 ? 5 : sisa (1: SONYA, 2: AGOTHO, 3: GEDHONG, 4: PANDHITA, 5: RATU)
   */
  const analisisPalenggahan = function (namaTempat, namaOrang) {
    if (!namaTempat || namaTempat.trim() === "" || namaTempat.trim() === "-") {
      return { 
        namaTempat: "-", 
        namaOrang: namaOrang || "-",
        firstCharTempat: "-", 
        lastCharTempat: "-", 
        aksaraFirstTempat: "-", 
        aksaraLastTempat: "-", 
        neptuFirstTempat: 0, 
        neptuLastTempat: 0,
        firstCharOrang: "-", 
        lastCharOrang: "-", 
        aksaraFirstOrang: "-", 
        aksaraLastOrang: "-", 
        neptuFirstOrang: 0, 
        neptuLastOrang: 0, 
        totalNeptu: 0, 
        noPalenggahan: 0, 
        palenggahan: { surasa: "-", tegese: "-" } 
      };
    }
    let rawTempat = namaTempat.trim();
    let rawOrang = (namaOrang && namaOrang !== '-') ? namaOrang.trim() : "";

    let parseTempat = parseAksaraFromWord(rawTempat);
    let parseOrang = parseAksaraFromWord(rawOrang || "H");

    let firstCharTempat = parseTempat.firstLabel;
    let lastCharTempat = parseTempat.lastLabel;
    let aksaraFirstTempat = parseTempat.firstAksara;
    let aksaraLastTempat = parseTempat.lastAksara;

    let firstCharOrang = rawOrang ? parseOrang.firstLabel : "H";
    let lastCharOrang = rawOrang ? parseOrang.lastLabel : "H";
    let aksaraFirstOrang = rawOrang ? parseOrang.firstAksara : "HA";
    let aksaraLastOrang = rawOrang ? parseOrang.lastAksara : "HA";
    
    let lookupAksara = (typeof MASTER_AKSARA_FAAL !== 'undefined') ? MASTER_AKSARA_FAAL : (root.MASTER_AKSARA_FAAL || {});
    let neptuFirstTempat = lookupAksara[aksaraFirstTempat] || 1;
    let neptuLastTempat = lookupAksara[aksaraLastTempat] || 1;
    let neptuFirstOrang = lookupAksara[aksaraFirstOrang] || 1;
    let neptuLastOrang = lookupAksara[aksaraLastOrang] || 1;

    let totalNeptu = neptuFirstTempat + neptuLastTempat + neptuFirstOrang + neptuLastOrang;
    
    let sisa = totalNeptu % 5;
    let noPalenggahan = (sisa === 0) ? 5 : sisa;
    
    let lookupPal = (typeof MASTER_PALENGGAHAN !== 'undefined') ? MASTER_PALENGGAHAN : (root.MASTER_PALENGGAHAN || {});
    return {
      namaTempat: rawTempat,
      namaOrang: rawOrang || "-",
      firstCharTempat,
      lastCharTempat,
      aksaraFirstTempat,
      aksaraLastTempat,
      neptuFirstTempat,
      neptuLastTempat,
      firstCharOrang,
      lastCharOrang,
      aksaraFirstOrang,
      aksaraLastOrang,
      neptuFirstOrang,
      neptuLastOrang,
      totalNeptu,
      noPalenggahan,
      palenggahan: lookupPal[noPalenggahan] || { surasa: "-", tegese: "-" }
    };
  };

  /**
   * getSirikanAdhepOmah
   * Menghitung pantangan arah hadap rumah berdasarkan Neptu Weton dan Hari Lahir (Dina).
   */
  const ALL_ARAH_MATA_ANGIN = ["KULON / BARAT", "LOR / UTARA", "WETAN / TIMUR", "KIDUL / SELATAN"];

  const getSirikanAdhepOmah = function (neptu, dino) {
    let neptuNum = parseInt(neptu) || 0;
    let mapNeptu = (typeof MASTER_SIRIKAN_NEPTU !== 'undefined') ? MASTER_SIRIKAN_NEPTU : (root.MASTER_SIRIKAN_NEPTU || {});
    let mapDina = (typeof MASTER_SIRIKAN_DINA !== 'undefined') ? MASTER_SIRIKAN_DINA : (root.MASTER_SIRIKAN_DINA || {});
    
    let sirikanNeptu = mapNeptu[neptuNum] || "-";
    let cleanDino = (dino || "").trim().toLowerCase().replace(/['’]/g, '').replace('rebo', 'rabu');
    let sirikanDina = mapDina[cleanDino] || "-";

    const pantanganList = [];
    if (sirikanNeptu && sirikanNeptu !== '-') pantanganList.push(sirikanNeptu);
    if (sirikanDina && sirikanDina !== '-' && !pantanganList.includes(sirikanDina)) pantanganList.push(sirikanDina);

    const arahAmanList = ALL_ARAH_MATA_ANGIN.filter(a => !pantanganList.includes(a));
    const anjuranNeptuList = ALL_ARAH_MATA_ANGIN.filter(a => a !== sirikanNeptu);
    const anjuranDinaList = ALL_ARAH_MATA_ANGIN.filter(a => a !== sirikanDina);

    const pantanganText = pantanganList.length > 0 ? pantanganList.join(" & ") : "-";
    const arahAmanText = arahAmanList.length > 0 ? arahAmanList.join(" & ") : "Semua Arah Aman";
    
    return {
      neptu: {
        neptu: neptuNum,
        pantangan: sirikanNeptu,
        anjuran: anjuranNeptuList.join(", "),
        keterangan: `Neptu ${neptuNum} disirikan (dipantang) menghadap ${sirikanNeptu}`
      },
      dina: {
        hari: dino || "-",
        dina: dino || "-",
        pantangan: sirikanDina,
        anjuran: anjuranDinaList.join(", "),
        keterangan: `Hari ${dino} disirikan (dipantang) menghadap ${sirikanDina}`
      },
      dino: dino || "-",
      sirikanNeptu: sirikanNeptu,
      sirikanDina: sirikanDina,
      pantanganCombined: pantanganList,
      pantanganText: pantanganText,
      arahAman: arahAmanList,
      arahAmanText: arahAmanText,
      catatan: `Menurut petungan Jawa, pemilik weton ber-Neptu ${neptuNum} disirikan (dipantang) membangun atau menghadapkan pintu utama rumah ke arah ${sirikanNeptu}. Berdasarkan hari kelahiran ${dino}, pantangan arah hadap rumah adalah ke arah ${sirikanDina}. Arah utama yang aman dan dianjurkan: ${arahAmanText}.`
    };
  };

  const getPekerjaanPakarti = function (dino, pasaran) {
    if (!dino || !pasaran) return null;
    const cleanD = dino.trim().toLowerCase().replace(/['’]/g, '').replace('rebo', 'rabu');
    const cleanP = pasaran.trim().toLowerCase().replace(/['’]/g, '');

    const item = MASTER_PEKERJAAN.find(p => {
      const pD = p.dino.trim().toLowerCase().replace(/['’]/g, '').replace('rebo', 'rabu');
      const pP = p.pasaran.trim().toLowerCase().replace(/['’]/g, '');
      return pD === cleanD && pP === cleanP;
    });

    if (!item) return null;
    const rejekiKey = (item.rejeki || '').toLowerCase().trim();
    const artiRejeki = MASTER_PAKARTI_REJEKI[rejekiKey] || '-';
    const badanKey = (item.badan || '').toLowerCase().trim();
    const artiBadan = MASTER_PAKARTI_BADAN[badanKey] || getPakartiBadanArtinya(item.badan) || '-';

    return {
      dino: item.dino,
      pasaran: item.pasaran,
      pakarti_rejeki: item.rejeki,
      pakarti_badan: item.badan,
      pakaryan: item.pakaryan,
      arti_rejeki: artiRejeki,
      arti_badan: artiBadan
    };
  };

  const getWatakDina = function (dino) {
    if (!dino) return null;
    const key = dino.trim().toLowerCase().replace(/['’]/g, '').replace('rebo', 'rabu');
    const data = MASTER_DINA[key] || null;
    if (!data) return null;
    return {
      dina: data.nama_masehi,
      nama_masehi: data.nama_masehi,
      lambang: data.lambang,
      watak_utama: data.watak_utama,
      watak: data.watak_utama,
      deskripsi: data.deskripsi,
      rekomendasi_profesi: data.rekomendasi_profesi,
      profesi: data.rekomendasi_profesi
    };
  };

  const getWatakPasaran = function (pasaran) {
    if (!pasaran) return null;
    const key = pasaran.trim().toLowerCase().replace(/['’]/g, '');
    const data = MASTER_PASARAN[key] || null;
    if (!data) return null;
    return {
      pasaran: data.nama_pasaran,
      nama_pasaran: data.nama_pasaran,
      lambang: data.lambang,
      watak_utama: data.watak_utama,
      watak: data.watak_utama,
      deskripsi: data.deskripsi,
      catatan_rejeki_nasib: data.catatan_rejeki_nasib,
      rejeki: data.catatan_rejeki_nasib
    };
  };

  // Bind ke global root / window
  root.MASTER_KARAKTER_DASAR = MASTER_KARAKTER_DASAR;
  root.MASTER_DINA = MASTER_DINA;
  root.MASTER_PASARAN = MASTER_PASARAN;
  root.MASTER_SIRIKAN_NEPTU = MASTER_SIRIKAN_NEPTU;
  root.MASTER_SIRIKAN_DINA = MASTER_SIRIKAN_DINA;
  root.LIST_AKSARA_CARAKAN = LIST_AKSARA_CARAKAN;
  root.MASTER_AKSARA_FAAL = MASTER_AKSARA_FAAL;
  root.MASTER_PALENGGAHAN = MASTER_PALENGGAHAN;
  root.MASTER_PEKERJAAN = MASTER_PEKERJAAN;
  root.MASTER_PAKARTI_REJEKI = MASTER_PAKARTI_REJEKI;
  root.MASTER_PAKARTI_BADAN = MASTER_PAKARTI_BADAN;

  root.hitungKarakterDasar = hitungKarakterDasar;
  root.getPakartiBadanArtinya = getPakartiBadanArtinya;
  root.getAksaraFromChar = getAksaraFromChar;
  root.parseAksaraFromWord = parseAksaraFromWord;
  root.analisisPalenggahan = analisisPalenggahan;
  root.getSirikanAdhepOmah = getSirikanAdhepOmah;
  root.getPekerjaanPakarti = getPekerjaanPakarti;
  root.getWatakDina = getWatakDina;
  root.getWatakPasaran = getWatakPasaran;

  // Node.js CommonJS export support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      MASTER_KARAKTER_DASAR,
      MASTER_DINA,
      MASTER_PASARAN,
      MASTER_SIRIKAN_NEPTU,
      MASTER_SIRIKAN_DINA,
      LIST_AKSARA_CARAKAN,
      MASTER_AKSARA_FAAL,
      MASTER_PALENGGAHAN,
      MASTER_PEKERJAAN,
      MASTER_PAKARTI_REJEKI,
      MASTER_PAKARTI_BADAN,
      hitungKarakterDasar,
      getPakartiBadanArtinya,
      getAksaraFromChar,
      parseAksaraFromWord,
      analisisPalenggahan,
      getSirikanAdhepOmah,
      getPekerjaanPakarti,
      getWatakDina,
      getWatakPasaran
    };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
