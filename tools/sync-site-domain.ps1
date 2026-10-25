# Keep static metadata available to crawlers without requiring JavaScript.
# Run from any directory: powershell -File tools/sync-site-domain.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$config = Get-Content (Join-Path $root 'site.config.json') -Raw | ConvertFrom-Json
$domain = $config.domain.TrimEnd('/')
$uri = [Uri]$domain
if ($uri.Scheme -ne 'https' -or $uri.AbsolutePath -ne '/' -or $uri.Query -or $uri.Fragment) {
    throw 'site.config.json domain must be an HTTPS origin with no path, query or fragment.'
}
$utf8 = New-Object System.Text.UTF8Encoding($false)
$pages = [ordered]@{
    'index.html' = '/'
    'services/index.html' = '/services/'
    'booking/index.html' = '/booking/'
    'gallery/index.html' = '/gallery/'
    'services.html' = '/services/'
    'booking.html' = '/booking/'
    'portfolio.html' = '/gallery/'
}
foreach ($entry in $pages.GetEnumerator()) {
    $path = Join-Path $root $entry.Key
    $original = [IO.File]::ReadAllText($path)
    $content = [regex]::Replace($original, '(<link rel="canonical" href=")[^"]+(">)', ('${1}' + $domain + $entry.Value + '${2}'))
    $content = [regex]::Replace($content, '(<meta property="og:url" content=")[^"]+(">)', ('${1}' + $domain + $entry.Value + '${2}'))
    $content = [regex]::Replace($content, '(<meta property="og:image" content=")https://[^/]+', ('${1}' + $domain))
    $content = [regex]::Replace($content, '("url":\s*")https://[^"]+("\s*,)', ('${1}' + $domain + $entry.Value + '${2}'))
    if ($content -cne $original) { [IO.File]::WriteAllText($path, $content, $utf8) }
}
foreach ($file in @('robots.txt', 'sitemap.xml')) {
    $path = Join-Path $root $file
    $original = [IO.File]::ReadAllText($path)
    $pattern = if ($file -eq 'robots.txt') { '(Sitemap:\s*)https://[^/\s]+' } else { '(<loc>)https://[^/<]+' }
    $content = [regex]::Replace($original, $pattern, ('${1}' + $domain))
    if ($content -cne $original) { [IO.File]::WriteAllText($path, $content, $utf8) }
}
