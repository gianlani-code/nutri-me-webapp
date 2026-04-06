param(
    [string]$DestinationDir = "../../APP+-github-upload"
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $scriptRoot ".."))
$destinationPath = [System.IO.Path]::GetFullPath((Join-Path $scriptRoot $DestinationDir))

function Copy-RequiredFile {
    param(
        [string]$RelativeSourcePath,
        [string]$RelativeDestinationPath = $RelativeSourcePath,
        [switch]$Optional
    )

    $sourcePath = Join-Path $projectRoot $RelativeSourcePath
    $targetPath = Join-Path $destinationPath $RelativeDestinationPath

    if (-not (Test-Path $sourcePath)) {
        if ($Optional) {
            return
        }

        throw "File richiesto non trovato: $sourcePath"
    }

    $targetDir = Split-Path -Parent $targetPath
    if ($targetDir -and -not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    Copy-Item -Path $sourcePath -Destination $targetPath -Force
}

if (-not (Test-Path $destinationPath)) {
    New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
}

Get-ChildItem -Path $destinationPath -Force | Remove-Item -Recurse -Force

& (Join-Path $scriptRoot 'generate-avatar-assets.ps1') | Out-Null

Copy-RequiredFile -RelativeSourcePath '.nojekyll'
Copy-RequiredFile -RelativeSourcePath 'index.html'
Copy-RequiredFile -RelativeSourcePath 'style.css'
Copy-RequiredFile -RelativeSourcePath 'script.js'
Copy-RequiredFile -RelativeSourcePath 'avatar-assets.js'
Copy-RequiredFile -RelativeSourcePath 'app-config.js' -Optional
Copy-RequiredFile -RelativeSourcePath 'data/clinical-nutrition-overweight-50plus.js'
Copy-RequiredFile -RelativeSourcePath 'data/kaggle-products.json'

$avatarSourceDir = Join-Path $projectRoot 'avatars'
$avatarDestinationDir = Join-Path $destinationPath 'avatars'
if (Test-Path $avatarSourceDir) {
    New-Item -ItemType Directory -Path $avatarDestinationDir -Force | Out-Null
    Get-ChildItem -Path $avatarSourceDir -File | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination (Join-Path $avatarDestinationDir $_.Name) -Force
    }
}

$readmePath = Join-Path $destinationPath 'README-DEPLOY.txt'
$readmeLines = @(
    'Cartella pronta per GitHub Pages.',
    '',
    'Carica il contenuto di questa cartella nel repository invece dell''intero progetto APP+.',
    'Sono inclusi solo i file necessari al funzionamento del frontend.',
    '',
    'File esclusi di proposito:',
    '- node_modules',
    '- api',
    '- server',
    '- scripts',
    '- netlify',
    '- file locali .env e cartelle di tooling'
)
[System.IO.File]::WriteAllLines($readmePath, $readmeLines, [System.Text.Encoding]::UTF8)

$fileCount = (Get-ChildItem -Path $destinationPath -Recurse -File).Count
Write-Host "Cartella GitHub pronta: $destinationPath"
Write-Host "File esportati: $fileCount"