#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs';
import { loadImageNode, resizeImage } from './imageToAscii.js';
const imagePath = process.argv[2]; // Pass image path as a command-line argument
const outputPath = process.argv[3];
const outputDirectory = outputPath + '/assets';
const outputDirectoryCss = outputPath + '/css';
const sizes = [50, 75, 100, 200, 300]; // Example sizes
function generateAsciiFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Loading image from ${imagePath}`);
            const imgCanvas = yield loadImageNode(imagePath);
            console.log(`Image loaded successfully`);
            for (const size of sizes) {
                console.log(`Processing size ${size}`);
                const charWidth = 1; // 1 pixel per character in width
                const charHeight = 2; // 2 pixels per character in height
                const maxPixelWidth = size * charWidth;
                const aspectRatio = imgCanvas.height / imgCanvas.width;
                const maxHeight = Math.floor(maxPixelWidth * aspectRatio / charHeight);
                console.log(`Resizing image to ${maxPixelWidth}x${maxHeight}`);
                const resizedImageData = resizeImage(imgCanvas, maxPixelWidth, maxHeight);
                console.log(`Image resized to ${maxPixelWidth}x${maxHeight}`);
                var { asciiArt, colors } = generateAsciiAndColors(resizedImageData, true, false);
                console.log(`ASCII art generated for size ${size} - isRight false`);
                if (!fs.existsSync(outputDirectory)) {
                    fs.mkdirSync(outputDirectory, { recursive: true });
                }
                fs.writeFileSync(`${outputDirectory}/ascii_${size}.txt`, asciiArt);
                console.log(`ASCII art file saved as ascii_${size}.txt`);
                if (!fs.existsSync(outputDirectoryCss)) {
                    fs.mkdirSync(outputDirectoryCss, { recursive: true });
                }
                const cssContent = generateCss(colors);
                fs.writeFileSync(`${outputDirectoryCss}/colors_${size}.css`, cssContent);
                console.log(`CSS file saved as colors_${size}.css`);
                var { asciiArt, colors } = generateAsciiAndColors(resizedImageData, true, true);
                console.log(`ASCII art generated for size ${size} - isRight true`);
                if (!fs.existsSync(outputDirectory)) {
                    fs.mkdirSync(outputDirectory, { recursive: true });
                }
                fs.writeFileSync(`${outputDirectory}/ascii_${size}_right.txt`, asciiArt);
                console.log(`ASCII art file saved as ascii_${size}_right.txt`);
            }
        }
        catch (error) {
            console.error('Error generating ASCII art and CSS files:', error);
        }
    });
}
function generateAsciiAndColors(imageData, color = true, isRight = false) {
    const grayscale = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
    const asciiChars = ' .,:;i1tfLCG08@'; // From light to dark
    let asciiStr = '';
    let line = '';
    const totalPixels = imageData.width * imageData.height;
    let processedPixels = 0;
    const colors = new Set();
    console.log('Starting ASCII conversion');
    for (let y = 0; y < imageData.height; y++) {
        let previousClass = '';
        let currentLine = '';
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
                colors.add(className);
                if (className !== previousClass) {
                    if (previousClass) {
                        line += `<span class="${previousClass}">${currentLine}</span>`;
                    }
                    currentLine = char;
                    previousClass = className;
                }
                else {
                    currentLine += char;
                }
            }
            else {
                currentLine += char;
            }
            processedPixels++;
            if (processedPixels % 1000 === 0) {
                console.log(`Processed ${processedPixels} / ${totalPixels} pixels`);
            }
        }
        if (color && previousClass) {
            line += `<span class="${previousClass}">${currentLine}</span>`;
        }
        else {
            line += currentLine;
        }
        if (isRight == false) {
            line = line.replace(/(<span class="[^"]*">\s*<\/span>)+$/, '');
        }
        else {
            line = line.replace(/^\s*<span class="[^"]*">(\s*<\/span>)*$/, '');
        }
        asciiStr += line + '<br>'; // Append the line at once
        line = '';
    }
    console.log('ASCII conversion done');
    return { asciiArt: asciiStr, colors: colors };
}
function rgbToClass(r, g, b) {
    return `c-${r}-${g}-${b}`;
}
function generateCss(colors) {
    let css = '';
    for (const color of colors) {
        const [_, r, g, b] = color.split('-').map(Number);
        css += `.${color} { color: rgb(${r}, ${g}, ${b}); }\n`;
    }
    return css;
}
generateAsciiFiles();
