
## SVG to PNG
inkscape -z -e icon-72x72.png -w 72 -h 72 icon.svg
inkscape -z -e icon-96x96.png -w 96 -h 96 icon.svg
inkscape -z -e icon-128x128.png -w 128 -h 128 icon.svg
inkscape -z -e icon-144x144.png -w 144 -h 144 icon.svg
inkscape -z -e icon-152x152.png -w 152 -h 152 icon.svg
inkscape -z -e icon-192x192.png -w 192 -h 192 icon.svg
inkscape -z -e icon-384x384.png -w 384 -h 384 icon.svg
inkscape -z -e icon-512x512.png -w 512 -h 512 icon.svg

## PNG to ico
convert icon-512x512.png -define icon:auto-resize=64,48,32,16 favicon.ico