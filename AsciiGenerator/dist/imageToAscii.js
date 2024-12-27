var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createCanvas, loadImage } from 'canvas';
export function loadImageNode(src) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            loadImage(src).then(image => {
                const canvas = createCanvas(image.width, image.height);
                const context = canvas.getContext('2d');
                if (!context)
                    throw new Error('Failed to get 2D context');
                context.drawImage(image, 0, 0);
                resolve(canvas);
            }).catch(error => {
                reject(error);
            });
        });
    });
}
export function resizeImage(imageCanvas, width, height) {
    const offScreenCanvas = createCanvas(width, height);
    const offScreenContext = offScreenCanvas.getContext('2d');
    if (!offScreenContext)
        throw new Error('Failed to get 2D context');
    console.log(`Resizing image to ${width}x${height}`);
    offScreenContext.drawImage(imageCanvas, 0, 0, width, height);
    console.log('Image resized');
    const imageData = offScreenContext.getImageData(0, 0, width, height);
    return imageData;
}
