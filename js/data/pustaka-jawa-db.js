/**
 * Jagad Jawa — Database Pustaka Jawa (Kautamaning Laku, Ramuan Tradisional & Aji Rajah Kalacakra)
 * Sumber: database_pustaka_jawa.json
 */

export const PUSTAKA_JAWA_DATA = {
  meta: {
    nama: "Pustaka Jawa: Kautamaning Laku, Usada & Rajah Kalacakra",
    versi: "1.0.0",
    sumber: "database_pustaka_jawa.json"
  },
  kautamaning_laku: {
    judul: "KAUTAMANING LAKU",
    deskripsi: "Filsafat, ajaran moral, dan laku batin Jawa berdasarkan naskah klasik.",
    butir_ajaran: [
      {
        id: 1,
        teks_jawa: "Wong eling ing ilmu sarak dalil sinung kamurahaning Pangeran",
        makna: "Orang yang ingat pada hukum/ajaran agama serta dalil akan dikaruniai kemurahan oleh Tuhan."
      },
      {
        id: 2,
        teks_jawa: "Wong amrih rahayuning sesaminira sinung ayating Pangeran",
        makna: "Orang yang mengusahakan keselamatan sesamanya akan dianugerahi tanda-tanda kebesaran/rahmat Tuhan."
      },
      {
        id: 3,
        teks_jawa: "Angrawuhana Ngilmu Gaib, nanging aja tinggal Ngilmu Sarak iku paraboting urip kang utama",
        makna: "Pahamilah ilmu batin/gaib, namun jangan tinggalkan ilmu syariat/agama karena itulah sarana hidup yang utama."
      },
      {
        id: 4,
        teks_jawa: "Aja kurang pamariksanira lan den agung pangapuranira",
        makna: "Jangan kurang introspeksi/ketelitian dan perbesarlah sifat pemaaf."
      },
      {
        id: 5,
        teks_jawa: "Agaweya kabecikan marang sesamanira tumitah, agaweya sukaning manahe sesamaning jalma",
        makna: "Berbuatlah kebaikan kepada sesama makhluk hidup, buatlah hati sesama manusia merasa senang dan bahagia."
      },
      {
        id: 6,
        teks_jawa: "Aja duwe rumasa bener sarta becik, rumasaa ala lan luput, den agung panalangsanira ing Pangeran Kang Maha Mulya, lamun sira ngarasa bener lawan becik, ginantungan bebenduning Pangeran",
        makna: "Jangan merasa paling benar dan baik, rumahtanggalah bahwa diri ini banyak salah dan dosa, perbesarlah permohonan ampun kepada Tuhan Yang Maha Mulya; jika seseorang merasa paling benar dan baik, ia akan digantung oleh murka Tuhan."
      },
      {
        id: 7,
        teks_jawa: "Angenakena sarira, anyem-anyemna nalanira, aja anggrangsang samubarang kang senedya, den prayitna barang karya",
        makna: "Tenteramkan raga, tenangkan hati, jangan bernafsu serakah/gegabah terhadap segala keinginan, dan tetaplah waspada dalam setiap pekerjaan."
      },
      {
        id: 8,
        teks_jawa: "Elinga marang Kang Murbehing Jagat, aja pegat rina lawan wengi",
        makna: "Ingatlah selalu kepada Sang Pencipta dan Penguasa Alam, jangan terputus siang dan malam."
      },
      {
        id: 9,
        teks_jawa: "Atapna Geniara, tegese den teguh yen krungu ujar ala",
        makna: "Terapkan Geniara (laku api), artinya tetap teguh pendirian dan sabar meskipun mendengar perkataan buruk."
      },
      {
        id: 10,
        teks_jawa: "Atapna Banyuara, tegese Ngeli, iku nurut saujaring liyan, datan nyulayani",
        makna: "Terapkan Banyuara (laku air), artinya mengalir mengikuti dinamika keadaan demi kebaikan tanpa harus berselisih."
      },
      {
        id: 11,
        teks_jawa: "Tapa Ngluwat tegese Mendhem atine aja ngatonake kabecikane dhewe",
        makna: "Tapa Ngluwat artinya memendam atau menyembunyikan kebaikan diri sendiri, tidak pamer."
      },
      {
        id: 12,
        teks_jawa: "Aprang Sabil tegese perang sajroning jajanira priyangga ana perang bratayuda perang ati ala lan ati becik samangsa sira bisa nyegah sabarang cipta ala, pratanda menang perang Sabil",
        makna: "Perang Sabil adalah perang di dalam dada sendiri (perang bratayuda antara hawa nafsu buruk dan niat baik); bilamana seseorang mampu mencegah segala niat buruk, itulah tanda kemenangan Perang Sabil."
      }
    ]
  },
  ramuan_obat: {
    judul: "RAMUAN OBAT TRADISIONAL",
    deskripsi: "Kumpulan resep ramuan herbal tradisional Jawa untuk berbagai jenis penyakit.",
    kategori_pengobatan: [
      {
        id: "jantung",
        penyakit: "JANTUNG",
        bahan: [
          "Daun Sirih Merah",
          "Ginseng Jawa / Akar Bayam Duri Merah",
          "Daun Sambung Nyawa",
          "Ceplukan Komplit",
          "Bawang Putih",
          "Kunyit Putih / Kuning",
          "Buah Nagasari",
          "Adas Pulowaras",
          "Gula Aren / Jawa"
        ],
        keterangan_aplikasi: "Direbus bersama air secukupnya hingga mendidih dan menyusut, saring lalu diminum selagi hangat."
      },
      {
        id: "paru-paru",
        penyakit: "PARU – PARU",
        bahan: [
          "Ceplukan Komplit",
          "Ginseng Jawa / Akar Bayam Duri Merah",
          "Daun Sambung Nyawa",
          "Buah Nagasari",
          "Adas Pulowaras",
          "Gula Aren / Jawa"
        ],
        keterangan_aplikasi: "Direbus dengan api kecil hingga sari bahan keluar, diminum teratur pagi dan sore."
      },
      {
        id: "kulit-kudis",
        penyakit: "PENYAKIT KULIT / KUDIS",
        keterangan_aplikasi: "Dipipis halus lalu dioleskan pada bagian kulit yang terkena luka/kudis.",
        bahan: [
          "Daun Awar – Awar",
          "Daun dan Biji Mahkota Dewa",
          "Daun Sambung Darah",
          "Daun Rosela Merah",
          "Daun Jarak Wulung",
          "Temu Hitam",
          "Garam Grasak"
        ]
      },
      {
        id: "syaraf-tulang-minum",
        penyakit: "SYARAF TULANG (YANG DIMINUM)",
        keterangan_aplikasi: "Direbus dengan air bersih hingga mendidih, diminum hangat untuk meredakan nyeri syaraf dan persendian.",
        bahan: [
          "Daun Alpukat",
          "Ceplukan Komplit",
          "Ginseng Jawa / Akar Bayam Duri Merah",
          "Daun Kemangi",
          "Daun Serai",
          "Adas Pulowaras",
          "Gula Aren / Jawa"
        ]
      },
      {
        id: "syaraf-tulang-oles",
        penyakit: "SYARAF TULANG (YANG DIOLESKAN)",
        keterangan_aplikasi: "Ditumbuk/dipipis halus dicampur minyak kelapa, dibalurkan pada bagian tulang/persendian yang sakit.",
        bahan: [
          "Akar dan Ranting Patah Tulang",
          "Ginseng Jawa / Akar Bayam Duri Merah",
          "Daun Seligi",
          "Daun Kemangi",
          "Garam Grasak",
          "Minyak Kelapa"
        ]
      },
      {
        id: "kulit-jerawatan",
        penyakit: "PENYAKIT KULIT JERAWATAN",
        keterangan_aplikasi: "Dipipis halus lalu dioleskan merata pada wajah atau area kulit berjerawat.",
        bahan: [
          "Buah Blimbing Wuluh Diparut",
          "Tepung Biji Bunga Pukul Empat",
          "Ekstrak Bunga Lavender",
          "Lidah Buaya",
          "Kulit dan Daging Buah Mahkota Dewa",
          "Temu Hitam",
          "Garam Grasak"
        ]
      },
      {
        id: "jampi-telat-ngomong",
        penyakit: "JAMPI TELAT NGOMONG",
        catatan: "Air rebusan pakai air rendaman fosil",
        keterangan_aplikasi: "Bahan direbus menggunakan air rendaman fosil, diminumkan secara bertahap kepada anak.",
        bahan: [
          "Godhong klengkeng yg pernah berbuah",
          "Tamba wuku"
        ]
      },
      {
        id: "jampi-kanker",
        penyakit: "JAMPI KANKER",
        catatan: "Air rebusan pakai air rendaman fosil",
        keterangan_aplikasi: "Direbus dengan air rendaman fosil dengan api stabil hingga tersisa separuh, disaring lalu diminum.",
        bahan: [
          "Kemladean jeruk pecel",
          "Oyot alang2",
          "Adas pulowaras",
          "Kunir putih",
          "Ceplukan",
          "Pancasuda",
          "Patikan kebo",
          "Sambung nyawa",
          "Nagasari + godong",
          "Tamba wuku"
        ]
      },
      {
        id: "jampi-ginjal",
        penyakit: "JAMPI GINJAL",
        catatan: "Air rebusan pakai air rendaman fosil",
        keterangan_aplikasi: "Bahan-bahan segar direbus perlahan dengan air rendaman fosil dan pemanis gula aren, disaring.",
        bahan: [
          "5 ontong janten jagung dirajang",
          "Segenggam daun semanggi",
          "Segenggam daun kumis kucing",
          "Segenggam daun dan akar meniran",
          "Segenggam daun sambung nyawa",
          "Segenggam daun nagasari",
          "Adas pulowaras",
          "Gulo aren",
          "Obat wuku"
        ]
      },
      {
        id: "jampi-koreng",
        penyakit: "JAMPI KORENG",
        keterangan_aplikasi: "Godhong nongko lumah kurep 5 jodo dibakar dipendet arenge dipun kecek ngangge iler bekicot lalu dibalurkan pada koreng.",
        bahan: [
          "Godhong nongko lumah kurep 5 jodo (dibakar diambil arangnya)",
          "Iler bekicot (cairan lendir bekicot)"
        ]
      }
    ]
  },
  aji_rajah_kalacakra: {
    judul: "AJI RAJAH KALACAKRA",
    keterangan: "Rajah yang ada di dada Batara Kala, yang mampu membaca adalah Sang Hyang Batara Wisnu.",
    filosofi: "Rajah Kalacakra merupakan rajah sakral pembalik marabahaya dan penangkal segala sengkala. Pola mantranya membentuk palindrom mistik di mana setiap baris membalikkan energi negatif menjadi kebajikan dan keselamatan.",
    mantra_bait: [
      {
        baris: "YA MARAJA JARAMAYA",
        arti: "Heh Pangrancana Mariya Luwih (Siapa yang menyerang berbalik menjadi berbelas kasihan)"
      },
      {
        baris: "YA MARANI NIRAMAYA",
        arti: "Heh Kang Anekani Ilanga Kaluwihanira (Siapa yang datang dengan niat buruk akan malah menjauhinya)"
      },
      {
        baris: "YA SILAPA PALASIYA",
        arti: "Heh Kang Aweh Luwe Amaregana (Siapa yang membuat lapar berbalik memberikan makan)"
      },
      {
        baris: "YA MIRODO DOROMIYA",
        arti: "Heh Kang Aweh Mlarat Anyukupena (Siapa memaksa berbalik memberikan keleluasaan dan kebebasan)"
      },
      {
        baris: "YA MIDOSA SADOMIYA",
        arti: "Heh Kang Anyikara Mariya Nangsaya (Siapa yang berbuat dosa berbalik berbuat jasa)"
      },
      {
        baris: "YA DAYUDA DAYUDAYA",
        arti: "Heh Kang Amerangi Laruta Kuwatira (Siapa yang memerangi berbalik membawa kedamaian)"
      },
      {
        baris: "YA SIYACA CAYASIYA",
        arti: "Heh Kang Pracidra Kogel - Welasa (Siapa yang membuat celaka berbalik membuat sehat dan sejahtera)"
      },
      {
        baris: "YA SIHAMA MAHASIYA",
        arti: "Heh Kang Dadi Hama Yogya Asiha (Siapa yang berbuat merusak berbalik membangun dan sayang)"
      }
    ]
  }
};

