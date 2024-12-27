import { createCanvas, loadImage, Image, Canvas } from 'canvas';

export interface CanvasImageData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

export async function loadImageNode(src: string): Promise<Canvas> {
    return new Promise((resolve, reject) => {
        loadImage(src).then(image => {
            const canvas = createCanvas(image.width, image.height);
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Failed to get 2D context');

            context.drawImage(image, 0, 0);
            resolve(canvas);
        }).catch(error => {
            reject(error);
        });
    });
}

export function resizeImage(imageCanvas: Canvas, width: number, height: number): CanvasImageData {
    const offScreenCanvas = createCanvas(width, height);
    const offScreenContext = offScreenCanvas.getContext('2d');
    if (!offScreenContext) throw new Error('Failed to get 2D context');

    console.log(`Resizing image to ${width}x${height}`);
    offScreenContext.drawImage(imageCanvas, 0, 0, width, height);
    console.log('Image resized');
    const imageData = offScreenContext.getImageData(0, 0, width, height) as unknown as CanvasImageData;
    return imageData;
}
