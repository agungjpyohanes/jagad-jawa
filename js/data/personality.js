// Data Nujum Kepribadian, Faalakiah, Bincil, Asesoris
// jawa-v2 – single source nujum, exact lookup
import {
  bincilDatabase,
  getNujumData,
  getNujumFromMatrix,
  getNujumFromDatabase
} from './nujum-matrix.js';
import {
  pawukonDatabase,
  getPawukonData,
  PAWUKON_LIST
} from './pawukon.js';
import { HARI, PASARAN, WUKU, NEPTU_HARI, NEPTU_PASARAN } from './calendar.js';

// ─── KANON DEWA (Single Source of Truth) ────────────────────────────────────
// Wire resolver dari dewa-kanon.js agar tersedia via personality.js
export {
  ASTAWARA_8,
  SIKLUS_12,
  WUKU_DEWA,
  normalizeDewaName,
  resolveAstawara,
  resolveSiklus12,
  resolveWukuDewa,
  illustrationPath,
  wukuIllustrationPath,
  dewaneIllustrationPath,
  siklus12IllustrationPath,
  astawaraIllustrationPath
} from './dewa-kanon.js';

export const primbonMatrix = bincilDatabase;
export { bincilDatabase };
export const nujumMatrix = bincilDatabase;
export const nujumDatabase = bincilDatabase;
export { getNujumData, getNujumFromMatrix, getNujumFromDatabase };

export { pawukonDatabase, getPawukonData, PAWUKON_LIST };


export const KARAKTER = {
  1: "Leader", 2: "Diplomat", 3: "Analisis", 4: "Realis",
  5: "Adventurer", 6: "Idealis", 7: "Edukatif", 8: "Eksekutor", 0: "Entertainer"
};

export const PADEWAN = [
  // Siklus 12 Batara/Batari — kanon A2 (dewa-kanon.js)
  // Index 0 = siklus ke-1, Index 11 = siklus ke-12
  "Batara Suryo",    // 1
  "Batara Bromo",    // 2
  "Batari Durga",    // 3  ← bukan Durgo (gender: Batari)
  "Batara Asmoro",   // 4
  "Batara Isworo",   // 5
  "Batari Nagagini", // 6  ← bukan Nogogini
  "Batara Kamajaya", // 7  ← bukan Komojoyo
  "Batari Sri",      // 8  ← bukan Batara Sri (gender: Batari)
  "Batara Bayu",     // 9
  "Batara Wisnu",    // 10
  "Batara Endro",    // 11
  "Batara Yamadipati"// 12
];

export const AKSARA_FAAL = {
  "HA": 1, "NA": 2, "CA": 3, "RA": 4, "KA": 5, "DA": 6, "TA": 7, "SA": 8, "WA": 9, "LA": 10,
  "PA": 11, "DHA": 12, "JA": 13, "YA": 14, "NYA": 15, "MA": 16, "GA": 17, "BA": 18, "THA": 19, "NGA": 20
};

export const NABI_FAAL = {
  1: "Nabi Yusuf", 2: "Nabi Ahmad", 3: "Nabi Isa", 4: "Nabi Dawut", 5: "Nabi Soleman",
  6: "Nabi Adam", 7: "Nabi Ibrahim", 8: "Nabi Idris", 9: "Nabi Nuh", 10: "Nabi Musa",
  11: "Nabi Ayub", 12: "Nabi Yunus", 0: "Nabi Yunus"
};

