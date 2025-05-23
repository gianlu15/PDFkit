import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const fs = require('fs');

const api = {
  selectPDFs: () => ipcRenderer.invoke('dialog:openFiles'),
  readFileAsArrayBuffer: (filePath) => fs.promises.readFile(filePath),
  mergePDFs: (filePaths, fileName) => ipcRenderer.invoke('merge-pdfs', filePaths, fileName),
  splitFixedPDF: (filePaths, intervals) => ipcRenderer.invoke('split-fixed-pdfs', filePaths, intervals),
  splitPersonalizedPDF: (filePaths, interval) => ipcRenderer.invoke('split-personalized-pdfs', filePaths, interval),
  extractionPDF: (filePaths, intervals) => ipcRenderer.invoke('extraction-pdfs', filePaths, intervals),
  removePDF: (filePaths, intervals) => ipcRenderer.invoke('remove-pdfs', filePaths, intervals),
  extractionImagesPDF: (filePaths) => ipcRenderer.invoke('extraction-images-pdf', filePaths),
  watermarkPDF: (filePaths, text, opacity, position, rotation, size) => ipcRenderer.invoke('watermark-pdf', filePaths, text, opacity, position, rotation, size),
  summaryPDF: (filePaths, language) => ipcRenderer.invoke('summary-pdf', filePaths, language),
  openExternal: (url) => shell.openExternal(url),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
