/**
 * Definisi Tipe Data Domain: Selametan (Pengetan Tilar Donyo)
 * Sesuai konvensi pergantian hari Sultan Agungan (bakda Maghrib)
 */

export type WaktuWafat = 'siang' | 'malam_maghrib';

export interface GeblakInfo {
  tahun: number;
  bulan: number;
  tanggal: number;
  hari: string;
  pasaran: string;
  neptu: number;
  tanggalStr: string;
  waktuWafat?: WaktuWafat;
  namaAlmarhum?: string;
  tanggalMasehiAsli?: string;
}

export interface SelametanScheduleItem {
  id?: string;
  nama: string;
  approx: number;
  targetH: string;
  targetP: string;
  targetWeton: string;
  tahun: number;
  bulan: number;
  tanggal: number;
  dateStr: string;
  diffDays: number;
  maknaKultural: string;
  ubarampe: string;
  donga: string;
}

export interface SelametanResult {
  geblak: GeblakInfo;
  items: SelametanScheduleItem[];
  waktuWafat: WaktuWafat;
  namaAlmarhum: string;
}

export interface SelametanWizardInput {
  tanggalWafat: string; // YYYY-MM-DD
  waktuWafat: WaktuWafat;
  namaAlmarhum?: string;
}
