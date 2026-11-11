$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$verticalSource = Join-Path $repoRoot "assets/media/cyberpunk2077/ui/source/hud-vertical-sheet.png"
$wideSource = Join-Path $repoRoot "assets/media/cyberpunk2077/ui/source/hud-wide-sheet.png"
$logoSource = Join-Path $repoRoot "assets/media/cyberpunk2077/official/logo-cyberpunk-2077-user.png"
$outputDir = Join-Path $repoRoot "assets/media/cyberpunk2077/ui/derived"

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  throw "ffmpeg is required to regenerate the deterministic UI crops."
}
if (-not (Test-Path -LiteralPath $verticalSource)) {
  throw "Source atlas not found: $verticalSource"
}
if (-not (Test-Path -LiteralPath $wideSource)) {
  throw "Source atlas not found: $wideSource"
}
if (-not (Test-Path -LiteralPath $logoSource)) {
  throw "Source logo not found: $logoSource"
}

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$crops = @(
  @{ Name = "ui-button-frame-clean.png"; Source = $verticalSource; Filter = "crop=130:70:870:1000,drawbox=x=18:y=17:w=94:h=31:color=0x080a0e:t=fill"; Size = "130x70" },
  @{ Name = "ui-nav-arrow-clean.png"; Source = $verticalSource; Filter = "crop=65:70:550:640"; Size = "65x70" },
  @{ Name = "ui-status-badge-clean.png"; Source = $verticalSource; Filter = "crop=130:70:870:720,drawbox=x=10:y=14:w=112:h=39:color=0x080a0e:t=fill"; Size = "130x70" },
  @{ Name = "ui-modal-corner-clean.png"; Source = $wideSource; Filter = "crop=90:90:1370:65"; Size = "90x90" },
  @{ Name = "hud-loading-bar-clean.png"; Source = $wideSource; Filter = "crop=310:35:1990:670"; Size = "310x35" },
  @{ Name = "ui-meta-signal.png"; Source = $verticalSource; Filter = "crop=170:48:34:1065"; Size = "170x48" },
  @{ Name = "logo-tight-transparent.png"; Source = $logoSource; Filter = "crop=2048:560:0:365,scale=1320:360,colorkey=0x272322:0.08:0.02,format=rgba"; Size = "1320x360 RGBA" }
)

foreach ($crop in $crops) {
  $destination = Join-Path $outputDir $crop.Name
  & ffmpeg -y -loglevel error -i $crop.Source -vf $crop.Filter $destination
  if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed for $($crop.Name)"
  }
  Write-Host "$($crop.Name) <- $($crop.Filter) [$($crop.Size)]"
}
