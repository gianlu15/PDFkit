const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const FormData = require('form-data');
const { PDFDocument, StandardFonts } = require('pdf-lib');
require('dotenv').config();

const API_KEY = process.env.SUMMARY_API_KEY;

export async function handleSummary(event, file, language, exportPath) {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(file[0]));
    form.append('output_language', language);
    form.append('summary_length', 'long');

    const options = {
      method: 'POST',
      url: 'https://api.apyhub.com/ai/summarize-documents/file',
      headers: {
        'apy-token': API_KEY,
        ...form.getHeaders()
      },
      data: form
    };

    const response = await axios.request(options);
    const summaryText = response.data.data.summary;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    const fontSize = 12;
    const maxLineWidth = width - 80;
    const lines = wrapText(summaryText, font, fontSize, maxLineWidth);

    lines.forEach((line, index) => {
      page.drawText(line, {
        x: 40,
        y: height - 50 - index * (fontSize + 4),
        size: fontSize,
        font: font
      });
    });

    const pdfBytes = await pdfDoc.save();
    const baseName = path.basename(file[0], '.pdf');
    const outputDir = exportPath || path.join(os.homedir(), 'Desktop');
    const outputPath = path.join(outputDir, `${baseName}_summary.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);

    return true;
  } catch (error) {
    console.error('Errore nel riassunto:', error.response?.data || error.message);
    return false;
  }
}

function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}