export const FAAL_DESC = {
  1: "Antuk rahmate Pangeran, agung kaluhurane, pinter bisa nindakake sembarang pagaweyan. Bilahine amarga kapiterane dewe. Tolak: sedekaha WEDUS sakwayahe. Dzikir: YA ALIMU 15x setiap malam.",
  2: "Ora bisa sugih rajabrana, nanging becik atine. Bilahine tansah diudi dening wong supaya rusak nanging ora bisa. Tolak: sedekaha JARIT PUTIH lan ALI-ALI SALOKA. Jangan makan umbi-umbian.",
  3: "Tansah ditresnani lan diwedeni. Tolak: sedekaha BERAS ABANG lan BERAS PUTIH sarta PITIK IRENG MULUS lan PITIK PUTIH MULUS. Larangan: ojo dahar kewan mabur lan endog. Dzikir: YA ROBBI 400x.",
  4: "Akeh begja lan daulate, nanging bandane sarta anake akeh kang ilang. Bilahi dari lawan jenis. Tolak: sedekaha SALOKA bobot 3 aga lan dinar 5 iji. Dzikir: YA KADIRU 100x.",
  5: "Akeh begja lan daulate, sugih donya lan sugih anak. Bilahi karena sering nyidrani janji. Tolak: sedekaha JARIK IRENG saklembar. Larangan: ojo dahar pucukan. Dzikir: YA ALIMU 50x.",
  6: "Akeh begja, antuk kanugrahan, ora kendat rejekine. Anak akeh kang ilang/cacat. Bilahi dari lawan jenis. Tolak: sedekaha KERIS. Larangan: ojo dahar kewan mabur. Dzikir: YA KALKU 90x.",
  7: "Sumadiya manggon ana ing omah ibadah amarga deweke wis nandang bilahine, kabeh banda donyane wis ditinggalke. Tolak: sidekaha EMAS bobot telung aga. Prayoga ojo dahar ENDOG saklawase urip. Dzikir: YA RAHIMU 9x saben wengi.",
  8: "Demen marang kabecikan, binuka ing ngelmu gaib. Becik dadi ahlul ibadah. Sugih anak nanging akeh cacat. Tolak: sidekaha DAGING dicampur BANYU sarta JARIK PUTIH. Larangan: ojo dahar WALANG. Dzikir: YA SALAMU 100x.",
  9: "Agung rahmate, sugih banda untuk dagang/tani. Anak bakal murang sarak. Bilahi dari rabi atau anak. Tolak: sidekaha JARIK BATIK. Larangan: ojo dahar kewan mabur. Dzikir: YA KAFI, YA MUKNIYA 9x.",
  10: "Adoh banget lelakone/pacobane. Asring tapa lan perang nanging ora tahu kalah. Watake ora sabaran. Tolak: sidekaha JARIK PUTIH. Dzikir: YA ROBBI 8x.",
  11: "Tansah nandang lara-laranen. Kabejane tinemu ing buri. Bilahi dari lawan jenis. Tolak: sidekaha GANGSA bobot rong kati. Dzikir: YA MUKYI 8x.",
  12: "Ora sugih banda donya nanging sugih anak. Harta dijaga Naga lan Singa. Tolak: sidekaha TIMAH bobot rong kati lan ALI-ALI SALOKA. Larangan: ojo dahar IWAK ATI. Dzikir: YA KADIRU 100x.",
  0: "Ora sugih banda donya nanging sugih anak. Harta dijaga Naga lan Singa. Tolak: sidekaha TIMAH bobot rong kati lan ALI-ALI SALOKA. Larangan: ojo dahar IWAK ATI. Dzikir: YA KADIRU 100x."
};

// 1. PADEWAN (Astawara / 8 Dewa)
export const PADEWAN_DATA = {
  1: { nama: "Sri", arti: "Welas asih" },
  2: { nama: "Indra", arti: "Teliti, angkuh" },
  3: { nama: "Guru", arti: "Memberi percobaan, lelemeran" },
  4: { nama: "Yamadipati", arti: "Pengertian, malas" },
  5: { nama: "Rudra", arti: "Berbudi luhur" },
  6: { nama: "Brama", arti: "Brangasan" },
  7: { nama: "Kala", arti: "Serakah, bohong" },
  8: { nama: "Uma", arti: "Welas asih" }
};

