import Pica from 'pica';

export async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // nécessaire pour éviter des problèmes de CORS
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
        img.src = src;
    });
}

export async function resizeImage(image: HTMLImageElement, width: number, height: number): Promise<ImageData> {
    const pica = new Pica();
    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = width;
    offScreenCanvas.height = height;
    const offScreenContext = offScreenCanvas.getContext('2d');
    if (!offScreenContext) throw new Error('Failed to get 2D context');

    console.log(`Resizing image to ${width}x${height}`);
    await pica.resize(image, offScreenCanvas);
    console.log('Image resized');
    return offScreenContext.getImageData(0, 0, width, height);
}

function rgbToClass(r: number, g: number, b: number): string {
    return `color-${(r << 16) + (g << 8) + b}`;
}

export function imageToAscii(imageData: ImageData, color: boolean = true): string {
    const grayscale = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;
    const asciiChars = ' .,:;i1tfLCG08@'; // From light to dark

    let asciiStr = '';
    let line = '';
    const totalPixels = imageData.width * imageData.height;
    let processedPixels = 0;

    console.log('Starting ASCII conversion');
    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const index = (y * imageData.width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];

            const gray = grayscale(r, g, b);
            const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
            const char = asciiChars[charIndex];

            if (color) {
                const className = rgbToClass(r, g, b);
                line += `<span class="${className}">${char}</span>`;
            } else {
                line += char;
            }

            processedPixels++;
            if (processedPixels % 1000 === 0) {
                console.log(`Processed ${processedPixels} / ${totalPixels} pixels`);
            }
        }
        asciiStr += line + '<br>'; // Append the line at once
        line = '';
    }
    console.log('ASCII conversion done');
    return asciiStr;
}
