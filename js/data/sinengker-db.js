/**
 * Jagad Jawa — Database Pustaka Sinengker Khusus
 * Memuat naskah sakral, kawruh batin, ajaran rahasia, ubarampe pager gaib,
 * mantra wingit, dan Petung Kompas Danyang.
 * Sumber: database_sinengker_khusus.json
 */

export const SINENGKER_DATA = {
  meta: {
    nama: "Pustaka Sinengker Khusus Jagad Jawa",
    status: "Sinengker / Sakral",
    versi: "1.0.0",
    sumber: "database_sinengker_khusus.json"
  },
  petung_kompas_danyang: {
    judul: "PETUNG KOMPAS DANYANG",
    deskripsi: "Panduan arah mata angin dan aksara Jawa dalam kompas spiritual Danyang desa/kelurahan.",
    gambar_aset: "assets/kompas_danyang.jpg",
    arah_utama: {
      lor: ["THA", "NGA", "GA", "BA"],
      wetan: ["HA", "NA", "CA", "RA", "KA", "DA"],
      kidul: ["TA", "SA", "WA", "LA"],
      kulon: ["PA", "DHA", "JA", "YA", "NYA", "MA"]
    },
    detail_arah: {
      lor: {
        nama_jawa: "Lor",
        nama_id: "Utara",
        simbol: "U",
        derajat: 0,
        aksara: ["THA", "NGA", "GA", "BA"],
        aksara_display: "Tha, Nga, Ga, Ba (lan aksara swara A, I, U, E, O)",
        sifat: "Kasantosan, Kateguhan, lan Kasedan Jati",
        danyang_pitedah: "Wewengkon ingkang kapayungan dening Danyang Arah Lor gadhah hawa adhem, mantep, lan santosa. Prayogi kangge laku tirakat, ngudi kawruh batin, sarta nyenyuwun ketenteraman kaluwarga.",
        sesaji_ubarampe: "Sekar setaman telon, jenang petak (putih), toya wening, lan kemenyan madu."
      },
      wetan: {
        nama_jawa: "Wetan",
        nama_id: "Timur",
        simbol: "T",
        derajat: 90,
        aksara: ["HA", "NA", "CA", "RA", "KA", "DA"],
        aksara_display: "Ha, Na, Ca, Ra, Ka, Da",
        sifat: "Wiwitan, Pepadhang, Kawelasan, lan Kamulyan",
        danyang_pitedah: "Wewengkon ingkang kapayungan dening Danyang Arah Wetan dados sumber pepadhang, pambuka rejeki, lan paseduluran luhur. Prayogi kangge miwiti usaha, pambangunan griya anyar, lan pambuka dalan gesang.",
        sesaji_ubarampe: "Jenang abrit-petak, sekar boreh wangi, dupa arum, lan godhong suruh temu rose."
      },
      kidul: {
        nama_jawa: "Kidul",
        nama_id: "Selatan",
        simbol: "S",
        derajat: 180,
        aksara: ["TA", "SA", "WA", "LA"],
        aksara_display: "Ta, Sa, Wa, La",
        sifat: "Kakuwatan Samodra, Kawicaksanan, lan Kamakmuran",
        danyang_pitedah: "Wewengkon ingkang kapayungan dening Danyang Arah Kidul ngemot kakuwatan toya agung samodra, lambang kamakmuran lan keluberan rejeki. Prayogi kangge dagang ageng, tetanen lebet, lan njagi kawilujengan.",
        sesaji_ubarampe: "Ketan kolak kencana, gedhang raja satangkep, sekar mlathi, lan wedang kopi pait."
      },
      kulon: {
        nama_jawa: "Kulon",
        nama_id: "Barat",
        simbol: "B",
        derajat: 270,
        aksara: ["PA", "DHA", "JA", "YA", "NYA", "MA"],
        aksara_display: "Pa, Dha, Ja, Ya, Nya, Ma",
        sifat: "Kawiryan, Panguwasa, Panutuping Sengkala, lan Kasantikan",
        danyang_pitedah: "Wewengkon ingkang kapayungan dening Danyang Arah Kulon mranani ing babagan kawiryan, pangreksa saking sambikala, lan kadigdayan batin. Prayogi kangge pager pekarangan lan ngicali sambikala.",
        sesaji_ubarampe: "Jenang abang gurih, rujak degan kelapa ijo, kembang kantil kuning, lan lawe wenang."
      }
    },
    peta_aksara_derajat: [
    {
        urutan: 1,
        aksara: "THA",
        aksara_jawa: "ꦛ",
        sudut: 9,
        arah_sektor: "lor",
        arah_sektor_jawa: "Lor",
        arah_mata_angin: "Utara-Menimur Laut (NNE)",
        arah_mata_angin_jawa: "Lor-Wetan",
        watak_spiritual: "Tamba Kasarasan, Panguripan Sejati, lan Kasantosan Lahir Batin (Thukul wiji kasarasan). Ngusadani lelara lan nukulaken daya urip anyar.",
        danyang_pitedah: "Wewengkon Danyang THA gadhah hawa tamba/usada ingkang kiyat sanget. Prayogi kagem papan usada tradisional, klinik herbal, sarta tirakat nyuwun kasarasan lahir batin.",
        sesaji_ubarampe: "Godhong sirih temu rose, beras kencur, jenang abrit-petak, sekar telon, lan toya sendang."
    },
    {
        urutan: 2,
        aksara: "NGA",
        aksara_jawa: "ꦔ",
        sudut: 27,
        arah_sektor: "lor",
        arah_sektor_jawa: "Lor",
        arah_mata_angin: "Timur Laut (TL)",
        arah_mata_angin_jawa: "Lor-Wetan",
        watak_spiritual: "Kasampurnan Batin, Pangruwatan Sukerta, lan Paring Dalan Padhang (Ngarah ing kasampurnan jati). Panutuping carakan ingkang ngruwat rubeda dadi begja.",
        danyang_pitedah: "Danyang NGA kapatah ngruwat sambikala lan rubeda dados pepadhang mulya. Wewengkon punika prayogi sanget kagem ruwatan desa, pagelaran wayang purwa, lan sedekah bumi.",
        sesaji_ubarampe: "Jenang sengkala (abang-putih), tumpeng robyong alit, sekar setaman pitu werna, toya tempuran, lan dupa harum."
    },
    {
        urutan: 3,
        aksara: "HA",
        aksara_jawa: "ꦲ",
        sudut: 45,
        arah_sektor: "wetan",
        arah_sektor_jawa: "Wetan",
        arah_mata_angin: "Timur Laut (TL)",
        arah_mata_angin_jawa: "Lor-Wetan",
        watak_spiritual: "Kasantosan, Kateguhan Batin, lan Panguripan Anyar (Hana huruping urip). Titik wiwitan pepadhang lan pangayoman sejati saking sambikala.",
        danyang_pitedah: "Wewengkon ingkang kapayungan dening Danyang Arah HA gadhah hawa adhem, mantep, lan santosa. Prayogi kagem wiwitan laku spiritual, ngudi kawruh batin, sarta nyenyuwun ketenteraman kaluwarga.",
        sesaji_ubarampe: "Sekar setaman telon, jenang petak (putih), toya wening, lan kemenyan madu."
    },
    {
        urutan: 4,
        aksara: "NA",
        aksara_jawa: "ꦤ",
        sudut: 63,
        arah_sektor: "wetan",
        arah_sektor_jawa: "Wetan",
        arah_mata_angin: "Timur-Timur Laut (ENE)",
        arah_mata_angin_jawa: "Wetan-Lor",
        watak_spiritual: "Keluhuran Budi, Wiwitaning Becik, lan Karukunan Paseduluran (Niat ingsun madeg prayoga). Pambuka rejeki lan paseduluran luhur.",
        danyang_pitedah: "Wewengkon kapayungan Danyang NA minangka sumber pepadhang, pambuka rejeki enggal, lan katentreman warga. Prayogi kagem miwiti usaha lan pambangunan griya.",
        sesaji_ubarampe: "Jenang abrit-petak, sekar boreh wangi, dupa arum, lan suruh temu rose."
    },
    {
        urutan: 5,
        aksara: "CA",
        aksara_jawa: "ꦕ",
        sudut: 81,
        arah_sektor: "wetan",
        arah_sektor_jawa: "Wetan",
        arah_mata_angin: "Timur (Wetan)",
        arah_mata_angin_jawa: "Wetan",
        watak_spiritual: "Cipta Wening, Kawicaksanan Intelektual, lan Padhang Pikiran (Cipta hening pepadhang sukma). Sumber daya pamikir lan kasantikan cipta.",
        danyang_pitedah: "Wewengkon ingkang kapayungan Danyang CA ngreksa kapinteran, paguron, lan kreativitas warga. Prayogi kagem papan pasinaon, karya sastra, lan pambuka wawasan luhur.",
        sesaji_ubarampe: "Jenang abrit, toya wening kemlandhingan, kembang melathi, lan menyan madu."
    },
    {
        urutan: 6,
        aksara: "RA",
        aksara_jawa: "ꦫ",
        sudut: 99,
        arah_sektor: "wetan",
        arah_sektor_jawa: "Wetan",
        arah_mata_angin: "Timur-Menenggara (ESE)",
        arah_mata_angin_jawa: "Wetan-Kidul",
        watak_spiritual: "Rasa Sejati, Pangayoman Batin, lan Kamulyan Gesang (Rasa sejati kahanan mulya). Ngraketaken karukunan lan kemakmuran trah.",
        danyang_pitedah: "Wewengkon Danyang RA mujudaken tlatah ingkang kebak welas asih lan kakuwatan paseduluran. Prayogi kagem kagiatan sosial, tetanen, lan njagi kawilujengan bebarengan.",
        sesaji_ubarampe: "Sekar setaman telon, jenang abrit gurih, godhong dadap srep, lan dupa wangi."
    },
    {
        urutan: 7,
        aksara: "KA",
        aksara_jawa: "ꦏ",
        sudut: 117,
        arah_sektor: "wetan",
        arah_sektor_jawa: "Wetan",
        arah_mata_angin: "Tenggara (Wetan-Kidul)",
        arah_mata_angin_jawa: "Wetan-Kidul",
        watak_spiritual: "Karsaning Hyang Widhi, Pambuka Rejeki, lan Kamakmuran Tani/Dagang (Karya raharja murakabi). Kekuwatan tumindak nyata lan asil pakaryan.",
        danyang_pitedah: "Tlatah kapayungan Danyang KA mranani sanget kagem pusat dedagangan, tetanen, lan industri rakyat. Rejeki mili lancar linambaran manah tulus lan sregep makarya.",
        sesaji_ubarampe: "Jenang panca warna, gedhang raja satangkep, beras kuning, lan menyan wangi."
    },
    {
        urutan: 8,
        aksara: "DA",
        aksara_jawa: "ꦢ",
        sudut: 135,
        arah_sektor: "wetan",
        arah_sektor_jawa: "Wetan",
        arah_mata_angin: "Tenggara (TG)",
        arah_mata_angin_jawa: "Wetan-Kidul",
        watak_spiritual: "Ayem Tentrem, Panglarisan Dedagangan, lan Katentreman Batih (Dhedhep ayem tentrem). Nukulaken asil bumi lan paseduluran dagang.",
        danyang_pitedah: "Wewengkon Danyang DA paring hawa sejuk kagem gesang bebrayan. Prayogi kagem pasar, pomahan batih, sarta toko ingkang ngudi rejeki halal lan barokah.",
        sesaji_ubarampe: "Sega golong lulut, jenang petak, kembang boreh wangi, lan toya degan ijo."
    },
    {
        urutan: 9,
        aksara: "TA",
        aksara_jawa: "ꦠ",
        sudut: 153,
        arah_sektor: "kidul",
        arah_sektor_jawa: "Kidul",
        arah_mata_angin: "Selatan-Menenggara (SSE)",
        arah_mata_angin_jawa: "Kidul-Wetan",
        watak_spiritual: "Kateguhan Jiwa, Panyirna Pepalang, lan Ketegaran Nglampahi Pagesangan (Tatas tatag tutug). Nyawijekaken tekad lan kakuwatan ngadhepi pacoban.",
        danyang_pitedah: "Wewengkon Danyang TA maringi panguwasa batin kagem warga supados tabah, ulet, lan kuwat ngadhepi jaman owah-owahan. Prayogi kagem padhepokan bela dhiri lan laku prihatin.",
        sesaji_ubarampe: "Ketan ireng, jenang abrit, godhong suruh ayu, lan dupa gaharu."
    },
    {
        urutan: 10,
        aksara: "SA",
        aksara_jawa: "ꦱ",
        sudut: 171,
        arah_sektor: "kidul",
        arah_sektor_jawa: "Kidul",
        arah_mata_angin: "Selatan (Kidul)",
        arah_mata_angin_jawa: "Kidul",
        watak_spiritual: "Pengasihan Luhur, Daya Pangaribawa Asih, lan Kaselarasan Batin (Sifat welas asih mring sesama). Kakuwatan asih ingkang nglebur cecongkrahan.",
        danyang_pitedah: "Danyang SA nyiram katresnan lan paseduluran ing satengahing warga. Panggenan ingkang sae sanget kagem rembug desa, bale paguyuban, lan kerukunan warga.",
        sesaji_ubarampe: "Sekar mlathi kanthil, wedang kopi manis, ketan kolak, lan jenang petak."
    },
    {
        urutan: 11,
        aksara: "WA",
        aksara_jawa: "ꦮ",
        sudut: 189,
        arah_sektor: "kidul",
        arah_sektor_jawa: "Kidul",
        arah_mata_angin: "Selatan-Membarat Daya (SSW)",
        arah_mata_angin_jawa: "Kidul-Kulon",
        watak_spiritual: "Kawaspadan Gaib, Panangkal Bebaya, lan Katentreman Pekarangan (Waspada ing pandom gesang). Pangreksa saking sambikala lan daya negatif.",
        danyang_pitedah: "Tlatah kapayungan Danyang WA gadhah binar kawaspadan ingkang inggil. Prayogi kagem pager omah, njagi lumbung pangan, lan katentreman lingkungan.",
        sesaji_ubarampe: "Jenang abrit-petak, rujak degan, lawe wenang putih, lan godhong senthe."
    },
    {
        urutan: 12,
        aksara: "LA",
        aksara_jawa: "ꦭ",
        sudut: 207,
        arah_sektor: "kidul",
        arah_sektor_jawa: "Kidul",
        arah_mata_angin: "Barat Daya (BD)",
        arah_mata_angin_jawa: "Kidul-Kulon",
        watak_spiritual: "Kakuwatan Samodra Rejeki, Kamardikan Manah, lan Keluberan Kasarasan (Lir gumantung lakuning hyang). Jembaring rejeki kados toya samodra.",
        danyang_pitedah: "Wewengkon Danyang LA ngemot kakuwatan toya murni samodra kidul, lambang rejeki agung lan kesabaran. Prayogi kagem kolam tirta, tetanen lebet, lan usaha banyu.",
        sesaji_ubarampe: "Ketan salak, sekar setaman, gedhang emas satangkep, lan wedang jahe anget."
    },
    {
        urutan: 13,
        aksara: "PA",
        aksara_jawa: "ꦥ",
        sudut: 225,
        arah_sektor: "kulon",
        arah_sektor_jawa: "Kulon",
        arah_mata_angin: "Barat Daya (BD)",
        arah_mata_angin_jawa: "Kidul-Kulon",
        watak_spiritual: "Derajat Pangkat, Kadigdayan Martabat, lan Kasembadan Karsa (Papan pangudi kamulyan). Paring prabawa panguwasa lan kaluhuran asma.",
        danyang_pitedah: "Danyang PA maringi daya pangaribawa ageng tumrap para pamimpin lan sesepuh. Prayogi kagem kantor pamerintahan, bale kelurahan, lan tata praja.",
        sesaji_ubarampe: "Sega tumpeng alit, ayam kampung ingkung, sekar boreh, lan menyan madu."
    },
    {
        urutan: 14,
        aksara: "DHA",
        aksara_jawa: "ꦝ",
        sudut: 243,
        arah_sektor: "kulon",
        arah_sektor_jawa: "Kulon",
        arah_mata_angin: "Barat-Membarat Daya (WSW)",
        arah_mata_angin_jawa: "Kulon-Kidul",
        watak_spiritual: "Panulak Balak, Kasabaran Ageng, lan Panutup Sambikala (Dhadhap sanyata linambaran sabar). Kasantikan gaib kagem nglebur guna-guna lan lelara.",
        danyang_pitedah: "Tlatah kapayungan Danyang DHA asring dados benteng gaib wewengkon saking serbuan mara bahaya. Prayogi kagem tirakat panolak balak lan tamba lara.",
        sesaji_ubarampe: "Godhong dhadhap serep, jenang abang gurih, toya petak, lan lawe setundhun."
    },
    {
        urutan: 15,
        aksara: "JA",
        aksara_jawa: "ꦗ",
        sudut: 261,
        arah_sektor: "kulon",
        arah_sektor_jawa: "Kulon",
        arah_mata_angin: "Barat (Kulon)",
        arah_mata_angin_jawa: "Kulon",
        watak_spiritual: "Kawiryan Luhur, Wibawa Pangreh Praja, lan Kaadilan Sejati (Jumeneng ing sajroning adil). Nuntun marang kabeneran hukum lan paugeran praja.",
        danyang_pitedah: "Danyang JA ngayomi pranatan desa supados tansah adil, tentrem, lan mboten wonten crah congkrah. Prayogi kagem musyawarah warga lan penegakan adil.",
        sesaji_ubarampe: "Jenang abrit-petak, sekar kantil kuning, rokok klobot, lan dupa arum."
    },
    {
        urutan: 16,
        aksara: "YA",
        aksara_jawa: "ꦪ",
        sudut: 279,
        arah_sektor: "kulon",
        arah_sektor_jawa: "Kulon",
        arah_mata_angin: "Barat-Membarat Laut (WNW)",
        arah_mata_angin_jawa: "Kulon-Lor",
        watak_spiritual: "Pangreksa Gaib Kulon, Keheningan Tirakat, lan Pager Kawilujengan (Yekti ayom ayem kapayungan). Njagi pekarangan saking daya peteng.",
        danyang_pitedah: "Wewengkon kapayungan Danyang YA sae sanget kagem pager gaib pekarangan lan ngicali sengkala kiriman. Hawanipun wingit nanging maringi perlindungan sentosa.",
        sesaji_ubarampe: "Kembang setaman, toya sumur pitu, jenang mancawarna, lan menyan madu."
    },
    {
        urutan: 17,
        aksara: "NYA",
        aksara_jawa: "ꦚ",
        sudut: 297,
        arah_sektor: "kulon",
        arah_sektor_jawa: "Kulon",
        arah_mata_angin: "Barat Laut (BL)",
        arah_mata_angin_jawa: "Kulon-Lor",
        watak_spiritual: "Kasantikan Panunggalan, Daya Panglebur Fitnah, lan Kateguhan Tekad (Nyawiji ing ngarsa Gusti). Nyawijekaken tekad paseduluran lahir batin.",
        danyang_pitedah: "Danyang NYA paring pepadhang dhumateng manah ingkang bingung, nglebur fitnah lan kabar dora ing wewengkon. Prayogi kagem padhepokan paseduluran.",
        sesaji_ubarampe: "Jenang petak, toya kelapa ijo, sekar melathi roncean, lan dupa wangi."
    },
    {
        urutan: 18,
        aksara: "MA",
        aksara_jawa: "ꦩ",
        sudut: 315,
        arah_sektor: "kulon",
        arah_sektor_jawa: "Kulon",
        arah_mata_angin: "Barat Laut (BL)",
        arah_mata_angin_jawa: "Kulon-Lor",
        watak_spiritual: "Kasudiran Jiwa, Daya Pangaribawa Mantep, lan Karaharjan Padunungan (Madhep mantep ing budi luhur). Mantep ing panggayuh lan teguh panemu.",
        danyang_pitedah: "Tlatah kapayungan Danyang MA maringi kateguhan tumrap warga ingkang ngupadi kasuksesan. Mboten gampil goyah dening rubeda lan panggodha.",
        sesaji_ubarampe: "Ketan bumbu, pisang raja satangkep, sekar setaman, lan toya wening."
    },
    {
        urutan: 19,
        aksara: "GA",
        aksara_jawa: "ꦒ",
        sudut: 333,
        arah_sektor: "lor",
        arah_sektor_jawa: "Lor",
        arah_mata_angin: "Utara-Membarat Laut (NNW)",
        arah_mata_angin_jawa: "Lor-Kulon",
        watak_spiritual: "Pangayoman Danyang Sepuh, Kasuksesan Usaha Ageng, lan Kasembadan Niat (Gayuh kamulyan jati). Titik puncak kawiryan lan kamulyan usaha ageng.",
        danyang_pitedah: "Wewengkon kapayungan Danyang GA (kados tlatah Gatak, Gondang, Gamping) dipun-reksa dening Danyang Sepuh ingkang gadhah daya pangaribawa wibawa ageng. Prayogi sanget kagem industri ageng, perdagangan agung, lan pambangunan sentra ekonomi ingkang mapan.",
        sesaji_ubarampe: "Jenang abrit gurih, tumpeng megono alit, kembang kantil kuning, kemenyan wangi, lan rujak degan kelapa ijo."
    },
    {
        urutan: 20,
        aksara: "BA",
        aksara_jawa: "ꦧ",
        sudut: 351,
        arah_sektor: "lor",
        arah_sektor_jawa: "Lor",
        arah_mata_angin: "Utara (Lor)",
        arah_mata_angin_jawa: "Lor",
        watak_spiritual: "Guyub Rukun, Kelimpahan Sandhang Pangan, lan Keteguhan Paguyuban (Babaring tentrem kaluwarga). Paseduluran raket lan lumintu rejeki pangan.",
        danyang_pitedah: "Danyang BA maringi berkah katentreman lumbung pangan kaluwarga. Tlatah punika sae sanget kagem lumbung pari, peternakan, lan padunungan kaluwarga ageng.",
        sesaji_ubarampe: "Sega wuduk uduk, jenang petak gurih, toya kendhi wening, lan kemenyan madu."
    }
]
  },
  mendhem_ari_ari: {
    judul: "MENDHEM ARI-ARI",
    deskripsi: "Tata cara lan ubarampe (sesaji/perlengkapan) penanganan lan pependheming ari-ari (plasenta bayi).",
    perlengkapan_ubarampe: [
      "Kendhil anyar (pot tanah liat baru)",
      "Godhong senthe (sebagai alas)",
      "Kembang boreh (kembang setaman + pandan)",
      "Lenga wangi",
      "Welat kunir (bambu/kunyit pengiris)",
      "Uyah grasak (garam kasar)",
      "Dom bolah (jarum & benang)",
      "Gereh pethek (ikan asin pethek)",
      "Gantal konyeh (suruh kinang komplit)",
      "Kemiri gepak jendhul (kemiri utuh)",
      "Tulisan Jawa, Arab, Latin, dan angka 1 s/d 10",
      "Duwit receh logam"
    ],
    tata_cara: "Kendhil ditutupi lemper anyar, banjur dibungkus mori putih anyar. Lumrahe dipendhem ing luwangan dening bapakne si bayi piyambak kanthi ngagem busana ingkang pantes lan resik. Saben dina weton si jabang bayi, pusara ari-ari dipunparingi sekar setaman telon minangka tandha pakurmatan marang sedulur papat kalima pancer."
  },
  ubarampe_pager: {
    judul: "UBARAMPE PAGER (PAGAR GAIB PEKARANGAN)",
    deskripsi: "Perlengkapan ubarampe pager pangreksa gaib kanggo Bumi lan Gandhul/Omah.",
    pager_bumi: [
      "Welat (pring wulung) – Empu Kunir",
      "Cula / Ciung Warak",
      "Jenang Sente",
      "Ringin Sungsang",
      "Alang – Alang",
      "Janur Kuning",
      "Sada Aren (lidi aren)",
      "Duwit Logam Rp. 100 / Gunungan",
      "Godhong Opo – Opo"
    ],
    pager_gandhul_omah: [
      "Welat (pring wulung) – Empu Kunir",
      "Cula / Ciung Warak",
      "Kluwih – Godhonge",
      "Ringin Sungsang",
      "Alang – Alang",
      "Godhong Opo – Opo",
      "Janur Kuning Kupat Luar"
    ],
    pantek_pager: [
      { kayu: "Jati", jumlah: 1, makna: "Kukuh lan sayektos ngadeg ing kaleresan" },
      { kayu: "Dhadhap Serep", jumlah: 2, makna: "Nyerepke panas lan memitran tentrem" },
      { kayu: "Awar – Awar", jumlah: 3, makna: "Nawarake hawa panas sarta guna-guna" },
      { kayu: "Waru", jumlah: 4, makna: "Ngayomi lan ngayemi saisen-isening griya" },
      { elemen: "Duwit Logam Gunungan", makna: "Tandha kuncaraning kamulyan lan panyuwunan slamet" }
    ]
  },
  ajaran_asenggama_sastra_jendra: {
    judul: "AJARAN ASENGGAMA & SASTRA JENDRA",
    deskripsi: "Wektu larangan lan wektu ingkang prayogi kangge sambang lulut (hubungan suami istri), sarta Mantra Saresmi Sejati.",
    waktu_larangan_asenggama: [
      { waktu: "Pas Awan (Tengah Hari)", akibat: "Awon (Buruk)" },
      { waktu: "Minggu Dan Malam Senin", akibat: "Pandurjana Larenipun" },
      { waktu: "Rabu Dan Malam Kamis", akibat: "Bocah Cilaka" },
      { waktu: "Waktu Fajar", akibat: "Tuna Liwat Watakneki" },
      { waktu: "Malam Hari Besar", akibat: "Juru Teluh, Duraka Baba Bibi, Siwil Adatipun, Adoh Begjanira" },
      { waktu: "Saat Hamil", akibat: "Duwe Lara Beser" },
      { waktu: "Sabtu Dan Malam Minggu", akibat: "Bilahine Alite Kalebeng Toya" },
      { waktu: "Sambi Rerasan Tan Becik", akibat: "Mapan Bisu" },
      { waktu: "Neng Ngisor Wit-Witan", akibat: "Panggaweyane Niaya" },
      { waktu: "Malem Barahat Tan Becik", akibat: "Anandhang Lara" },
      { waktu: "Ana Ing Panginepan", akibat: "Abanget Cilakanira" },
      { waktu: "Anuju Kel Ing Pawestri", akibat: "Budug Adate Kang Sakit" },
      { waktu: "Sabtu Legi", akibat: "Awon" },
      { waktu: "Wong Wadon Lagi Tarab", akibat: "Awon" },
      { waktu: "Jumat Tali Wangke", akibat: "Awon" }
    ],
    waktu_senggama_yang_baik: [
      { waktu: "Malem Selasa", manfaat: "Akeh Kang Tresna" },
      { waktu: "Malem Kemis", manfaat: "Akeh Begjani Reki" },
      { waktu: "Malem Jumat Sadurunge Lingsir", manfaat: "Sugih" }
    ],
    mantra_saresmi_sejati: {
      sumber: "Buku Wejangan Wali Sanga",
      sebelum_berhubungan: [
        "Mengheningkan cipta ~1 menit membersihkan angan, lalu baca dalam hati:",
        "Bismillahirrohmanirrohiim",
        "Niat ingsun unggah ing girikumala",
        "Angengakake lawang kencana",
        "Tinampan mBok Fatimah",
        "Hu Allah (3x)"
      ],
      saat_proses: [
        "Berhenti sejenak, lalu lanjutkan:",
        "Aku lanang sajati anurunake rasa,",
        "Tumika bumi rachmatullah, kang linuku racuk garu",
        "Kang ginaru racuk luku tukul ing krakatullah",
        "Kang sinung kanugrahane Allah",
        "Hu Allah (3x)"
      ],
      setelah_selesai: [
        "Bismillah niat ingsun mudun saka giri kumala,",
        "Anginepake lawang kencana, Atas Gusti Kang Agung",
        "Hu Allah (3x)"
      ]
    }
  },
  ajaran_bodro_sampir: {
    judul: "AJARAN BODRO SAMPIR",
    deskripsi: "Ilmu batin lan penyelarasan Dzat Gusti kang asipat Langgeng.",
    mantra: [
      "Sakaliring Cahyo kabeh pada kalimputan dening Dzat Ingsun",
      "Iya Ingsun Dzating Gusti kang asipat Esa",
      "Iya Ingsun Dzating Gusti kang Maha Suci asipat Langgeng",
      "Iya Ingsun Dzating Gusti kang Maha Luhur",
      "Jumeneng Ratu Agung kang Murba Amisesa",
      "Kang Kuwasa Ngracut Jisim Ingsun, Anarik Yoga Ingsun",
      "Angukut Jagat Ingsun, Ambabar Turas Ingsun",
      "Amasang Pangawikan Maring Titah Ingsun",
      "Amasang Kamayan Maring Makluk Ingsun",
      "Kabeh pada sampurna saka Kodrat Ingsun",
      "Hu Allah Hu Allah Hu Allah"
    ],
    catatan: "Didoakan dalam 1x tarikan nafas kanthi tumata lan weninging manah."
  },
  ajaran_kasedan_jati: {
    judul: "KASEDAN JATI",
    deskripsi: "Elmu kesedan sejati, manunggaling kawula Gusti, kasampurnan sangkan paraning dumadi.",
    paragraf_ajaran: [
      "Ingsun Dzating Gusti kang Asifat Esa, angliputi ing kawulaningsun tunggal dadi sakahanan sampurna, saka ing kodratingsun.",
      "Ingsun Dzating Gusti kang Suci Asifat Langgeng, kang amurba amisesa kang kawasa, kang sampurna nirmala waluya ing jatiningsun, saka ing kodratingsun.",
      "Ingsun Dzat Kang Maha Luhur Jumeneng Ratu Agung, kang amisesa kang kawasa, andadeake ing karaton ing kang Agung kang maha mulya, Ingsun wengku sampurna sakapraboningsun, sangkep saisen – isening karatoningsun, pepak sabalaningsun kabeh ora ono kang kekurangan, byar gumelar dadi sak ciptaningsun, ana sak sedyaningsun, teka sakarsa – karsaningsun kabeh, saka ing kodratingsun.",
      "Jisimingsun kang kari ana ing alam donya, yen wis ana ing jaman karamat kang maha mulya, wulu kulit daging getih balung sungsum sapanuggalane kabeh, asale saka cahya muliha maring cahya, sampurna bali marang Ingsun maneh, saka ing kodratingsun.",
      "Yoganingsun sapanduwur sapangisor kabeh, kang pada mulih ing jaman karamating alame dewe – dewe pada suci mulya sampurna kaya Ingsun, saka ing kodratingsun.",
      "Ingsun andadekake alam donya saisen – isene kabeh iki, yes wis tutug ing wewangene, Ingsun kukud mulih mulya sampurna dadi sawija kalawan kahaningsung maneh, saka ing kodratingsun.",
      "Turasingsun kang maksih pada kari ana ing alam donya kabeh, pada nemuo suka bungah sugih singgih aja ana kang kekurangan",
      "Sakehing titahingsun kabeh, kang pada andulu kang pada karungu pada asih welasa marang Ingsun, saka ing kodratingsun.",
      "Sakehing maklukingsun kabeh, kang ora ngendahake maringsun, pada kaprabawa ing kamayan, saka ing kodratingsun.",
      "Hu Allah Hu Allah Hu Allah"
    ],
    catatan: "Didoakan selaras kanthi tarik hembus nafas per paragraf."
  },
  ajaran_roso_sejati: {
    judul: "AJARAN ROSO SEJATI & SARANA PRAKTIS",
    deskripsi: "Kumpulan ajaran roso sejati, semedi, pengasihan, tolak bala, pelaris, lan sarana panyuwunan hajat.",
    gandhewo: {
      bait: [
        "Ono roso mangan cahyo",
        "Ono cahyo mangan roso",
        "Roso rasaning Allah",
        "Cahyo cahyaning Allah",
        "Menungso sakdremo nglakoning pakoning Allah"
      ],
      doa: "Bisemillah Nirohman Nirohim\nLaillah anta subaha naka ini untum minal dolimin",
      amalan: {
        panyuwunan: "72x",
        tetombo: "3x"
      }
    },
    semedi_panetepan: {
      deskripsi: "Kepercayaan Marang Gusti Kang Maha Kuwasa",
      bacaan_1: "DOTHO GOBOSO KOJODOLO HOJODO JODO HONOTHO POHOLOKO DHOKO JOYONYOYO KOJODOLO HOJODO SOJODO GOYOKOJO GOTHO NGOYOJO",
      bacaan_2: "DOTHO GOBOSO KOJODOLO HOJODO DHOYOTOYO GOTHO BOWOSO"
    },
    semedi_nyampurnake_wujud: {
      deskripsi: "Nalika Ingsun Mampan Ing Bumi Suci",
      bacaan: [
        "DOTHO GOBOSO KOJODOLO HOJODO",
        "NYOHOMONG KOJODO",
        "LOKOGOKO DHONYOTHO MONGJOHOJO",
        "DHOHOMONG HOJODO",
        "THOROWOTHO BOSOJODO",
        "SOJODO GOYOKOJO",
        "KOJODOLO HOJODO DHOYOTOYO",
        "GOTHO BOWOSO",
        "YOHO DOTHOGOBOSO",
        "YOHO JOBOROLO",
        "YOHO MOKOHOLO",
        "YOHO HOSOROPOLO",
        "YOHO HOJOROLO",
        "YOHO SOJODO GOYOKOJO",
        "GOKOROWOHO BOSOJOKO",
        "DHOHOJOTHO JODOGOYO"
      ]
    },
    sarana_praktis: {
      kanggo_dodolan: "Banyu soko sendang wali lan sapiturute ing Pringgondani kanggo mususi beras lan banjur disiramake ono ing pekarangan sarto nggabur doro putih sak jodo.",
      kanggo_pelarisan: [
        "Versi 1: Beras kuning, dlingo bengle lan dhele putih",
        "Versi 2: Beras kuning, dlingo bengle, dhele putih, kulit nongko, jungkat sak rambute, koco pengilon"
      ],
      kanggo_tolak_udan: "Sate debok diiris kotak-kotak karo trasi, brambang, lombok digandheng, di dokok ing sak dhuwure omah/gendheng.",
      kanggo_srono_wong_duwe_gawe: "Kacang ijo di gepuk lembut dicampurke gula pasir lan beras",
      arume_panggondo_jisim: "Sabda Angin, tansyah murbo wisesa, syah ganda kari rasa, badanku Arum, selehku Arum, rak lap tan ana karasa, dong-ginendong saking kersaning Gusti Kang Murbehing Dumadi.",
      pengasihan_lian_bangsa: "Ya mubya yamubyati (diwoco 3x)",
      numpak_kendaraan: {
        darat: "Roh rogo kreto jiwo sukma kang nglakokake",
        banyu: "Ya mareha wa mursaha (diwoco 3x)"
      },
      dongo_nenandur: "Kaki Longok, Nini Thengok, Songgo Buwana, Lang – Lang Buwana, Sekar Buwana"
    },
    mantra_pangedepaning_lelembut: [
      "Bisemillah Nirohman Nirohim",
      "Allahuma bahung kulon, malaikat satur punjul papat kang rumekso ing awakku, ing anakku, ing rakyatku kabeh",
      "Allahuma bahung wetan, malaikat satus punjul papat kang rumekso ing awakku, ing anakku, ing rakyatku kabeh",
      "Allahuma bahung kidul, malaikat satus punjul papat kang rumekso ing awakku, ing anakku, ing rakyatku kabeh",
      "Allahuma bahung elor, malaikat satus punjul papat kang rumekso ing awakku, ing anakku, ing rakyatku kabeh",
      "Allahuma bahung ngisor, malaikat satus punjul papat kang rumeksa ing awakku, ing anakku ing rakyatku kabeh",
      "Allahuma bahung dhuwur malaikat satus punjul papat kang rumeksa ing awakku lan mayungi ing awakku, ing anakku ing rakyatku kabeh",
      "Lailah lailawoh Muhamad rasul Allah",
      "Salauwau Allaihi wasallam"
    ]
  },
  aji_condo_birowo: {
    judul: "AJI CONDO BIROWO",
    deskripsi: "Mantra panyuwunan usada lan pangreksa saking laraning bongso sesakit.",
    bacaan: [
      "Punika laraning bongso sesakit",
      "Sang ayu sesiraha sumiraha",
      "Sang ayu sesiraha sumingkira",
      "Joko sakti teko soko wetan",
      "Gowo panutan nyangking rembulan",
      "Betora Kolo teko soko kulon",
      "Ambleso bumi sap pitu",
      "Hayu slamet, Hayu slamet, Hayu slamet"
    ],
    catatan: "Diwaca kaping 3 kanthi manah mantep lan ngeningake cipta."
  },
  aji_semar_kawak: {
    judul: "AJI PENGASIHAN SEMAR KAWAK",
    deskripsi: "Aji pengasihan tradisional Semar Kawak kangge kawelasan luhur.",
    bacaan: [
      "ENDANG - ENDONG SEMAR KAWAK KERI KODANAN",
      "…………..NGGUYA - NGGUYU  SAK  TEKAKU",
      "…………..LONGA - LONGO  SAK  LUNGAKU",
      "…………..TEKA KEDEP TEKA LEREP",
      "ANENG  BADAN  SELIRAKU",
      "HU ALLAH    HU ALLAH   HU ALLAH"
    ],
    catatan: "Titik-titik isian saged dipunsebat kanthi asma pribadi utawi panyuwunan batin."
  },
  aji_waringin_sungsang: {
    judul: "AJI WARINGIN SUNGSANG",
    deskripsi: "Ilmu aji Waringin Sungsang pangayoman gaib jagad suci Roh Idlafi.",
    bacaan: [
      "Allahuma Roh Idlafi",
      "Ratune nyawa sak kalir, sakehe kang turu pada siro tangia. Manembaha marang ingsung, manut mituruta sak pakoningsun.",
      "Ya ingsun Ratune Roh Idlafi, wangi tanpa gondo padang tan ono petenge.",
      "Kang muna-muni lebur dening swaraning Allah.",
      "Ya ingsun Ratune Roh Idlafi ngadeg ing waringin sungsang kang pangawak buwona balik.",
      "Hu Allah Hu Allah Hu Allah"
    ],
    catatan: "Rapalan wingit panutup sengkala lan pangracut hawa nepsu ala."
  },
  ruwatan_batara_kala: {
    judul: "RUWATAN MURWAKALA (BATARA KALA)",
    narasumber: "Ki Dalang Manteb Soedharsono",
    deskripsi: "Upacara sakral Ruwatan Murwakala minangka piwulang luhur panyucen sukma manungsa saking karma papa, bebaya hawa nafsu, sarta panguwasaning Batara Kala supados manggih kaslametan lahir lan batin.",
    pengantar_filosofi: "Ruwatan Murwakala miturut Ki Dalang Manteb Soedharsono sanes namung pagelaran magis utawi tolak balak tanpa teges, nanging minangka piweling agung kagem eling marang Gusti Kang Akarya Jagad. Batara Kala mujudaken pralambang wektu lan hawa nafsu angkara murka ingkang tansah ngincer manungsa ingkang lena. Lumantar laku ruwatan, manungsa kasuceni batinipun, karuwat sangkalanipun, sarta kawisudha dados titah ingkang waspada lan eling.",
    patang_mantra_rajah: [
      {
        id: "purwaning_dumadi",
        nama: "Mantra Purwaning Dumadi",
        posisi: "Kaserat ing Bathuk (Dahi)",
        titik_anatomi: "Bathuk / Cakra Ajna (Pusat Cipta & Nalar Budi)",
        aksara_jawa: "ꦲꦺꦴꦁꦲꦾꦁꦲꦩꦸꦂꦮꦨꦹꦩꦶꦥꦸꦂꦮꦤꦶꦁꦢꦸꦩꦢꦶ",
        mantra_teks: "Hong Hyang Amurwa Bhumi, Purwaning Dumadi kang asipat langgeng, heh Kala sira sumingkira, ingsun sejatining manungsa kang kinemulan dening Hyang Suksma Kawekas.",
        werdi_makna: "Kasrat ing bathuk minangka pancereng nalar budi lan pikiran wening. Ngemutaken purwaning dumadi bilih manungsa pinaringan pepadhang suci saking Gusti, saengga petenging hawa nepsu lan panggodhaning Batara Kala mboten saged nguwasani pikiran, nalar, sarta iman manungsa."
      },
      {
        id: "tinekak",
        nama: "Mantra Tinekak / Telak",
        posisi: "Kaserat ing Tutuk (Mulut / Langit-langit)",
        titik_anatomi: "Tutuk / Lesan / Telak (Pusat Sabda & Pitedah)",
        aksara_jawa: "ꦲꦺꦴꦁꦠꦶꦤꦼꦏꦏ꧀ꦠꦸꦠꦸꦏꦶꦁꦏꦭ",
        mantra_teks: "Hong Tinekak tutuking Kala, tinitah bungkem dening Hyang Widhi, aja memangsa manungsa kang wus kasektenan iman lan kasucian, sirna dayaning wisa, teka tawa teka lara sirna dening asihing Hyang.",
        werdi_makna: "Kasrat ing tutuk/telak minangka panyumpet cangkeme Batara Kala supados mboten wani memangsa bocah sukerta. Uga minangka pandom tumrap manungsa supados tansah njagi lesan/lathi saking dora caraka (ngapusi), fitnah, lan tembung ala ingkang saged ngundang sangkala."
      },
      {
        id: "rajah_kalacakra",
        nama: "Rajah Kala Cakra (8 Bait Pembalik Sengkala)",
        posisi: "Kaserat ing Dada (Jaja)",
        titik_anatomi: "Dada / Jaja (Pusat Manah, Rasa Sejati & Katentreman)",
        aksara_jawa: "ꦪꦩꦫꦗꦗꦫꦩꦪꦪꦩꦫꦤꦶꦤꦶꦫꦩꦪ",
        mantra_teks: [
          { bait: "YA MARAJA JARAMAYA", werdi: "Heh pangrancana (sing marani ala), mariya lan sirnaa tanpa sisa." },
          { bait: "YA MARANI NIRAMAYA", werdi: "Heh sing teka gawe cilaka, sirnaa dadi slamet raharja." },
          { bait: "YA SILAPA PALASIYA", werdi: "Heh sing gawe kaluwen lan pailan, ngasihaa marang sapadha-padha." },
          { bait: "YA MIRODA DAROMIYA", werdi: "Heh sing meksa ala lan murka, balia dadi welas asih lan tentrem." },
          { bait: "YA MIDOSA SADOMIYA", werdi: "Heh sing gawe dosa lan piala, dadia kabecikan lan karukunan." },
          { bait: "YA DAYUDA DAYUDAYA", werdi: "Heh sing gawe aprang lan crah congkrah, dadia paseduluran luhur." },
          { bait: "YA SIYACA CAYASIYA", werdi: "Heh sing gawe rusuh lan peteng, dadia pepadhang lan tentreming jagad." },
          { bait: "YA SIHAMA MAHASIYA", werdi: "Heh kang dadi ama lan rubeda, asih-tresnaa mring kabeh titahing urip." }
        ],
        werdi_makna: "Kasrat ing jaja minangka benteng manah lan jantung batin. Daya Kalacakra minangka 'pembalik' sengkala—samubarang sedya ala, tenung, santet, fitnah, utawi hawa nepsu ingkang nempuh manah badhe kapuntir dados kawelasan lan karahayon."
      },
      {
        id: "caraka_balik",
        nama: "Caraka Balik / Sungsang",
        posisi: "Kaserat ing Gigir (Punggung)",
        titik_anatomi: "Gigir / Balung Wingking (Pager Mburi & Panguwasaning Sukma)",
        aksara_jawa: "ꦔꦛꦧꦒꦩꦚꦪꦗꦝꦥꦭꦮꦱꦠꦢꦏꦫꦕꦤꦲ",
        urutan_aksara: "NGA - THA - BA - GA - MA - NYA - YA - JA - DHA - PA - LA - WA - SA - TA - DA - KA - RA - CA - NA - HA",
        mantra_teks: "NGA, THA, BA, GA, MA, NYA, YA, JA, DHA, PA, LA, WA, SA, TA, DA, KA, RA, CA, NA, HA.",
        werdi_makna: "Caraka lumrah (Ha-Na-Ca-Ra-Ka dumugi Nga) ngemot lampahing gesang wiwit lahir dumugi puput. Dene Caraka Balik/Sungsang minangka kawruh 'Inna lillahi wa inna ilaihi rajiun'—kondur marang sangkan paraning dumadi. Kasrat ing gigir minangka pager mburi, mbalekake sedaya balak, teluh, tenung, sengkala, lan dayaning Kala marang asale suwung, saengga manungsa ayom ayem lahir batin."
      }
    ]
  }
};
