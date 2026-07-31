$ErrorActionPreference = "Stop"

$assets = @(
  @{ Path = "public/projects/birla-evara/hero.webp"; Url = "https://www.birlaestates.com/birla-evara-sarjapur/images/01-evara-banner.webp" },
  @{ Path = "public/projects/birla-evara/gallery-1.webp"; Url = "https://www.birlaestates.com/birla-evara-sarjapur/images/02-evara-banner.webp" },
  @{ Path = "public/projects/birla-evara/gallery-2.webp"; Url = "https://www.birlaestates.com/birla-evara-sarjapur/images/showcase/project-showcase-1.webp" },

  @{ Path = "public/projects/birla-ojasvi/hero.webp"; Url = "https://www.birlaestates.com/birla-ojasvi-rrnagar/images/projects/ojasvi/bg-res-proj-detail-03-md.webp" },

  @{ Path = "public/projects/prestige-somerville/hero.jpg"; Url = "https://d1t2fddy6amcvs.cloudfront.net/projectimage/d71149a4-0a52-4878-926f-3a353fa51379.jpeg" },
  @{ Path = "public/projects/prestige-somerville/gallery-1.jpg"; Url = "https://dsc1bri60i31v.cloudfront.net/projectgallery/77c7057d-8849-427c-861c-afcd394f1107.jpeg" },
  @{ Path = "public/projects/prestige-somerville/gallery-2.jpg"; Url = "https://dsc1bri60i31v.cloudfront.net/projectgallery/728e49ee-1cff-488d-b991-d740b048d612.jpeg" },

  @{ Path = "public/projects/prestige-kings-county/hero.jpg"; Url = "https://d1t2fddy6amcvs.cloudfront.net/projectimage/6f5d698f-2650-48b5-aa3e-99e1e3771926.jpeg" },
  @{ Path = "public/projects/prestige-kings-county/gallery-1.jpg"; Url = "https://d1t2fddy6amcvs.cloudfront.net/projectgallery/cce2e5e1-1980-45d5-9d65-984f6cf9586d.jpeg" },
  @{ Path = "public/projects/prestige-kings-county/gallery-2.jpg"; Url = "https://d1t2fddy6amcvs.cloudfront.net/projectgallery/2c9269d0-4d44-4aeb-8be3-de23519b90e6.jpeg" },

  @{ Path = "public/projects/brigade-insignia/hero.webp"; Url = "https://d1di04ifehjy6m.cloudfront.net/media/filer_public/ff/bb/ffbbd70b-5589-438a-8ee8-19826a94ce14/cam-08_brigade_insignia_1_1.webp" },
  @{ Path = "public/projects/brigade-insignia/gallery-1.webp"; Url = "https://d1di04ifehjy6m.cloudfront.net/media/filer_public/dd/2e/dd2eb64d-1827-49e8-a3fa-901891f36c0b/cam-08_brigade_insignia_1_2.webp" },
  @{ Path = "public/projects/brigade-insignia/gallery-2.jpg"; Url = "https://d1di04ifehjy6m.cloudfront.net/media/filer_public/4c/c2/4cc2bd96-7ce1-4e54-af09-7d387336696d/cam03_brigadeinsignia_revised.jpg" },

  @{ Path = "public/projects/brigade-citrine/hero.jpg"; Url = "https://d1di04ifehjy6m.cloudfront.net/media/filer_public/c3/07/c3075fd9-5418-4841-b341-9636764ff20c/1920x780-citrine.jpg" },
  @{ Path = "public/projects/brigade-citrine/gallery-1.jpg"; Url = "https://d1di04ifehjy6m.cloudfront.net/media/filer_public/db/64/db645a39-4296-4ad1-b897-bfe7100eea4b/768x682-citrine_detail_1.jpg" },
  @{ Path = "public/projects/brigade-citrine/gallery-2.webp"; Url = "https://d1di04ifehjy6m.cloudfront.net/media/filer_public/46/29/462990a1-a453-48a4-b1ad-bb3e7dbf776a/citrine_1920x700.webp" },

  @{ Path = "public/projects/brigade-valencia/hero.webp"; Url = "https://d1di04ifehjy6m.cloudfront.net/media/filer_public/06/54/06544c7a-7dd5-4216-a1ce-a36e7a9551a2/valencia-banner-1920x780-1.webp" },
  @{ Path = "public/projects/brigade-valencia/gallery-1.webp"; Url = "https://d1di04ifehjy6m.cloudfront.net/media/filer_public/c5/fa/c5fa124e-ecaf-4fc8-b9de-b77b750a0cab/valencia-banner_copy_5_copy_4_1_1.webp" },
  @{ Path = "public/projects/brigade-valencia/gallery-2.webp"; Url = "https://d1di04ifehjy6m.cloudfront.net/media/filer_public/7a/fb/7afb70c2-4b99-4480-b7d5-74f4596169b8/valencia-1920x700.webp" },

  @{ Path = "public/projects/lodha-azur/hero.jpg"; Url = "https://www.lodhagroup.com/sites/default/files/projects/banner/Spotlight_Lodha-Azur_1903X800_0.jpg" },
  @{ Path = "public/projects/lodha-azur/gallery-1.jpg"; Url = "https://www.lodhagroup.com/sites/default/files/2024-04/USP1_Lodha-Azur_390X347.jpg" },
  @{ Path = "public/projects/lodha-azur/gallery-2.jpg"; Url = "https://www.lodhagroup.com/sites/default/files/2024-04/USP2_Lodha-Azur_390X347.jpg" },

  @{ Path = "public/projects/godrej-tiara/hero.jpg"; Url = "https://www.godrejproperties.com/landing-page/bangalore/residential/godrej-tiara/Images/main-banner.jpg?var=0.2" },
  @{ Path = "public/projects/godrej-tiara/gallery-1.png"; Url = "https://www.godrejproperties.com/landing-page/bangalore/residential/godrej-tiara/Images/gallery.png" },
  @{ Path = "public/projects/godrej-tiara/gallery-2.png"; Url = "https://www.godrejproperties.com/landing-page/bangalore/residential/godrej-tiara/Images/gallery-2.png" },

  @{ Path = "public/projects/assetz-ren-rei/hero.jpeg"; Url = "https://assetzproperty-222d9.kxcdn.com/renandrei/images/project-everwiew-img.jpeg" },
  @{ Path = "public/projects/assetz-ren-rei/gallery-1.png"; Url = "https://www.assetzproperty.com/renandrei/storage/01JQEJ9YSNZ7AGRH7PJTSZ9QEC.png" },
  @{ Path = "public/projects/assetz-ren-rei/gallery-2.png"; Url = "https://www.assetzproperty.com/renandrei/storage/01JQEJCSGWZTVQ97KBNZGC1SK2.png" },

  @{ Path = "public/projects/assetz-soho-sky/hero.png"; Url = "https://www.assetzproperty.com/sohoandsky/wp-content/themes/sohosky/assets/images/home/bannertwo.png" },
  @{ Path = "public/projects/assetz-soho-sky/gallery-1.png"; Url = "https://www.assetzproperty.com/sohoandsky/wp-content/themes/sohosky/assets/images/home/bannerthree.png" },
  @{ Path = "public/projects/assetz-soho-sky/gallery-2.png"; Url = "https://www.assetzproperty.com/sohoandsky/wp-content/themes/sohosky/assets/images/home/building.png" },

  @{ Path = "public/projects/nikoo-homes-vi/hero.jpg"; Url = "https://nikoohomes.com/wp-content/uploads/2024/01/NH6_BLOCK-2-scaled.jpg" },
  @{ Path = "public/projects/nikoo-homes-vi/gallery-1.jpg"; Url = "https://nikoohomes.com/wp-content/uploads/2024/01/NH6_BLOCK-4-scaled.jpg" },
  @{ Path = "public/projects/nikoo-homes-vi/gallery-2.jpg"; Url = "https://nikoohomes.com/wp-content/uploads/2024/01/NH6_BLOCK-3-1.jpg" },

  @{ Path = "public/projects/nikoo-homes-8/hero.jpg"; Url = "https://nikoohomes.com/wp-content/uploads/2026/05/home_garden.jpg" },
  @{ Path = "public/projects/nikoo-homes-8/gallery-1.png"; Url = "https://nikoohomes.com/wp-content/uploads/2026/05/township.png" }
)

foreach ($asset in $assets) {
  $directory = Split-Path -Parent $asset.Path
  New-Item -ItemType Directory -Force -Path $directory | Out-Null
  if ((Test-Path $asset.Path) -and ((Get-Item $asset.Path).Length -ge 10000)) {
    Write-Host "Already imported $($asset.Path)"
    continue
  }
  try {
    Invoke-WebRequest -Uri $asset.Url -OutFile $asset.Path -UseBasicParsing -Headers @{
      "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138 Safari/537.36"
      "Referer" = ([System.Uri]$asset.Url).GetLeftPart([System.UriPartial]::Authority)
    }
  }
  catch {
    Write-Warning "Could not import $($asset.Path): $($_.Exception.Message)"
    continue
  }
  $size = (Get-Item $asset.Path).Length
  if ($size -lt 10000) {
    throw "Downloaded file is unexpectedly small: $($asset.Path) ($size bytes)"
  }
  Write-Host "Imported $($asset.Path) ($size bytes)"
}
