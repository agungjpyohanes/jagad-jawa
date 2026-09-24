/**
 * Jagad Jawa — Database Petung Ternak, Loro, & Geblak
 * Disarikan dari petung_ternak_loro_geblak.xlsx
 * 
 * CATATAN PENTING:
 * 1. Menggunakan NEPTU APP standar (bukan neptu ijab).
 * 2. Lookup utama melalui struktur weton_35[dina][pasaran].
 */

export const weton_35 = {
  "Minggu": {
    "Pon": {
      "id": 1,
      "dina": "Minggu",
      "pasaran": "Pon",
      "neptu_dina": 5,
      "neptu_pasaran": 7,
      "neptu_jumlah": 12,
      "ternak": {
        "kode": "Buto",
        "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
        "status_ringkas": "Ala",
        "badge": {
          "color": "amber",
          "label": "Buto (Perlu Prayitna)"
        },
        "saran_praktis": "Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna."
      },
      "loro": {
        "kode": "Lepas",
        "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "tombone": "sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Asad",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Kliwon": {
      "id": 8,
      "dina": "Minggu",
      "pasaran": "Kliwon",
      "neptu_dina": 5,
      "neptu_pasaran": 8,
      "neptu_jumlah": 13,
      "ternak": {
        "kode": "Suku",
        "tegese": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "teal",
          "label": "Suku (Rikat Manak)"
        },
        "saran_praktis": "Cocok sanget kanggé ternak ingkang dipuntujokaken supados rikat rembaka utawi manak (mendo/wedhus, menda, ayam, unggas)."
      },
      "loro": {
        "kode": "Sabdo",
        "tegese": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
        "tombone": "Tamba medis lan panyuwunan pangayoman marang Gusti.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Gunung",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang.",
        "fokus_ditinggal": "Kulawarga ingkang katilaran pikantuk kamulyan lan katentreman.",
        "wiradat_40_dina": "Kulawarga ingkang katilaran pinaringan kekiyatan mangun kamulyan. Wiradat donga 40 dinten tansah dipunlestantunaken minangka bekti tumrap leluhur.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pahing": {
      "id": 15,
      "dina": "Minggu",
      "pasaran": "Pahing",
      "neptu_dina": 5,
      "neptu_pasaran": 9,
      "neptu_jumlah": 14,
      "ternak": {
        "kode": "Watu",
        "tegese": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
        "status_ringkas": "Normal",
        "badge": {
          "color": "stone",
          "label": "Watu (Kukuh Santosa)"
        },
        "saran_praktis": "Karakter kuwat lan awèt. Prayogi kanggé kéwan gladhèn, narik kreta/bajak, utawi investasi jangka panjang."
      },
      "loro": {
        "kode": "Guna",
        "tegese": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Jugrug",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Wage": {
      "id": 22,
      "dina": "Minggu",
      "pasaran": "Wage",
      "neptu_dina": 5,
      "neptu_pasaran": 4,
      "neptu_jumlah": 9,
      "ternak": {
        "kode": "Suku",
        "tegese": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "teal",
          "label": "Suku (Rikat Manak)"
        },
        "saran_praktis": "Cocok sanget kanggé ternak ingkang dipuntujokaken supados rikat rembaka utawi manak (mendo/wedhus, menda, ayam, unggas)."
      },
      "loro": {
        "kode": "Sabdo",
        "tegese": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
        "tombone": "Tamba medis lan panyuwunan pangayoman marang Gusti.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Gunung",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang.",
        "fokus_ditinggal": "Kulawarga ingkang katilaran pikantuk kamulyan lan katentreman.",
        "wiradat_40_dina": "Kulawarga ingkang katilaran pinaringan kekiyatan mangun kamulyan. Wiradat donga 40 dinten tansah dipunlestantunaken minangka bekti tumrap leluhur.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Legi": {
      "id": 29,
      "dina": "Minggu",
      "pasaran": "Legi",
      "neptu_dina": 5,
      "neptu_pasaran": 5,
      "neptu_jumlah": 10,
      "ternak": {
        "kode": "Watu",
        "tegese": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
        "status_ringkas": "Normal",
        "badge": {
          "color": "stone",
          "label": "Watu (Kukuh Santosa)"
        },
        "saran_praktis": "Karakter kuwat lan awèt. Prayogi kanggé kéwan gladhèn, narik kreta/bajak, utawi investasi jangka panjang."
      },
      "loro": {
        "kode": "Guna",
        "tegese": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Jugrug",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    }
  },
  "Senin": {
    "Wage": {
      "id": 2,
      "dina": "Senin",
      "pasaran": "Wage",
      "neptu_dina": 4,
      "neptu_pasaran": 4,
      "neptu_jumlah": 8,
      "ternak": {
        "kode": "Buto",
        "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
        "status_ringkas": "Ala",
        "badge": {
          "color": "amber",
          "label": "Buto (Perlu Prayitna)"
        },
        "saran_praktis": "Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna."
      },
      "loro": {
        "kode": "Lepas",
        "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "tombone": "sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Asad",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Legi": {
      "id": 9,
      "dina": "Senin",
      "pasaran": "Legi",
      "neptu_dina": 4,
      "neptu_pasaran": 5,
      "neptu_jumlah": 9,
      "ternak": {
        "kode": "Suku",
        "tegese": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "teal",
          "label": "Suku (Rikat Manak)"
        },
        "saran_praktis": "Cocok sanget kanggé ternak ingkang dipuntujokaken supados rikat rembaka utawi manak (mendo/wedhus, menda, ayam, unggas)."
      },
      "loro": {
        "kode": "Sabdo",
        "tegese": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
        "tombone": "Tamba medis lan panyuwunan pangayoman marang Gusti.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Gunung",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang.",
        "fokus_ditinggal": "Kulawarga ingkang katilaran pikantuk kamulyan lan katentreman.",
        "wiradat_40_dina": "Kulawarga ingkang katilaran pinaringan kekiyatan mangun kamulyan. Wiradat donga 40 dinten tansah dipunlestantunaken minangka bekti tumrap leluhur.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pon": {
      "id": 16,
      "dina": "Senin",
      "pasaran": "Pon",
      "neptu_dina": 4,
      "neptu_pasaran": 7,
      "neptu_jumlah": 11,
      "ternak": {
        "kode": "Gajah",
        "tegese": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "emerald",
          "label": "Gajah (Becik Sanget)"
        },
        "saran_praktis": "Dinten ingkang saé sanget kanggé miwiti ngopeni ternak ageng (sapi, maesa/kebo) utawi komersial. Rejeki dipunpitados gampil tumangkar."
      },
      "loro": {
        "kode": "Wana",
        "tegese": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Segara",
        "tegese": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino.",
        "fokus_ditinggal": "Kulawarga dipunsuwun jembar manahipun lan tabah ngadhepi pacobaning gesang.",
        "wiradat_40_dina": "Kados jembaring samodra, kulawarga dipunsuwun jembar dhadhanipun, ikhlas, lan nyawiji ing dalem donga wiradat 40 dinten tanpa pedhot.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Kliwon": {
      "id": 23,
      "dina": "Senin",
      "pasaran": "Kliwon",
      "neptu_dina": 4,
      "neptu_pasaran": 8,
      "neptu_jumlah": 12,
      "ternak": {
        "kode": "Buto",
        "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
        "status_ringkas": "Ala",
        "badge": {
          "color": "amber",
          "label": "Buto (Perlu Prayitna)"
        },
        "saran_praktis": "Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna."
      },
      "loro": {
        "kode": "Lepas",
        "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "tombone": "sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Asad",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pahing": {
      "id": 30,
      "dina": "Senin",
      "pasaran": "Pahing",
      "neptu_dina": 4,
      "neptu_pasaran": 9,
      "neptu_jumlah": 13,
      "ternak": {
        "kode": "Suku",
        "tegese": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "teal",
          "label": "Suku (Rikat Manak)"
        },
        "saran_praktis": "Cocok sanget kanggé ternak ingkang dipuntujokaken supados rikat rembaka utawi manak (mendo/wedhus, menda, ayam, unggas)."
      },
      "loro": {
        "kode": "Sabdo",
        "tegese": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
        "tombone": "Tamba medis lan panyuwunan pangayoman marang Gusti.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Gunung",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang.",
        "fokus_ditinggal": "Kulawarga ingkang katilaran pikantuk kamulyan lan katentreman.",
        "wiradat_40_dina": "Kulawarga ingkang katilaran pinaringan kekiyatan mangun kamulyan. Wiradat donga 40 dinten tansah dipunlestantunaken minangka bekti tumrap leluhur.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    }
  },
  "Selasa": {
    "Kliwon": {
      "id": 3,
      "dina": "Selasa",
      "pasaran": "Kliwon",
      "neptu_dina": 3,
      "neptu_pasaran": 8,
      "neptu_jumlah": 11,
      "ternak": {
        "kode": "Gajah",
        "tegese": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "emerald",
          "label": "Gajah (Becik Sanget)"
        },
        "saran_praktis": "Dinten ingkang saé sanget kanggé miwiti ngopeni ternak ageng (sapi, maesa/kebo) utawi komersial. Rejeki dipunpitados gampil tumangkar."
      },
      "loro": {
        "kode": "Wana",
        "tegese": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Segara",
        "tegese": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino.",
        "fokus_ditinggal": "Kulawarga dipunsuwun jembar manahipun lan tabah ngadhepi pacobaning gesang.",
        "wiradat_40_dina": "Kados jembaring samodra, kulawarga dipunsuwun jembar dhadhanipun, ikhlas, lan nyawiji ing dalem donga wiradat 40 dinten tanpa pedhot.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pahing": {
      "id": 10,
      "dina": "Selasa",
      "pasaran": "Pahing",
      "neptu_dina": 3,
      "neptu_pasaran": 9,
      "neptu_jumlah": 12,
      "ternak": {
        "kode": "Buto",
        "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
        "status_ringkas": "Ala",
        "badge": {
          "color": "amber",
          "label": "Buto (Perlu Prayitna)"
        },
        "saran_praktis": "Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna."
      },
      "loro": {
        "kode": "Lepas",
        "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "tombone": "sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Asad",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Wage": {
      "id": 17,
      "dina": "Selasa",
      "pasaran": "Wage",
      "neptu_dina": 3,
      "neptu_pasaran": 4,
      "neptu_jumlah": 7,
      "ternak": {
        "kode": "Gajah",
        "tegese": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "emerald",
          "label": "Gajah (Becik Sanget)"
        },
        "saran_praktis": "Dinten ingkang saé sanget kanggé miwiti ngopeni ternak ageng (sapi, maesa/kebo) utawi komersial. Rejeki dipunpitados gampil tumangkar."
      },
      "loro": {
        "kode": "Wana",
        "tegese": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Segara",
        "tegese": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino.",
        "fokus_ditinggal": "Kulawarga dipunsuwun jembar manahipun lan tabah ngadhepi pacobaning gesang.",
        "wiradat_40_dina": "Kados jembaring samodra, kulawarga dipunsuwun jembar dhadhanipun, ikhlas, lan nyawiji ing dalem donga wiradat 40 dinten tanpa pedhot.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Legi": {
      "id": 24,
      "dina": "Selasa",
      "pasaran": "Legi",
      "neptu_dina": 3,
      "neptu_pasaran": 5,
      "neptu_jumlah": 8,
      "ternak": {
        "kode": "Buto",
        "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
        "status_ringkas": "Ala",
        "badge": {
          "color": "amber",
          "label": "Buto (Perlu Prayitna)"
        },
        "saran_praktis": "Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna."
      },
      "loro": {
        "kode": "Lepas",
        "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "tombone": "sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Asad",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pon": {
      "id": 31,
      "dina": "Selasa",
      "pasaran": "Pon",
      "neptu_dina": 3,
      "neptu_pasaran": 7,
      "neptu_jumlah": 10,
      "ternak": {
        "kode": "Watu",
        "tegese": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
        "status_ringkas": "Normal",
        "badge": {
          "color": "stone",
          "label": "Watu (Kukuh Santosa)"
        },
        "saran_praktis": "Karakter kuwat lan awèt. Prayogi kanggé kéwan gladhèn, narik kreta/bajak, utawi investasi jangka panjang."
      },
      "loro": {
        "kode": "Guna",
        "tegese": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Jugrug",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    }
  },
  "Rabu": {
    "Legi": {
      "id": 4,
      "dina": "Rabu",
      "pasaran": "Legi",
      "neptu_dina": 7,
      "neptu_pasaran": 5,
      "neptu_jumlah": 12,
      "ternak": {
        "kode": "Buto",
        "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
        "status_ringkas": "Ala",
        "badge": {
          "color": "amber",
          "label": "Buto (Perlu Prayitna)"
        },
        "saran_praktis": "Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna."
      },
      "loro": {
        "kode": "Lepas",
        "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "tombone": "sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Asad",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pon": {
      "id": 11,
      "dina": "Rabu",
      "pasaran": "Pon",
      "neptu_dina": 7,
      "neptu_pasaran": 7,
      "neptu_jumlah": 14,
      "ternak": {
        "kode": "Watu",
        "tegese": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
        "status_ringkas": "Normal",
        "badge": {
          "color": "stone",
          "label": "Watu (Kukuh Santosa)"
        },
        "saran_praktis": "Karakter kuwat lan awèt. Prayogi kanggé kéwan gladhèn, narik kreta/bajak, utawi investasi jangka panjang."
      },
      "loro": {
        "kode": "Guna",
        "tegese": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Jugrug",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Kliwon": {
      "id": 18,
      "dina": "Rabu",
      "pasaran": "Kliwon",
      "neptu_dina": 7,
      "neptu_pasaran": 8,
      "neptu_jumlah": 15,
      "ternak": {
        "kode": "Gajah",
        "tegese": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "emerald",
          "label": "Gajah (Becik Sanget)"
        },
        "saran_praktis": "Dinten ingkang saé sanget kanggé miwiti ngopeni ternak ageng (sapi, maesa/kebo) utawi komersial. Rejeki dipunpitados gampil tumangkar."
      },
      "loro": {
        "kode": "Wana",
        "tegese": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Segara",
        "tegese": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino.",
        "fokus_ditinggal": "Kulawarga dipunsuwun jembar manahipun lan tabah ngadhepi pacobaning gesang.",
        "wiradat_40_dina": "Kados jembaring samodra, kulawarga dipunsuwun jembar dhadhanipun, ikhlas, lan nyawiji ing dalem donga wiradat 40 dinten tanpa pedhot.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pahing": {
      "id": 25,
      "dina": "Rabu",
      "pasaran": "Pahing",
      "neptu_dina": 7,
      "neptu_pasaran": 9,
      "neptu_jumlah": 16,
      "ternak": {
        "kode": "Buto",
        "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
        "status_ringkas": "Ala",
        "badge": {
          "color": "amber",
          "label": "Buto (Perlu Prayitna)"
        },
        "saran_praktis": "Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna."
      },
      "loro": {
        "kode": "Lepas",
        "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "tombone": "sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Asad",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Wage": {
      "id": 32,
      "dina": "Rabu",
      "pasaran": "Wage",
      "neptu_dina": 7,
      "neptu_pasaran": 4,
      "neptu_jumlah": 11,
      "ternak": {
        "kode": "Gajah",
        "tegese": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "emerald",
          "label": "Gajah (Becik Sanget)"
        },
        "saran_praktis": "Dinten ingkang saé sanget kanggé miwiti ngopeni ternak ageng (sapi, maesa/kebo) utawi komersial. Rejeki dipunpitados gampil tumangkar."
      },
      "loro": {
        "kode": "Wana",
        "tegese": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Segara",
        "tegese": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino.",
        "fokus_ditinggal": "Kulawarga dipunsuwun jembar manahipun lan tabah ngadhepi pacobaning gesang.",
        "wiradat_40_dina": "Kados jembaring samodra, kulawarga dipunsuwun jembar dhadhanipun, ikhlas, lan nyawiji ing dalem donga wiradat 40 dinten tanpa pedhot.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    }
  },
  "Kamis": {
    "Pahing": {
      "id": 5,
      "dina": "Kamis",
      "pasaran": "Pahing",
      "neptu_dina": 8,
      "neptu_pasaran": 9,
      "neptu_jumlah": 17,
      "ternak": {
        "kode": "Suku",
        "tegese": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "teal",
          "label": "Suku (Rikat Manak)"
        },
        "saran_praktis": "Cocok sanget kanggé ternak ingkang dipuntujokaken supados rikat rembaka utawi manak (mendo/wedhus, menda, ayam, unggas)."
      },
      "loro": {
        "kode": "Sabdo",
        "tegese": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
        "tombone": "Tamba medis lan panyuwunan pangayoman marang Gusti.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Gunung",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang.",
        "fokus_ditinggal": "Kulawarga ingkang katilaran pikantuk kamulyan lan katentreman.",
        "wiradat_40_dina": "Kulawarga ingkang katilaran pinaringan kekiyatan mangun kamulyan. Wiradat donga 40 dinten tansah dipunlestantunaken minangka bekti tumrap leluhur.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Wage": {
      "id": 12,
      "dina": "Kamis",
      "pasaran": "Wage",
      "neptu_dina": 8,
      "neptu_pasaran": 4,
      "neptu_jumlah": 12,
      "ternak": {
        "kode": "Buto",
        "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
        "status_ringkas": "Ala",
        "badge": {
          "color": "amber",
          "label": "Buto (Perlu Prayitna)"
        },
        "saran_praktis": "Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna."
      },
      "loro": {
        "kode": "Lepas",
        "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "tombone": "sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Asad",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Legi": {
      "id": 19,
      "dina": "Kamis",
      "pasaran": "Legi",
      "neptu_dina": 8,
      "neptu_pasaran": 5,
      "neptu_jumlah": 13,
      "ternak": {
        "kode": "Suku",
        "tegese": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "teal",
          "label": "Suku (Rikat Manak)"
        },
        "saran_praktis": "Cocok sanget kanggé ternak ingkang dipuntujokaken supados rikat rembaka utawi manak (mendo/wedhus, menda, ayam, unggas)."
      },
      "loro": {
        "kode": "Sabdo",
        "tegese": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
        "tombone": "Tamba medis lan panyuwunan pangayoman marang Gusti.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Gunung",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang.",
        "fokus_ditinggal": "Kulawarga ingkang katilaran pikantuk kamulyan lan katentreman.",
        "wiradat_40_dina": "Kulawarga ingkang katilaran pinaringan kekiyatan mangun kamulyan. Wiradat donga 40 dinten tansah dipunlestantunaken minangka bekti tumrap leluhur.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pon": {
      "id": 26,
      "dina": "Kamis",
      "pasaran": "Pon",
      "neptu_dina": 8,
      "neptu_pasaran": 7,
      "neptu_jumlah": 15,
      "ternak": {
        "kode": "Gajah",
        "tegese": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "emerald",
          "label": "Gajah (Becik Sanget)"
        },
        "saran_praktis": "Dinten ingkang saé sanget kanggé miwiti ngopeni ternak ageng (sapi, maesa/kebo) utawi komersial. Rejeki dipunpitados gampil tumangkar."
      },
      "loro": {
        "kode": "Wana",
        "tegese": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Segara",
        "tegese": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino.",
        "fokus_ditinggal": "Kulawarga dipunsuwun jembar manahipun lan tabah ngadhepi pacobaning gesang.",
        "wiradat_40_dina": "Kados jembaring samodra, kulawarga dipunsuwun jembar dhadhanipun, ikhlas, lan nyawiji ing dalem donga wiradat 40 dinten tanpa pedhot.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Kliwon": {
      "id": 33,
      "dina": "Kamis",
      "pasaran": "Kliwon",
      "neptu_dina": 8,
      "neptu_pasaran": 8,
      "neptu_jumlah": 16,
      "ternak": {
        "kode": "Buto",
        "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
        "status_ringkas": "Ala",
        "badge": {
          "color": "amber",
          "label": "Buto (Perlu Prayitna)"
        },
        "saran_praktis": "Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna."
      },
      "loro": {
        "kode": "Lepas",
        "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "tombone": "sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Asad",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    }
  },
  "Jumat": {
    "Pon": {
      "id": 6,
      "dina": "Jumat",
      "pasaran": "Pon",
      "neptu_dina": 6,
      "neptu_pasaran": 7,
      "neptu_jumlah": 13,
      "ternak": {
        "kode": "Suku",
        "tegese": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "teal",
          "label": "Suku (Rikat Manak)"
        },
        "saran_praktis": "Cocok sanget kanggé ternak ingkang dipuntujokaken supados rikat rembaka utawi manak (mendo/wedhus, menda, ayam, unggas)."
      },
      "loro": {
        "kode": "Sabdo",
        "tegese": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
        "tombone": "Tamba medis lan panyuwunan pangayoman marang Gusti.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Gunung",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang.",
        "fokus_ditinggal": "Kulawarga ingkang katilaran pikantuk kamulyan lan katentreman.",
        "wiradat_40_dina": "Kulawarga ingkang katilaran pinaringan kekiyatan mangun kamulyan. Wiradat donga 40 dinten tansah dipunlestantunaken minangka bekti tumrap leluhur.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Kliwon": {
      "id": 13,
      "dina": "Jumat",
      "pasaran": "Kliwon",
      "neptu_dina": 6,
      "neptu_pasaran": 8,
      "neptu_jumlah": 14,
      "ternak": {
        "kode": "Watu",
        "tegese": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
        "status_ringkas": "Normal",
        "badge": {
          "color": "stone",
          "label": "Watu (Kukuh Santosa)"
        },
        "saran_praktis": "Karakter kuwat lan awèt. Prayogi kanggé kéwan gladhèn, narik kreta/bajak, utawi investasi jangka panjang."
      },
      "loro": {
        "kode": "Guna",
        "tegese": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Jugrug",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pahing": {
      "id": 20,
      "dina": "Jumat",
      "pasaran": "Pahing",
      "neptu_dina": 6,
      "neptu_pasaran": 9,
      "neptu_jumlah": 15,
      "ternak": {
        "kode": "Gajah",
        "tegese": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "emerald",
          "label": "Gajah (Becik Sanget)"
        },
        "saran_praktis": "Dinten ingkang saé sanget kanggé miwiti ngopeni ternak ageng (sapi, maesa/kebo) utawi komersial. Rejeki dipunpitados gampil tumangkar."
      },
      "loro": {
        "kode": "Wana",
        "tegese": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Segara",
        "tegese": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino.",
        "fokus_ditinggal": "Kulawarga dipunsuwun jembar manahipun lan tabah ngadhepi pacobaning gesang.",
        "wiradat_40_dina": "Kados jembaring samodra, kulawarga dipunsuwun jembar dhadhanipun, ikhlas, lan nyawiji ing dalem donga wiradat 40 dinten tanpa pedhot.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Wage": {
      "id": 27,
      "dina": "Jumat",
      "pasaran": "Wage",
      "neptu_dina": 6,
      "neptu_pasaran": 4,
      "neptu_jumlah": 10,
      "ternak": {
        "kode": "Watu",
        "tegese": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
        "status_ringkas": "Normal",
        "badge": {
          "color": "stone",
          "label": "Watu (Kukuh Santosa)"
        },
        "saran_praktis": "Karakter kuwat lan awèt. Prayogi kanggé kéwan gladhèn, narik kreta/bajak, utawi investasi jangka panjang."
      },
      "loro": {
        "kode": "Guna",
        "tegese": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Jugrug",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Legi": {
      "id": 34,
      "dina": "Jumat",
      "pasaran": "Legi",
      "neptu_dina": 6,
      "neptu_pasaran": 5,
      "neptu_jumlah": 11,
      "ternak": {
        "kode": "Gajah",
        "tegese": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "emerald",
          "label": "Gajah (Becik Sanget)"
        },
        "saran_praktis": "Dinten ingkang saé sanget kanggé miwiti ngopeni ternak ageng (sapi, maesa/kebo) utawi komersial. Rejeki dipunpitados gampil tumangkar."
      },
      "loro": {
        "kode": "Wana",
        "tegese": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Segara",
        "tegese": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino.",
        "fokus_ditinggal": "Kulawarga dipunsuwun jembar manahipun lan tabah ngadhepi pacobaning gesang.",
        "wiradat_40_dina": "Kados jembaring samodra, kulawarga dipunsuwun jembar dhadhanipun, ikhlas, lan nyawiji ing dalem donga wiradat 40 dinten tanpa pedhot.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    }
  },
  "Sabtu": {
    "Wage": {
      "id": 7,
      "dina": "Sabtu",
      "pasaran": "Wage",
      "neptu_dina": 9,
      "neptu_pasaran": 4,
      "neptu_jumlah": 13,
      "ternak": {
        "kode": "Suku",
        "tegese": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "teal",
          "label": "Suku (Rikat Manak)"
        },
        "saran_praktis": "Cocok sanget kanggé ternak ingkang dipuntujokaken supados rikat rembaka utawi manak (mendo/wedhus, menda, ayam, unggas)."
      },
      "loro": {
        "kode": "Sabdo",
        "tegese": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
        "tombone": "Tamba medis lan panyuwunan pangayoman marang Gusti.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Gunung",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang.",
        "fokus_ditinggal": "Kulawarga ingkang katilaran pikantuk kamulyan lan katentreman.",
        "wiradat_40_dina": "Kulawarga ingkang katilaran pinaringan kekiyatan mangun kamulyan. Wiradat donga 40 dinten tansah dipunlestantunaken minangka bekti tumrap leluhur.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Legi": {
      "id": 14,
      "dina": "Sabtu",
      "pasaran": "Legi",
      "neptu_dina": 9,
      "neptu_pasaran": 5,
      "neptu_jumlah": 14,
      "ternak": {
        "kode": "Watu",
        "tegese": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
        "status_ringkas": "Normal",
        "badge": {
          "color": "stone",
          "label": "Watu (Kukuh Santosa)"
        },
        "saran_praktis": "Karakter kuwat lan awèt. Prayogi kanggé kéwan gladhèn, narik kreta/bajak, utawi investasi jangka panjang."
      },
      "loro": {
        "kode": "Guna",
        "tegese": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Jugrug",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pon": {
      "id": 21,
      "dina": "Sabtu",
      "pasaran": "Pon",
      "neptu_dina": 9,
      "neptu_pasaran": 7,
      "neptu_jumlah": 16,
      "ternak": {
        "kode": "Buto",
        "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
        "status_ringkas": "Ala",
        "badge": {
          "color": "amber",
          "label": "Buto (Perlu Prayitna)"
        },
        "saran_praktis": "Kurang prayogi miturut pètungan tradisi. Prayogi dipunpilihi dinten sanès (Gajah/Suku), utawi dipunjangkepi karesikan kandhang lan pakan ingkang langkung prayitna."
      },
      "loro": {
        "kode": "Lepas",
        "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "tombone": "sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Asad",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Kliwon": {
      "id": 28,
      "dina": "Sabtu",
      "pasaran": "Kliwon",
      "neptu_dina": 9,
      "neptu_pasaran": 8,
      "neptu_jumlah": 17,
      "ternak": {
        "kode": "Suku",
        "tegese": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
        "status_ringkas": "Becik",
        "badge": {
          "color": "teal",
          "label": "Suku (Rikat Manak)"
        },
        "saran_praktis": "Cocok sanget kanggé ternak ingkang dipuntujokaken supados rikat rembaka utawi manak (mendo/wedhus, menda, ayam, unggas)."
      },
      "loro": {
        "kode": "Sabdo",
        "tegese": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
        "tombone": "Tamba medis lan panyuwunan pangayoman marang Gusti.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Gunung",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang.",
        "fokus_ditinggal": "Kulawarga ingkang katilaran pikantuk kamulyan lan katentreman.",
        "wiradat_40_dina": "Kulawarga ingkang katilaran pinaringan kekiyatan mangun kamulyan. Wiradat donga 40 dinten tansah dipunlestantunaken minangka bekti tumrap leluhur.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    },
    "Pahing": {
      "id": 35,
      "dina": "Sabtu",
      "pasaran": "Pahing",
      "neptu_dina": 9,
      "neptu_pasaran": 9,
      "neptu_jumlah": 18,
      "ternak": {
        "kode": "Watu",
        "tegese": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
        "status_ringkas": "Normal",
        "badge": {
          "color": "stone",
          "label": "Watu (Kukuh Santosa)"
        },
        "saran_praktis": "Karakter kuwat lan awèt. Prayogi kanggé kéwan gladhèn, narik kreta/bajak, utawi investasi jangka panjang."
      },
      "loro": {
        "kode": "Guna",
        "tegese": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
        "tombone": "kudu reresik lan njaluk pangapuro.",
        "disclaimer_medis": "Pènget Wigati: Petung jalaran loro punika minangka piwulang kearifan lokal lan kabudayan tradisi Jawi, sanès diagnosis medis resmi. Manawi wonten kulawarga ingkang gerah, kedah énggal dipunpriksakaken dhateng dokter utawi fasilitas kesehatan (Puskesmas/Rumah Sakit)."
      },
      "geblak": {
        "kode": "Jugrug",
        "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e.",
        "fokus_ditinggal": "Paseduluran lan kerukunan anak-turun kedah dipunjagi kanthi raket.",
        "wiradat_40_dina": "Wiradat donga, ziarah, lan paseduluran 40 dinten tanpa pedhot wiwit dinten geblakipun supados suwargi pikantuk dalan pepadhang lan jembar kuburipun.",
        "disclaimer_adat": "Petung geblak punika minangka donga lan tata krama tradisi leluhur kanggé ngurmati suwargi lan nyaketaken paseduluran kulawarga, sanès paugeran takdir mutlak."
      }
    }
  }
};

export const WETON_35_LIST = [
  {
    "id": 1,
    "dina": "Minggu",
    "pasaran": "Pon",
    "neptu_dina": 5,
    "neptu_pasaran": 7,
    "neptu_jumlah": 12,
    "wiwit_ternak": "Buto",
    "tegese_ternak": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "jalaran_loro": "Lepas",
    "tegese_loro": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
    "petung_geblak": "Asad",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 2,
    "dina": "Senin",
    "pasaran": "Wage",
    "neptu_dina": 4,
    "neptu_pasaran": 4,
    "neptu_jumlah": 8,
    "wiwit_ternak": "Buto",
    "tegese_ternak": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "jalaran_loro": "Lepas",
    "tegese_loro": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
    "petung_geblak": "Asad",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 3,
    "dina": "Selasa",
    "pasaran": "Kliwon",
    "neptu_dina": 3,
    "neptu_pasaran": 8,
    "neptu_jumlah": 11,
    "wiwit_ternak": "Gajah",
    "tegese_ternak": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
    "jalaran_loro": "Wana",
    "tegese_loro": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Segara",
    "tegese_geblak": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino."
  },
  {
    "id": 4,
    "dina": "Rabu",
    "pasaran": "Legi",
    "neptu_dina": 7,
    "neptu_pasaran": 5,
    "neptu_jumlah": 12,
    "wiwit_ternak": "Buto",
    "tegese_ternak": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "jalaran_loro": "Lepas",
    "tegese_loro": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
    "petung_geblak": "Asad",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 5,
    "dina": "Kamis",
    "pasaran": "Pahing",
    "neptu_dina": 8,
    "neptu_pasaran": 9,
    "neptu_jumlah": 17,
    "wiwit_ternak": "Suku",
    "tegese_ternak": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
    "jalaran_loro": "Sabdo",
    "tegese_loro": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
    "petung_geblak": "Gunung",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang."
  },
  {
    "id": 6,
    "dina": "Jumat",
    "pasaran": "Pon",
    "neptu_dina": 6,
    "neptu_pasaran": 7,
    "neptu_jumlah": 13,
    "wiwit_ternak": "Suku",
    "tegese_ternak": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
    "jalaran_loro": "Sabdo",
    "tegese_loro": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
    "petung_geblak": "Gunung",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang."
  },
  {
    "id": 7,
    "dina": "Sabtu",
    "pasaran": "Wage",
    "neptu_dina": 9,
    "neptu_pasaran": 4,
    "neptu_jumlah": 13,
    "wiwit_ternak": "Suku",
    "tegese_ternak": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
    "jalaran_loro": "Sabdo",
    "tegese_loro": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
    "petung_geblak": "Gunung",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang."
  },
  {
    "id": 8,
    "dina": "Minggu",
    "pasaran": "Kliwon",
    "neptu_dina": 5,
    "neptu_pasaran": 8,
    "neptu_jumlah": 13,
    "wiwit_ternak": "Suku",
    "tegese_ternak": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
    "jalaran_loro": "Sabdo",
    "tegese_loro": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
    "petung_geblak": "Gunung",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang."
  },
  {
    "id": 9,
    "dina": "Senin",
    "pasaran": "Legi",
    "neptu_dina": 4,
    "neptu_pasaran": 5,
    "neptu_jumlah": 9,
    "wiwit_ternak": "Suku",
    "tegese_ternak": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
    "jalaran_loro": "Sabdo",
    "tegese_loro": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
    "petung_geblak": "Gunung",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang."
  },
  {
    "id": 10,
    "dina": "Selasa",
    "pasaran": "Pahing",
    "neptu_dina": 3,
    "neptu_pasaran": 9,
    "neptu_jumlah": 12,
    "wiwit_ternak": "Buto",
    "tegese_ternak": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "jalaran_loro": "Lepas",
    "tegese_loro": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
    "petung_geblak": "Asad",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 11,
    "dina": "Rabu",
    "pasaran": "Pon",
    "neptu_dina": 7,
    "neptu_pasaran": 7,
    "neptu_jumlah": 14,
    "wiwit_ternak": "Watu",
    "tegese_ternak": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
    "jalaran_loro": "Guna",
    "tegese_loro": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Jugrug",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 12,
    "dina": "Kamis",
    "pasaran": "Wage",
    "neptu_dina": 8,
    "neptu_pasaran": 4,
    "neptu_jumlah": 12,
    "wiwit_ternak": "Buto",
    "tegese_ternak": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "jalaran_loro": "Lepas",
    "tegese_loro": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
    "petung_geblak": "Asad",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 13,
    "dina": "Jumat",
    "pasaran": "Kliwon",
    "neptu_dina": 6,
    "neptu_pasaran": 8,
    "neptu_jumlah": 14,
    "wiwit_ternak": "Watu",
    "tegese_ternak": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
    "jalaran_loro": "Guna",
    "tegese_loro": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Jugrug",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 14,
    "dina": "Sabtu",
    "pasaran": "Legi",
    "neptu_dina": 9,
    "neptu_pasaran": 5,
    "neptu_jumlah": 14,
    "wiwit_ternak": "Watu",
    "tegese_ternak": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
    "jalaran_loro": "Guna",
    "tegese_loro": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Jugrug",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 15,
    "dina": "Minggu",
    "pasaran": "Pahing",
    "neptu_dina": 5,
    "neptu_pasaran": 9,
    "neptu_jumlah": 14,
    "wiwit_ternak": "Watu",
    "tegese_ternak": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
    "jalaran_loro": "Guna",
    "tegese_loro": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Jugrug",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 16,
    "dina": "Senin",
    "pasaran": "Pon",
    "neptu_dina": 4,
    "neptu_pasaran": 7,
    "neptu_jumlah": 11,
    "wiwit_ternak": "Gajah",
    "tegese_ternak": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
    "jalaran_loro": "Wana",
    "tegese_loro": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Segara",
    "tegese_geblak": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino."
  },
  {
    "id": 17,
    "dina": "Selasa",
    "pasaran": "Wage",
    "neptu_dina": 3,
    "neptu_pasaran": 4,
    "neptu_jumlah": 7,
    "wiwit_ternak": "Gajah",
    "tegese_ternak": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
    "jalaran_loro": "Wana",
    "tegese_loro": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Segara",
    "tegese_geblak": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino."
  },
  {
    "id": 18,
    "dina": "Rabu",
    "pasaran": "Kliwon",
    "neptu_dina": 7,
    "neptu_pasaran": 8,
    "neptu_jumlah": 15,
    "wiwit_ternak": "Gajah",
    "tegese_ternak": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
    "jalaran_loro": "Wana",
    "tegese_loro": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Segara",
    "tegese_geblak": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino."
  },
  {
    "id": 19,
    "dina": "Kamis",
    "pasaran": "Legi",
    "neptu_dina": 8,
    "neptu_pasaran": 5,
    "neptu_jumlah": 13,
    "wiwit_ternak": "Suku",
    "tegese_ternak": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
    "jalaran_loro": "Sabdo",
    "tegese_loro": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
    "petung_geblak": "Gunung",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang."
  },
  {
    "id": 20,
    "dina": "Jumat",
    "pasaran": "Pahing",
    "neptu_dina": 6,
    "neptu_pasaran": 9,
    "neptu_jumlah": 15,
    "wiwit_ternak": "Gajah",
    "tegese_ternak": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
    "jalaran_loro": "Wana",
    "tegese_loro": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Segara",
    "tegese_geblak": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino."
  },
  {
    "id": 21,
    "dina": "Sabtu",
    "pasaran": "Pon",
    "neptu_dina": 9,
    "neptu_pasaran": 7,
    "neptu_jumlah": 16,
    "wiwit_ternak": "Buto",
    "tegese_ternak": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "jalaran_loro": "Lepas",
    "tegese_loro": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
    "petung_geblak": "Asad",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 22,
    "dina": "Minggu",
    "pasaran": "Wage",
    "neptu_dina": 5,
    "neptu_pasaran": 4,
    "neptu_jumlah": 9,
    "wiwit_ternak": "Suku",
    "tegese_ternak": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
    "jalaran_loro": "Sabdo",
    "tegese_loro": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
    "petung_geblak": "Gunung",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang."
  },
  {
    "id": 23,
    "dina": "Senin",
    "pasaran": "Kliwon",
    "neptu_dina": 4,
    "neptu_pasaran": 8,
    "neptu_jumlah": 12,
    "wiwit_ternak": "Buto",
    "tegese_ternak": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "jalaran_loro": "Lepas",
    "tegese_loro": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
    "petung_geblak": "Asad",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 24,
    "dina": "Selasa",
    "pasaran": "Legi",
    "neptu_dina": 3,
    "neptu_pasaran": 5,
    "neptu_jumlah": 8,
    "wiwit_ternak": "Buto",
    "tegese_ternak": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "jalaran_loro": "Lepas",
    "tegese_loro": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
    "petung_geblak": "Asad",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 25,
    "dina": "Rabu",
    "pasaran": "Pahing",
    "neptu_dina": 7,
    "neptu_pasaran": 9,
    "neptu_jumlah": 16,
    "wiwit_ternak": "Buto",
    "tegese_ternak": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "jalaran_loro": "Lepas",
    "tegese_loro": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
    "petung_geblak": "Asad",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 26,
    "dina": "Kamis",
    "pasaran": "Pon",
    "neptu_dina": 8,
    "neptu_pasaran": 7,
    "neptu_jumlah": 15,
    "wiwit_ternak": "Gajah",
    "tegese_ternak": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
    "jalaran_loro": "Wana",
    "tegese_loro": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Segara",
    "tegese_geblak": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino."
  },
  {
    "id": 27,
    "dina": "Jumat",
    "pasaran": "Wage",
    "neptu_dina": 6,
    "neptu_pasaran": 4,
    "neptu_jumlah": 10,
    "wiwit_ternak": "Watu",
    "tegese_ternak": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
    "jalaran_loro": "Guna",
    "tegese_loro": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Jugrug",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 28,
    "dina": "Sabtu",
    "pasaran": "Kliwon",
    "neptu_dina": 9,
    "neptu_pasaran": 8,
    "neptu_jumlah": 17,
    "wiwit_ternak": "Suku",
    "tegese_ternak": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
    "jalaran_loro": "Sabdo",
    "tegese_loro": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
    "petung_geblak": "Gunung",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang."
  },
  {
    "id": 29,
    "dina": "Minggu",
    "pasaran": "Legi",
    "neptu_dina": 5,
    "neptu_pasaran": 5,
    "neptu_jumlah": 10,
    "wiwit_ternak": "Watu",
    "tegese_ternak": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
    "jalaran_loro": "Guna",
    "tegese_loro": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Jugrug",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 30,
    "dina": "Senin",
    "pasaran": "Pahing",
    "neptu_dina": 4,
    "neptu_pasaran": 9,
    "neptu_jumlah": 13,
    "wiwit_ternak": "Suku",
    "tegese_ternak": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
    "jalaran_loro": "Sabdo",
    "tegese_loro": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari.",
    "petung_geblak": "Gunung",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang."
  },
  {
    "id": 31,
    "dina": "Selasa",
    "pasaran": "Pon",
    "neptu_dina": 3,
    "neptu_pasaran": 7,
    "neptu_jumlah": 10,
    "wiwit_ternak": "Watu",
    "tegese_ternak": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
    "jalaran_loro": "Guna",
    "tegese_loro": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Jugrug",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 32,
    "dina": "Rabu",
    "pasaran": "Wage",
    "neptu_dina": 7,
    "neptu_pasaran": 4,
    "neptu_jumlah": 11,
    "wiwit_ternak": "Gajah",
    "tegese_ternak": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
    "jalaran_loro": "Wana",
    "tegese_loro": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Segara",
    "tegese_geblak": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino."
  },
  {
    "id": 33,
    "dina": "Kamis",
    "pasaran": "Kliwon",
    "neptu_dina": 8,
    "neptu_pasaran": 8,
    "neptu_jumlah": 16,
    "wiwit_ternak": "Buto",
    "tegese_ternak": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "jalaran_loro": "Lepas",
    "tegese_loro": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati.",
    "petung_geblak": "Asad",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "id": 34,
    "dina": "Jumat",
    "pasaran": "Legi",
    "neptu_dina": 6,
    "neptu_pasaran": 5,
    "neptu_jumlah": 11,
    "wiwit_ternak": "Gajah",
    "tegese_ternak": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
    "jalaran_loro": "Wana",
    "tegese_loro": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Segara",
    "tegese_geblak": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino."
  },
  {
    "id": 35,
    "dina": "Sabtu",
    "pasaran": "Pahing",
    "neptu_dina": 9,
    "neptu_pasaran": 9,
    "neptu_jumlah": 18,
    "wiwit_ternak": "Watu",
    "tegese_ternak": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
    "jalaran_loro": "Guna",
    "tegese_loro": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro.",
    "petung_geblak": "Jugrug",
    "tegese_geblak": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  }
];

export const KAMUS_WIWIT_TERNAK = [
  {
    "kode": "Gajah",
    "tegese": "Dianggap paling baik. Tanda rezeki besar, ternak mudah membawa keuntungan.",
    "status_ringkas": "Becik"
  },
  {
    "kode": "Suku",
    "tegese": "Hewan biasanya cepat berkembang atau bertambah. Cocok untuk ternak yang ingin dikembangbiakkan.",
    "status_ringkas": "Becik"
  },
  {
    "kode": "Watu",
    "tegese": "Hewan kuat dan tahan lama. Cocok untuk hewan kerja atau ternak jangka panjang.",
    "status_ringkas": "Normal"
  },
  {
    "kode": "Buto",
    "tegese": "Kurang baik dalam kepercayaan Jawa. Dikhawatirkan hewan sering sakit atau tidak membawa untung.",
    "status_ringkas": "Ala"
  }
];

export const KAMUS_JALARAN_LORO = [
  {
    "kode": "Lepas",
    "tegese": "Jalaran amargo medis, rodok butuh wektu kanggo mari, tombone sarono medis, nek ora ngati-ati isoh marakke bablas mati."
  },
  {
    "kode": "Wana",
    "tegese": "Jalaran soko wana utawa paran, isoh amargo kondisi hawa, angin, kodanan lan amargo keno sawan. Tombone kudu reresik lan njaluk pangapuro."
  },
  {
    "kode": "Sabdo",
    "tegese": "Jalaran soko omongane utawa batine dewe, omongane utawa batine liyan. Njaluk tombo sak omonge sing menehi tombo bakalan mari."
  },
  {
    "kode": "Guna",
    "tegese": "Jalaran soko keno guno digawe liyan. Tombone kudu reresik lan njaluk pangapuro."
  }
];

export const KAMUS_GEBLAK = [
  {
    "kode": "Asad",
    "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  },
  {
    "kode": "Segara",
    "tegese": "Koyo segara, isoh nampung bab becik isoh uga nampung bab ala. Tegese sing ditinggal isoh bakal nemu bejo utawa cilaka miturut wiradate tumuju 40 dino."
  },
  {
    "kode": "Gunung",
    "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu kamulyan, lan sing mati isoh nemu dalane kasampurnan luwih gampang."
  },
  {
    "kode": "Jugrug",
    "tegese": "Sing ditinggal (anak, turun, sedulur) bakal nemu jugrug (isoh kerukunan sedulur, rejeki, lan liyane) lan sing mati kangelan nemu dalan kasampurnan, karono wiradat didongani 40 dino tanpo pedot wiwit soko geblak e."
  }
];

export const REF_NEPTU_APP = [
  {
    "jenis": "dina",
    "nama": "Minggu",
    "neptu": 5
  },
  {
    "jenis": "dina",
    "nama": "Senin",
    "neptu": 4
  },
  {
    "jenis": "dina",
    "nama": "Selasa",
    "neptu": 3
  },
  {
    "jenis": "dina",
    "nama": "Rabu",
    "neptu": 7
  },
  {
    "jenis": "dina",
    "nama": "Kamis",
    "neptu": 8
  },
  {
    "jenis": "dina",
    "nama": "Jumat",
    "neptu": 6
  },
  {
    "jenis": "dina",
    "nama": "Sabtu",
    "neptu": 9
  },
  {
    "jenis": "pasaran",
    "nama": "Legi",
    "neptu": 5
  },
  {
    "jenis": "pasaran",
    "nama": "Pahing",
    "neptu": 9
  },
  {
    "jenis": "pasaran",
    "nama": "Pon",
    "neptu": 7
  },
  {
    "jenis": "pasaran",
    "nama": "Wage",
    "neptu": 4
  },
  {
    "jenis": "pasaran",
    "nama": "Kliwon",
    "neptu": 8
  }
];

/**
 * Helper lookup langsung berdasarkan dina & pasaran
 * @param {string} dina - Nama hari (e.g. "Minggu", "Senin")
 * @param {string} pasaran - Nama pasaran (e.g. "Pon", "Wage")
 * @returns {object|null}
 */
export function lookupWetonTernakLoroGeblak(dina, pasaran) {
  if (!dina || !pasaran) return null;
  const dNorm = Object.keys(weton_35).find(k => k.toLowerCase() === String(dina).trim().toLowerCase());
  if (!dNorm) return null;
  const pNorm = Object.keys(weton_35[dNorm]).find(k => k.toLowerCase() === String(pasaran).trim().toLowerCase());
  if (!pNorm) return null;
  return weton_35[dNorm][pNorm];
}
