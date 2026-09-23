// =========================================================================
// ENSIKLOPEDIA PAWUKON JAWA (30 WUKU NUSANTARA)
// Sumber: draft_database_nujum - pawukon.csv (Pembaruan & Pembersihan Terbaru)
// =========================================================================

(function (root) {
const PAWUKON_LIST = [
  {
    "no_wuku": 1,
    "nama_wuku": "Sinta",
    "dewane": "Sang Hyang Yamadipati",
    "watek_budi_pangerti": "rebut arepan, gede kanepsone ora srantan kerep katiwasan, lembut budine enak wicarane lan cupet pangandele, nduweni kamukten, peritahe panas ing ngarep adem ing mburi, dadi pangaubane wong lara sangsara lan wong minggat, awet anom kebat sembarang gawene, weruh ing wangsit, ngatonake donyane, pradah ninging ora sarju, prihatinan, gede piyangkuhe tur mandita.",
    "bilahi_bebaya": "wayah Setengah Tuwuh Ora Dreman sarta Rada Akeh Laline",
    "sesaji_ruwat": "GEDANG MORO SEBO kang tuwuh saktundun lan ARESARESAN (pala kependem , kasampar lan gumantung) sarta DAGING karo WOHINGNDAMI",
    "tindih_ruwat": "21 PICIS",
    "selamatan_sega": "SEGA PULEN dangdangan",
    "selamatan_iwak": "KEBO tukon 21 KETENG tanpa nganyang diolah pindang",
    "salawat": "4 keteng",
    "donga_slamet": "Tolak Bilahi",
    "pangupaya_jiwa": "ANDERES",
    "tamba_yen_lara": "GODONG LUNTAS , utawa GODONG WALUH lan ASEM winor jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 2,
    "nama_wuku": "Landep",
    "dewane": "Sang Hyang Mahadewa",
    "watek_budi_pangerti": "bagus warnane tur ayu garwane, dreman anak, padang atine, de men samadi, parentahe panas ngarep adem ing buri, dadi pangaubaning wong lara sangsara lan wong minggat sarta ingoningoning Wong Agung wredine kanggep pangawulane, ngatonake kasugihane, pradah nanging ora sarju, gede bebudene akeh begjane, padang atine tur elingan lan bisa madangake atine liyan .",
    "bilahi_bebaya": "amarga Karubuhan Kekayon sarta Kurang Panarimane",
    "sesaji_ruwat": "MOJO 30 Glundung lan ARESARESAN",
    "tindih_ruwat": "4 PICIS",
    "selamatan_sega": "SEGA TUMPENG dangdangan",
    "selamatan_iwak": "MENJANGAN kinalak ginecok bakar",
    "salawat": "4 keteng",
    "donga_slamet": "Kabula",
    "pangupaya_jiwa": "ANDERES",
    "tamba_yen_lara": "GODONG LUNTAS , utawa KEMBANG PULU winor jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 3,
    "nama_wuku": "Wukir",
    "dewane": "Sang Hyang Mahayekti",
    "watek_budi_pangerti": "ora kena tinangguh bebudine, pradah berboja kramane, sak enggon-enggone bisa paretah marang sakpadane, andap asor bebudine lan ing tembe bakal nemu kamukten Bagus warnane ugo arum wicarane, kanggep pangwulane, ora kena kaungkulan karo sakpadane, limpat sembarang gawe, angatokake kadonyane, pradah nanging ora sarju, adoh katon becik cedak katon ala, su ngil lan angel bebudine, pakewuhan nanging pradah ing pangan tur rilan lairbatin, pinter marang kagunan lan kasusastran.",
    "bilahi_bebaya": "amarga Kinaniaya dening sakpadane sarta Kasusahan Atine dewe",
    "sesaji_ruwat": "KERAMBIL saktabone 4 Glundung lan ARESARESAN",
    "tindih_ruwat": "5 PICIS",
    "selamatan_sega": "SEGA WUDUK dangdangan",
    "selamatan_iwak": "PITIK PUTIH sakwayahe linembaran kuluban warna : 5",
    "salawat": "4 keteng",
    "donga_slamet": "Rajukna",
    "pangupaya_jiwa": "UNDAGIYA(suwita)",
    "tamba_yen_lara": "GODONG PAKIS binakar winor jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 4,
    "nama_wuku": "Kurantil",
    "dewane": "Sang Hyang Langsur",
    "watek_budi_pangerti": "bisa amet atining liyan, narima ing satitah, ora duwe kanepson, nang ing puguh budine, ing tembe antuk kabegjan, ora kena diaubi amarga saka panasten, ler weh ora bisa sim pen, satibatibane kangelan nanging diasihi wong Agung lan sembarang karepe rada ngiwa, kalamangsane bisa sugih uga bisa melarat.",
    "bilahi_bebaya": "amarga tiba saka Memenek sarta Kapitenah dening wong Agung",
    "sesaji_ruwat": "NANAS sakkuncunge 7 Iji lan ARESARESAN",
    "tindih_ruwat": "7 PICIS",
    "selamatan_sega": "SEGA TUMPENG dangdangan",
    "selamatan_iwak": "PITIK sakwayahe dipecel",
    "salawat": "7 keteng",
    "donga_slamet": "Rajukna",
    "pangupaya_jiwa": "LAKU DAGANG",
    "tamba_yen_lara": "GODONG TERONG winor jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 5,
    "nama_wuku": "Tolu",
    "dewane": "Sang Hyang Bayu",
    "watek_budi_pangerti": "kukuh bakuh pambekane mintir lan tatag budine lugu wicarane, wulet tur kanggo ing kaprajuritan, ora bisa sareh/ririh kebat cukat ing gawe sarta betah melek wengi, ngatokake donyane, pradah nanging ora sarju, ing tembe bakal nemu kabegjan lan kamuktene,angkuh tur ambedidig na nging ora langgeng, demen dora carita dene akeh kang resep sing pada mulat marang deweke.",
    "bilahi_bebaya": "amarga Kasungu utawa Kasiyung sarta kakehan kang dipikir",
    "sesaji_ruwat": "SEMANGKA wu tuhan 7 gelundung lan ARESARESAN",
    "tindih_ruwat": "3 PICIS",
    "selamatan_sega": "SEGA WUDUK dangdangan",
    "selamatan_iwak": "PITIK",
    "salawat": "3 keteng",
    "donga_slamet": "Kabula",
    "pangupaya_jiwa": "NGINGU BEBEK",
    "tamba_yen_lara": "BABAKAN SUWEG utawa KUNCI lan KEN CUR binakar",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 6,
    "nama_wuku": "Gumbreg",
    "dewane": "Sang Hyang Cakra",
    "watek_budi_pangerti": "bisa ngungkuli sakpadane, ujar sapisan tur pratits, rila karana rai, pare ntahe adem ngarep panas ing buri, dadi pangaubane kadang wargane, kesit budine tur pinilala ing wong Agung, arum manis lan juweh wicarane, akeh kang resep sing pada mulat marang deweke, kanggep panga wulane, luhur piyangkuhe lan gede daulate, lila ing donyane ora nganggo raine, sugih kojah lan sugih ilmu atine sumucisuci nanging ora ngerti marang wekasane, temahan wigar anggagar tumrap ilmune.",
    "bilahi_bebaya": "amarga KABALABAG utawa KANCEMPLUNG BANYU sarta BINENDON ing wong Agung",
    "sesaji_ruwat": "BENEMAN GEMBILI 10 Iji lan ARESARESAN",
    "tindih_ruwat": "4 PICIS",
    "selamatan_sega": "SEGA PERA dangdangan",
    "selamatan_iwak": "PITIK BARUMBUN kang lumancur dipindang",
    "salawat": "4 keteng",
    "donga_slamet": "Rajukna",
    "pangupaya_jiwa": "NGUKIRUKIRA",
    "tamba_yen_lara": "BABAKAN SUWEG utawa GODONG SU WEG winor jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 7,
    "nama_wuku": "Warigalit",
    "dewane": "Sang Hyang Asmara",
    "watek_budi_pangerti": "bagus warnane, dadi kembanging pasamuwan, kerep rabi, dengki serei gede but arepane, ewuh kekarepane lumuh marang pajagongan, karem saba ing sepi, mungguh dadi pa ndita ana darajate amarga demen mangun semedi sarta prihatinan,saenggonenggon bisa dadi nanging ora lana (langgeng).",
    "bilahi_bebaya": "amarga DIEMBETAKE marang prakaraning liyan sarta LALEN",
    "sesaji_ruwat": "GEDANG GARAITA kang suluh satundun lan ARESARESAN",
    "tindih_ruwat": "4 PICIS",
    "selamatan_sega": "SEGA URA dangdangan",
    "selamatan_iwak": "KEBO RAJAPAN tukon brandon digecok",
    "salawat": "8 keteng",
    "donga_slamet": "Tolak Bilahi",
    "pangupaya_jiwa": "MANGUNMANGUNA",
    "tamba_yen_lara": "KAPAS SAWIT utawa GODONGKAPAS binenema winor jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 8,
    "nama_wuku": "Warigagung",
    "dewane": "Sang Hyang Maharesi",
    "watek_budi_pangerti": "akeh kamelikane lan abot sanggane, rame arum manis wicarane, ke dep lamun aparentah, wanter budine, bisa ngupaya ing pangane, lila peparonan, begjane ketemu ana ing tembe buri, sugih guna ora ketara, nanging linyok sajroning atine.",
    "bilahi_bebaya": "amarga KABENDON ing prasanake sarta KAPEDOTAN SIH ingkang aweh sandang pangan",
    "sesaji_ruwat": "UWI WUTUHAN ingedang lan ARESARESAN",
    "tindih_ruwat": "5 PICIS",
    "selamatan_sega": "SEGA WUDUK dangdangan",
    "selamatan_iwak": "BEBEK PUTIH diolah gegurihan lan kuluban 5 warna",
    "salawat": "5 keteng",
    "donga_slamet": "Rasul",
    "pangupaya_jiwa": "TEMEN SEMBARANG GAWE",
    "tamba_yen_lara": "KAPAS SAWIT utawa GODO NG KAPAS binakar",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 9,
    "nama_wuku": "Julungwangi",
    "dewane": "Sang Hyang Sambu",
    "watek_budi_pangerti": "sembarang gandane angambarambar, lire sabarang karepe durung nganti kelakon uwis kajuwara ing wong akeh, cepak kabegjane, lilan lan pradah budine nanging kudu kina tonake pawewehe, receh uga manis arum wicarane tur ginugu sabasane sarta kanggep pangawulane, kina sihan ing wong akeh, bisa sembarang gawe nanging sajroning atine bosenan lan amrih dudu.",
    "bilahi_bebaya": "amarga TINEBAK ING MACAN sarta sebab saka ATINE GEDE nanging ORA KASEMBADAN karepe lan",
    "sesaji_ruwat": "DUREN 7 glundung lan ARESARESAN",
    "tindih_ruwat": "KUCING",
    "selamatan_sega": "SEGA KABULI dangdangan",
    "selamatan_iwak": "PITIK ABANG winor ing sega",
    "salawat": "",
    "donga_slamet": "Tolak Bilahi",
    "pangupaya_jiwa": "ADOL TIMAH",
    "tamba_yen_lara": "KEMANGI SAWIT utawa GODONG SERE",
    "keterangan_barang_salawat": "KUCING"
  },
  {
    "no_wuku": 10,
    "nama_wuku": "Sungsang",
    "dewane": "Sang Hyang Gana",
    "watek_budi_pangerti": "petengan aten, kuwat/rosa angkat junjung, anggalidik ora bisa nganggur keras budine, karem marang darbeking liyan, boros lan adoh begjane, murka pambekane marang penggawe kang kurang patut, lila ing donyane nanging ora karana rai, gede kanepsone lan isih kena dipalangi.",
    "bilahi_bebaya": "amarga KAWSEN (kena ing wesi) sarta sebab saka BINGUNG ATINE amarga kerep ANYIDRANI JANJI",
    "sesaji_ruwat": "JAGUNG 40 ontong , lan ARESARESAN",
    "tindih_ruwat": "10 PICIS",
    "selamatan_sega": "SEGA MEGANA dangdangan",
    "selamatan_iwak": "BEBEK lan PITIK sakarepe kang olah , lan janganan warna 9 winor ing sega megana mau",
    "salawat": "10 keteng",
    "donga_slamet": "Kabula",
    "pangupaya_jiwa": "KLITIKKLITIKA",
    "tamba_yen_lara": "TEMU SAWIT utawa BONGGOL GEDANG",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 11,
    "nama_wuku": "Galungan",
    "dewane": "Sang Hyang Kamajaya",
    "watek_budi_pangerti": "bagus luruh ora lelemeran, bisa amrih ajering prihatin, tansah adedana ing badane, ora bisa gemi, satitik rejekine, gede kanepsone, karem marang darbeking liyan, anggali dik ora bisa nganggur, keras budine, anggone golek hasil sarana nenungkul waranane nganggo garagoda",
    "bilahi_bebaya": "amarga ATETUKARAN (padudon) sarta awit amarga LARANG ANAK lagi arep oleh Sih ing Gusti nuli kacanjekan ing bebaya",
    "sesaji_ruwat": "JERUK GEDE 4 glundung lan ARESAESRSAN",
    "tindih_ruwat": "9 PICIS",
    "selamatan_sega": "SEGA dangdangan",
    "selamatan_iwak": "WEDUS saulesulese lan PITIK IRENG MULUS sakwayahe dipindang",
    "salawat": "saketeng",
    "donga_slamet": "Slamet Pina",
    "pangupaya_jiwa": "DADI JAGAL",
    "tamba_yen_lara": "LAOS SAWIT",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 12,
    "nama_wuku": "Kuningan",
    "dewane": "Sang Hyang Indra",
    "watek_budi_pangerti": "andarbeni kaluwihan, enak rinungu wicarane lan ambeg kumingsun, luwih adi ing warnane nanging sumingkir saka ing parameyan lan slamet penggalihane, anguh nanging nastiti Kebat trampil sembarang gawe, kumet, sugetan aten tur isinan rame wicarane lan akeh gorohing ati, yen ti nunjel ora bisa mungkasi karya.",
    "bilahi_bebaya": "amarga DIAMUK sarta sebab TININGGAL ING BATUR lan BUSANA",
    "sesaji_ruwat": "GEDANG EMAS satundun lan ARESARESAN",
    "tindih_ruwat": "6 PICIS",
    "selamatan_sega": "SEGA PUNAR dangdangan",
    "selamatan_iwak": "KEBO RANJAPAN digoreng",
    "salawat": "duwit anyar 11 keteng",
    "donga_slamet": "Kabula",
    "pangupaya_jiwa": "ADOLA EMAS",
    "tamba_yen_lara": "KUNIR winor jamu utawa EMPU KUNIR",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 13,
    "nama_wuku": "Langkir",
    "dewane": "Sang Hyang Kala",
    "watek_budi_pangerti": "gede kanepsone, ora ngeman ing ragane, kang pada miyat wedi giris, can dala wangkot budine, murka akeh larangane, panast aten, ora kena cinedakan ing wong, ora kena ingauban lan rame wicarane, prajurit pambekane, ber kawanen ora mawang marang wong, sakeh swarane kayakaya nyilike ati nanging ora ngapaapa.",
    "bilahi_bebaya": "amarga KADURJANAN lan TETUKARAN sarta saka anggone GAWE PRAKARA dewe",
    "sesaji_ruwat": "BENDA 6 Glintir lan ARESARESAN",
    "tindih_ruwat": "6 PICIS",
    "selamatan_sega": "SEGA WUDUK dangdangan",
    "selamatan_iwak": "WEDUS lan iwak LOH linembaran , janganan kang pe pak",
    "salawat": "5 keteng",
    "donga_slamet": "Selamet Pina",
    "pangupaya_jiwa": "ADOLA KROWODAN",
    "tamba_yen_lara": "GODONG CABE SAWIT utawa BENGLE SAWIT",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 14,
    "nama_wuku": "Mandasiya",
    "dewane": "Sang Hyang Brama",
    "watek_budi_pangerti": "rosa keras pambekane, panas baranan nanging ana duryate, adem parentahe, kukuh lan diluluti ing wong akeh, dadi pangubaning wong kawelas asih, rosa budine, ora srantan barang karepe, gemi marang arta lan akeh rejekine, keliwat sabar ing ati ninging yen wis metu nepsune sok nemeni.",
    "bilahi_bebaya": "amarga KENA ING GENI sarta saka RINENGON ing wong Agung",
    "sesaji_ruwat": "JAMBU KLUTHUK 100 Iji lan ARESARESAN",
    "tindih_ruwat": "10 PICIS",
    "selamatan_sega": "SEGA AMBENGAN dangdangan beras abang , JANGANAN BAYEM ABANG",
    "selamatan_iwak": "PITIK AB ANG dipindang , amongamongane KEMBANG SETAMAN kang sarwa abang",
    "salawat": "picis anyar kang putih 40 keteng",
    "donga_slamet": "Selamet Pina",
    "pangupaya_jiwa": "CRAKIYA",
    "tamba_yen_lara": "BAWANG utawa GODONG JAMBE winor jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 15,
    "nama_wuku": "Julungpujut",
    "dewane": "Sang Hyang Guritna",
    "watek_budi_pangerti": "kaduk meneng, yen nepsu kotbisu, becik pocapane lan ana kawisaya ne, bagus rupane tanpa ganda, saenggonenggon diupaya, gede karepe, aremit budine, tur lumuh kaung kulan sambarang karepe, ngalor ngidul anggone ngupaya pangan mulane ora kekurangan rejekine.",
    "bilahi_bebaya": "amarga KATELUH lan KATARAGNYANA sarta sebab saka KENA POCAPAN ALA amarga sok nyidrani janjine",
    "sesaji_ruwat": "GEDANG BECICI kang suluh satundun , lan ARESARESAN",
    "tindih_ruwat": "6 PICIS ba njur disedekahake",
    "selamatan_sega": "SEGA TUMPENG dangdangan",
    "selamatan_iwak": "PITIK ABANG kapanggang , kulubane warna 9 , sa lawate 30 KETENG , dongane Balasrewu lan Kunut",
    "salawat": "",
    "donga_slamet": "Balasrewu Lan Kunut",
    "pangupaya_jiwa": "MALANDANGA",
    "tamba_yen_lara": "ALANGALANG lan KEMANGI winor ja mu utawa GODONG SERE",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 16,
    "nama_wuku": "Pahang",
    "dewane": "Sang Hyang Tantra",
    "watek_budi_pangerti": "paksa luwih pangucape mung waton para tatang lan angluhurake kasu janane, sugih yitna, lanas pangucape tur panasten, juweh wicarane, dadi pangaubaning wong welas asih lan wong minggat, demen ngiwa pambekan, boros lan rila ing dunyane, misuwur sabarange, ing njaba su ci nanging ing njero agung prihatin.",
    "bilahi_bebaya": "amarga KINANIAYA sarta sebab KENA ING PASANGAN",
    "sesaji_ruwat": "JAMBU KAMPLOK 100 Iji lan ARESARESAN",
    "tindih_ruwat": "7 PICIS",
    "selamatan_sega": "SEGA WUDUK dangdangan",
    "selamatan_iwak": "PITIK PUTIH MULUS linembarang kuluban warna 11",
    "salawat": "9 keteng",
    "donga_slamet": "Rasul",
    "pangupaya_jiwa": "ADOLA POLO WIJO",
    "tamba_yen_lara": "WHO KUDU utawa GODONG PACE WOH KUDU sarta DUREN",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 17,
    "nama_wuku": "Kuruwelut",
    "dewane": "Sang Hyang Wisnu",
    "watek_budi_pangerti": "prayitna mantep ing gawe, wingit wicarane, demen angungasake kawruhe, anggraita atine, karem ing kaprajuritan, selamet resik penggalihe, kesit budine, lembut barang kare pe, demen marang sesanake lan rada prihatinan, ngatokake donyane, pradah nanging ora sarju, gede bu dine tur akeh begjane, watake angluwihi wicarane nanging ora teyeng wigati.",
    "bilahi_bebaya": "amarga KASUSAHAN lan KINANIAYA ING DURJANA",
    "sesaji_ruwat": "TEBU IRENG 4 Lonjor lan ARESARESAN",
    "tindih_ruwat": "6 PICIS",
    "selamatan_sega": "WEDUS TRUJAH (wedus kang putih sikile ing ngarep) kaolah kang pepak",
    "selamatan_iwak": "-",
    "salawat": "100 keteng",
    "donga_slamet": "Kabula",
    "pangupaya_jiwa": "DADIYA CARIK",
    "tamba_yen_lara": "BLIGO winor jamu , utawa GODONG BLI GO lan OYODE",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 18,
    "nama_wuku": "Marakeh",
    "dewane": "Sang Hyang Surenggana",
    "watek_budi_pangerti": "rada sinung kaelingan, saguh gumolong wicarane lan wani ing pakewuh, ora ana gawene, ora kena dikokon adoh, amasti kena ing bebaya, cepak kamuktene, angatokake pasihaning Dewane, kumet nanging arum manis wicarane lan tinunjel ing rembuk banjur anjloprongake murih dudune ing sapadapada",
    "bilahi_bebaya": "amarga KABALABAK sarta sebab saka dialakake ing wong akeh lan kerep diapusi",
    "sesaji_ruwat": "KEMIRI 100 Iji lan ARESARESAN",
    "tindih_ruwat": "100 PICIS",
    "selamatan_sega": "SEGA WUDUK dangdangan",
    "selamatan_iwak": "PITIK PUTIH MULUS linembaran lan JUWADAH warna-warna",
    "salawat": "100 keteng",
    "donga_slamet": "Tolak Bilahi",
    "pangupaya_jiwa": "NANDUR GEDANG",
    "tamba_yen_lara": "LERI BUNGKAK utawa BRAMBANG lan KUNCI",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 19,
    "nama_wuku": "Tambir",
    "dewane": "Sang Hyang Siwah",
    "watek_budi_pangerti": "ing tata lair seje karo batine, gegendungan bebudene kumalungkung lan demen gawe warta pangerameram tur weruh ing wewadi lan wangsit, ora kena ingauban, kumenjas bara ng wicarane, kumet sarta oneng asih ing Dewane, gede prabawan lan napsune, nanging akeh pepagere ing awake.",
    "bilahi_bebaya": "amarga kena ing PASANGAN sarta awit saka tininggal ing SANDANG PANGANE",
    "sesaji_ruwat": "sesa ji TIMUN 25 Iji lan ARESARESAN",
    "tindih_ruwat": "DOM 100 Iji lan PANGOT WAJA SARAKIT",
    "selamatan_sega": "SEGA PULEN dangdangan",
    "selamatan_iwak": "BEBEK LAN PITIK dipindang duduh putih lan duduh ab ang nganggo AMBENGAN TIMUN WATANG 25 Iji",
    "salawat": "",
    "donga_slamet": "Selamet Pina",
    "pangupaya_jiwa": "NGUNGGAHNA BANYU",
    "tamba_yen_lara": "SUNTI winor jamu , utawa GODHONG RANTI",
    "keterangan_barang_salawat": "PANGOT lan DOM SIJI"
  },
  {
    "no_wuku": 20,
    "nama_wuku": "Medangkungan",
    "dewane": "Sang Hyang Basuki",
    "watek_budi_pangerti": "putus ing pamicara, narima ing titah, mantep budine, demen saba ing banyu, pikire katemu ing buri, dadi kembanging alas, yen ana ing nagara ora ana gawene, angluhurake ka dunyane, ngungasake tadane, ing satemah dadi nista lan atine rerenggi, amarga ora sukuran atine",
    "bilahi_bebaya": "amarga KACIDRA ing wayah wengi , sarana KASUDUK sarta saka enggone MADA PAWONGANG satemah nemu ing papa",
    "sesaji_ruwat": "KLAYU Satampah lan ARESARESAN",
    "tindih_ruwat": "10 PICIS",
    "selamatan_sega": "SEGA PUNAR dangdangan",
    "selamatan_iwak": "PITIK WIRING KUNING lan JENANG ABANG",
    "salawat": "5 keteng",
    "donga_slamet": "Umur",
    "pangupaya_jiwa": "ADOLA KAYU",
    "tamba_yen_lara": "JAHE winor jamu utawa JAHE lan SUNTI",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 21,
    "nama_wuku": "Maktal",
    "dewane": "Sang Hyang Sakri",
    "watek_budi_pangerti": "banter atenatene, mantep ing sembarang, bagus warnane, arum wicarane tur pinilala sarta kinasihan ing wong Agung, kesit budine, kanggep pangawulane, luhur piyangkuhe gede daulate, sugihe bareng lan kasinggihane, wicarane daksiya marang sapadapadane nanging ing tembe yen uwis tuwa kasinungan becik budine.",
    "bilahi_bebaya": "amarga TETUKARAN sarta awit saka SINAING ing wong Agung",
    "sesaji_ruwat": "MANGGIS 30 Iji lan ARESARESAN",
    "tindih_ruwat": "6 PICIS",
    "selamatan_sega": "SEGA WUDUK dangdangan",
    "selamatan_iwak": "PITIK lan BEBEK diolah warna loro pinindang lan line mbaran , ujube memule ing Gusti Rasul",
    "salawat": "4 keteng",
    "donga_slamet": "Rasul",
    "pangupaya_jiwa": "ADOLA SALAKA",
    "tamba_yen_lara": "TALES winor ing jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 22,
    "nama_wuku": "Wuye",
    "dewane": "Sang Hyang Kuwera",
    "watek_budi_pangerti": "bisa ambebungah atine wong, kenceng anggawokake wicarane, tambuh ing rame lan karem ing kaprajuritan, parentahe awor cugetan sarta putungan aten nanging ora lana lan uwas marang panggawe rahayu, prayitna tur landep atine, rila ing kekasihane, barang darbeke marang ka ng dadi karujukane uwis ora nganggo diengetake, luwih rilane sarta pracayane nanging sok mutung, dawa umure, gede daulate, luwih but arepane ora karem ing karameyan, rada pakewuhan, angel bebudene tan pa dadi enggone perang pamikir.",
    "bilahi_bebaya": "amarga KATELUH lan KATRAGNYANA sarta saka KAGEDEN PANGARUH",
    "sesaji_ruwat": "KACA NG DUNDUNGAN 6 tekem lan ARESARESAN",
    "tindih_ruwat": "7 PICIS",
    "selamatan_sega": "TUKON PASAR sawarnane lan sakehing JUWADAHAN , pangaji satak sawe , entekna kabeh kang tinuku disik MADU bakal ginawe salawat , dongane Tolak Bilahi.",
    "selamatan_iwak": "-",
    "salawat": "",
    "donga_slamet": "Tolak Bilahi",
    "pangupaya_jiwa": "ADOLA SALAKA",
    "tamba_yen_lara": "BAYEM winor ing jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 23,
    "nama_wuku": "Manahil",
    "dewane": "Sang Hyang Citragotra",
    "watek_budi_pangerti": "angluhurake awake, pinter ngumpuli ing rame nanging angkuh, agu ng jagajaga bela tanpa pambekane, prayitna landep atine, satitk gawene nanging wulet tur kesit budine le mbut barang pikire, akedik pangane, andap asor parentahe nanging ora nganggo pangkat, angucira ing gawe, cat katon cat ora / sok sregep sok kesed.",
    "bilahi_bebaya": "amarga kena ing GEGAMAN sarta lagi becik awake KATEKAN BILAHI",
    "sesaji_ruwat": "KAPUNDUNG saktampah lan ARESARESAN",
    "tindih_ruwat": "9 PICIS",
    "selamatan_sega": "SEGA LIWET dangdangan",
    "selamatan_iwak": "PITIK sakwayahe lan IWAK LOH , janganan kang pepak sambel gepeng",
    "salawat": "9 keteng",
    "donga_slamet": "Selamet Tolak Bilahi",
    "pangupaya_jiwa": "ADOLA PADANG utawa KERIS",
    "tamba_yen_lara": "KACANG winor ing jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 24,
    "nama_wuku": "Prangbakat",
    "dewane": "Sang Hyang Bisma",
    "watek_budi_pangerti": "kakon aten anggaregut, trengginas ing gawe tur isinan, angatokake wa taking prajurit lumaku tinuduh ing aprang, sembarang budine ora ana kang dipakewuhake, kenceng pangkat pamicarane, parentahe adem ngarep panas ing buri, dawa umure, cukup lumintu sandang pangane, ku kuh bakuh piyangkuhe, kebat sembarang gawe, isinan puguh tur kakon aten, dreman ing ilmu tur alus suci",
    "bilahi_bebaya": "amarga saka MEMENEK utawa POLAHE DEWE sarta jalaran DIALAKAKE ING SANAK KANCANE",
    "sesaji_ruwat": "RAMBUTAN satampah lan ARESARESAN",
    "tindih_ruwat": "WESI GLIGEN",
    "selamatan_sega": "SEGA TUMPENG dangdangan",
    "selamatan_iwak": "SAPI diolah jajatah (sate) bumbu manis , janganan kang pepak",
    "salawat": "",
    "donga_slamet": "Selamet Pina",
    "pangupaya_jiwa": "AHLIYA MEMARANG",
    "tamba_yen_lara": "BENGUK winor ing jamu",
    "keterangan_barang_salawat": "PACUL"
  },
  {
    "no_wuku": 25,
    "nama_wuku": "Bala",
    "dewane": "Sang Hyang Batari Durga",
    "watek_budi_pangerti": "karem agawe garagoda, kekes giris miris kang krungu, jahil sarta karem angubungi ing kadursilan, ora ana kang dikeringi, luwih rosa yen lumaku silib, rame wicarane, ora kena ingauban, panas parentahe nanging kedep, kesit budine tur cedak maring wong Agung, luhur piyang kuhe, akeh daulate lan kanggep pangawulane, angtokake kasugihane, ora kena tinangguh bebudene,salah candak enggone ngupaya pangan, malah lara kasurangsurang.",
    "bilahi_bebaya": "amarga KATELUH lan KENA ING UPAS sarta yen KAWIYAK WADINE",
    "sesaji_ruwat": "KARA satampah lan ARESARESAN",
    "tindih_ruwat": "7 PICIS",
    "selamatan_sega": "SEGA TUMPENG dangdangan , janganan warna 7",
    "selamatan_iwak": "PITIK IRENG MULUS dipanggang",
    "salawat": "40 keteng",
    "donga_slamet": "Rajukna",
    "pangupaya_jiwa": "ADOLA SEGA",
    "tamba_yen_lara": "WIJEN SAWIT winor ing jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 26,
    "nama_wuku": "Wugu",
    "dewane": "Sang Hyang Singajalma",
    "watek_budi_pangerti": "jembar budine, lepas kawruhe, sugih barang pangawikan nanging darbe budi rerenggi, luwes memes andap asor nanging srei, luwih prayitna ing lair nanging sakjroning ati kurang sujana, siaga andulu kaya anyidam yen uwis kelakon mangan ewa atine, ora kena kumpul ing akeh amarga mung mikir karepe dewe sarta kumet, ewuh kekarepane nanging jembar budine lan polatane .",
    "bilahi_bebaya": "amarga KACAKOT ULO utawa jalaran TETUKARAN lan sanak kadange",
    "sesaji_ruwat": "KIMPUL satampah lan ARESARESAN",
    "tindih_ruwat": "10 PICIS",
    "selamatan_sega": "SEGA PULEN dangdangan lan JUWADAH sawarnane , tukon pasar",
    "selamatan_iwak": "BEBEK PUTIH sajodo linembaran",
    "salawat": "10 keteng",
    "donga_slamet": "Selamet Kabula",
    "pangupaya_jiwa": "BLANTIK JARAN",
    "tamba_yen_lara": "TEBU IRENG winor ing jamu",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 27,
    "nama_wuku": "Wayang",
    "dewane": "Sang Hyang Batari Sri",
    "watek_budi_pangerti": "yen lanang bagus, yen wadon ayu warnane, tansah prihatin, anggung nastapa, welasan pambekane, pradah ing bojakramane tur nastiti, arum manis adem parentahe, luwes amemes sasolahe, akeh kayungyun kang mulat, resep kang andulu, pinilala ing wong Agung, arum manis ujare, gede daulate, kesit budine, rila ing donyane nanging kudu katingalake kabecikane, murah sandang pangane, prayitna landep atine, parentahe gampang ngarep angel ing buri, bisa madangake ati kang susah resik tur suci ing budi, temah yuwana sugih sarta terang ilmune.",
    "bilahi_bebaya": "amarga KACIDRA sarta sebab PETENG ATINE amarga kabeka sanak kadang",
    "sesaji_ruwat": "PELEM kang manis satampah lan ARESARESAN",
    "tindih_ruwat": "8 PICIS",
    "selamatan_sega": "SEGA TUMPENG dangdangan",
    "selamatan_iwak": "WEDUS KENDIT diolah kang samekta , JUWADAH kang prayoga lan iwake PITIK diolah kang samekta , janganan pepak",
    "salawat": "4 keteng",
    "donga_slamet": "Bumi",
    "pangupaya_jiwa": "DADIYA JOGET",
    "tamba_yen_lara": "KECIPIR",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 28,
    "nama_wuku": "Kulawu",
    "dewane": "Sang Hyang Sadhana",
    "watek_budi_pangerti": "ku,kuh tatag pambekane tur tanggon, welasan lan bisa ambungahake sapadane, dawa umure, gede daulate tur luwih kuwat, boros tarabas ora bisa sesimpen, akeh begjane, ge de budine, pradah rila ing donyane, adem ayem sembarang parentahe, rada kethul atine nanging bares ora darbe sigen, kawitane miskin nanging wekasane dadi sugih, awet jodone lamun wewayuhan .",
    "bilahi_bebaya": "amarga kena ing UPAS lan KACAKOT ULO",
    "sesaji_ruwat": "WALUH 2 Iji ingedang jeroning ginulan lan ARESARESAN",
    "tindih_ruwat": "4 PICIS",
    "selamatan_sega": "SEGA GOLONG dangdangan",
    "selamatan_iwak": "PITIK lan BEBEK pada ules abange sarta IWAK LOH diolah sakarepe",
    "salawat": "5keteng",
    "donga_slamet": "Kabula",
    "pangupaya_jiwa": "ADOLA DOM",
    "tamba_yen_lara": "SABARANG WALUH",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 29,
    "nama_wuku": "Dukut",
    "dewane": "Sang Hyang Baruna",
    "watek_budi_pangerti": "prajurit, wanter keras budine, antepan lan wasis panggalihe, ora pegat ing kasujanane, pinilala ing wong Agung, kanggep pangawulane, arum manis wicarane, luhur piyangkuhe, gede daulate, prayitna landep panggraitane, barang katon kapengin, kiwa enggone epeh tan kena pinarekan gemi agung kasugihane lan akeh wong asih, bagus warnane lan gemi prawira ing lungid nanging cacade wedi lan isin ing paprangan .",
    "bilahi_bebaya": "amarga ana satengahing PAPRANGAN sarta sebab saka TININGGAL ing GUSTI lan WONG TUWA sing andadekake MELARAT",
    "sesaji_ruwat": "PARE WELUT wutuhan kinulup satampah lan ARESARESAN",
    "tindih_ruwat": "6 PICIS",
    "selamatan_sega": "SEGA TUMPENG dangdangan",
    "selamatan_iwak": "PITIK PUTIH MULUS lan PITIK BARUMBUN dipang gang",
    "salawat": "satak sawe keteng",
    "donga_slamet": "Selamet Pina",
    "pangupaya_jiwa": "ADOLA GEGODONGAN",
    "tamba_yen_lara": "LAMPES SAWIT",
    "keterangan_barang_salawat": ""
  },
  {
    "no_wuku": 30,
    "nama_wuku": "Watugunung",
    "dewane": "Sang Hyang Anantaboga lan Sang Hyang Batari Nagagini",
    "watek_budi_pangerti": "akeh kekarepane tansah prihatinan agung nantang catur, lumuh kaungkulan, kemaron sih lan angajab luputing wong, gugon tuhon tur manutan bagus warnane, sumingkir ing karameyan, wingit wicarane, gede butarepane, tambuh ing rame, karem saba ing asepi mungguh amandita ana darajate, demen mangun samadi nanging prihatinan, kasinungan cahya padang atine.",
    "bilahi_bebaya": "amarga KAPUSARA lan KINANIAYA sarta KENA WALAT amarga saka tekade dewe",
    "sesaji_ruwat": "GEDANG RAJA kang suluh satundun lan MUNDU kang kuning satampah sarta ARESARESAN kang pepak sakehing pala kapendem , kasempar lan gumantung",
    "tindih_ruwat": "SATAK SAWE",
    "selamatan_sega": "SEGA TUMPENG dangdangan",
    "selamatan_iwak": "BURON DARAT , BURON MABUR lan BURON LENG ,kang pada khalal kabeh , wowohan , juwadah kang papak , kuluban warna 7",
    "salawat": "19 keteng",
    "donga_slamet": "Mubarak",
    "pangupaya_jiwa": "ADOLA BATA",
    "tamba_yen_lara": "RANTI SAWIT",
    "keterangan_barang_salawat": ""
  }
];

const pawukonDatabase = {};

// Daftarkan ke database berdasarkan nomor wuku dan nama wuku (serta alias umum)
PAWUKON_LIST.forEach(item => {
  pawukonDatabase[item.no_wuku] = item;
  pawukonDatabase[item.nama_wuku] = item;
  pawukonDatabase[item.nama_wuku.toLowerCase()] = item;

  // Nama berformat Uppercase & Title Case
  pawukonDatabase[item.nama_wuku.toUpperCase()] = item;
  const titleName = item.nama_wuku.charAt(0).toUpperCase() + item.nama_wuku.slice(1).toLowerCase();
  pawukonDatabase[titleName] = item;
});

// Alias-alias ejaan tradisional yang sering digunakan
const WUKU_ALIASES = {
  'sinto': 1, 'shinto': 1, 'sinta': 1,
  'landep': 2,
  'wukir': 3,
  'kurantil': 4, 'kulantir': 4,
  'tolu': 5,
  'gumbreg': 6,
  'warigalit': 7,
  'warigagung': 8, 'wariagung': 8,
  'julungwangi': 9, 'julung wangi': 9,
  'sungsang': 10,
  'galungan': 11,
  'kuningan': 12,
  'langkir': 13,
  'mandasiya': 14, 'mandungan': 14,
  'julungpujut': 15, 'julung pujut': 15, 'pujut': 15,
  'pahang': 16,
  'kuruwelut': 17,
  'marakeh': 18,
  'tambir': 19,
  'madangkungan': 20, 'mendangkungan': 20, 'medangkungan': 20,
  'maktal': 21,
  'wuye': 22,
  'manahil': 23, 'menail': 23,
  'prangbakat': 24,
  'bala': 25,
  'wugu': 26,
  'wayang': 27,
  'kulawu': 28,
  'dukut': 29,
  'watugunung': 30, 'watu gunung': 30
};

Object.entries(WUKU_ALIASES).forEach(([alias, no]) => {
  const target = pawukonDatabase[no];
  if (target) {
    pawukonDatabase[alias] = target;
    pawukonDatabase[alias.replace(/\s+/g, '')] = target;
  }
});

function getPawukonData(wukuNameOrNo) {
  if (wukuNameOrNo === undefined || wukuNameOrNo === null) return null;
  if (typeof wukuNameOrNo === 'number') {
    return pawukonDatabase[wukuNameOrNo] || null;
  }
  const clean = String(wukuNameOrNo).trim().toLowerCase();
  if (pawukonDatabase[clean]) return pawukonDatabase[clean];
  const noSpaces = clean.replace(/\s+/g, '');
  if (pawukonDatabase[noSpaces]) return pawukonDatabase[noSpaces];
  const parsedNo = parseInt(clean, 10);
  if (!isNaN(parsedNo) && pawukonDatabase[parsedNo]) return pawukonDatabase[parsedNo];
  return null;
}

  root.PAWUKON_LIST = PAWUKON_LIST;
  root.pawukonDatabase = pawukonDatabase;
  root.getPawukonData = getPawukonData;
  root.getPawukonDetail = getPawukonData;
  root.MASTER_PAWUKON = pawukonDatabase;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      PAWUKON_LIST,
      pawukonDatabase,
      MASTER_PAWUKON: pawukonDatabase,
      getPawukonData,
      getPawukonDetail: getPawukonData
    };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

const _gPwk = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : {});
export const PAWUKON_LIST = _gPwk.PAWUKON_LIST;
export const pawukonDatabase = _gPwk.pawukonDatabase;
export const MASTER_PAWUKON = _gPwk.pawukonDatabase;
export const getPawukonData = _gPwk.getPawukonData;
export const getPawukonDetail = _gPwk.getPawukonData;

export default {
  PAWUKON_LIST: _gPwk.PAWUKON_LIST,
  pawukonDatabase: _gPwk.pawukonDatabase,
  MASTER_PAWUKON: _gPwk.pawukonDatabase,
  getPawukonData: _gPwk.getPawukonData,
  getPawukonDetail: _gPwk.getPawukonData
};

