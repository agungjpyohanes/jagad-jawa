// Data Selametan Wong Mulih (Mati)

export const TARGET_HARI_SELAMETAN = [
  ['Selasa', 'Sabtu', 'Kamis', 'Senin', 'Rabu', 'Selasa', "Jumat"],
  ['Rabu', 'Minggu', "Jumat", 'Selasa', 'Kamis', 'Rabu', 'Sabtu'],
  ['Kamis', 'Senin', 'Sabtu', 'Rabu', "Jumat", 'Kamis', 'Minggu'],
  ["Jumat", 'Selasa', 'Minggu', 'Kamis', 'Sabtu', "Jumat", 'Senin'],
  ['Sabtu', 'Rabu', 'Senin', "Jumat", 'Minggu', 'Sabtu', 'Selasa'],
  ['Minggu', 'Kamis', 'Selasa', 'Sabtu', 'Senin', 'Minggu', 'Rabu'],
  ['Senin', "Jumat", 'Rabu', 'Minggu', 'Selasa', 'Senin', 'Kamis']
];

export const TARGET_PASARAN_SELAMETAN = {
  'Pahing': ['Wage', 'Pon', 'Legi', 'Legi', 'Kliwon', 'Legi', 'Legi'],
  'Pon':    ['Kliwon', 'Wage', 'Pahing', 'Pahing', 'Legi', 'Pahing', 'Pahing'],
  'Wage':   ['Legi', 'Kliwon', 'Pon', 'Pon', 'Pahing', 'Pon', 'Pon'],
  'Kliwon': ['Pahing', 'Legi', 'Wage', 'Wage', 'Pon', 'Wage', 'Wage'],
  'Legi':   ['Pon', 'Pahing', 'Kliwon', 'Kliwon', 'Wage', 'Kliwon', 'Kliwon']
};

export const JENIS_SELAMETAN = [
  { nama: '3 Harian', approx: 3, idx: 0 },
  { nama: '7 Harian', approx: 7, idx: 1 },
  { nama: '40 Harian', approx: 40, idx: 2 },
  { nama: '100 Harian', approx: 100, idx: 3 },
  { nama: 'Pendak Pisan (1 Tahun)', approx: 354, idx: 4 },
  { nama: 'Pendak Pindho (2 Tahun)', approx: 710, idx: 5 },
  { nama: 'Nyewu (1000 Hari)', approx: 1000, idx: 6 }
];