export const PADEWAN_ARTI = {
  "Sri": "Welas asih",
  "Indra": "Teliti, angkuh",
  "Guru": "Memberi percobaan, lelemeran",
  "Yamadipati": "Pengertian, malas",
  "Rudra": "Berbudi luhur",
  "Brama": "Brangasan",
  "Kala": "Serakah, bohong",
  "Uma": "Welas asih"
};

// 2. PARINGKELAN (Sadwara / 6 Hari)
export const PARINGKELAN_DATA = {
  1: { nama: "Tungle", arti: "Tidak tepat janji" },
  2: { nama: "Aryang", arti: "Pelupa" },
  3: { nama: "Wurukung", arti: "Lengah" },
  4: { nama: "Paningron", arti: "Takabur" },
  5: { nama: "Uwas", arti: "Melikan" },
  6: { nama: "Mawulu", arti: "Sering sakit" }
};

export const PARINGKELAN_ARTI = {
  "Tungle": "Tidak tepat janji",
  "Aryang": "Pelupa",
  "Wurukung": "Lengah",
  "Paningron": "Takabur",
  "Uwas": "Melikan",
  "Mawulu": "Sering sakit"
};

// 3. PANDANGON (Sangawara / 9 Hari)
export const PANDANGON_DATA = {
  1: { nama: "Dangu", arti: "Pendiam, bodoh, kerashati" },
  2: { nama: "Jagur", arti: "Luwes, kuat, irihatin" },
  3: { nama: "Gigis", arti: "Kuat dapat menerima keadaan" },
  4: { nama: "Kerangan", arti: "Teliti, berpendirian" },
  5: { nama: "Nohan", arti: "Welasasih" },
  6: { nama: "Wogan", arti: "Tekun, hemat dan kuat pendiriannya" },
  7: { nama: "Tulus", arti: "Jujur, banyak kemauannya" },
  8: { nama: "Wurung", arti: "Berangasan dan tidak sabaran" },
  9: { nama: "Dadi", arti: "Tidak mau disaingi" }
};

export const PANDANGON_ARTI = {
  "Dangu": "Pendiam, bodoh, kerashati",
  "Jagur": "Luwes, kuat, irihatin",
  "Gigis": "Kuat dapat menerima keadaan",
  "Kerangan": "Teliti, berpendirian",
  "Nohan": "Welasasih",
  "Wogan": "Tekun, hemat dan kuat pendiriannya",
  "Tulus": "Jujur, banyak kemauannya",
  "Wurung": "Berangasan dan tidak sabaran",
  "Dadi": "Tidak mau disaingi"
};

// 4. BINCIL PAARASAN (10 Watak)
export const PAARASAN_DATA = {
  1: { nama: "Aras Tuding", arti: "Pemberi dan terpakai kinerjanya tapi sering menjual perabotnya dan suka mencuri (climut)" },
  2: { nama: "Aras Kembang", arti: "Larang anak tetapi dikasihi banyak orang dan mudah berpikir bekerja serta diluluti orang" },
  3: { nama: "Lakuning Lintang", arti: "Pendiam, rendah hati, betah melek, berdagang dan jual bahasa tidak bisa diarahkan, sering pindah rumah" },
  4: { nama: "Lakuning Rembulan", arti: "Pandai, cekatan, luas pandangannya, diluluti orang, sukses hidupnya tetapi jangan sungkan - sungkan" },
  5: { nama: "Lakuning Srengenge", arti: "Pengertian, manis bicaranya, kreatif, selalu kalah bertengkar dan jangan banyak makan" },
  6: { nama: "Lakuning Banyu", arti: "Teguh, rajin, ramah, bisa jadi pemimpin, banyak makan dan selalu bertengkar" },
  7: { nama: "Lakuning Bumi", arti: "Pendiam, pamarah, bodoh, senang selingkuh dan welas asih tidak punya teman/saudara" },
  8: { nama: "Lakuning Geni", arti: "Pemarah, dengki, pemberi, banyak rencana dan untuk perempuan banyak celakanya" },
  9: { nama: "Lakuning Angin", arti: "Pendiam, suka disanjung, tidak teguh dan tawar doanya, sering pindah rumah dan menyenangkan orang" },
  10: { nama: "Aras Pepet", arti: "Pendiam, tajam pikirannya, termasyur karyanya, ada bakat jadi paranormal dan jarang kesampaian cita - citanya" }
};

