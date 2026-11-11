$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$iconsSource = Join-Path $repoRoot "assets/media/cyberpunk2077/ui/source/icons-symbol-sheet.png"
$wideSource = Join-Path $repoRoot "assets/media/cyberpunk2077/ui/source/hud-wide-sheet.png"
$verticalSource = Join-Path $repoRoot "assets/media/cyberpunk2077/ui/source/hud-vertical-sheet.png"
$outputDir = Join-Path $repoRoot "assets/media/cyberpunk2077/ui/granular"
$preview = Join-Path $outputDir "granular-crops-preview.png"

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  throw "ffmpeg is required to generate the granular crop preview."
}
foreach ($source in @($iconsSource, $wideSource, $verticalSource)) {
  if (-not (Test-Path -LiteralPath $source)) {
    throw "Source atlas not found: $source"
  }
}

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

# Each crop is a single reusable control or a tightly bounded texture family.
$crops = @(
  @{ Name = "icon-arrow-forward-yellow"; Source = $iconsSource; Filter = "crop=170:170:55:205,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "icon-arrow-back-black"; Source = $iconsSource; Filter = "crop=170:170:225:205,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "icon-warning-triangle"; Source = $iconsSource; Filter = "crop=150:140:430:225,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "icon-danger-triangle"; Source = $iconsSource; Filter = "crop=150:140:650:225,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "icon-crosshair-grid"; Source = $iconsSource; Filter = "crop=330:280:1060:55,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "icon-chevron-stack"; Source = $iconsSource; Filter = "crop=430:190:1480:670,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "icon-expand-square"; Source = $iconsSource; Filter = "crop=180:170:1340:870,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "icon-direction-pad"; Source = $iconsSource; Filter = "crop=180:190:1510:860,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "signal-chevron-strip"; Source = $iconsSource; Filter = "crop=500:180:55:665,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "signal-loading-frame"; Source = $iconsSource; Filter = "crop=420:170:610:665,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "signal-forward-frame"; Source = $iconsSource; Filter = "crop=450:180:1470:665,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "icon-plus-control"; Source = $iconsSource; Filter = "crop=190:170:55:865,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "icon-target-diamond"; Source = $iconsSource; Filter = "crop=190:180:1450:430,colorkey=0xf4f5f0:0.08:0.02,format=rgba" },
  @{ Name = "rail-cyan-top"; Source = $verticalSource; Filter = "crop=340:72:20:640" },
  @{ Name = "ring-cyan-small"; Source = $verticalSource; Filter = "crop=150:150:320:640" },
  @{ Name = "ring-cyan-large"; Source = $verticalSource; Filter = "crop=170:170:320:805" },
  @{ Name = "nav-arrow-cyan"; Source = $verticalSource; Filter = "crop=65:70:550:640" },
  @{ Name = "status-badge-empty"; Source = $verticalSource; Filter = "crop=130:70:870:720,drawbox=x=10:y=14:w=112:h=39:color=0x080a0e:t=fill" },
  @{ Name = "button-frame-empty"; Source = $verticalSource; Filter = "crop=130:70:870:1000,drawbox=x=18:y=17:w=94:h=31:color=0x080a0e:t=fill" },
  @{ Name = "rail-cyan-lower"; Source = $verticalSource; Filter = "crop=340:72:20:900" },
  @{ Name = "warning-strip-red"; Source = $verticalSource; Filter = "crop=320:82:545:1070" },
  @{ Name = "loading-bar-cyan"; Source = $verticalSource; Filter = "crop=310:65:195:1150" },
  @{ Name = "hud-modal-corner"; Source = $wideSource; Filter = "crop=90:90:1370:65" },
  @{ Name = "hud-loading-bar-yellow"; Source = $wideSource; Filter = "crop=310:35:1990:670" },
  @{ Name = "hud-data-slot"; Source = $wideSource; Filter = "crop=330:120:1950:520" },
  @{ Name = "hud-chart-trace"; Source = $wideSource; Filter = "crop=570:220:2150:730" },
  @{ Name = "hud-circular-readout"; Source = $wideSource; Filter = "crop=410:280:2320:820" }
)

foreach ($crop in $crops) {
  $destination = Join-Path $outputDir ($crop.Name + ".png")
  & ffmpeg -y -loglevel error -i $crop.Source -vf $crop.Filter $destination
  if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed for $($crop.Name)"
  }
}

# Build a labelled contact sheet so each crop can be reviewed before runtime wiring.
$inputArgs = @()
$filterParts = @()
for ($index = 0; $index -lt $crops.Count; $index++) {
  $path = Join-Path $outputDir ($crops[$index].Name + ".png")
  $inputArgs += @("-i", $path)
  $label = $crops[$index].Name.Replace("-", "_")
  $filterParts += "[${index}:v]scale=260:150:force_original_aspect_ratio=decrease,pad=260:150:(ow-iw)/2:(oh-ih)/2:color=0b0d12,drawbox=x=0:y=0:w=259:h=149:color=0x343943:t=2,drawtext=text='$label':x=8:y=8:fontcolor=0xe6ff00:fontsize=12:box=1:boxcolor=0b0d12@0.78[out$index]"
}
$labels = (0..($crops.Count - 1) | ForEach-Object { "[out$_]" }) -join ""
$rows = [math]::Ceiling($crops.Count / 4)
$filterComplex = ($filterParts -join ";") + ";" + $labels + "concat=n=$($crops.Count):v=1:a=0[grid];[grid]tile=4x$rows"
& ffmpeg -y -loglevel error @inputArgs -filter_complex $filterComplex -frames:v 1 $preview
if ($LASTEXITCODE -ne 0) {
  throw "ffmpeg failed to build the granular crop preview."
}

Write-Host "Generated $($crops.Count) granular crops in $outputDir"
Write-Host "Preview: $preview"
