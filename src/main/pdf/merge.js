const path = require('path');
const fs = require('fs/promises');
const os = require('os');
const { PDFDocument } = require('pdf-lib');

export async function handleMerge(event, files, fileName, exportPath) {
  try {
    const safeName = fileName.replace(/[^a-zA-Z0-9-_]/g, '_');
    const outputDir = exportPath || path.join(os.homedir(), 'Desktop');
    const outputPath = path.join(outputDir, `${safeName}.pdf`);
    const mergedPdf = await PDFDocument.create();

    for (const filePath of files) {
      const pdfBytes = await fs.readFile(filePath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    await fs.writeFile(outputPath, mergedPdfBytes);

    return true;
  } catch (error) {
    console.error('Errore unendo i PDF:', error);
    return false;
  }
}

