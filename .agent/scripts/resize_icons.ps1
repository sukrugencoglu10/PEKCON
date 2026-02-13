
# Define source and destination paths
$sourcePath = "$PSScriptRoot\..\..\public\favicon-512x512.png"
$publicDir = "$PSScriptRoot\..\..\public"

# Verify source exists
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source file not found at: $sourcePath"
    exit 1
}

# Image processing function
function Resize-Image {
    param (
        [string]$Source,
        [string]$Destination,
        [int]$Width,
        [int]$Height
    )

    Add-Type -AssemblyName System.Drawing

    $srcImage = [System.Drawing.Image]::FromFile($Source)
    $newImage = new-object System.Drawing.Bitmap $Width, $Height

    $graphics = [System.Drawing.Graphics]::FromImage($newImage)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $graphics.DrawImage($srcImage, 0, 0, $Width, $Height)
    
    $newImage.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)

    $srcImage.Dispose()
    $newImage.Dispose()
    $graphics.Dispose()
    
    Write-Host "Created: $Destination ($Width x $Height)"
}

# Generate icons
Resize-Image -Source $sourcePath -Destination "$publicDir\favicon-16x16.png" -Width 16 -Height 16
Resize-Image -Source $sourcePath -Destination "$publicDir\favicon-32x32.png" -Width 32 -Height 32
Resize-Image -Source $sourcePath -Destination "$publicDir\apple-touch-icon.png" -Width 180 -Height 180
Resize-Image -Source $sourcePath -Destination "$publicDir\favicon-192x192.png" -Width 192 -Height 192

Write-Host "All icons generated successfully."
