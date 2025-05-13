const path = require('path');
const fs = require('fs/promises');
const os = require('os');
const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');

export async function handleWatermark(event, file, text, opacity) {
    try {
        const pdfBytes = await fs.readFile(file[0]);
        const pdf = await PDFDocument.load(pdfBytes);
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);

        const watermarkText = text;

        const pages = pdf.getPages();
        for (const page of pages) {
            const { width, height } = page.getSize();

            page.drawText(watermarkText, {
                x: width / 2 - 50,
                y: height / 2,
                size: 50,
                font,
                rotate: degrees(45),
                color: rgb(0.75, 0.75, 0.75),
                opacity: opacity/100,
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