export const PAARASAN_ARTI = {
  "Aras Tuding": "Pemberi dan terpakai kinerjanya tapi sering menjual perabotnya dan suka mencuri (climut)",
  "Aras Kembang": "Larang anak tetapi dikasihi banyak orang dan mudah berpikir bekerja serta diluluti orang",
  "Lakuning Lintang": "Pendiam, rendah hati, betah melek, berdagang dan jual bahasa tidak bisa diarahkan, sering pindah rumah",
  "Lakuning Rembulan": "Pandai, cekatan, luas pandangannya, diluluti orang, sukses hidupnya tetapi jangan sungkan - sungkan",
  "Lakuning Srengenge": "Pengertian, manis bicaranya, kreatif, selalu kalah bertengkar dan jangan banyak makan",
  "Lakuning Banyu": "Teguh, rajin, ramah, bisa jadi pemimpin, banyak makan dan selalu bertengkar",
  "Lakuning Bumi": "Pendiam, pamarah, bodoh, senang selingkuh dan welas asih tidak punya teman/saudara",
  "Lakuning Geni": "Pemarah, dengki, pemberi, banyak rencana dan untuk perempuan banyak celakanya",
  "Lakuning Angin": "Pendiam, suka disanjung, tidak teguh dan tawar doanya, sering pindah rumah dan menyenangkan orang",
  "Aras Pepet": "Pendiam, tajam pikirannya, termasyur karyanya, ada bakat jadi paranormal dan jarang kesampaian cita - citanya"
};

// 5. BINCIL PANCASUDA (7 Watak)
export const PANCASUDA_DATA = {
  1: { nama: "Wasesa Segara", arti: "Berjiwa besar, pemaaf, dapat menerima masukan baik / jelek dan berwibawa" },
  2: { nama: "Tunggak Semi", arti: "Banyak rejeki, walau dipotong tetap ada rejekinya" },
  3: { nama: "Satriya Wibawa", arti: "Dimanapun selalu berwibawa dan dihormati orang" },
  4: { nama: "Sumur Sinaba", arti: "Menjadi tempat menimba ilmu" },
  5: { nama: "Satriya Wirang", arti: "Dimanapun selalu dipermalukan walau beritikat baikpun dan banyak halangan" },
  6: { nama: "Bumi Kapetak", arti: "Bersih hatinya kuat pendiriannya, malas dan tidak tahan lapar , harus rajin belajar" },
  7: { nama: "Lebu Ketiyup Angin", arti: "Melarat, tidak kerasanan sering pindah rumah dan berkayal, baik untuk berburu" }
};

export const PANCASUDA_ARTI = {
  "Wasesa Segara": "Berjiwa besar, pemaaf, dapat menerima masukan baik / jelek dan berwibawa",
  "Tunggak Semi": "Banyak rejeki, walau dipotong tetap ada rejekinya",
  "Satriya Wibawa": "Dimanapun selalu berwibawa dan dihormati orang",
  "Sumur Sinaba": "Menjadi tempat menimba ilmu",
  "Satriya Wirang": "Dimanapun selalu dipermalukan walau beritikat baikpun dan banyak halangan",
  "Bumi Kapetak": "Bersih hatinya kuat pendiriannya, malas dan tidak tahan lapar , harus rajin belajar",
  "Lebu Ketiyup Angin": "Melarat, tidak kerasanan sering pindah rumah dan berkayal, baik untuk berburu",
  "Lebu Ketiyup Angin": "Melarat, tidak kerasanan sering pindah rumah dan berkayal, baik untuk berburu"
};

