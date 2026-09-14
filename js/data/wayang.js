// Data Karakter Wayang Purwa Gagrag Surakarta (Solo)
// Standar skema: id, nama, kategori, kasatriyan, watak, pusaka, pasangan, tunggangan, ajian, gambar

const WAYANG_LIST = [
  // ==========================================
  // KATEGORI: PANDAWA LIMA
  // ==========================================
  {
    id: 'puntadewa',
    nama: 'Prabu Puntadewa (Yudhistira / Dharmaputra)',
    kategori: 'Pandawa',
    kasatriyan: 'Kraton Ngamarta (Indraprastha)',
    watak: 'Sabar, narima ing pandum, ikhlas, adil paramarta, getih putih (ora tau goroh utawa nepsu), asih tresna mring sasama.',
    pusaka: 'Jamus Kalimasada, Panah Kyai Sarotama, Tombak Kyai Karawelang.',
    pasangan: 'Dewi Drupadi',
    tunggangan: '-',
    ajian: 'Ajian Kawastrawam, Jimat Kalimasada.',
    gambar: 'assets/wayang/surakarta/puntadewa.png'
  },
  {
    id: 'bima',
    nama: 'Raden Werkudara (Bimasena / Bratasena)',
    kategori: 'Pandawa',
    kasatriyan: 'Kasatriyan Jodhipati',
    watak: 'Jujur, kukuh bakuh, ora tau cidra janji, pantang mundur, ora basa marang sapa wae kajaba Sang Hyang Dewa Ruci, setya tuhu marang bebener.',
    pusaka: 'Kuku Pancanaka, Gada Rujakpala, Gada Lambitamuka.',
    pasangan: 'Dewi Arimbi, Dewi Nagagini, Dewi Urangayu',
    tunggangan: '-',
    ajian: 'Aji Bandung Bandawasa, Aji Wungkal Bener, Aji Bayubajra.',
    gambar: 'assets/wayang/surakarta/bima.png'
  },
  {
    id: 'arjuna',
    nama: 'Raden Arjuna (Janaka / Dananjaya / Permadi)',
    kategori: 'Pandawa',
    kasatriyan: 'Kasatriyan Madukara',
    watak: 'Lantip ing pambudi, alus bebudene, teges, remen tetulung, gemar tapa brata, ksatria pinunjul kang sekti mandraguna.',
    pusaka: 'Panah Pasopati, Keris Pulanggeni, Keris Kyai Kalanadah, Panah Sarotama.',
    pasangan: 'Dewi Wara Sumbadra, Dewi Srikandi, Dewi Larasati, Dewi Manuhara',
    tunggangan: 'Kuda Ciptawilaha',
    ajian: 'Aji Sepiangin, Aji Palimunan, Aji Asmaragama, Aji Malayabumi.',
    gambar: 'assets/wayang/surakarta/arjuna.png'
  },
  {
    id: 'nakula',
    nama: 'Raden Nakula (Pinten)',
    kategori: 'Pandawa',
    kasatriyan: 'Kasatriyan Sawojajar (Bumiretawu)',
    watak: 'Jujur, setya, bela becik, tanggap marang sasmita kahanan, gemi nastiti, gemar ngreksa karaharjaning praja.',
    pusaka: 'Pedang Tirtamanik',
    pasangan: 'Dewi Suyati, Dewi Srengganawati',
    tunggangan: 'Jaran Prangwedana',
    ajian: 'Aji Pranawajati (kawruh mangerteni rasa atining sasama manungsa).',
    gambar: 'assets/wayang/surakarta/nakula.png'
  },
  {
    id: 'sadewa',
    nama: 'Raden Sadewa (Tangsen)',
    kategori: 'Pandawa',
    kasatriyan: 'Kasatriyan Baweratalun (Bumiretawu)',
    watak: 'Wicaksana, wasis ing babagan nujum lan ilmu kasidan jati, jujur, setya, prigel ngreksa turangga lan tata nagara.',
    pusaka: 'Pedang Maniktentram',
    pasangan: 'Dewi Padmarini',
    tunggangan: '-',
    ajian: 'Aji Purnamajati (waspada marang sadurunge winarah).',
    gambar: 'assets/wayang/surakarta/sadewa.png'
  },

  // ==========================================
  // KATEGORI: PUNAKAWAN
  // ==========================================
  {
    id: 'semar',
    nama: 'Kyai Lurah Semar (Batara Ismaya / Badranaya)',
    kategori: 'Punakawan',
    kasatriyan: 'Padhepokan Karangtumaritis',
    watak: 'Sabar, wicaksana, asih mring para ksatria utomo, andhap asor, humoris nanging kebak wejangan filosofi kasampurnan urip.',
    pusaka: 'Kukus Bau Busuk (Kentut Semar), Jamus Semar Pethak.',
    pasangan: 'Dewi Kanastren',
    tunggangan: '-',
    ajian: 'Ajian Ismaya Jati, Aji Kuncung Putih.',
    gambar: 'assets/wayang/surakarta/semar.png'
  },
  {
    id: 'gareng',
    nama: 'Nala Gareng (Cakruk / Pegatwaja)',
    kategori: 'Punakawan',
    kasatriyan: 'Padhepokan Karangtumaritis',
    watak: 'Prasaja, waspada ing tindak-tanduk, pinter ngguyokake ati, seneng tetulung sanajan sikil lan tangane cacad minangka piwulang pangati-ati.',
    pusaka: 'Cundrik Gareng',
    pasangan: 'Dewi Sarindri',
    tunggangan: '-',
    ajian: '-',
    gambar: 'assets/wayang/surakarta/gareng.png'
  },
  {
    id: 'petruk',
    nama: 'Petruk (Kanthong Bolong / Dawala)',
    kategori: 'Punakawan',
    kasatriyan: 'Padhepokan Karangtumaritis',
    watak: 'Grapyak sumeh, prigel omong, landhep pamikirane, guyonan tajem ngenani kritik sosial lan kahanan urip, welas asih.',
    pusaka: 'Pecut Kyai Pamuk',
    pasangan: 'Dewi Ambarwati',
    tunggangan: '-',
    ajian: 'Aji Welut Putih (angel cinandhak dening mungsuh).',
    gambar: 'assets/wayang/surakarta/petruk.png'
  },
  {
    id: 'bagong',
    nama: 'Bagong (Bawor / Ki Lurah Bagong)',
    kategori: 'Punakawan',
    kasatriyan: 'Padhepokan Karangtumaritis',
    watak: 'Blaka suta (terus terang), kritis, wani mbelani bebener tanpa tedheng aling-aling, gecul nanging wicaksana.',
    pusaka: 'Gegaman Bedor',
    pasangan: 'Dewi Bagnawati',
    tunggangan: '-',
    ajian: 'Aji Bayu Sejati',
    gambar: 'assets/wayang/surakarta/bagong.png'
  },

  // ==========================================
  // KATEGORI: ANAK PANDAWA
  // ==========================================
  {
    id: 'gatotkaca',
    nama: 'Raden Gatotkaca (Kacanagara / Purubaya)',
    kategori: 'Anak Pandawa',
    kasatriyan: 'Kraton Pringgandani',
    watak: 'Gagah prakosa, otot kawat balung wesi, setya tuhu bela nagara, tangguh, ora wedi pati demi bebener, asih marang kulawarga.',
    pusaka: 'Kotang Antakusuma, Caping Basunanda, Kasut Pada Kacarma.',
    pasangan: 'Dewi Pregiwa',
    tunggangan: '-',
    ajian: 'Aji Brajamusti, Aji Narantaka, Aji Brajadenta.',
    gambar: 'assets/wayang/surakarta/gatotkaca.png'
  },
  {
    id: 'abimanyu',
    nama: 'Raden Abimanyu (Angkawijaya / Sumbadraputra)',
    kategori: 'Anak Pandawa',
    kasatriyan: 'Kasatriyan Plangkawati',
    watak: 'Alus bebudene, tatag, tanggon, prawira tama, luhur pambudi, ksatria trahing kusuma rembesing madu kang nurunake ratu ing tanah Jawa.',
    pusaka: 'Keris Pulanggeni, Keris Kyai Kalanadah.',
    pasangan: 'Dewi Utari, Dewi Siti Sundari',
    tunggangan: 'Kuda Kyai Ciptawilaha',
    ajian: 'Aji Jayadratha, Aji Wungkal Bener.',
    gambar: 'assets/wayang/surakarta/abimanyu.png'
  },
  {
    id: 'antareja',
    nama: 'Raden Antareja (Ananta Senaputra)',
    kategori: 'Anak Pandawa',
    kasatriyan: 'Kasatriyan Jangkarbumi',
    watak: 'Sabar, setya marang sedulur, jujur, lila legawa kurban jiwa raga kanthi ngesep tipak tilase dhewe demi kamimpangan Pandawa.',
    pusaka: 'Cincin Mustikabumi, Sisik Kawacabumi.',
    pasangan: 'Dewi Ganggi',
    tunggangan: '-',
    ajian: 'Upas Anta (idu ngandhut wisa mandi panglebur badan mungsuh), Aji Amblasbumi.',
    gambar: 'assets/wayang/surakarta/antareja.png'
  },
  {
    id: 'irawan',
    nama: 'Raden Irawan',
    kategori: 'Anak Pandawa',
    kasatriyan: 'Kasatriyan Pucangsewu',
    watak: 'Alus, sopan santun, prawira ing palagan, setya bekti marang bapa lan trah Pandawa sanajan gugur ing pungkasan palagan.',
    pusaka: 'Panah Kyai Candrasa',
    pasangan: 'Dewi Titisari',
    tunggangan: '-',
    ajian: 'Aji Guna Santika',
    gambar: 'assets/wayang/surakarta/irawan.png'
  },
  {
    id: 'wisanggeni',
    nama: 'Raden Wisanggeni',
    kategori: 'Anak Pandawa',
    kasatriyan: 'Daksinapati (Kahyangan Batara Brahma)',
    watak: 'Sakti tanpa tandingan, cerdas, kritis, jujur tanpa tedheng aling-aling, ora basa marang dewa kajaba Sang Hyang Wenang, kendel mbelani bebener.',
    pusaka: 'Api Dahana, Panah Wisanggeni',
    pasangan: 'Dewi Mustikawati',
    tunggangan: 'Melesat mabur tanpa swiwi',
    ajian: 'Aji Gumbalagni (daya bakar geni saketi)',
    gambar: 'assets/wayang/surakarta/wisanggeni.png'
  },
  {
    id: 'antasena',
    nama: 'Raden Antasena',
    kategori: 'Anak Pandawa',
    kasatriyan: 'Kasatriyan Guyangan / Candhibarata',
    watak: 'Prasaja, lugu, tanpa basa-basi, bekti marang tiyang sepuh, sakti mandraguna tan kena ing pati.',
    pusaka: 'Cupu Madusena (bisa nguripake wong mati)',
    pasangan: 'Dewi Jenakawati',
    tunggangan: 'Sisik naga (ambles bumi lan nglangi samodra bebas)',
    ajian: 'Kuping Tirta Buwana (ajian banyu)',
    gambar: 'assets/wayang/surakarta/antasena.png'
  },

  // ==========================================
  // KATEGORI: DEWA
  // ==========================================
  {
    id: 'batara_guru',
    nama: 'Batara Guru (Sang Hyang Manikmaya)',
    kategori: 'Dewa',
    kasatriyan: 'Kayangan Jonggring Saloka',
    watak: 'Adil paramarta, wicaksana, ngasta panguwasa telung jagad (Mayapada, Madyapada, Arcapada), nanging sok kaduk pangira.',
    pusaka: 'Trisula, Cupu Manik Astagina.',
    pasangan: 'Batari Uma',
    tunggangan: 'Lembu Andini',
    ajian: 'Aji Kemayan, Aji Kawastrawam.',
    gambar: 'assets/wayang/surakarta/batara_guru.png'
  },
  {
    id: 'batara_narada',
    nama: 'Batara Narada (Sang Hyang Kanekaputra)',
    kategori: 'Dewa',
    kasatriyan: 'Kayangan Sidi Udal-udal',
    watak: 'Wicaksana, wasis pinter wicara, penasihat utama para dewa, seneng guyon nanging landhep isi wejangane.',
    pusaka: 'Buku Pustakarancang',
    pasangan: 'Batari Kanistri',
    tunggangan: '-',
    ajian: 'Aji Cipta Hening',
    gambar: 'assets/wayang/surakarta/batara_narada.png'
  },
  {
    id: 'batara_surya',
    nama: 'Batara Surya (Sang Hyang Surya / Pratinggeb)',
    kategori: 'Dewa',
    kasatriyan: 'Kayangan Ekacakra',
    watak: 'Maringi pepadhang cahya marang jagad raya, ikhlas, welas asih mring kabeh makhluk tanpa pilih kasih.',
    pusaka: 'Kancing Gelung Kuntadenta, Panah Surya Narayana.',
    pasangan: 'Batari Kesti',
    tunggangan: 'Kuda Pitu Kencana (Kreta Surya)',
    ajian: 'Aji Kalasurya (pepadhang pamungkas).',
    gambar: 'assets/wayang/surakarta/batara_surya.png'
  },
  {
    id: 'batara_kamajaya',
    nama: 'Batara Kamajaya',
    kategori: 'Dewa',
    kasatriyan: 'Kayangan Cakrakembang',
    watak: 'Bagyo mulya, rupawan luhur, lambang katresnan sejati lan kasetyan bebrayan agung, asih tresna mring garwa lan kabeh titah.',
    pusaka: 'Panah Pancawisuda',
    pasangan: 'Batari Ratih',
    tunggangan: '-',
    ajian: 'Aji Asmaragama',
    gambar: 'assets/wayang/surakarta/batara_kamajaya.png'
  },
  {
    id: 'batara_bayu',
    nama: 'Batara Bayu (Sang Hyang Bayu)',
    kategori: 'Dewa',
    kasatriyan: 'Kayangan Mayapadha (Panglawang)',
    watak: 'Gagah sentosa, keras ing bebener, jujur, dadi pamomong lan paring kasekten marang para ksatria kang kagungan Kuku Pancanaka (Werkudara, Hanoman).',
    pusaka: 'Kuku Pancanaka, Gandi Bayu.',
    pasangan: 'Batari Sumi',
    tunggangan: 'Gajah Erawata',
    ajian: 'Aji Bayubajra, Aji Maruta Sejati.',
    gambar: 'assets/wayang/surakarta/batara_bayu.png'
  },
  {
    id: 'batara_wisnu',
    nama: 'Sang Hyang Batara Wisnu',
    kategori: 'Dewa',
    kasatriyan: 'Kayangan Untarasegara',
    watak: 'Panguwasa pemelihara jagad (Sthiti), adil, wicaksana, asih marang titah, panuntun kabecikan.',
    pusaka: 'Senjata Cakra Basudewa, Kembang Wijayakusuma',
    pasangan: 'Dewi Sri Sekar (Batari Sri)',
    tunggangan: 'Manuk Garudha (Garudheya)',
    ajian: 'Triwikrama (tiwikrama malih dadi buta sakti Brahala)',
    gambar: 'assets/wayang/surakarta/batara_wisnu.png'
  },
  {
    id: 'batara_indra',
    nama: 'Sang Hyang Batara Indra',
    kategori: 'Dewa',
    kasatriyan: 'Kayangan Tinjomaya',
    watak: 'Dermawan, pemberi rahmat rezeki, luhur budi, pangreksa para widadari ing kahyangan.',
    pusaka: 'Panah Kilat (Gladhik), Gada Bajra',
    pasangan: 'Batari Wiyati',
    tunggangan: 'Gajah Erawata (Airavata)',
    ajian: 'Endralaksana',
    gambar: 'assets/wayang/surakarta/batara_indra.png'
  },
  {
    id: 'batara_kala',
    nama: 'Batara Kala',
    kategori: 'Dewa',
    kasatriyan: 'Kayangan Selamangumpeng',
    watak: 'Galak, murka, panguwasa mangsa kalaning manungsa (waktu & sukerta), tanpa ampun.',
    pusaka: 'Gada Kalanenggala, Keris Kalanadah',
    pasangan: 'Batari Durga',
    tunggangan: 'Celeng Kresna / Buta Menggala',
    ajian: 'Panggilingan Kala, Siwur Tirta Pralaya',
    gambar: 'assets/wayang/surakarta/batara_kala.png'
  },
  {
    id: 'batari_durga',
    nama: 'Batari Durga (Dewi Uma Kalis)',
    kategori: 'Dewa',
    kasatriyan: 'Kayangan Krendhawahana',
    watak: 'Ratu para lelembut dan raseksa, keras, panguwasa kadonyan gelap, nanging paring pangayoman marang sing kuwat prihatin.',
    pusaka: 'Cundrik Pengantol, Gandi Kala',
    pasangan: 'Batara Kala',
    tunggangan: 'Macan Lodhaya (Kala Maruta)',
    ajian: 'Aji Panyirepan Alas, Kalika Maya',
    gambar: 'assets/wayang/surakarta/batari_durga.png'
  },

  // ==========================================
  // KATEGORI: PELENGKAP / KAYON
  // ==========================================
  {
    id: 'gunungan',
    nama: 'Gunungan Kayon (Kayon Purwa Solo)',
    kategori: 'Pelengkap',
    kasatriyan: 'Panggung Kelir Pakeliran',
    watak: 'Simbol jagad gumelar saisine (kosmos mikro lan makro): wit panguripan, satwa, geni, hawa, lan gapura manunggalaning kawula Gusti.',
    pusaka: 'Cempurit Kayon',
    pasangan: '-',
    tunggangan: '-',
    ajian: 'Tancep Kayon (Pambuka, Jejer, lan Panutup Lakon).',
    gambar: 'assets/wayang/surakarta/gunungan.png'
  }
];

// Peta Objek Keyed-by-ID untuk Kompatibilitas & Akses Cepat
const WAYANG_CHARACTERS = WAYANG_LIST.reduce((acc, item) => {
  item.name = item.nama;
  item.bio = `${item.watak} Ksatria/Dewa saka ${item.kasatriyan}, kagungan pusaka ${item.pusaka}.`;
  acc[item.id] = item;
  return acc;
}, {});

if (typeof window !== 'undefined') {
  window.WAYANG_LIST = WAYANG_LIST;
  window.WAYANG_CHARACTERS = WAYANG_CHARACTERS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WAYANG_LIST, WAYANG_CHARACTERS };
}

