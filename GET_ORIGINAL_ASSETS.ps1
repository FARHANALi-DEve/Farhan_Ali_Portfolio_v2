$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$base = 'https://raw.githubusercontent.com/henryjeff/portfolio-website/master/static/models/'
$files = @(
    @{Path='Computer/computer_setup.glb'; Min=50000},
    @{Path='Computer/baked_computer.jpg'; Min=200000},
    @{Path='Decor/decor.glb'; Min=30000},
    @{Path='Decor/baked_decor.jpg'; Min=200000},
    @{Path='World/environment.glb'; Min=30000},
    @{Path='World/baked_environment.jpg'; Min=200000}
)
foreach ($item in $files) {
    $relative = $item.Path
    $target = Join-Path $PSScriptRoot ('reference-assets/' + $relative)
    $folder = Split-Path -Parent $target
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    if ((Test-Path $target) -and ((Get-Item $target).Length -gt $item.Min)) {
        Write-Host "Already present: $relative"
        continue
    }
    $url = $base + $relative
    $ok = $false
    foreach ($attempt in 1..3) {
        try {
            Write-Host "Downloading original MIT-licensed model: $relative (attempt $attempt)"
            Invoke-WebRequest -Uri $url -OutFile $target -TimeoutSec 60 -UseBasicParsing
            if ((Get-Item $target).Length -lt $item.Min) { throw "Incomplete download" }
            $ok = $true
            break
        } catch {
            Write-Host "Attempt $attempt failed: $($_.Exception.Message)"
            Start-Sleep -Seconds 2
        }
    }
    if (-not $ok) { Write-Host "Unable to download $relative. Check GitHub connectivity."; exit 1 }
}
Write-Host "Original 3D assets ready."
