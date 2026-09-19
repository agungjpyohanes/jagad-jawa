import re
import pandas as pd

def clean_pawukon_data(file_path, output_path):
    print(f"Membaca file: {file_path}...")
    # Baca file CSV (sesuaikan pemisah jika menggunakan koma atau titik koma)
    df = pd.read_csv(file_path)
    
    # 1. Standarisasi & Normalisasi Nama Wuku
    # Daftar 30 Wuku Baku (Title Case)
    wuku_map = {
        "shinto": "Sinta", "sinto": "Sinta", "sinta": "Sinta",
        "landep": "Landep",
        "wukir": "Wukir",
        "kurantil": "Kurantil",
        "tolu": "Tolu",
        "gumbreg": "Gumbreg",
        "warigalit": "Warigalit",
        "wariagung": "Warigagung", "warigagung": "Warigagung",
        "julungwangi": "Julungwangi", "julung wangi": "Julungwangi",
        "sungsang": "Sungsang",
        "galungan": "Galungan",
        "kuningan": "Kuningan",
        "langkir": "Langkir",
        "mandasiya": "Mandasiya", "mandhalasia": "Mandasiya",
        "julungpujut": "Julungpujut", "julung pujut": "Julungpujut",
        "pahang": "Pahang",
        "kuruwelut": "Kuruwelut",
        "marakeh": "Marakeh",
        "tambir": "Tambir",
        "mendangkungan": "Medangkungan", "madangkungan": "Medangkungan", "medangkungan": "Medangkungan",
        "maktal": "Maktal",
        "wuye": "Wuye",
        "manahil": "Manahil", "menail": "Manahil",
        "prangbakat": "Prangbakat",
        "bala": "Bala",
        "wugu": "Wugu",
        "wayang": "Wayang",
        "kulawu": "Kulawu",
        "dukut": "Dukut",
        "watu gunung": "Watugunung", "watugunung": "Watugunung"
    }

    if 'wuku' in df.columns:
        df['wuku_clean'] = df['wuku'].astype(str).str.strip().str.lower()
        df['wuku'] = df['wuku_clean'].map(wuku_map).fillna(df['wuku'].str.title())
        df.drop(columns=['wuku_clean'], inplace=True)

    # 2. Pembersihan Kolom 'salawat' (Nominal & Pisah Barang Non-Uang)
    if 'salawat' in df.columns:
        def clean_salawat(val):
            if pd.isna(val):
                return "", ""
            val_str = str(val).strip()
            # Cek apakah mengandung angka/keteng atau murni barang fisik (Kucing, Pacul, dll)
            if any(char.isdigit() for char in val_str) or 'keteng' in val_str.lower():
                # Bersihkan spasi ganda dan jadikan huruf kecil untuk format angka + keteng
                cleaned_num = re.sub(r'\s+', ' ', val_str).lower()
                return cleaned_num, ""
            else:
                # Jika isinya barang non-uang, pindahkan ke kolom keterangan barang
                return "", val_str

        results = df['salawat'].apply(clean_salawat)
        df['salawat_clean'] = [r[0] for r in results]
        df['keterangan_barang'] = [r[1] for r in results]
        df['salawat'] = df['salawat_clean']
        df.drop(columns=['salawat_clean'], inplace=True)

    # 3. Pembersihan Kolom 'donga_slamet' (Trim spasi & standarisasi kapitalisasi)
    if 'donga_slamet' in df.columns:
        df['donga_slamet'] = df['donga_slamet'].astype(str).str.strip().str.title()
        # Perbaikan typo umum jika ada
        df['donga_slamet'] = df['donga_slamet'].str.replace('Pino', 'Pina', regex=False)
        df['donga_slamet'] = df['donga_slamet'].str.replace('Tulak', 'Tolak', regex=False)

    # Simpan hasil pembersihan ke file CSV baru
    df.to_csv(output_path, index=False, encoding='utf-8')
    print(f"Pembersihan selesai! File bersih disimpan di: {output_path}")

# Contoh cara penggunaan skrip:
# clean_pawukon_data('bincil.csv', 'bincil_bersih.csv')