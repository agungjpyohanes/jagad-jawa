/**
 * Definisi Tipe Data Domain: Nujum Kepribadian & 6 Dimensi Bincil
 */

export interface BincilDimension {
  nama: string;
  arti: string;
}

export interface PawukonDetail {
  dewa?: string;
  dewanama?: string;
  kayu?: string;
  burung?: string;
  gedhong?: string;
  candra?: string;
  sambekala?: string;
  sesaji?: string;
  keterangan?: string;
}

export interface NujumDataResult {
  found: boolean;
  wuku: string;
  dino: string;
  pasaran: string;
  no_wuku: number;
  padewan: BincilDimension;
  paringkelan: BincilDimension;
  pandangon: BincilDimension;
  paarasan: BincilDimension;
  pancasuda: BincilDimension;
  kamarokan: BincilDimension;
  pawukon: PawukonDetail | null;
}

export interface FaalakiahResult {
  kode: number;
  nabi: string;
  desc: string;
  aksaraStr: string;
  sum: number;
}

export type NujumViewMode = 'ringkas' | 'mendalam';

export interface NujumGlossaryItem {
  id: string;
  istilah: string;
  namaJawa: string;
  kategori: string;
  siklus: string;
  deskripsi: string;
  filosofi: string;
  contoh: string;
}

export interface NujumSummaryRingkas {
  nama: string;
  tglMasehiStr: string;
  dino: string;
  pas: string;
  neptu: number;
  wukuName: string;
  tipeKarakter: string;
  deskripsiKarakter: string;
  kekuatanUtama: string[];
  areaWaspada: string;
  arahHoki: string;
  sirikanRumah: string;
  faalRingkas: string;
}

export interface NonJodohPersonInput {
  nama: string;
  tglLahir: string; // 'YYYY-MM-DD'
}

export interface NonJodohPersonProfile {
  nama: string;
  d: number;
  m: number;
  y: number;
  tglStr: string;
  dino: string;
  pas: string;
  neptu: number;
  wukuName: string;
  wukuNo: number;
  tipeKarakter: string;
  bincil: {
    padewan: BincilDimension;
    paringkelan: BincilDimension;
    pandangon: BincilDimension;
    paarasan: BincilDimension;
    pancasuda: BincilDimension;
    kamarokan: BincilDimension;
  };
}

export interface NonJodohSinergiAnalysis {
  relasiType: 'rekan_kerja' | 'mitra_bisnis' | 'sahabat' | 'keluarga';
  relasiLabel: string;
  kombinasiKarakter: string;
  skorKeselarasanRelasi: number; // 0 - 100
  titikTemu: string[];
  potensiFriksi: string[];
  saranTepaSlira: string[];
}

export interface NonJodohComparisonResult {
  person1: NonJodohPersonProfile;
  person2: NonJodohPersonProfile;
  sinergi: NonJodohSinergiAnalysis;
  disclaimer: string;
}

