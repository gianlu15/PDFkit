const path = require('path');
const fs = require('fs/promises');
const os = require('os');
const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');

function getPositionCoords(position, width, height) {
    switch (position) {
        case "top-left": return { x: 50, y: height - 250 };
        case "top-right": return { x: width - 200, y: height -2350 };
        case "bottom-left": return { x: 50, y: 50 };
        case "bottom-right": return { x: width - 200, y: 50 };
        default: return { x: width / 2 - 50, y: height / 2 - 50 };
    }
}

function getSize(size) {
    switch (size) {
        case "small": return 24;
        case "normal": return 46;
        case "big": return 68;
        default: return 24;
    }
}

export async function handleWatermark(event, file, text, opacity, position, rotation, sizeload) {
    try {
        const pdfBytes = await fs.readFile(file[0]);
        const pdf = await PDFDocument.load(pdfBytes);
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);

        const watermarkText = text;

        const pages = pdf.getPages();
        for (const page of pages) {
            const { width, height } = page.getSize();
            const { x, y } = getPositionCoords(position, width, height);
            const size = getSize(sizeload);

            page.drawText(watermarkText, {
                x: x,
                y: y,
                size: size,
                font,
                rotate: degrees(rotation),
                color: rgb(0.75, 0.75, 0.75),
                opacity: opacity / 100,
            });
        }

        const base = path.basename(file[0], '.pdf');
        const dir = path.join(os.homedir(), 'Desktop');
        const outputPath = path.join(dir, `${base}_watermark.pdf`);

        const outputBytes = await pdf.save();
        await fs.writeFile(outputPath, outputBytes);

        return true;
    } catch (error) {
        console.error('Errore applicando watermark le pagine:', error);
        return false;
    }
}

