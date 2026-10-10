#Requires -Version 5.1
<#
.SYNOPSIS
    Jagad Jawa — Remote Read-Only Cloudflare KV Auditor & Comparison Tool.

.DESCRIPTION
    Skrip audit read-only untuk memverifikasi daftar key remote pada namespace Cloudflare KV
    terhadap dataset lokal Jagad Jawa (42 total canonical key: 37 key lama + 5 key supplemental).

    BATASAN KETAT:
    - Hanya operasi READ-ONLY (npx wrangler kv key list).
    - TIDAK ADA perintah tulis: TIDAK ADA 'bulk put', TIDAK ADA 'delete', TIDAK ADA mutasi data.
    - Parameter -NamespaceId wajib diberikan secara eksplisit; tidak ada auto-pilih atau tebak judul.
    - Memeriksa exit code Wrangler secara ketat; jika gagal atau error autentikasi, langsung berhenti
      dengan peringatan "hasil tidak valid - jangan simpulkan key hilang".
    - Menormalisasi root array JSON secara aman pada Windows PowerShell 5.1 dan PowerShell 7+.
    - Mendukung mode pengujian lokal (-MockJsonPath / -MockExitCode) tanpa perlu kredensial atau jaringan.

.PARAMETER NamespaceId
    ID namespace Cloudflare KV remote yang dituju (wajib jika tidak menggunakan -MockJsonPath).

.PARAMETER MockJsonPath
    Path ke file JSON mock lokal untuk pengujian logika perbandingan tanpa koneksi jaringan/Wrangler.

.PARAMETER MockExitCode
    Simulasi exit code Wrangler untuk pengujian penanganan error tanpa Wrangler asli.

.PARAMETER ManifestPath
    Path alternatif ke datasetManifest.js (default: js/services/datasetManifest.js).

.EXAMPLE
    .\scripts\verify-kv-remote.ps1 -NamespaceId "a1b2c3d4e5f60718293a4b5c6d7e8f90"

.EXAMPLE
    .\scripts\verify-kv-remote.ps1 -MockJsonPath "tests\fixtures\mock-kv-37-keys.json"
#>

