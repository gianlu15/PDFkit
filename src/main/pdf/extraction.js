const path = require('path');
const fs = require('fs/promises');
const os = require('os');
const { PDFDocument } = require('pdf-lib');

export async function handleExtraction(event, file, intervals) {
  try {
    const pdfBytes = await fs.readFile(file[0]);
    const pdf = await PDFDocument.load(pdfBytes);
    const totalPages = pdf.getPageCount();
    const indices = pdf.getPageIndices();

    const base = path.basename(file[0], '.pdf');
    const dir = path.join(os.homedir(), 'Desktop');

    let partCounter = 1;

    for (const [start, end] of intervals) {
      if (start > totalPages) {
        throw new Error("Indice di divisione non valido");
      }

      const slicedPdf = await PDFDocument.create();
      const slicedPages = await slicedPdf.copyPages(pdf, indices.slice(start - 1, end));
      slicedPages.forEach(page => slicedPdf.addPage(page));

      const outputBytes = await slicedPdf.save();
      await fs.writeFile(path.join(dir, `${base}_parte${partCounter}.pdf`), outputBytes);

      partCounter++;
    }

    return true;
  } catch (error) {
    console.error('Errore dividendo i PDF per intervalli:', error);
    return false;
  }
}