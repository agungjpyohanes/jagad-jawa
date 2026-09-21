/**
 * Definisi Tipe Data Domain: Perjodohan (Pitung Jawa 7 Metode)
 */

export interface AksaraPerjodohanItem {
  kode: string;
  iv: number;
  vvi: number;
}

export interface PitungPersonInput {
  nama?: string;
  hari: string;
  pasaran: string;
  neptu?: number;
  aksaraDepan?: string;
  aksaraBelakang?: string;
}

export interface PitungOutcome {
  nama: string;
  arti: string;
  status: 'baik' | 'buruk' | 'campur';
}

export interface PitungRow {
  no: string;
  namaMetode: string;
  h: PitungOutcome;
  rumus: string;
}

export interface PitungSummary {
  baik: number;
  buruk: number;
  campur: number;
  total: number;
  skorKeselarasan: number;
}

export interface PitungResult {
  wanita: PitungPersonInput;
  pria: PitungPersonInput;
  totalNeptu: number;
  rows: PitungRow[];
  summary: PitungSummary;
}

export interface TanggalMantuRekomendasi {
  dateStr: string; // 'YYYY-MM-DD'
  formattedDate: string; // misal 'Sabtu, 24 Oktober 2026'
  dino: string;
  pas: string;
  weton: string;
  wukuName: string;
  neptuHari: number;
  totalNeptuMantu: number; // totalNeptuPasangan + neptuHari
  sisaPancaSudha: number; // (totalNeptuMantu % 5)
  predikat: 'Sri' | 'Lungguh' | 'Gedhong';
  kategoriLabel: string;
  makna: string;
  isDinoIjo: boolean;
  isDinoGede: boolean;
}

export interface TingkatKeharmonisanDetail {
  predikat: string;
  badgeClass: string;
  deskripsi: string;
  saranKultural: string;
}

export interface PitungHistoryItem {
  id: string;
  timestamp: number;
  tglHitungStr: string;
  wanita: {
    nama: string;
    tglLahir?: string;
    hari: string;
    pasaran: string;
    neptu: number;
  };
  pria: {
    nama: string;
    tglLahir?: string;
    hari: string;
    pasaran: string;
    neptu: number;
  };
  totalNeptu: number;
  skorKeselarasan: number;
  predikatKeharmonisan: string;
  summary: PitungSummary;
}