[CmdletBinding(DefaultParameterSetName = 'Remote')]
param(
    [Parameter(Mandatory = $true, ParameterSetName = 'Remote', Position = 0)]
    [ValidateNotNullOrEmpty()]
    [string]$NamespaceId,

    [Parameter(Mandatory = $true, ParameterSetName = 'Mock')]
    [ValidateNotNullOrEmpty()]
    [string]$MockJsonPath,

    [Parameter(ParameterSetName = 'Mock')]
    [int]$MockExitCode = 0,

    [Parameter()]
    [string]$ManifestPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-SectionHeader {
    param([string]$Title)
    Write-Host ""
    Write-Host ("=" * 73) -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host ("=" * 73) -ForegroundColor Cyan
}

# 1. Definisikan Himpunan Kunci Lokal Dinamis dari Manifest
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

if (-not $ManifestPath) {
    $ManifestPath = Join-Path $ProjectRoot "js\services\datasetManifest.js"
}

if (-not (Test-Path -LiteralPath $ManifestPath)) {
    Write-Error "CRITICAL: Berkas manifest tidak ditemukan di '$ManifestPath'."
    exit 2
}

# 5 Key Supplemental Resmi
$SupplementalKeysList = @(
    'wayang:all',
    'pitutur:all',
    'mitologi:all',
    'pustaka:digital',
    'tumpeng:all'
)

# Ekstrak semua canonical keys dari datasetManifest.js
$ManifestContent = Get-Content -LiteralPath $ManifestPath -Raw -Encoding UTF8
$MatchesAll = [regex]::Matches($ManifestContent, "'([a-z0-9_\-]+:[a-z0-9_\-]+)':\s*\{")
$LocalCanonicalKeys = [System.Collections.Generic.List[string]]::new()
foreach ($m in $MatchesAll) {
    $k = $m.Groups[1].Value
    if (-not $LocalCanonicalKeys.Contains($k)) {
        $LocalCanonicalKeys.Add($k)
    }
}

if ($LocalCanonicalKeys.Count -eq 0) {
    Write-Error "CRITICAL: Gagal mem-parse canonical keys dari '$ManifestPath'."
    exit 2
}

$ExpectedTotalCount = $LocalCanonicalKeys.Count
$ExpectedSupplementalCount = $SupplementalKeysList.Count
$Old37KeysList = [System.Collections.Generic.List[string]]::new()
foreach ($k in $LocalCanonicalKeys) {
    if ($SupplementalKeysList -notcontains $k) {
        $Old37KeysList.Add($k)
    }
}
$ExpectedOldCount = $Old37KeysList.Count

Write-SectionHeader "JAGAD JAWA — AUDIT READ-ONLY CLOUDFLARE KV NAMESPACE"
Write-Host "Lokasi Repositori  : $ProjectRoot"
Write-Host "Manifest Digunakan : $ManifestPath"
Write-Host "Ekspektasi Lokal   : $ExpectedTotalCount total keys ($ExpectedOldCount key lama + $ExpectedSupplementalCount supplemental)"

# 2. Fungsi Normalisasi Array JSON Aman Lintas PowerShell 5.1 & 7+
function ConvertFrom-SafeJsonArray {
    param([string]$RawJson)

    if ([string]::IsNullOrWhiteSpace($RawJson)) {
        throw "Raw output JSON kosong atau whitespace."
    }

    $Trimmed = $RawJson.Trim()
    if (-not ($Trimmed.StartsWith("[") -and $Trimmed.EndsWith("]"))) {
        throw "Output bukan JSON array root (tidak diawali '[' dan diakhiri ']'). Kemungkinan error output CLI."
    }

    # Gunakan JavaScriptSerializer jika di PS 5.1 untuk konsistensi atau ConvertFrom-Json
    $Parsed = $null
    try {
        $Parsed = ConvertFrom-Json -InputObject $Trimmed -ErrorAction Stop
    } catch {
        throw "Gagal mem-parse JSON: $($_.Exception.Message)"
    }

    $List = [System.Collections.Generic.List[string]]::new()

    if ($null -eq $Parsed) {
        return ,$List.ToArray()
    }

    if ($Parsed -is [System.Array]) {
        foreach ($item in $Parsed) {
            if ($null -ne $item) {
                if ($item -is [string]) {
                    $List.Add($item)
                } elseif ($item.PSObject -and $item.PSObject.Properties['name']) {
                    $List.Add([string]$item.name)
                } elseif ($item.PSObject -and $item.PSObject.Properties['key']) {
                    $List.Add([string]$item.key)
                } else {
                    $List.Add([string]$item)
                }
            }
        }
    } else {
        # Singleton object (array beranggotakan tepat 1 elemen pada PS 5.1)
        if ($Parsed.PSObject -and $Parsed.PSObject.Properties['name']) {
            $List.Add([string]$Parsed.name)
        } elseif ($Parsed.PSObject -and $Parsed.PSObject.Properties['key']) {
            $List.Add([string]$Parsed.key)
        } else {
            $List.Add([string]$Parsed)
        }
    }

    return ,$List.ToArray()
}

# 3. Pengambilan Data Remote atau Mock
$RemoteKeysRaw = ""
$ExitCode = 0

if ($PSCmdlet.ParameterSetName -eq 'Mock') {
    Write-Host "`n[MODE UJI / MOCK] Menggunakan berkas fixture: $MockJsonPath" -ForegroundColor Yellow
    if (-not (Test-Path -LiteralPath $MockJsonPath)) {
        Write-Error "CRITICAL: Berkas mock '$MockJsonPath' tidak ditemukan."
        exit 2
    }
    $RemoteKeysRaw = Get-Content -LiteralPath $MockJsonPath -Raw -Encoding UTF8
    $ExitCode = $MockExitCode

    if ($ExitCode -ne 0) {
        Write-Host ""
        Write-Host "=========================================================================" -ForegroundColor Red
        Write-Host "❌ WRANGLER EXIT CODE: $ExitCode" -ForegroundColor Red
        Write-Host "HASIL TIDAK VALID — JANGAN SIMPULKAN KEY HILANG." -ForegroundColor Red
        Write-Host "=========================================================================" -ForegroundColor Red
        Write-Host "Pemeriksaan dihentikan karena Wrangler mengembalikan status gagal." -ForegroundColor Red
        Write-Host "Jangan simpulkan dataset kosong atau key hilang jika perintah gagal." -ForegroundColor Red
        exit $ExitCode
    }
} else {
    Write-Host "`n[MODE REMOTE READ-ONLY]" -ForegroundColor Green
    Write-Host "Namespace Target ID: $NamespaceId" -ForegroundColor Cyan
    Write-Host "Menjalankan perintah: npx --yes wrangler@4.147.0 kv key list --namespace-id <ID> --remote" -ForegroundColor Gray

    # Siapkan penangkapan stdout dan stderr terpisah
    $StdOutFile = [System.IO.Path]::GetTempFileName()
    $StdErrFile = [System.IO.Path]::GetTempFileName()

    try {
        $Pinfo = New-Object System.Diagnostics.ProcessStartInfo
        $Pinfo.FileName = "cmd.exe"
        $Pinfo.Arguments = "/c npx --yes wrangler@4.147.0 kv key list --namespace-id `"$NamespaceId`" --remote"
        $Pinfo.UseShellExecute = $false
        $Pinfo.RedirectStandardOutput = $true
        $Pinfo.RedirectStandardError = $true
        $Pinfo.CreateNoWindow = $true

        $Process = New-Object System.Diagnostics.Process
        $Process.StartInfo = $Pinfo
        [void]$Process.Start()

        $StdoutTask = $Process.StandardOutput.ReadToEndAsync()
        $StderrTask = $Process.StandardError.ReadToEndAsync()

        $Process.WaitForExit()

        $StdoutContent = $StdoutTask.Result
        $StderrContent = $StderrTask.Result
        $ExitCode = $Process.ExitCode

        if ($ExitCode -ne 0) {
            Write-Host ""
            Write-Host "=========================================================================" -ForegroundColor Red
            Write-Host "❌ WRANGLER EXIT CODE: $ExitCode" -ForegroundColor Red
            Write-Host "HASIL TIDAK VALID — JANGAN SIMPULKAN KEY HILANG." -ForegroundColor Red
            Write-Host "=========================================================================" -ForegroundColor Red
            if (-not [string]::IsNullOrWhiteSpace($StderrContent)) {
                Write-Host "Detail STDERR dari Wrangler:" -ForegroundColor DarkYellow
                Write-Host $StderrContent.Trim() -ForegroundColor DarkYellow
            }
            if (-not [string]::IsNullOrWhiteSpace($StdoutContent)) {
                Write-Host "Detail STDOUT dari Wrangler:" -ForegroundColor Gray
                Write-Host $StdoutContent.Trim() -ForegroundColor Gray
            }
            Write-Host "`nPemeriksaan remote dihentikan demi menjaga kesahihan audit." -ForegroundColor Red
            Write-Host "Pastikan autentikasi Cloudflare aktif ('npx wrangler login') dan ID namespace tepat." -ForegroundColor Red
            exit $ExitCode
        }

        $RemoteKeysRaw = $StdoutContent
    } finally {
        if (Test-Path $StdOutFile) { Remove-Item $StdOutFile -Force -ErrorAction SilentlyContinue }
        if (Test-Path $StdErrFile) { Remove-Item $StdErrFile -Force -ErrorAction SilentlyContinue }
    }
}