// 6. BINCIL KAMAROKAN (6 Watak)
export const KAMAROKAN_DATA = {
  1: { nama: "Nuju Padu", arti: "Jelek, dalam segala hal sering bertengkar apa lagi untuk pernikahan" },
  2: { nama: "Kala Tinantang", arti: "Jelek, selalu kekurangan hidupnya, sering sakit dan besar ammarahnya" },
  3: { nama: "Sanggar Waringin", arti: "Baik, tentram , bahagia, banyak rejeki , berkembang , terang hatinya , menjadi pelindung" },
  4: { nama: "Mantri Sinarojo", arti: "Baik, tercapai cita-citanya , senang hidupnya, murah sandang-pangan dan banyak anak" },
  5: { nama: "Macan Ketawan", arti: "Cukupan, disegani tetapi juga dijauhi orang , sering kehilangan , ada niat jelek" },
  6: { nama: "Nuju Pati", arti: "Jelek, mampat rejekinya, susah hidupnya, cepat cerai jodohnya, banyak bencana" }
};

export const KAMAROKAN_ARTI = {
  "Nuju Padu": "Jelek, dalam segala hal sering bertengkar apa lagi untuk pernikahan",
  "Kala Tinantang": "Jelek, selalu kekurangan hidupnya, sering sakit dan besar ammarahnya",
  "Sanggar Waringin": "Baik, tentram , bahagia, banyak rejeki , berkembang , terang hatinya , menjadi pelindung",
  "Mantri Sinarojo": "Baik, tercapai cita-citanya , senang hidupnya, murah sandang-pangan dan banyak anak",
  "Macan Ketawan": "Cukupan, disegani tetapi juga dijauhi orang , sering kehilangan , ada niat jelek",
  "Nuju Pati": "Jelek, mampat rejekinya, susah hidupnya, cepat cerai jodohnya, banyak bencana"
};

// Urip Kerta-Aji untuk Pancasuda (7 Siklus)
export const KERTA_AJI_HARI = [6, 4, 3, 7, 5, 7, 8]; // Minggu=6, Senin=4, Selasa=3, Rabu=7, Kamis=5, Jumat=7, Sabtu=8
export const KERTA_AJI_PASARAN = [5, 9, 7, 4, 8]; // Legi=5, Pahing=9, Pon=7, Wage=4, Kliwon=8

// Urip Rakam untuk Kamarokan (6 Siklus)
export const RAKAM_HARI = [3, 4, 5, 6, 7, 1, 2]; // Jumat=1, Sabtu=2, Minggu=3, Senin=4, Selasa=5, Rabu=6, Kamis=7
export const RAKAM_PASARAN = [2, 3, 4, 5, 1]; // Kliwon=1, Legi=2, Pahing=3, Pon=4, Wage=5

// =========================================================================
// SISTEM MATRIKS LOOKUP TABEL BAKU (primbonMatrix)
// =========================================================================

