// =========================================================================
// BASIS DATA MATRIKS LOOKUP TABEL BAKU PRIMBON (210 HARI PAWUKON JAWA)
// Format Kunci: "[NamaWeton]_[NamaWuku]" (Contoh: "SelasaLegi_Landep")
// =========================================================================

const primbonMatrix = {
  // --- WUKU 1: SHINTO ---
  "MingguPahing_Shinto": {
    padewan: "Sri",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  "MingguPahing_Sinta": {
    padewan: "Sri",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  "SeninPon_Shinto": {
    padewan: "Indra",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "SeninPon_Sinta": {
    padewan: "Indra",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "SelasaWage_Shinto": {
    padewan: "Guru",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "SelasaWage_Sinta": {
    padewan: "Guru",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "RabuKliwon_Shinto": {
    padewan: "Yamadipati",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "RabuKliwon_Sinta": {
    padewan: "Yamadipati",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "KamisLegi_Shinto": {
    padewan: "Rudra",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "KamisLegi_Sinta": {
    padewan: "Rudra",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "JumatPahing_Shinto": {
    padewan: "Brama",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Tunggak Semi",
    kamarokan: "Mantri Sinarojo"
  },
  "JumatPahing_Sinta": {
    padewan: "Brama",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Tunggak Semi",
    kamarokan: "Mantri Sinarojo"
  },
  "SabtuPon_Shinto": {
    padewan: "Kala",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Banyu",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  "SabtuPon_Sinta": {
    padewan: "Kala",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Banyu",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  // --- WUKU 2: LANDEP ---
  "MingguWage_Landep": {
    padewan: "Uma",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Lakuning Angin",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Kala Tinantang"
  },
  "SeninKliwon_Landep": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "SelasaLegi_Landep": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "RabuPahing_Landep": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Lakuning Banyu",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  "KamisPon_Landep": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "JumatWage_Landep": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "SabtuKliwon_Landep": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Lakuning Bumi",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  // --- WUKU 3: WUKIR ---
  "MingguLegi_Wukir": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "SeninPahing_Wukir": {
    padewan: "Uma",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SelasaPon_Wukir": {
    padewan: "Sri",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Aras Pepet",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "RabuWage_Wukir": {
    padewan: "Indra",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "KamisKliwon_Wukir": {
    padewan: "Guru",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Lakuning Banyu",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Kala Tinantang"
  },
  "JumatLegi_Wukir": {
    padewan: "Yamadipati",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Aras Tuding",
    pancasuda: "Satriya Wirang",
    kamarokan: "Sanggar Waringin"
  },
  "SabtuPahing_Wukir": {
    padewan: "Rudra",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Lakuning Geni",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Macan Ketawan"
  },
  // --- WUKU 4: KURANTIL ---
  "MingguPon_Kurantil": {
    padewan: "Brama",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Aras Kembang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SeninWage_Kurantil": {
    padewan: "Kala",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Sanggar Waringin"
  },
  "SelasaKliwon_Kurantil": {
    padewan: "Uma",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "RabuLegi_Kurantil": {
    padewan: "Sri",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Aras Kembang",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "KamisPahing_Kurantil": {
    padewan: "Indra",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "JumatPon_Kurantil": {
    padewan: "Guru",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Macan Ketawan"
  },
  "SabtuWage_Kurantil": {
    padewan: "Yamadipati",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Nuju Padu"
  },
  // --- WUKU 5: TOLU ---
  "MingguKliwon_Tolu": {
    padewan: "Rudra",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "SeninLegi_Tolu": {
    padewan: "Brama",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Lakuning Angin",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "SelasaPahing_Tolu": {
    padewan: "Kala",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Kala Tinantang"
  },
  "RabuPon_Tolu": {
    padewan: "Uma",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "KamisWage_Tolu": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Aras Kembang",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "JumatKliwon_Tolu": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Kala Tinantang"
  },
  "SabtuLegi_Tolu": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Mantri Sinarojo"
  },
  // --- WUKU 6: GUMBREG ---
  "MingguPahing_Gumbreg": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  "SeninPon_Gumbreg": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "SelasaWage_Gumbreg": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "RabuKliwon_Gumbreg": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "KamisLegi_Gumbreg": {
    padewan: "Uma",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "JumatPahing_Gumbreg": {
    padewan: "Sri",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Tunggak Semi",
    kamarokan: "Mantri Sinarojo"
  },
  "SabtuPon_Gumbreg": {
    padewan: "Indra",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Banyu",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  // --- WUKU 7: WARIGALIT ---
  "MingguWage_Warigalit": {
    padewan: "Guru",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Angin",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Kala Tinantang"
  },
  "SeninKliwon_Warigalit": {
    padewan: "Yamadipati",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "SelasaLegi_Warigalit": {
    padewan: "Rudra",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "RabuPahing_Warigalit": {
    padewan: "Brama",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Lakuning Banyu",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  "KamisPon_Warigalit": {
    padewan: "Kala",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "JumatWage_Warigalit": {
    padewan: "Uma",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "SabtuKliwon_Warigalit": {
    padewan: "Sri",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Lakuning Bumi",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  // --- WUKU 8: WARIGAGUNG ---
  "MingguLegi_Warigagung": {
    padewan: "Indra",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "SeninPahing_Warigagung": {
    padewan: "Guru",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Lakuning Lintang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SelasaPon_Warigagung": {
    padewan: "Yamadipati",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Aras Pepet",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "RabuWage_Warigagung": {
    padewan: "Rudra",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "KamisKliwon_Warigagung": {
    padewan: "Brama",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Lakuning Banyu",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Kala Tinantang"
  },
  "JumatLegi_Warigagung": {
    padewan: "Kala",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Aras Tuding",
    pancasuda: "Satriya Wirang",
    kamarokan: "Sanggar Waringin"
  },
  "SabtuPahing_Warigagung": {
    padewan: "Uma",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Lakuning Geni",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Macan Ketawan"
  },
  // --- WUKU 9: JULUNG WANGI ---
  "MingguPon_JulungWangi": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Aras Kembang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "MingguPon_Julung Wangi": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Aras Kembang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SeninWage_JulungWangi": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Sanggar Waringin"
  },
  "SeninWage_Julung Wangi": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Sanggar Waringin"
  },
  "SelasaKliwon_JulungWangi": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "SelasaKliwon_Julung Wangi": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "RabuLegi_JulungWangi": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Aras Kembang",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "RabuLegi_Julung Wangi": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Aras Kembang",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "KamisPahing_JulungWangi": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "KamisPahing_Julung Wangi": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "JumatPon_JulungWangi": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Macan Ketawan"
  },
  "JumatPon_Julung Wangi": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Macan Ketawan"
  },
  "SabtuWage_JulungWangi": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Nuju Padu"
  },
  "SabtuWage_Julung Wangi": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Nuju Padu"
  },
  // --- WUKU 10: SUNGSANG ---
  "MingguKliwon_Sungsang": {
    padewan: "Uma",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "SeninLegi_Sungsang": {
    padewan: "Sri",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Lakuning Angin",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "SelasaPahing_Sungsang": {
    padewan: "Indra",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Kala Tinantang"
  },
  "RabuPon_Sungsang": {
    padewan: "Guru",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "KamisWage_Sungsang": {
    padewan: "Yamadipati",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Aras Kembang",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "JumatKliwon_Sungsang": {
    padewan: "Rudra",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Kala Tinantang"
  },
  "SabtuLegi_Sungsang": {
    padewan: "Brama",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Mantri Sinarojo"
  },
  // --- WUKU 11: GALUNGAN ---
  "MingguPahing_Galungan": {
    padewan: "Kala",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  "SeninPon_Galungan": {
    padewan: "Kala",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "SelasaWage_Galungan": {
    padewan: "Kala",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "RabuKliwon_Galungan": {
    padewan: "Uma",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "KamisLegi_Galungan": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "JumatPahing_Galungan": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Tunggak Semi",
    kamarokan: "Mantri Sinarojo"
  },
  "SabtuPon_Galungan": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Lakuning Banyu",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  // --- WUKU 12: KUNINGAN ---
  "MingguWage_Kuningan": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Angin",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Kala Tinantang"
  },
  "SeninKliwon_Kuningan": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "SelasaLegi_Kuningan": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "RabuPahing_Kuningan": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Banyu",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  "KamisPon_Kuningan": {
    padewan: "Uma",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "JumatWage_Kuningan": {
    padewan: "Sri",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "SabtuKliwon_Kuningan": {
    padewan: "Indra",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Lakuning Bumi",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  // --- WUKU 13: LANGKIR ---
  "MingguLegi_Langkir": {
    padewan: "Guru",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "SeninPahing_Langkir": {
    padewan: "Yamadipati",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Lakuning Lintang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SelasaPon_Langkir": {
    padewan: "Rudra",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Aras Pepet",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "RabuWage_Langkir": {
    padewan: "Brama",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "KamisKliwon_Langkir": {
    padewan: "Kala",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Lakuning Banyu",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Kala Tinantang"
  },
  "JumatLegi_Langkir": {
    padewan: "Uma",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Aras Tuding",
    pancasuda: "Satriya Wirang",
    kamarokan: "Sanggar Waringin"
  },
  "SabtuPahing_Langkir": {
    padewan: "Sri",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Lakuning Geni",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Macan Ketawan"
  },
  // --- WUKU 14: MANDASIYA ---
  "MingguPon_Mandasiya": {
    padewan: "Indra",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Aras Kembang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SeninWage_Mandasiya": {
    padewan: "Guru",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Sanggar Waringin"
  },
  "SelasaKliwon_Mandasiya": {
    padewan: "Yamadipati",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "RabuLegi_Mandasiya": {
    padewan: "Rudra",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Aras Kembang",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "KamisPahing_Mandasiya": {
    padewan: "Brama",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "JumatPon_Mandasiya": {
    padewan: "Kala",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Macan Ketawan"
  },
  "SabtuWage_Mandasiya": {
    padewan: "Uma",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Nuju Padu"
  },
  // --- WUKU 15: JULUNG PUJUT ---
  "MingguKliwon_JulungPujut": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "MingguKliwon_Julung Pujut": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "SeninLegi_JulungPujut": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Lakuning Angin",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "SeninLegi_Julung Pujut": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Lakuning Angin",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "SelasaPahing_JulungPujut": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Kala Tinantang"
  },
  "SelasaPahing_Julung Pujut": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Kala Tinantang"
  },
  "RabuPon_JulungPujut": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "RabuPon_Julung Pujut": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "KamisWage_JulungPujut": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Aras Kembang",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "KamisWage_Julung Pujut": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Aras Kembang",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "JumatKliwon_JulungPujut": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Kala Tinantang"
  },
  "JumatKliwon_Julung Pujut": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Kala Tinantang"
  },
  "SabtuLegi_JulungPujut": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Mantri Sinarojo"
  },
  "SabtuLegi_Julung Pujut": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Mantri Sinarojo"
  },
  // --- WUKU 16: PAHANG ---
  "MingguPahing_Pahang": {
    padewan: "Uma",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  "SeninPon_Pahang": {
    padewan: "Sri",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "SelasaWage_Pahang": {
    padewan: "Indra",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "RabuKliwon_Pahang": {
    padewan: "Guru",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "KamisLegi_Pahang": {
    padewan: "Yamadipati",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "JumatPahing_Pahang": {
    padewan: "Rudra",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Tunggak Semi",
    kamarokan: "Mantri Sinarojo"
  },
  "SabtuPon_Pahang": {
    padewan: "Brama",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Lakuning Banyu",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  // --- WUKU 17: KURUWELUT ---
  "MingguWage_Kuruwelut": {
    padewan: "Kala",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Lakuning Angin",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Kala Tinantang"
  },
  "SeninKliwon_Kuruwelut": {
    padewan: "Uma",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "SelasaLegi_Kuruwelut": {
    padewan: "Sri",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "RabuPahing_Kuruwelut": {
    padewan: "Indra",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Lakuning Banyu",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  "KamisPon_Kuruwelut": {
    padewan: "Guru",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "JumatWage_Kuruwelut": {
    padewan: "Yamadipati",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "SabtuKliwon_Kuruwelut": {
    padewan: "Rudra",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Lakuning Bumi",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  // --- WUKU 18: MARAKEH ---
  "MingguLegi_Marakeh": {
    padewan: "Brama",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "SeninPahing_Marakeh": {
    padewan: "Kala",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Lakuning Lintang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SelasaPon_Marakeh": {
    padewan: "Uma",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Aras Pepet",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "RabuWage_Marakeh": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "KamisKliwon_Marakeh": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Lakuning Banyu",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Kala Tinantang"
  },
  "JumatLegi_Marakeh": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Aras Tuding",
    pancasuda: "Satriya Wirang",
    kamarokan: "Sanggar Waringin"
  },
  "SabtuPahing_Marakeh": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Lakuning Geni",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Macan Ketawan"
  },
  // --- WUKU 19: TAMBIR ---
  "MingguPon_Tambir": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Aras Kembang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SeninWage_Tambir": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Sanggar Waringin"
  },
  "SelasaKliwon_Tambir": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "RabuLegi_Tambir": {
    padewan: "Uma",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Aras Kembang",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "KamisPahing_Tambir": {
    padewan: "Sri",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "JumatPon_Tambir": {
    padewan: "Indra",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Macan Ketawan"
  },
  "SabtuWage_Tambir": {
    padewan: "Guru",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Nuju Padu"
  },
  // --- WUKU 20: MADANGKUNGAN ---
  "MingguKliwon_Madangkungan": {
    padewan: "Yamadipati",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "SeninLegi_Madangkungan": {
    padewan: "Rudra",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Angin",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "SelasaPahing_Madangkungan": {
    padewan: "Brama",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Kala Tinantang"
  },
  "RabuPon_Madangkungan": {
    padewan: "Kala",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "KamisWage_Madangkungan": {
    padewan: "Uma",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Aras Kembang",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "JumatKliwon_Madangkungan": {
    padewan: "Sri",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Kala Tinantang"
  },
  "SabtuLegi_Madangkungan": {
    padewan: "Indra",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Mantri Sinarojo"
  },
  // --- WUKU 21: MAKTAL ---
  "MingguPahing_Maktal": {
    padewan: "Guru",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  "SeninPon_Maktal": {
    padewan: "Yamadipati",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "SelasaWage_Maktal": {
    padewan: "Rudra",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "RabuKliwon_Maktal": {
    padewan: "Brama",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "KamisLegi_Maktal": {
    padewan: "Kala",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "JumatPahing_Maktal": {
    padewan: "Uma",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Tunggak Semi",
    kamarokan: "Mantri Sinarojo"
  },
  "SabtuPon_Maktal": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Lakuning Banyu",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  // --- WUKU 22: WUYE ---
  "MingguWage_Wuye": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Lakuning Angin",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Kala Tinantang"
  },
  "SeninKliwon_Wuye": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "SelasaLegi_Wuye": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "RabuPahing_Wuye": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Banyu",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  "KamisPon_Wuye": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "JumatWage_Wuye": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "SabtuKliwon_Wuye": {
    padewan: "Uma",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Lakuning Bumi",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  // --- WUKU 23: MANAHIL ---
  "MingguLegi_Manahil": {
    padewan: "Sri",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "SeninPahing_Manahil": {
    padewan: "Indra",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Lakuning Lintang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SelasaPon_Manahil": {
    padewan: "Guru",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Aras Pepet",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "RabuWage_Manahil": {
    padewan: "Yamadipati",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "KamisKliwon_Manahil": {
    padewan: "Rudra",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Lakuning Banyu",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Kala Tinantang"
  },
  "JumatLegi_Manahil": {
    padewan: "Brama",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Aras Tuding",
    pancasuda: "Satriya Wirang",
    kamarokan: "Sanggar Waringin"
  },
  "SabtuPahing_Manahil": {
    padewan: "Kala",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Lakuning Geni",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Macan Ketawan"
  },
  // --- WUKU 24: PRANGBAKAT ---
  "MingguPon_Prangbakat": {
    padewan: "Uma",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Aras Kembang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SeninWage_Prangbakat": {
    padewan: "Sri",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Sanggar Waringin"
  },
  "SelasaKliwon_Prangbakat": {
    padewan: "Indra",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "RabuLegi_Prangbakat": {
    padewan: "Guru",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Aras Kembang",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "KamisPahing_Prangbakat": {
    padewan: "Yamadipati",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "JumatPon_Prangbakat": {
    padewan: "Rudra",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Macan Ketawan"
  },
  "SabtuWage_Prangbakat": {
    padewan: "Brama",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Nuju Padu"
  },
  // --- WUKU 25: BALA ---
  "MingguKliwon_Bala": {
    padewan: "Kala",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "SeninLegi_Bala": {
    padewan: "Uma",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Lakuning Angin",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "SelasaPahing_Bala": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Kala Tinantang"
  },
  "RabuPon_Bala": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "KamisWage_Bala": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Aras Kembang",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "JumatKliwon_Bala": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Kala Tinantang"
  },
  "SabtuLegi_Bala": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Mantri Sinarojo"
  },
  // --- WUKU 26: WUGU ---
  "MingguPahing_Wugu": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  "SeninPon_Wugu": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "SelasaWage_Wugu": {
    padewan: "Uma",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "RabuKliwon_Wugu": {
    padewan: "Sri",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "KamisLegi_Wugu": {
    padewan: "Indra",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "JumatPahing_Wugu": {
    padewan: "Guru",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Tunggak Semi",
    kamarokan: "Mantri Sinarojo"
  },
  "SabtuPon_Wugu": {
    padewan: "Yamadipati",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Lakuning Banyu",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Pati"
  },
  // --- WUKU 27: WAYANG ---
  "MingguWage_Wayang": {
    padewan: "Rudra",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Lakuning Angin",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Kala Tinantang"
  },
  "SeninKliwon_Wayang": {
    padewan: "Brama",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "SelasaLegi_Wayang": {
    padewan: "Kala",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Nuju Padu"
  },
  "RabuPahing_Wayang": {
    padewan: "Uma",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Banyu",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  "KamisPon_Wayang": {
    padewan: "Sri",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Srengenge",
    pancasuda: "Satriya Wirang",
    kamarokan: "Macan Ketawan"
  },
  "JumatWage_Wayang": {
    padewan: "Indra",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "SabtuKliwon_Wayang": {
    padewan: "Guru",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Bumi",
    pancasuda: "Tunggak Semi",
    kamarokan: "Sanggar Waringin"
  },
  // --- WUKU 28: KULAWU ---
  "MingguLegi_Kulawu": {
    padewan: "Yamadipati",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Aras Pepet",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "SeninPahing_Kulawu": {
    padewan: "Rudra",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Lakuning Lintang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SelasaPon_Kulawu": {
    padewan: "Brama",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Aras Pepet",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Sanggar Waringin"
  },
  "RabuWage_Kulawu": {
    padewan: "Kala",
    paringkelan: "Tungle",
    pandangon: "Dangu",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Macan Ketawan"
  },
  "KamisKliwon_Kulawu": {
    padewan: "Uma",
    paringkelan: "Aryang",
    pandangon: "Jagur",
    paarasan: "Lakuning Banyu",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Kala Tinantang"
  },
  "JumatLegi_Kulawu": {
    padewan: "Sri",
    paringkelan: "Wurukung",
    pandangon: "Gigis",
    paarasan: "Aras Tuding",
    pancasuda: "Satriya Wirang",
    kamarokan: "Sanggar Waringin"
  },
  "SabtuPahing_Kulawu": {
    padewan: "Indra",
    paringkelan: "Paningron",
    pandangon: "Kerangan",
    paarasan: "Lakuning Geni",
    pancasuda: "Satriya Wibawa",
    kamarokan: "Macan Ketawan"
  },
  // --- WUKU 29: DUKUT ---
  "MingguPon_Dukut": {
    padewan: "Guru",
    paringkelan: "Uwas",
    pandangon: "Nohan",
    paarasan: "Aras Kembang",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Nuju Padu"
  },
  "SeninWage_Dukut": {
    padewan: "Yamadipati",
    paringkelan: "Mawulu",
    pandangon: "Wogan",
    paarasan: "Lakuning Geni",
    pancasuda: "Wasesa Segara",
    kamarokan: "Sanggar Waringin"
  },
  "SelasaKliwon_Dukut": {
    padewan: "Rudra",
    paringkelan: "Tungle",
    pandangon: "Tulus",
    paarasan: "Aras Tuding",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Nuju Pati"
  },
  "RabuLegi_Dukut": {
    padewan: "Brama",
    paringkelan: "Aryang",
    pandangon: "Wurung",
    paarasan: "Aras Kembang",
    pancasuda: "Sumur Sinaba",
    kamarokan: "Kala Tinantang"
  },
  "KamisPahing_Dukut": {
    padewan: "Kala",
    paringkelan: "Wurukung",
    pandangon: "Dadi",
    paarasan: "Lakuning Bumi",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "JumatPon_Dukut": {
    padewan: "Uma",
    paringkelan: "Paningron",
    pandangon: "Dangu",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Macan Ketawan"
  },
  "SabtuWage_Dukut": {
    padewan: "Sri",
    paringkelan: "Uwas",
    pandangon: "Jagur",
    paarasan: "Lakuning Lintang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Nuju Padu"
  },
  // --- WUKU 30: WATU GUNUNG ---
  "MingguKliwon_WatuGunung": {
    padewan: "Indra",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "MingguKliwon_Watu Gunung": {
    padewan: "Indra",
    paringkelan: "Mawulu",
    pandangon: "Gigis",
    paarasan: "Lakuning Lintang",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "SeninLegi_WatuGunung": {
    padewan: "Guru",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Angin",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "SeninLegi_Watu Gunung": {
    padewan: "Guru",
    paringkelan: "Tungle",
    pandangon: "Kerangan",
    paarasan: "Lakuning Angin",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "SelasaPahing_WatuGunung": {
    padewan: "Yamadipati",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Kala Tinantang"
  },
  "SelasaPahing_Watu Gunung": {
    padewan: "Yamadipati",
    paringkelan: "Aryang",
    pandangon: "Nohan",
    paarasan: "Aras Kembang",
    pancasuda: "Satriya Wirang",
    kamarokan: "Kala Tinantang"
  },
  "RabuPon_WatuGunung": {
    padewan: "Rudra",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "RabuPon_Watu Gunung": {
    padewan: "Rudra",
    paringkelan: "Wurukung",
    pandangon: "Wogan",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Lebu Katiyup Angin",
    kamarokan: "Mantri Sinarojo"
  },
  "KamisWage_WatuGunung": {
    padewan: "Brama",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Aras Kembang",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "KamisWage_Watu Gunung": {
    padewan: "Brama",
    paringkelan: "Paningron",
    pandangon: "Tulus",
    paarasan: "Aras Kembang",
    pancasuda: "Tunggak Semi",
    kamarokan: "Nuju Pati"
  },
  "JumatKliwon_WatuGunung": {
    padewan: "Kala",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Kala Tinantang"
  },
  "JumatKliwon_Watu Gunung": {
    padewan: "Kala",
    paringkelan: "Uwas",
    pandangon: "Wurung",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Wasesa Segara",
    kamarokan: "Kala Tinantang"
  },
  "SabtuLegi_WatuGunung": {
    padewan: "Uma",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Mantri Sinarojo"
  },
  "SabtuLegi_Watu Gunung": {
    padewan: "Uma",
    paringkelan: "Mawulu",
    pandangon: "Dadi",
    paarasan: "Lakuning Rembulan",
    pancasuda: "Bumi Kapetak",
    kamarokan: "Mantri Sinarojo"
  },
};

function getNujumFromMatrix(hari, pasaran, wuku) {
  if (!hari || !pasaran || !wuku) return null;
  const cleanWuku = String(wuku).replace(/\s+/g, "");
  const key = hari + pasaran + "_" + cleanWuku;
  if (primbonMatrix[key]) return primbonMatrix[key];
  const keyOriginal = hari + pasaran + "_" + wuku;
  if (primbonMatrix[keyOriginal]) return primbonMatrix[keyOriginal];
  if (cleanWuku === "Sinta" && primbonMatrix[hari + pasaran + "_Shinto"]) {
    return primbonMatrix[hari + pasaran + "_Shinto"];
  }
  return null;
}

if (typeof window !== "undefined") {
  window.primbonMatrix = primbonMatrix;
  window.nujumMatrix = primbonMatrix;
  window.nujumDatabase = primbonMatrix;
  window.getNujumFromMatrix = getNujumFromMatrix;
  window.getNujumFromDatabase = getNujumFromMatrix;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { primbonMatrix, nujumMatrix: primbonMatrix, nujumDatabase: primbonMatrix, getNujumFromMatrix, getNujumFromDatabase: getNujumFromMatrix };
}