# 4. Parsing dan Normalisasi Hasil Array Remote
$RemoteKeys = @()
try {
    $RemoteKeys = ConvertFrom-SafeJsonArray -RawJson $RemoteKeysRaw
} catch {
    Write-Host ""
    Write-Host "=========================================================================" -ForegroundColor Red
    Write-Host "❌ ERROR PARSING DAFTAR KEY REMOTE" -ForegroundColor Red
    Write-Host "HASIL TIDAK VALID — JANGAN SIMPULKAN KEY HILANG." -ForegroundColor Red
    Write-Host "=========================================================================" -ForegroundColor Red
    Write-Host "Detail kesalahan: $($_.Exception.Message)" -ForegroundColor DarkYellow
    exit 3
}

$RemoteCount = $RemoteKeys.Count
Write-Host "`n📊 Jumlah Key Ditemukan di Remote KV : $RemoteCount" -ForegroundColor Green

# 5. Komparasi Terstruktur Terhadap Himpunan Lokal
$RemoteSet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($rk in $RemoteKeys) {
    if (-not [string]::IsNullOrWhiteSpace($rk)) {
        [void]$RemoteSet.Add($rk.Trim())
    }
}

# Analisis 37 Key Lama
$MissingOldKeys = [System.Collections.Generic.List[string]]::new()
$FoundOldKeys = [System.Collections.Generic.List[string]]::new()
foreach ($k in $Old37KeysList) {
    if ($RemoteSet.Contains($k)) {
        $FoundOldKeys.Add($k)
    } else {
        $MissingOldKeys.Add($k)
    }
}

# Analisis 5 Key Supplemental
$FoundSupplementalKeys = [System.Collections.Generic.List[string]]::new()
$PendingSupplementalKeys = [System.Collections.Generic.List[string]]::new()
foreach ($k in $SupplementalKeysList) {
    if ($RemoteSet.Contains($k)) {
        $FoundSupplementalKeys.Add($k)
    } else {
        $PendingSupplementalKeys.Add($k)
    }
}

# Analisis Key Remote-Only (yang tidak ada di manifest 42 lokal)
$RemoteOnlyKeys = [System.Collections.Generic.List[string]]::new()
foreach ($rk in $RemoteKeys) {
    if (-not $LocalCanonicalKeys.Contains($rk)) {
        $RemoteOnlyKeys.Add($rk)
    }
}

