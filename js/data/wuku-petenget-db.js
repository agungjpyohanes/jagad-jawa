/**
 * JAGAD JAWA - Master Database Petenget 30 Wuku Nusantara
 * Sumber:
 *   - database_nujum_cleaned - wuku_ala_becik.csv
 *   - database_nujum_cleaned - wuku_nambani.csv
 *   - database_nujum_cleaned - wuku_pangupajiwa.csv
 *   - database_nujum_cleaned - wuku_tetanen.csv
 *
 * Memuat panduan mendalam untuk tiap wuku (1 - 30):
 *   1. Ala & Becik (Pedoman umum hajat & pantangan)
 *   2. Nambani (Pengobatan tradisional, usada, & larangan tindakan medis)
 *   3. Pangupajiwa (Pencarian nafkah, bisnis, & profesi unggul)
 *   4. Tetanen (Bercocok tanam, jenis bibit, & pantangan bertani)
 */

(function (root) {
  const WUKU_PETENGET_LIST = [
  {
    "no": 1,
    "wuku": "Sinta",
    "alaBecik": {
      "becik": "Ngusadani, nenumbali, gawe sarat supaya murah udan, memantu masang pengasihan",
      "ala": "Olah kaweruh, nenandur, ngadan-adani, bebakal pekarangan"
    },
    "nambani": {
      "becik": "Ngusadani, nenumbali, gawe sarat supaya murah udan, memantu masang pengasihan",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "Nenandur, bebakal pekarangan"
    }
  },
  {
    "no": 2,
    "wuku": "Landep",
    "alaBecik": {
      "becik": "Anyabung pedang, naleni pager, gawe wisaya iwak lan sakpanunggalane",
      "ala": "Ngalih panggonan, memantu barusahan, gawe kori (lawang)"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 3,
    "wuku": "Wukir",
    "alaBecik": {
      "becik": "Memantu, dandan-dandan sembarang rusak, memitran tulus",
      "ala": "Tetirah, nambani lelara, nenumbali, ngedegake omah lan sakpanuggalane"
    },
    "nambani": {
      "becik": "Memantu, dandan-dandan sembarang rusak, memitran tulus",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 4,
    "wuku": "Kurantil",
    "alaBecik": {
      "becik": "Golek pawestri gelis oleh",
      "ala": "Memantu, nglumpukake wong ora bisa kumpul, memitran sulaya ing tembe, nenandur ora tuwuh"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 5,
    "wuku": "Tolu",
    "alaBecik": {
      "becik": "Golek pangupaya jiwa, nambani lelara, nenandur, ngalih panggonan, memantu sakpanunggalane",
      "ala": "Anyidra, lelungan, ngabotohan, angengundhuh sambarang palakirna"
    },
    "nambani": {
      "becik": "Golek pangupaya jiwa, nambani lelara, nenandur, ngalih panggonan, memantu sakpanunggalane",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "Golek pangupaya jiwa, nambani lelara, nenandur, ngalih panggonan, memantu sakpanunggalane",
      "ala": "-"
    },
    "tetanen": {
      "becik": "Nenandur",
      "ala": "-"
    }
  },
  {
    "no": 6,
    "wuku": "Gumbreg",
    "alaBecik": {
      "becik": "Bebesanan, anggaota kauntungan",
      "ala": "Nenandur kitri, ngedegake omah, ngadan-adani samubarang gawe sarta lelungan"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "Nenandur kitri, ngedegake omah, ngadan-adani samubarang gawe sarta lelungan"
    },
    "tetanen": {
      "becik": "-",
      "ala": "Nenandur kitri"
    }
  },
  {
    "no": 7,
    "wuku": "Warigalit",
    "alaBecik": {
      "becik": "Tepung prasanakan, memule marang leluhur, ngilekake banyu, lunga sesanjan",
      "ala": "Pagaweyan laku silib, lelungan adoh, mangsah perang"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "Pagaweyan laku silib, lelungan adoh, mangsah perang"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 8,
    "wuku": "Warigagung",
    "alaBecik": {
      "becik": "Ngadegake omah, nenandur, bebesanan, anggeguru pangiwakan",
      "ala": "Lelungan, laku anenamur, ngalih panggonan, amilala ingon-ingon"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "Nenandur",
      "ala": "-"
    }
  },
  {
    "no": 9,
    "wuku": "Julungwangi",
    "alaBecik": {
      "becik": "Lunga tirakat oleh Wahyu, ambubak lemah, nenandur, angelar kaweruh sinugu",
      "ala": "Lelungan adoh, ngalih panggonan, duwe gawe, ngadegake samubarang, anggaota pangupaya jiwo,nambani anak"
    },
    "nambani": {
      "becik": "-",
      "ala": "Lelungan adoh, ngalih panggonan, duwe gawe, ngadegake samubarang, anggaota pangupaya jiwo,nambani anak"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "Lelungan adoh, ngalih panggonan, duwe gawe, ngadegake samubarang, anggaota pangupaya jiwo,nambani anak"
    },
    "tetanen": {
      "becik": "Ambubak lemah, nenandur",
      "ala": "-"
    }
  },
  {
    "no": 10,
    "wuku": "Sungsang",
    "alaBecik": {
      "becik": "Golek panagupaya jiwa, ngalih panggonan, gawe prasanaan, bebesanan ambebara lan nenandur",
      "ala": "Memenek, negor kitri, lelungan adoh suka-suka, rame-rame, mangsah perang iku kabeh ala"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "Golek panagupaya jiwa, ngalih panggonan, gawe prasanaan, bebesanan ambebara lan nenandur",
      "ala": "-"
    },
    "tetanen": {
      "becik": "Golek pangupaya jiwa, nenandur",
      "ala": "-"
    }
  },
  {
    "no": 11,
    "wuku": "Galungan",
    "alaBecik": {
      "becik": "Lunga tirakat, sesanja ora adoh, anggeguru pangawikan",
      "ala": "Nandur pring, lelungan adoh, nambani wong lara, memantu, dadi priyayi, ngadegake omah"
    },
    "nambani": {
      "becik": "-",
      "ala": "Nandur pring, lelungan adoh, nambani wong lara, memantu, dadi priyayi, ngadegake omah"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "Nandur pring"
    }
  },
  {
    "no": 12,
    "wuku": "Kuningan",
    "alaBecik": {
      "becik": "Golek sanak, anggaota, mitulungi wong",
      "ala": "Nenandur, maju omah, duwe gawe mantu lan sapanunggalane"
    },
    "nambani": {
      "becik": "Golek sanak, anggaota, mitulungi wong",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "Nenandur"
    }
  },
  {
    "no": 13,
    "wuku": "Langkir",
    "alaBecik": {
      "becik": "Nenandur, lelungan, bebesanan, marangi gegaman, nambani wong lara",
      "ala": "Nyidra, nandukake prakara, pancakara lan sapanunggalane"
    },
    "nambani": {
      "becik": "Nenandur, lelungan, bebesanan, marangi gegaman, nambani wong lara",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "Nenandur",
      "ala": "-"
    }
  },
  {
    "no": 14,
    "wuku": "Mandasiya",
    "alaBecik": {
      "becik": "Amemitran, nambani wong lara, duwe gawe mantu, lan sakpanunggalane",
      "ala": "Lelungan, golek pangupayajiwa, gawe sumur, bebakal pekarangan"
    },
    "nambani": {
      "becik": "Amemitran, nambani wong lara, duwe gawe mantu, lan sakpanunggalane",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "Lelungan, golek pangupayajiwa, gawe sumur, bebakal pekarangan"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 15,
    "wuku": "Julungpujut",
    "alaBecik": {
      "becik": "Golek pangupayajiwa, amilala rajakaya, nandur pala kirna",
      "ala": "Ngadan - adani, sesanja"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "Golek pangupayajiwa, amilala rajakaya, nandur pala kirna",
      "ala": "-"
    },
    "tetanen": {
      "becik": "Golek pangupayajiwa, amilala rajakaya, nandur pala kirna",
      "ala": "-"
    }
  },
  {
    "no": 16,
    "wuku": "Pahang",
    "alaBecik": {
      "becik": "Nambani lelara, nandur samubarang, ngarah pawestri",
      "ala": "Lelungan adoh, golek pangupayajiwa, ngadan - adani"
    },
    "nambani": {
      "becik": "Nambani lelara, nandur samubarang, ngarah pawestri",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "Lelungan adoh, golek pangupayajiwa, ngadan - adani"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 17,
    "wuku": "Kuruwelut",
    "alaBecik": {
      "becik": "Nontoni, ngrancang bakal omah",
      "ala": "Lelungan, dandan-dandan, nambani lelara, nandur jujutan"
    },
    "nambani": {
      "becik": "-",
      "ala": "Lelungan, dandan-dandan, nambani lelara, nandur jujutan"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "Nandur jujutan"
    }
  },
  {
    "no": 18,
    "wuku": "Marakeh",
    "alaBecik": {
      "becik": "Nenandur, masang tumbal, dandan omah, mangun pekarangan",
      "ala": "Anggaoata, asih-asihan, alih-alihan"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "Nenandur, mangun pekarangan",
      "ala": "-"
    }
  },
  {
    "no": 19,
    "wuku": "Tambir",
    "alaBecik": {
      "becik": "Lunga dagang, golek pangupayajiwa, nandur pala kirna, nancebake turus",
      "ala": "Lunga tirakat, anggeguru pangawikan, mangsah perang"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "Lunga dagang, golek pangupayajiwa, nandur pala kirna, nancebake turus",
      "ala": "-"
    },
    "tetanen": {
      "becik": "Golek pangupayajiwa, nandur pala kirna, nancebake turus",
      "ala": "-"
    }
  },
  {
    "no": 20,
    "wuku": "Medangkungan",
    "alaBecik": {
      "becik": "Alaki rabi, ngadegake omah, golek sarana",
      "ala": "Nandukake para padu, anyidra"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 21,
    "wuku": "Maktal",
    "alaBecik": {
      "becik": "Duwe gawe mantu, nekakake wong sambatan, dandan - dandan, amemuja katarima",
      "ala": "Lelungan, ngalih panggonan, amantokake"
    },
    "nambani": {
      "becik": "Duwe gawe mantu, nekakake wong sambatan, dandan - dandan, amemuja katarima",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 22,
    "wuku": "Wuye",
    "alaBecik": {
      "becik": "Golek manuk, nenandur, memule kaduluran, lelungan golek rejeki",
      "ala": "Lelungan adoh, angapus - apusi"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "Golek manuk, nenandur, memule kaduluran, lelungan golek rejeki",
      "ala": "-"
    },
    "tetanen": {
      "becik": "Nenandur",
      "ala": "-"
    }
  },
  {
    "no": 23,
    "wuku": "Manahil",
    "alaBecik": {
      "becik": "Lunga golek tamba / sarat, gawe bendungan, bebakal kuburan, nindakake para padu",
      "ala": "Nibakake wiji, apek wiji, memantu, anggaoata"
    },
    "nambani": {
      "becik": "Lunga golek tamba / sarat, gawe bendungan, bebakal kuburan, nindakake para padu",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 24,
    "wuku": "Prangbakat",
    "alaBecik": {
      "becik": "Anggaoata samaran, rawat ing pasimpenan, meminta padagangan, matrap paukuman",
      "ala": "Lelungan, ngedekake omah, nandur kitri, golek pagaweyan, nambani wong lara"
    },
    "nambani": {
      "becik": "-",
      "ala": "Lelungan, ngedekake omah, nandur kitri, golek pagaweyan, nambani wong lara"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "Lelungan, ngedekake omah, nandur kitri, golek pagaweyan, nambani wong lara"
    },
    "tetanen": {
      "becik": "-",
      "ala": "Nandur kitri"
    }
  },
  {
    "no": 25,
    "wuku": "Bala",
    "alaBecik": {
      "becik": "Tilik mesan mitra, amet saraya mirukunake pawongan, rerembukan sabiyantu",
      "ala": "Medarake pangawikan, ambabar pangajaran, dandan - dandan"
    },
    "nambani": {
      "becik": "Tilik mesan mitra, amet saraya mirukunake pawongan, rerembukan sabiyantu",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 26,
    "wuku": "Wugu",
    "alaBecik": {
      "becik": "Dandan - dandan omah, duwe gawe mantu, lungo golek rejeki, nandur pala kependem",
      "ala": "Amemitran sulaya ing tembe, arerukunan, golek pangan"
    },
    "nambani": {
      "becik": "-",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "Dandan - dandan omah, duwe gawe mantu, lungo golek rejeki, nandur pala kependem",
      "ala": "-"
    },
    "tetanen": {
      "becik": "Nandur pala kependem",
      "ala": "-"
    }
  },
  {
    "no": 27,
    "wuku": "Wayang",
    "alaBecik": {
      "becik": "Golek rejeki, anggeguru pangawikan, ulah kawignyan",
      "ala": "Lunga tilik wong lara, ngadan - adani, mangsah perang"
    },
    "nambani": {
      "becik": "-",
      "ala": "Lunga tilik wong lara, ngadan - adani, mangsah perang"
    },
    "pangupajiwa": {
      "becik": "Golek rejeki, anggeguru pangawikan, ulah kawignyan",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 28,
    "wuku": "Kulawu",
    "alaBecik": {
      "becik": "Nambani wong lara, palakrama,, wewayuhan, amemitran, rerukunan",
      "ala": "Lelungan adoh, alih - alihan, ambukak alas"
    },
    "nambani": {
      "becik": "Nambani wong lara, palakrama,, wewayuhan, amemitran, rerukunan",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 29,
    "wuku": "Dukut",
    "alaBecik": {
      "becik": "Dandan-dandan, memangun kitri, karang kirna, golek pawestri, gawe tamba lan sarat",
      "ala": "lunga golek pangupayajiwa, anggeguru pangawikan"
    },
    "nambani": {
      "becik": "Dandan-dandan, memangun kitri, karang kirna, golek pawestri, gawe tamba lan sarat",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "lunga golek pangupayajiwa, anggeguru pangawikan"
    },
    "tetanen": {
      "becik": "-",
      "ala": "-"
    }
  },
  {
    "no": 30,
    "wuku": "Watugunung",
    "alaBecik": {
      "becik": "Lunga golek tamba, nandur samubarang, memitran, bebesanan dadi",
      "ala": "Gawe pager pekarangan, sesimpen ing parawatan"
    },
    "nambani": {
      "becik": "Lunga golek tamba, nandur samubarang, memitran, bebesanan dadi",
      "ala": "-"
    },
    "pangupajiwa": {
      "becik": "-",
      "ala": "-"
    },
    "tetanen": {
      "becik": "Nandur samubarang",
      "ala": "-"
    }
  }
];

  const WUKU_PETENGET_MAP = {};
  WUKU_PETENGET_LIST.forEach(item => {
    WUKU_PETENGET_MAP[item.no] = item;
    const clean = item.wuku.toLowerCase().replace(/\s+/g, '');
    WUKU_PETENGET_MAP[clean] = item;
    WUKU_PETENGET_MAP[item.wuku.toLowerCase()] = item;
  });

  /**
   * Mengambil data petenget wuku berdasarkan nomor wuku (1-30) atau nama wuku.
   * @param {number|string} wukuNoOrName
   * @returns {Object|null}
   */
  function getWukuPetenget(wukuNoOrName) {
    if (wukuNoOrName === undefined || wukuNoOrName === null) return null;
    if (typeof wukuNoOrName === 'number') {
      return WUKU_PETENGET_MAP[wukuNoOrName] || null;
    }
    const clean = String(wukuNoOrName).trim().toLowerCase().replace(/\s+/g, '');
    if (WUKU_PETENGET_MAP[clean]) return WUKU_PETENGET_MAP[clean];
    const parsed = parseInt(clean, 10);
    if (!isNaN(parsed) && WUKU_PETENGET_MAP[parsed]) return WUKU_PETENGET_MAP[parsed];
    return null;
  }

  root.WUKU_PETENGET_LIST = WUKU_PETENGET_LIST;
  root.WUKU_PETENGET_MAP = WUKU_PETENGET_MAP;
  root.getWukuPetenget = getWukuPetenget;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      WUKU_PETENGET_LIST,
      WUKU_PETENGET_MAP,
      getWukuPetenget
    };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

const _gPetenget = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : {});
export const WUKU_PETENGET_LIST = _gPetenget.WUKU_PETENGET_LIST;
export const WUKU_PETENGET_MAP = _gPetenget.WUKU_PETENGET_MAP;
export const getWukuPetenget = _gPetenget.getWukuPetenget;

export default {
  WUKU_PETENGET_LIST: _gPetenget.WUKU_PETENGET_LIST,
  WUKU_PETENGET_MAP: _gPetenget.WUKU_PETENGET_MAP,
  getWukuPetenget: _gPetenget.getWukuPetenget
};
