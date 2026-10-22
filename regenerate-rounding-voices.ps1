# Run with Windows PowerShell 5.1 (WinRT speech is not exposed by PowerShell 7).
param([string]$RawDirectory = (Join-Path $env:TEMP ('planet-ten-voice-' + [guid]::NewGuid())))
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer,Windows.Media.SpeechSynthesis,ContentType=WindowsRuntime]
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesisStream,Windows.Media.SpeechSynthesis,ContentType=WindowsRuntime]
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$voices = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices
New-Item -ItemType Directory -Force -Path $RawDirectory | Out-Null
$clips = Get-Content (Join-Path $PSScriptRoot 'assets/rounding-voice/transcripts.json') -Raw -Encoding UTF8 | ConvertFrom-Json
try {
 foreach ($clip in $clips) {
  $martian = $clip.id.StartsWith('comic-')
  $name = if ($martian) { 'Microsoft David' } else { 'Microsoft Zira' }
  $selected = $voices | Where-Object DisplayName -eq $name | Select-Object -First 1
  if (!$selected) { throw "Required installed voice missing: $name" }
  $synth.Voice = $selected
  $escaped = [Security.SecurityElement]::Escape($clip.text)
  $escaped = $escaped -replace '([.!?])\s+', '$1<break time="210ms"/>'
  $escaped = $escaped -replace 'Behold\.', 'Behold.<break time="450ms"/>'
  $rate = if ($martian) { '-5%' } else { '-18%' }
  $ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><prosody rate="' + $rate + '">' + $escaped + '</prosody></speak>'
  $operation = $synth.SynthesizeSsmlToStreamAsync($ssml)
  $task = $asTask.MakeGenericMethod([Windows.Media.SpeechSynthesis.SpeechSynthesisStream]).Invoke($null,@($operation))
  $stream = $task.GetAwaiter().GetResult()
  $reader = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
  $file = [IO.File]::Create((Join-Path $RawDirectory ($clip.id + '.wav')))
  try { $reader.CopyTo($file) } finally { $file.Dispose(); $reader.Dispose(); $stream.Dispose() }
 }
} finally { $synth.Dispose() }
Push-Location $PSScriptRoot
try { & node render-rounding-voice.js $RawDirectory; if ($LASTEXITCODE -ne 0) { throw 'Voice rendering failed' } } finally { Pop-Location }
Write-Output "Fresh source recordings: $RawDirectory"