$MissingOldKeys.Sort()
$FoundOldKeys.Sort()
$FoundSupplementalKeys.Sort()
$PendingSupplementalKeys.Sort()
$RemoteOnlyKeys.Sort()

# 6. Tampilkan Laporan Hasil Audit
Write-SectionHeader "RINGKASAN AUDIT KOMPARASI LOKAL VS REMOTE"

Write-Host "1. Key Lama Terdaftar ($ExpectedOldCount target):" -ForegroundColor White
Write-Host "   • Ada di Remote : $($FoundOldKeys.Count) / $ExpectedOldCount" -ForegroundColor $(if ($FoundOldKeys.Count -eq $ExpectedOldCount) { "Green" } else { "Yellow" })
Write-Host "   • Hilang        : $($MissingOldKeys.Count)" -ForegroundColor $(if ($MissingOldKeys.Count -eq 0) { "Green" } else { "Red" })

if ($MissingOldKeys.Count -gt 0) {
    Write-Host "`n   [!] DAFTAR KEY LAMA YANG HILANG DARI REMOTE:" -ForegroundColor Red
    foreach ($k in $MissingOldKeys) {
        Write-Host "       - $k" -ForegroundColor Red
    }
}

Write-Host "`n2. Key Supplemental Baru ($ExpectedSupplementalCount target):" -ForegroundColor White
Write-Host "   • Sudah Terunggah : $($FoundSupplementalKeys.Count) / $ExpectedSupplementalCount" -ForegroundColor $(if ($FoundSupplementalKeys.Count -eq $ExpectedSupplementalCount) { "Green" } else { "Yellow" })
Write-Host "   • Belum Diunggah  : $($PendingSupplementalKeys.Count) / $ExpectedSupplementalCount" -ForegroundColor $(if ($PendingSupplementalKeys.Count -eq 0) { "Green" } else { "DarkYellow" })

if ($FoundSupplementalKeys.Count -gt 0) {
    Write-Host "`n   [+] KEY SUPPLEMENTAL YANG SUDAH TERVERIFIKASI ADA:" -ForegroundColor Green
    foreach ($k in $FoundSupplementalKeys) {
        Write-Host "       + $k" -ForegroundColor Green
    }
}

if ($PendingSupplementalKeys.Count -gt 0) {
    Write-Host "`n   [*] KEY SUPPLEMENTAL YANG MASIH MENUNGGU UPLOAD PEMILIK:" -ForegroundColor DarkYellow
    foreach ($k in $PendingSupplementalKeys) {
        Write-Host "       * $k" -ForegroundColor DarkYellow
    }
}

Write-Host "`n3. Key Remote-Only (Tidak ada di Manifest 42 Lokal):" -ForegroundColor White
Write-Host "   • Jumlah : $($RemoteOnlyKeys.Count)" -ForegroundColor $(if ($RemoteOnlyKeys.Count -eq 0) { "Green" } else { "Yellow" })
if ($RemoteOnlyKeys.Count -gt 0) {
    Write-Host "   [?] DAFTAR KEY TIDAK DIKENAL DI MANIFEST:" -ForegroundColor Yellow
    foreach ($k in $RemoteOnlyKeys) {
        Write-Host "       ? $k" -ForegroundColor Yellow
    }
}

Write-SectionHeader "KESIMPULAN AUDIT & STATUS KESIAPAN"

if ($MissingOldKeys.Count -eq 0 -and $PendingSupplementalKeys.Count -eq 0 -and $RemoteCount -eq $ExpectedTotalCount) {
    Write-Host "🟢 STATUS: PARITAS PENUH 42/42 TERCAPAI DI REMOTE." -ForegroundColor Green
    Write-Host "Seluruh 37 key lama dan 5 key supplemental telah aktif di namespace Cloudflare KV." -ForegroundColor Green
} elseif ($MissingOldKeys.Count -eq 0 -and $FoundSupplementalKeys.Count -eq 0 -and $RemoteCount -eq $ExpectedOldCount) {
    Write-Host "🟡 STATUS: KEADAAN 37 KEY LAMA STABIL (SEBELUM MIGRASI SUPPLEMENTAL)." -ForegroundColor Yellow
    Write-Host "37 key lama utuh di remote. 5 key supplemental belum diunggah." -ForegroundColor Yellow
    Write-Host "👉 Unggah payload supplemental jika ingin mengaktifkan 5 fitur baru secara bertahap." -ForegroundColor Cyan
} else {
    Write-Host "⚠️ STATUS: KONDISI PARSIAL / MEMERLUKAN TINJAUAN." -ForegroundColor Yellow
    Write-Host "Periksa daftar selisih di atas sebelum melakukan deploy Cloudflare Pages Function." -ForegroundColor Yellow
}

Write-Host ""