export function getNujumLengkap(wukuId, weekdayId, pasaranId) {
  const hari = HARI[weekdayId];
  const pasaran = PASARAN[pasaranId];
  const wuku = WUKU[wukuId];
  const data = (typeof getNujumData === 'function') ? getNujumData(hari, pasaran, wuku) : null;
  const neptu = (NEPTU_HARI[weekdayId] || 0) + (NEPTU_PASARAN[pasaranId] || 0);
  const key = `${hari}${pasaran}_${String(wuku || '').replace(/\s+/g, '')}`;

  if (data && data.found) {
    return {
      key,
      neptu,
      padewan: {
        nama: data.padewan.nama,
        arti: data.padewan.arti,
        sisa: Object.keys(PADEWAN_DATA).find(k => PADEWAN_DATA[k].nama === data.padewan.nama) || "-"
      },
      paringkelan: {
        nama: data.paringkelan.nama,
        arti: data.paringkelan.arti,
        sisa: Object.keys(PARINGKELAN_DATA).find(k => PARINGKELAN_DATA[k].nama === data.paringkelan.nama) || "-"
      },
      pandangon: {
        nama: data.pandangon.nama,
        arti: data.pandangon.arti,
        sisa: Object.keys(PANDANGON_DATA).find(k => PANDANGON_DATA[k].nama === data.pandangon.nama) || "-"
      },
      paarasan: {
        nama: data.paarasan.nama,
        arti: data.paarasan.arti,
        sisa: Object.keys(PAARASAN_DATA).find(k => PAARASAN_DATA[k].nama === data.paarasan.nama) || "-"
      },
      pancasuda: {
        nama: data.pancasuda.nama,
        arti: data.pancasuda.arti,
        sisa: Object.keys(PANCASUDA_DATA).find(k => PANCASUDA_DATA[k].nama === data.pancasuda.nama) || "-"
      },
      kamarokan: {
        nama: data.kamarokan.nama,
        arti: data.kamarokan.arti,
        sisa: Object.keys(KAMAROKAN_DATA).find(k => KAMAROKAN_DATA[k].nama === data.kamarokan.nama) || "-"
      },
      pawukon: data.pawukon
    };
  }

  return {
    key,
    neptu,
    padewan: { nama: "-", arti: "-", sisa: "-" },
    paringkelan: { nama: "-", arti: "-", sisa: "-" },
    pandangon: { nama: "-", arti: "-", sisa: "-" },
    paarasan: { nama: "-", arti: "-", sisa: "-" },
    pancasuda: { nama: "-", arti: "-", sisa: "-" },
    kamarokan: { nama: "-", arti: "-", sisa: "-" },
    pawukon: null
  };
}

export function hitungPadewan(wukuId, weekdayId, pasaranId) {
  const p = (pasaranId !== undefined) ? pasaranId : ((1 + wukuId * 7 + weekdayId) % 5);
  return getNujumLengkap(wukuId, weekdayId, p).padewan;
}

export function hitungParingkelan(wukuId, weekdayId, pasaranId) {
  const p = (pasaranId !== undefined) ? pasaranId : ((1 + wukuId * 7 + weekdayId) % 5);
  return getNujumLengkap(wukuId, weekdayId, p).paringkelan;
}

export function hitungPandangon(wukuId, weekdayId, pasaranId) {
  const p = (pasaranId !== undefined) ? pasaranId : ((1 + wukuId * 7 + weekdayId) % 5);
  return getNujumLengkap(wukuId, weekdayId, p).pandangon;
}

export function hitungPaarasan(weekdayId, pasaranId) {
  const wukuId = 0;
  return getNujumLengkap(wukuId, weekdayId, pasaranId).paarasan;
}

export function hitungPancasuda(weekdayId, pasaranId) {
  const wukuId = 0;
  return getNujumLengkap(wukuId, weekdayId, pasaranId).pancasuda;
}

export function hitungKamarokan(weekdayId, pasaranId) {
  const wukuId = 0;
  return getNujumLengkap(wukuId, weekdayId, pasaranId).kamarokan;
}

export function namaKeAksaraList(nama) {
  const clean = nama.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const VOKAL = "aiueo";
  const hasil = [];
  const kataList = clean.split(" ");
  for (const kata of kataList) {
    if (!kata) continue;
    let i = 0;
    while (i < kata.length) {
      const c = kata[i];
      if (VOKAL.includes(c)) { hasil.push("HA"); i++; continue; }
      let kons = c;
      let next = kata[i + 1] || "";
      if ((c === "n" && next === "y") || (c === "n" && next === "g") || (c === "d" && next === "h") || (c === "t" && next === "h")) {
        kons = c + next; i += 2;
      } else { i += 1; }
      if (i < kata.length && VOKAL.includes(kata[i])) { i++; if (i < kata.length && VOKAL.includes(kata[i])) i++; }
      else { continue; }
      const mapKons = {
        "h": "HA", "n": "NA", "c": "CA", "r": "RA", "k": "KA", "d": "DA", "t": "TA", "s": "SA",
        "w": "WA", "l": "LA", "p": "PA", "j": "JA", "y": "YA", "m": "MA", "g": "GA", "b": "BA",
        "ny": "NYA", "ng": "NGA", "th": "THA", "dh": "DHA"
      };
      hasil.push(mapKons[kons] || mapKons[kons[0]] || "HA");
    }
  }
  return hasil;
}

