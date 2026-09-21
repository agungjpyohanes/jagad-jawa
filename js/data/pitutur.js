// Data Pitutur Luhur & Kuis Budaya Jawa (Korpus Lengkap & Bank Soal Interaktif)

const PITUTUR_LIST = [
  {
    jawa: 'Urip iku urup',
    aksara: 'ꦈꦫꦶꦥ꧀ꦲꦶꦏꦸꦲꦸꦫꦸꦥ꧀',
    artiHarfiah: 'Hidup itu hendaknya menyala atau menerangi.',
    makna: 'Keberadaan manusia di dunia selayaknya memberi manfaat, pertolongan, ketenteraman, dan cahaya kebaikan bagi sesama manusia serta alam sekitarnya.',
    sumber: 'Falsafah Luhur Jawa'
  },
  {
    jawa: 'Sura dira jayaningrat, lebur dening pangastuti',
    aksara: 'ꦱꦸꦫꦢꦶꦫꦗꦪꦤꦶꦁꦫꦠ꧀ꦭꦼꦧꦸꦂꦢꦼꦤꦶꦁꦥꦔꦱ꧀ꦠꦸꦠꦶ',
    artiHarfiah: 'Segala kekuatan angkara murka di jagad raya akan lebur oleh kelembutan budi dan welas asih.',
    makna: 'Kekuasaan, arogansi, dan angkara sehebat apa pun akan runtuh di hadapan ketulusan hati, kerendahan hati, dan doa permohonan kebaikan.',
    sumber: 'Serat Bratayuda'
  },
  {
    jawa: 'Memayu hayuning bawana',
    aksara: 'ꦩꦼꦩꦪꦸꦲꦪꦸꦤꦶꦁꦧꦮꦤ',
    artiHarfiah: 'Mempercantik dan memperindah keselamatan jagad raya.',
    makna: 'Kewajiban moral manusia untuk senantiasa menjaga kelestarian alam, kedamaian sosial, keharmonisan kosmik, dan kesejahteraan dunia.',
    sumber: 'Falsafah Kejawen'
  },
  {
    jawa: 'Ngluruk tanpa bala, menang tanpa ngasorake, sekti tanpa aji-aji, sugih tanpa bandha',
    aksara: 'ꦔ꧀ꦭꦸꦫꦸꦏ꧀ꦠꦤ꧀ꦥꦧꦭꦩꦼꦤꦁꦠꦤ꧀ꦥꦔꦱꦺꦴꦫꦏꦺ',
    artiHarfiah: 'Menyerbu tanpa pasukan bala, menang tanpa merendahkan, sakti tanpa mantra jimat, kaya tanpa harta tumpuk.',
    makna: 'Puncak keluhuran pendekar jiwa: berani karena benar, beradab menjaga martabat lawan, berwibawa karena ketulusan, dan kaya hati dengan rasa syukur.',
    sumber: 'Pitutur Para Pujangga'
  },
  {
    jawa: 'Aja gumunan, aja getunan, aja kagetan, aja aleman',
    aksara: 'ꦲꦗꦒꦸꦩꦸꦤꦤ꧀ꦲꦗꦒꦼꦠꦸꦤꦤ꧀ꦲꦗꦏꦒꦺꦠꦤ꧀ꦲꦗꦲꦭꦺꦩꦤ꧀',
    artiHarfiah: 'Jangan mudah terheran-heran, jangan mudah menyesal, jangan mudah terperanjat, jangan manja haus pujian.',
    makna: 'Pondasi ketenangan batin agar tidak silau oleh kemewahan duniawi, tabah menerima takdir masa lalu, siap menghadapi kejutan hidup, dan mandiri.',
    sumber: 'Pitutur Luhur Wong Tuwa'
  },
  {
    jawa: 'Dhemit ora ndulit, setan ora doyan',
    aksara: 'ꦝꦼꦩꦶꦠ꧀ꦲꦺꦴꦫꦤ꧀ꦢꦸꦭꦶꦠ꧀ꦱꦺꦠꦤ꧀ꦲꦺꦴꦫꦢꦺꦴꦪꦤ꧀',
    artiHarfiah: 'Hantu tidak menyentuh, setan pun tidak berselera.',
    makna: 'Orang yang hatinya bersih, berbudi pekerti luhur, dan senantiasa berserah kepada Gusti Allah akan terlindung dari marabahaya nyata maupun gaib.',
    sumber: 'Paribasan Jawa'
  },
  {
    jawa: 'Ajining dhiri dumunung aning lathi, ajining raga ana ing busana',
    aksara: 'ꦲꦗꦶꦤꦶꦁꦝꦶꦫꦶꦢꦸꦩꦸꦤꦸꦁꦲꦤꦶꦁꦭꦛꦶ',
    artiHarfiah: 'Kehormatan diri terletak pada lisan kata-kata, kehormatan raga terletak pada tata busana.',
    makna: 'Martabat dan kemuliaan seseorang ditentukan oleh tutur kata yang santun dan jujur, serta kesopanan dalam menjaga penampilan dan tingkah laku.',
    sumber: 'Paribasan Jawa'
  },
  {
    jawa: 'Crah agawe bubrah, rukun agawe santosa',
    aksara: 'ꦕꦿꦃꦲꦒꦮꦺꦧꦸꦧꦿꦃꦫꦸꦏꦸꦤ꧀ꦲꦒꦮꦺꦱꦤ꧀ꦠꦺꦴꦱ',
    artiHarfiah: 'Perselisihan membawa kehancuran, kerukunan menciptakan ketenteraman dan kekuatan.',
    makna: 'Pesan persatuan bahwa perselisihan dan pertikaian hanya melahirkan kehancuran bersama, sementara kerukunan dan gotong royong mengokohkan peradaban.',
    sumber: 'Paribasan Jawa'
  },
  {
    jawa: 'Alang-alang dudu aling-aling',
    aksara: 'ꦲꦭꦁꦲꦭꦁꦢꦸꦢꦸꦲꦭꦶꦁꦲꦭꦶꦁ',
    artiHarfiah: 'Rintangan rumput ilalang bukanlah tirai penghalang sejati.',
    makna: 'Segala macam kesulitan, rintangan, dan ujian hidup bukanlah akhir yang menghalangi jalan, melainkan tantangan yang harus dilewati dengan tekad baja.',
    sumber: 'Bebasan Jawa'
  },
  {
    jawa: 'Mikul dhuwur mendhem jero',
    aksara: 'ꦩꦶꦏꦸꦭ꧀ꦝꦸꦮꦸꦂꦩꦼꦤ꧀ꦝꦼꦩ꧀ꦗꦼꦫꦺꦴ',
    artiHarfiah: 'Memikul tinggi-tinggi dan memendam dalam-dalam.',
    makna: 'Kewajiban anak atau penerus untuk senantiasa menjunjung tinggi kehormatan, jasa, dan nama baik orang tua atau leluhur, sembari menutup rapat aib atau kekurangannya.',
    sumber: 'Falsafah Luhur Jawa'
  },
  {
    jawa: 'Bener kang satuhu, dudu benering karep dhewe',
    aksara: 'ꦧꦼꦤꦼꦂꦏꦁꦱꦠꦸꦲꦸꦢꦸꦢꦸꦧꦼꦤꦼꦫꦶꦁꦏꦫꦺꦥ꧀ꦝꦺꦮꦺ',
    artiHarfiah: 'Kebenaran yang sejati, bukanlah pembenaran menurut kemauan diri sendiri.',
    makna: 'Peringatan etika agar tidak terjebak dalam kesombongan nafsu subjektif; kebenaran harus diuji melalui kaidah luhur ketuhanan dan kemaslahatan umum.',
    sumber: 'Piwulang Kejawen'
  },
  {
    jawa: 'Sing sapa salah seleh',
    aksara: 'ꦱꦶꦁꦱꦥꦱꦭꦃꦱꦺꦭꦺꦃ',
    artiHarfiah: 'Siapa yang berbuat salah pada akhirnya akan berserah dan mengakui.',
    makna: 'Kepastian hukum karma dan keadilan semesta bahwa kebatilan yang disembunyikan serapat apa pun lambat laun akan terbongkar dan pelakunya akan tunduk.',
    sumber: 'Paribasan Jawa'
  },
  {
    jawa: 'Ojo dumeh, ojo nyleneh, ojo gersulo, ojo suloyo',
    aksara: 'ꦲꦺꦴꦗꦺꦴꦢꦸꦩꦺꦃꦲꦺꦴꦗꦺꦴꦚ꧀ꦭꦺꦤꦺꦃꦲꦺꦴꦗꦺꦴꦒꦼꦂꦱꦸꦭꦺꦴꦲꦺꦴꦗꦺꦴꦱꦸꦭꦺꦴꦪꦺꦴ',
    artiHarfiah: 'Jangan mentang-mentang, jangan bertingkah aneh menyimpang, jangan mengeluh, jangan ingkar janji.',
    makna: 'Empat pedoman kendali diri agar tidak sombong saat di atas, tidak bertindak amoral, ikhlas menerima ketetapan hidup, dan teguh memegang amanah.',
    sumber: 'Falsafah Luhur Jawa'
  },
  {
    jawa: 'Ngelmu iku kalakone kanthi laku, lekase lawan kas, tegese kas nyantosani, setya budya pangekese durangkara',
    aksara: 'ꦔꦺꦭ꧀ꦩꦸꦲꦶꦏꦸꦏꦭꦏꦺꦴꦤꦺꦏꦤ꧀ꦛꦶꦭꦏꦸ',
    artiHarfiah: 'Ilmu sejati itu terwujud melalui pengamalan nyata, diawali dengan kesungguhan hati yang mengokohkan budi, untuk melenyapkan watak angkara.',
    makna: 'Hakekat ilmu pengetahuan bukanlah sekadar wacana teoritis di kepala, melainkan harus dihidupi lewat laku perbuatan nyata dan budi pekerti penunduk nafsu.',
    sumber: 'Serat Wedhatama (Pocung)'
  },
  {
    jawa: 'Deduga lawan prayoga, myang watara reringa aywa lali',
    aksara: 'ꦢꦼꦢꦸꦒꦭꦮꦤ꧀ꦥꦿꦪꦺꦴꦒ',
    artiHarfiah: 'Pertimbangan nalar dan kepatutan, serta batas takaran dan kehati-hatian jangan sampai dilupakan.',
    makna: 'Setiap langkah dan keputusan dalam hidup hendaknya selalu ditimbang matang-matang dengan akal sehat, etika moral, dan kehati-hatian.',
    sumber: 'Serat Wulangreh (Dhandhanggula)'
  },
  {
    jawa: 'Amenangi zaman edan, ewuh aya ing pambudi, melu edan nora tahan, yen tan melu anglakoni, boya kaduman melik, kaliren wekasanipun, dilalah kersa Allah, begja-begjane kang lali, luwih begja kang eling lawan waspada',
    aksara: 'ꦲꦩꦼꦤꦔꦶꦗꦩꦤ꧀ꦲꦺꦢꦤ꧀',
    artiHarfiah: 'Menghadapi zaman edan serba susah berbuat, ikut gila tak tahan, bila tak ikut tak kebagian, namun sungguh seberuntung-beruntungnya orang yang lalai, masih lebih beruntung orang yang senantiasa ingat dan waspada.',
    makna: 'Pesan moral agung menghadapi krisis zaman: tetap teguh memegang prinsip kebajikan dengan senantiasa eling kepada Gusti Allah dan waspada menjaga nurani.',
    sumber: 'Serat Kalatidha (Sinom)'
  },
  {
    jawa: 'Dadi wong kudu bisa rumangsa, aja rumangsa bisa',
    aksara: 'ꦧꦶꦱꦫꦸꦩꦁꦱꦲꦗꦫꦸꦩꦁꦱꦧꦶꦱ',
    artiHarfiah: 'Sebagai manusia harus mampu tahu diri (mawas diri), jangan malah merasa diri paling bisa.',
    makna: 'Peringatan halus agar senantiasa rendah hati, introspektif mengakui keterbatasan diri, dan tidak angkuh seolah-olah menguasai segalanya.',
    sumber: 'Serat Wulangreh'
  },
  {
    jawa: 'Mulat sarira hangrasa wani, rumangsa melu handarbeni, wajib melu hangrungkebi',
    aksara: 'ꦩꦸꦭꦠ꧀ꦱꦫꦶꦫꦲꦁꦫꦱꦮꦤꦶ',
    artiHarfiah: 'Berani mawas diri, merasa ikut memiliki, dan wajib ikut berjuang membelanya.',
    makna: 'Tri Dharma kepemimpinan dan kebangsaan: memiliki keberanian memeriksa kekurangan diri, mencintai tanah air sepenuh hati, dan siap berkorban demi keluhuran nusa bangsa.',
    sumber: 'KGPAA Mangkunegara I (Pangeran Sambernyawa)'
  },
  {
    jawa: 'Becik ketitik, ala ketara',
    aksara: 'ꦧꦼꦕꦶꦏ꧀ꦏꦼꦠꦶꦠꦶꦏ꧀ꦲꦭꦏꦼꦠꦫ',
    artiHarfiah: 'Kebaikan akan bertanda, keburukan akan kentara terlihat.',
    makna: 'Segala amal kebajikan lambat laun pasti menuai buah manis kehormatan, sedangkan setiap kelicikan dan perbuatan buruk cepat atau lambat akan tersingkap.',
    sumber: 'Paribasan Jawa'
  },
  {
    jawa: 'Sepi ing pamrih, rame ing gawe',
    aksara: 'ꦱꦼꦥꦶꦲꦶꦁꦥꦩꦿꦶꦃꦫꦩꦺꦲꦶꦁꦒꦮꦺ',
    artiHarfiah: 'Sunyi dari pamrih pribadi, bersemangat giat dalam bekerja.',
    makna: 'Etos pengabdian sejati yang mengutamakan kerja nyata, karya baktian, dan kontribusi tulus bagi kemaslahatan masyarakat tanpa mengharapkan sanjungan atau keuntungan pribadi.',
    sumber: 'Falsafah Luhur Nusantara'
  },
  {
    jawa: 'Witing tresna jalaran saka kulina',
    aksara: 'ꦮꦶꦠꦶꦁꦠꦿꦺꦱ꧀ꦤꦗꦭꦫꦤ꧀ꦱꦏꦏꦸꦭꦶꦤ',
    artiHarfiah: 'Tumbuhnya cinta berawal dari kebiasaan bersama.',
    makna: 'Kasih sayang yang mendalam, kesepahaman, dan kesetiaan lahir dari interaksi yang berkesinambungan, proses saling mengenal, dan kesabaran meniti kebersamaan.',
    sumber: 'Paribasan Jawa'
  },
  {
    jawa: 'Adigang, adigung, adiguna',
    aksara: 'ꦲꦢꦶꦒꦁꦲꦢꦶꦒꦸꦁꦲꦢꦶꦒꦸꦤ',
    artiHarfiah: 'Menyombongkan kekuatan raga (kidang), kebesaran martabat (gajah), dan kepandaian muslihat (ula).',
    makna: 'Kritik tajam terhadap orang yang menyombongkan kelebihan fisik, kedudukan jabatan, maupun kecerdasan akal budi untuk merendahkan dan menindas sesama.',
    sumber: 'Serat Wulangreh (Gambuh)'
  },
  {
    jawa: 'Gusti ora sare',
    aksara: 'ꦒꦸꦱ꧀ꦠꦶꦲꦺꦴꦫꦱꦫꦺ',
    artiHarfiah: 'Tuhan Semesta Alam tidak pernah tidur.',
    makna: 'Keyakinan teguh bahwa Tuhan senantiasa mengawasi, melindungi orang benar, mendengar doa tulus hamba-Nya, dan menegakkan keadilan mutlak.',
    sumber: 'Falsafah Keimanan Jawa'
  },
  {
    jawa: 'Ngono ya ngono, ning aja ngono',
    aksara: 'ꦔꦺꦴꦤꦺꦴꦪꦔꦺꦴꦤꦺꦴꦤꦶꦁꦲꦗꦔꦺꦴꦤꦺꦴ',
    artiHarfiah: 'Begitu ya begitu, namun jangan sampai berbuat begitu.',
    makna: 'Peringatan tentang batas kepatutan rasa; silakan bersikap tegas, namun jangan sampai melampaui batas empati, kesopanan, dan melukai martabat sesama.',
    sumber: 'Ungkapan Rasa Jawa'
  },
  {
    jawa: 'Kebo nusu gudel',
    aksara: 'ꦏꦼꦧꦺꦴꦤꦸꦱꦸꦒꦸꦢꦺꦭ꧀',
    artiHarfiah: 'Kerbau dewasa menyusu kepada anak kerbau.',
    makna: 'Keadaan di mana orang yang lebih tua atau berkedudukan tinggi tidak malu merendahkan hati untuk menuntut ilmu dan meminta petuah dari generasi yang lebih muda.',
    sumber: 'Paribasan Jawa'
  },
  {
    jawa: 'Nabok nyilih tangan',
    aksara: 'ꦤꦧꦺꦴꦏ꧀ꦚꦶꦭꦶꦃꦠꦔꦤ꧀',
    artiHarfiah: 'Memukul dengan meminjam tangan orang lain.',
    makna: 'Sindiran keras bagi watak pengecut yang mencelakakan sesama dengan memperalat pihak ketiga tanpa berani bertanggung jawab secara jantan.',
    sumber: 'Paribasan Jawa'
  },
  {
    jawa: 'Kutuk marani sunduk',
    aksara: 'ꦏꦸꦠꦸꦏ꧀ꦩꦫꦤꦶꦱꦸꦤ꧀ꦢꦸꦏ꧀',
    artiHarfiah: 'Ikan gabus menghampiri sendiri tusukan pemanggang.',
    makna: 'Tindakan gegabah seseorang yang sengaja mendatangi marabahaya atau jebakan petaka karena kecerobohan dan menuruti nafsu sesaat.',
    sumber: 'Saloka Jawa'
  },
  {
    jawa: 'Basa ngelmu mupakate lan panemu, pasahe lan tapa',
    aksara: 'ꦧꦱꦔꦺꦭ꧀ꦩꦸꦩꦸꦥꦏꦠꦺꦭꦤ꧀ꦥꦤꦼꦩꦸ',
    artiHarfiah: 'Hakekat ilmu itu selaras dengan budi dan rasa batin, tajamnya diasah lewat laku prihatin.',
    makna: 'Ilmu spiritual dan kebijaksanaan sejati hanya akan berdaya guna dan bercahaya jika dibarengi dengan laku tirakat, kejujuran batin, serta welas asih.',
    sumber: 'Serat Wedhatama'
  },
  {
    jawa: 'Bebasan kaya banyu karo lenga',
    aksara: 'ꦧꦼꦧꦱꦤ꧀ꦧꦚꦸꦏꦫꦺꦴꦭꦼꦔ',
    artiHarfiah: 'Ibarat air dengan minyak yang tidak dapat bersatu.',
    makna: 'Menggambarkan perselisihan paham atau dua manusia yang watak dan pandangannya sangat bertolak belakang sehingga memerlukan kearifan untuk saling bertoleransi.',
    sumber: 'Bebasan Jawa'
  },
  {
    jawa: 'Alon-alon waton kelakon',
    aksara: 'ꦲꦭꦺꦴꦤ꧀ꦲꦭꦺꦴꦤ꧀ꦮꦠꦺꦴꦤ꧀ꦏꦼꦭꦏꦺꦴꦤ꧀',
    artiHarfiah: 'Perlahan-lahan asalkan berhasil tercapai dengan selamat.',
    makna: 'Petuah agar senantiasa mengutamakan perhitungan matang, ketelitian, kehati-hatian, dan keselamatan dalam bertindak demi mencapai tujuan yang lestari.',
    sumber: 'Paribasan Jawa'
  }
];