/**
 * Mengambil daftar 12 butir ajaran Kautamaning Laku
 * @returns {Array<{id: number, teks_jawa: string, makna: string}>}
 */
export function getKautamaningLakuList() {
  return [...PUSTAKA_JAWA_DATA.kautamaning_laku.butir_ajaran];
}

/**
 * Cari ajaran Kautamaning Laku berdasarkan kata kunci
 * @param {string} query 
 * @returns {Array<Object>}
 */
export function searchKautamaningLaku(query = '') {
  const list = getKautamaningLakuList();
  if (!query || !query.trim()) return list;
  const q = query.trim().toLowerCase();
  return list.filter(item => 
    item.teks_jawa.toLowerCase().includes(q) ||
    item.makna.toLowerCase().includes(q)
  );
}

/**
 * Mengambil daftar 10 resep Ramuan Obat Tradisional
 * @returns {Array<Object>}
 */
export function getRamuanObatList() {
  return [...PUSTAKA_JAWA_DATA.ramuan_obat.kategori_pengobatan];
}

/**
 * Cari ramuan obat berdasarkan penyakit atau bahan
 * @param {string} query 
 * @returns {Array<Object>}
 */
export function searchRamuanObat(query = '') {
  const list = getRamuanObatList();
  if (!query || !query.trim()) return list;
  const q = query.trim().toLowerCase();
  return list.filter(item => {
    if (item.penyakit.toLowerCase().includes(q)) return true;
    if (item.keterangan_aplikasi && item.keterangan_aplikasi.toLowerCase().includes(q)) return true;
    if (item.catatan && item.catatan.toLowerCase().includes(q)) return true;
    return item.bahan.some(b => b.toLowerCase().includes(q));
  });
}

/**
 * Mengambil data komplit Aji Rajah Kalacakra
 * @returns {Object}
 */
export function getAjiRajahKalacakra() {
  return { ...PUSTAKA_JAWA_DATA.aji_rajah_kalacakra };
}