export function getFaalakiah(nama) {
  const aksaraList = namaKeAksaraList(nama);
  if (aksaraList.length === 0) return { kode: 0, nabi: NABI_FAAL[0], desc: FAAL_DESC[0], aksaraStr: "-", sum: 0 };
  let sum = 0;
  for (const ak of aksaraList) sum += (AKSARA_FAAL[ak] || 1);
  const kode = sum % 12;
  return {
    kode,
    nabi: NABI_FAAL[kode] || NABI_FAAL[0],
    desc: FAAL_DESC[kode] || FAAL_DESC[0],
    aksaraStr: aksaraList.join(" "),
    sum
  };
}

export const UNICODE_JAWA_TO_FAAL = {
  'ꦲ': 'HA', 'ꦤ': 'NA', 'ꦕ': 'CA', 'ꦫ': 'RA', 'ꦏ': 'KA',
  'ꦢ': 'DA', 'ꦠ': 'TA', 'ꦱ': 'SA', 'ꦮ': 'WA', 'ꦭ': 'LA',
  'ꦥ': 'PA', 'ꦝ': 'DHA', 'ꦗ': 'JA', 'ꦪ': 'YA', 'ꦚ': 'NYA',
  'ꦩ': 'MA', 'ꦒ': 'GA', 'ꦧ': 'BA', 'ꦛ': 'THA', 'ꦔ': 'NGA',
  'ꦟ': 'NA', 'ꦑ': 'KA', 'ꦡ': 'TA', 'ꦰ': 'SA',
  'ꦦ': 'PA', 'ꦘ': 'NYA', 'ꦓ': 'GA', 'ꦨ': 'BA',
  'ꦄ': 'HA', 'ꦅ': 'HA', 'ꦈ': 'HA', 'ꦌ': 'HA', 'ꦎ': 'HA',
  'ꦂ': 'RA', 'ꦁ': 'NGA', 'ꦃ': 'HA',
  'ꦿ': 'RA', 'ꦽ': 'RA', 'ꦾ': 'YA'
};

export function parseAksaraForFaalakiah(text) {
  if (!text || !text.trim()) return [];
  const clean = text.trim();
  const jawaChars = clean.match(/[\uA980-\uA9DF]/g);
  if (jawaChars && jawaChars.length > 0) {
    const list = [];
    for (const ch of jawaChars) {
      if (UNICODE_JAWA_TO_FAAL[ch]) {
        list.push(UNICODE_JAWA_TO_FAAL[ch]);
      }
    }
    if (list.length > 0) return list;
  }
  return namaKeAksaraList(clean);
}

