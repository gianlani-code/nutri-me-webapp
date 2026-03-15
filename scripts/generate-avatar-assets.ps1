param(
    [string]$AvatarDir = "../avatars",
    [string]$OutputFile = "../avatar-assets.js"
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$avatarPath = [System.IO.Path]::GetFullPath((Join-Path $scriptRoot $AvatarDir))
$outputPath = [System.IO.Path]::GetFullPath((Join-Path $scriptRoot $OutputFile))

if (-not (Test-Path $avatarPath)) {
    throw "Cartella avatar non trovata: $avatarPath"
}

$lines = @(
    "window.AVATAR_DATA_URIS = {"
)

Get-ChildItem -Path $avatarPath -File | Sort-Object Name | ForEach-Object {
    $extension = $_.Extension.TrimStart('.').ToLower()
    if ($extension -eq 'jpg') {
        $extension = 'jpeg'
    }

    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $base64 = [System.Convert]::ToBase64String($bytes)
    $relativePath = "avatars/$($_.Name)"
    $lines += "  '$relativePath': 'data:image/$extension;base64,$base64',"
}

$lines += "};"
[System.IO.File]::WriteAllLines($outputPath, $lines, [System.Text.Encoding]::UTF8)
Write-Host "Creato $outputPath"
