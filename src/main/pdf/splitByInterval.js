const pathInterval = require('path');
const fsInterval = require('fs/promises');
const osInterval = require('os');
const { PDFDocument: PDFDocInterval } = require('pdf-lib');

export async function handleSplitInterval(event, file, pagesPerSplit) {
  try {
    const pdfBytes = await fsInterval.readFile(file[0]);
    const pdf = await PDFDocInterval.load(pdfBytes);
    const totalPages = pdf.getPageCount();
    const indices = pdf.getPageIndices();

    const base = pathInterval.basename(file[0], '.pdf');
    const dir = pathInterval.join(osInterval.homedir(), 'Desktop');

    if (!Number.isInteger(pagesPerSplit) || pagesPerSplit < 1 || pagesPerSplit > totalPages) {
      throw new Error("Intervallo non valido. Deve essere un numero tra 1 e " + totalPages);
    }

    const totalParts = Math.ceil(totalPages / pagesPerSplit);
    let partCounter = 1;

    for (let i = 0; i < totalPages; i += pagesPerSplit) {
      const slicedPdf = await PDFDocInterval.create();
      const slicedPages = await slicedPdf.copyPages(pdf, indices.slice(i, i + pagesPerSplit));
      slicedPages.forEach(page => slicedPdf.addPage(page));

      const outputBytes = await slicedPdf.save();
      const outputName = `${base}_parte${partCounter}_di_${totalParts}.pdf`;
      await fsInterval.writeFile(pathInterval.join(dir, outputName), outputBytes);

      partCounter++;
    }

    return true;
  } catch (error) {
    console.error('Errore dividendo i PDF per intervalli fissi:', error);
    return false;
  }
}