export function getAsesoris(bulan, tanggal) {
  const data = {
    1: { dino: "Senin, Kamis lan Sabtu", sasi: "Januari lan Februari", lelara: "Kulit, Reumatik, Pencernaan", watu: "Black Onyx, Ruby, Giok", warna: "Biru Laut lan Ijo Tua", kembang: "Melati, Sedap Malam, Leli Putih" },
    2: { dino: "Selasa, Rabu lan Sabtu", sasi: "Februari lan Maret", lelara: "Umum", watu: "Safir Biru, Kalimaya, Amethyst", warna: "Oranye lan Abang Enom", kembang: "Mawar Oranye lan Mawar Abang" },
    3: { dino: "Selasa, Kamis lan Minggu", sasi: "Mei lan Juni", lelara: "Kulit Gatal, Reumatik", watu: "Safir Biru, Jamrud Ijo", warna: "Abu-abu", kembang: "Melati, Leli Putih, Ceplok Piring" },
    4: { dino: "Selasa", sasi: "Desember", lelara: "Mata, Ginjal, Hati", watu: "Kecubung, Intan, Badar Besi", warna: "Abang Tua lan Kuning", kembang: "Mawar Abang lan Leli Kuning" },
    5: { dino: "Rabu lan Jumat", sasi: "November", lelara: "Gulu Kejang, Jantung", watu: "Jamrud Ijo, Safir, Pirus Biru", warna: "Biru Tua, Coklat, Oranye", kembang: "Mawar Oranye, Anyelir, Suplir" },
    6: { dino: "Rabu lan Sabtu", sasi: "Februari", lelara: "Watuk, Mumet", watu: "Aquamarine, Jamrud Ijo", warna: "Putih, Kuning, Biru Enom", kembang: "Melati, Leli Putih, Anggrek" },
    7: { dino: "Senin", sasi: "Februari", lelara: "Weteng, Paru-paru", watu: "Mutiara, Mata Kucing, Biduri Bulan", warna: "Kuning Biru, Coklat", kembang: "Melati, Sedap Malam" },
    8: { dino: "Jumat lan Minggu", sasi: "Maret", lelara: "Mumet, Sendi", watu: "Berlian, Ruby Star, Topas Kuning", warna: "Kuning, Ijo, Oranye", kembang: "Melati, Leli, Anggrek" },
    9: { dino: "Rabu lan Sabtu", sasi: "April lan Agustus", lelara: "Maag, Angel Turu", watu: "Giok, Akik Lapis, Carnelian", warna: "Kuning lan Ijo", kembang: "Melati, Sedap Malam" },
    10: { dino: "Jumat", sasi: "Mei lan Agustus", lelara: "Umum", watu: "Opal, Berlian, Merjan", warna: "Biru lan Abang Anggur", kembang: "Kenanga Kuning, Wijaya Kusuma" },
    11: { dino: "Minggu lan Selasa", sasi: "Agustus", lelara: "Reumatik, Ginjal", watu: "Topas, Kalimaya, Aquamarine", warna: "Abang lan Putih", kembang: "Melati, Anggrek" },
    12: { dino: "Kamis lan Minggu", sasi: "Juli lan Oktober", lelara: "Tenggorokan, Paru-paru", watu: "Berlian, Nilam, Pirus", warna: "Ijo, Oranye, Kuning", kembang: "Melati, Leli Putih, Mawar" }
  };
  let k = 5;
  if ((bulan === 12 && tanggal >= 23) || bulan === 1 || (bulan === 2 && tanggal <= 3)) k = 1;
  else if (bulan === 2 && tanggal >= 4) k = 2;
  else if (bulan === 3 && tanggal <= 26) k = 3;
  else if ((bulan === 3 && tanggal >= 27) || (bulan === 4 && tanggal <= 19)) k = 4;
  else if ((bulan === 4 && tanggal >= 20) || (bulan === 5 && tanggal <= 12)) k = 5;
  else if ((bulan === 5 && tanggal >= 13) || (bulan === 6 && tanggal <= 22)) k = 6;
  else if ((bulan === 6 && tanggal >= 23) || bulan === 7 || (bulan === 8 && tanggal <= 2)) k = 7;
  else if (bulan === 8 && tanggal >= 3 && tanggal <= 25) k = 8;
  else if ((bulan === 8 && tanggal >= 26) || (bulan === 9 && tanggal <= 18)) k = 9;
  else if ((bulan === 9 && tanggal >= 19) || (bulan === 10 && tanggal <= 13)) k = 10;
  else if ((bulan === 10 && tanggal >= 14) || (bulan === 11 && tanggal <= 9)) k = 11;
  else k = 12;
  return data[k];
}