const QUIZ_QUESTIONS = [
  {
    q: 'Menapa tegesipun sesanti falsafah Jawa "Urip Iku Urup"?',
    opts: [
      'Urip kudu migunani lan madhangi tumrap sapadha-padha',
      'Urip kudu nglumpukake kasugihan donya sakakeh-akehe',
      'Urip kudu tansah seneng-seneng tanpa mikir sesuk',
      'Urip kudu ora kena obah lan pasrah marang kahanan'
    ],
    correct: 0,
    kategori: 'Falsafah'
  },
  {
    q: 'Pinten cacahe aksara Jawa Nglegena ing susunan carakan baku?',
    opts: [
      '15 Aksara',
      '20 Aksara',
      '25 Aksara',
      '30 Aksara'
    ],
    correct: 1,
    kategori: 'Aksara Jawa'
  },
  {
    q: 'Sinten penengah Pandawa Lima ingkang gadhah pusaka Panah Pasopati?',
    opts: [
      'Prabu Puntadewa (Yudhistira)',
      'Raden Werkudara (Bima)',
      'Raden Arjuna (Janaka)',
      'Raden Nakula'
    ],
    correct: 2,
    kategori: 'Wayang Purwa'
  },
  {
    q: 'Sandhangan swara ing aksara Jawa kagem ngungelaken vokal /u/ kawastanan...?',
    opts: [
      'Wulu',
      'Pepet',
      'Suku',
      'Taling'
    ],
    correct: 2,
    kategori: 'Aksara Jawa'
  },
  {
    q: 'Gamelan Jawa laras Slendro punika gadhah cacah nada pentatonis pinten ing satunggal gembyangan?',
    opts: [
      '5 Nada (Ji, Ro, Lu, Ma, Nem)',
      '7 Nada (Pelog Pelik)',
      '12 Nada Kromatik',
      '4 Nada Pathet'
    ],
    correct: 0,
    kategori: 'Karawitan & Gamelan'
  },
  {
    q: 'Dina Setu Paing punika menawi dipunpetung neptunipun gadhah gunggung sepinten?',
    opts: [
      '14 (Setu 9 + Paing 5)',
      '16 (Setu 9 + Paing 7)',
      '17 (Setu 9 + Paing 8)',
      '18 (Setu 9 + Paing 9)'
    ],
    correct: 3,
    kategori: 'Weton & Neptu'
  },
  {
    q: 'Pundi kombinasi dina lan pasaran ingkang gadhah gunggung neptu paling ageng (18) ing petungan Jawa?',
    opts: [
      'Setu Paing',
      'Jemuah Kliwon',
      'Rebo Legi',
      'Kemis Pon'
    ],
    correct: 0,
    kategori: 'Weton & Neptu'
  },
  {
    q: 'Ing sistem pawukon Jawa, satunggal siklus jangkep madeg saking pinten wuku?',
    opts: [
      '20 Wuku',
      '25 Wuku',
      '30 Wuku (210 Dina)',
      '35 Wuku (Selapan)'
    ],
    correct: 2,
    kategori: 'Pawukon'
  },
  {
    q: 'Wuku kapisan ing urutan tigang dasa (30) pawukon Jawa inggih punika wuku...?',
    opts: [
      'Wuku Landep',
      'Wuku Sinta',
      'Wuku Ukir',
      'Wuku Watugunung'
    ],
    correct: 1,
    kategori: 'Pawukon'
  },
  {
    q: 'Mangsa Kasa (kapisan) ing pranata mangsa Jawa dipuntandhani kaliyan candrasangkala utawi sesanti...?',
    opts: [
      'Sesotya murca ing embanan (godhong rontok)',
      'Bantala rengka (lemah nela)',
      'Sotya sinarawedi',
      'Anila kusuma'
    ],
    correct: 0,
    kategori: 'Pranata Mangsa'
  },
  {
    q: 'Mangsa Kapitu ing pranata mangsa biyasanipun katengeri kahanan hawa utawi mongso menapa?',
    opts: [
      'Mangsa rendheng udan deres lan banjir',
      'Mangsa bedhidhing adhem asrep',
      'Mangsa ketiga ngerak tanpa banyu',
      'Mangsa panen pari gadu'
    ],
    correct: 0,
    kategori: 'Pranata Mangsa'
  },
  {
    q: 'Pusaka Serat Jamus Kalimasada punika kagunganipun ratu ing Ngamarta, inggih punika...?',
    opts: [
      'Prabu Duryudana',
      'Prabu Baladewa',
      'Prabu Sri Bathara Kresna',
      'Prabu Puntadewa (Dharmakusuma)'
    ],
    correct: 3,
    kategori: 'Wayang Purwa'
  },
  {
    q: 'Tokoh wayang Punokawan ingkang dipunsebat dados pamoring dewa Sang Hyang Ismaya inggih punika...?',
    opts: [
      'Kyai Semar Badranaya',
      'Petruk Kanthong Bolong',
      'Nala Gareng',
      'Bagong (Bawor)'
    ],
    correct: 0,
    kategori: 'Wayang Purwa'
  },
  {
    q: 'Sandhangan panyigeg wanda kagem konsonan mati /-r/ ing aksara Jawa kawastanan...?',
    opts: [
      'Cecak',
      'Wignyan',
      'Layar',
      'Pangkon'
    ],
    correct: 2,
    kategori: 'Aksara Jawa'
  },
  {
    q: 'Sandhangan panyigeg wanda kagem mateni swara konsonan /-h/ inggih punika...?',
    opts: [
      'Wignyan',
      'Layar',
      'Cecak',
      'Pangkon'
    ],
    correct: 0,
    kategori: 'Aksara Jawa'
  },
  {
    q: 'Ksatria ing Pringgandani putra saking Raden Werkudara ingkang gadhah sesanti "otot kawat balung wesi" inggih punika...?',
    opts: [
      'Raden Abimanyu',
      'Raden Gatotkaca',
      'Raden Antareja',
      'Raden Irawan'
    ],
    correct: 1,
    kategori: 'Wayang Purwa'
  },
  {
    q: 'Pasaran Jawa cacahe wonten gangsal (5). Urutan ingkang trep miturut tradisi inggih punika...?',
    opts: [
      'Legi, Paing, Pon, Wage, Kliwon',
      'Pon, Wage, Kliwon, Legi, Paing',
      'Kliwon, Legi, Pon, Paing, Wage',
      'Wage, Pon, Legi, Paing, Kliwon'
    ],
    correct: 0,
    kategori: 'Weton & Neptu'
  },
  {
    q: 'Serat Wedhatama ingkang ngemot piwulang luhur babagan ngelmu kasampurnan karipta dening...?',
    opts: [
      'KGPAA Mangkunegara IV',
      'Sri Susuhunan Pakubuwana IV',
      'Raden Ngabehi Ranggawarsita',
      'Sultan Agung Hanyakrakusuma'
    ],
    correct: 0,
    kategori: 'Sastra & Piwulang'
  },
  {
    q: 'Serat Wulangreh ingkang ngemot pupuh Dhandhanggula, Kinanthi, lan Gambuh karipta dening...?',
    opts: [
      'Sri Susuhunan Pakubuwana IV',
      'KGPAA Mangkunegara IV',
      'Raden Ngabehi Yasadipura',
      'Empu Panuluh'
    ],
    correct: 0,
    kategori: 'Sastra & Piwulang'
  },
  {
    q: 'Satunggal Windu ing petungan pananggalan Jawa madeg saking pinten taun?',
    opts: [
      '5 Taun (Pancawarna)',
      '8 Taun (Alip dumugi Jimakir)',
      '10 Taun (Dasa Warsa)',
      '12 Taun (Siklus Zodiak)'
    ],
    correct: 1,
    kategori: 'Kalender Jawa'
  }
];

const rootScope = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this);
rootScope.PITUTUR_LIST = PITUTUR_LIST;
rootScope.QUIZ_QUESTIONS = QUIZ_QUESTIONS;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PITUTUR_LIST, QUIZ_QUESTIONS };
}

export { PITUTUR_LIST, QUIZ_QUESTIONS };
export default { PITUTUR_LIST, QUIZ_QUESTIONS };
