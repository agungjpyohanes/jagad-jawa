/**
 * Definisi Tipe Data Domain: Kalender & Pranata Mangsa
 */

export interface DayInfo {
  jdn: number;
  weekdayId: number; // 0 = Minggu, ..., 6 = Sabtu
  pasaranId: number; // 0 = Legi, ..., 4 = Kliwon
  wukuId: number;    // 0 = Sinta, ..., 29 = Watugunung
  hijri: [number, number, number]; // [tanggal, bulan, tahun]
  ajYear: number;    // Anno Javanico / Tahun Jawa Sultan Agungan
}

export interface TanggalJawaLengkap {
  tglJawa: number;
  bulanJawa: string;
  tahunAJ: number;
  tahunSiklus: string;
  namaWindu: string;
  dino: string;
  pas: string;
  neptu: number;
  wukuName: string;
  wukuNo: number;
  fullStr: string;
  shortStr: string;
}

export interface DinoStatus {
  isGede: boolean;
  isIjo: boolean;
  status: 'ijo' | 'abang';
  bottomBg: string;
  bottomBgClass: string;
  bottomTextColor: string;
  label: string;
  cellBg: string;
  cellBorder: string;
  cellBorderStyle: string;
  cellText: string;
  badgeText: string;
  badgeHtml: string;
}

export interface DinoGedeCheckResult {
  isGede: boolean;
  label: string;
  isGridGede: boolean;
  isTandaO: boolean;
  isAnggaraKasih: boolean;
  isJumatKliwon: boolean;
  isSatuSura: boolean;
  isCsvGede: boolean;
}

export interface PranataMangsaInfo {
  nama: string;
  rentang: string;
  candrasangkala: string;
  watak: string;
}

export interface PranataMangsaDetail extends PranataMangsaInfo {
  id: number;
  durasiHari: number;
  musimTani: string;
  pratandhaAlam: string;
  pakaryanTani: string;
}

export interface BookmarkItem {
  id: string;
  dateStr: string; // 'YYYY-MM-DD'
  y: number;
  m: number;
  d: number;
  kategori: string;
  catatan: string;
  weton?: string;
  createdAt?: string;
  updatedAt?: string;
}
