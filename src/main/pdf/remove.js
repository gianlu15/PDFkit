const path = require('path');
const fs = require('fs/promises');
const os = require('os');
const { PDFDocument } = require('pdf-lib');

export async function handleRemove(event, file, intervals) {
    try {
        const pdfBytes = await fs.readFile(file[0]);
        const pdf = await PDFDocument.load(pdfBytes);
        const totalPages = pdf.getPageCount();
        const indices = pdf.getPageIndices();

        const pagesToRemove = new Set();
        for (const [start, end] of intervals) {
            if (start > totalPages || end > totalPages) {
                throw new Error("Pages doesn't exist");
            }
            for (let i = start - 1; i < end; i++) {
                pagesToRemove.add(i);
            }
        }

        const pagesToKeep = indices.filter(i => !pagesToRemove.has(i));

        if (pagesToKeep.length === 0) {
            throw new Error("Non restano pagine dopo la rimozione.");
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
        copiedPages.forEach(page => newPdf.addPage(page));

        const base = path.basename(file[0], '.pdf');
        const dir = path.join(os.homedir(), 'Desktop');
        const outputPath = path.join(dir, `${base}_removed.pdf`);

        const outputBytes = await newPdf.save();
        await fs.writeFile(outputPath, outputBytes);

        return true;
    } catch (error) {
        console.error('Errore rimuovendo le pagine:', error);
        return false;
    }
}

