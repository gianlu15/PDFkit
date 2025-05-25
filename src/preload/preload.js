import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const fs = require('fs');

const api = {
  selectPDFs: () => ipcRenderer.invoke('dialog:openFiles'),
  readFileAsArrayBuffer: (filePath) => fs.promises.readFile(filePath),
  mergePDFs: (filePaths, fileName, exportPath) => ipcRenderer.invoke('merge-pdfs', filePaths, fileName, exportPath),
  splitFixedPDF: (filePaths, intervals, exportPath) => ipcRenderer.invoke('split-fixed-pdfs', filePaths, intervals, exportPath),
  splitPersonalizedPDF: (filePaths, interval, exportPath) => ipcRenderer.invoke('split-personalized-pdfs', filePaths, interval, exportPath),
  extractionPDF: (filePaths, intervals, exportPath) => ipcRenderer.invoke('extraction-pdfs', filePaths, intervals, exportPath),
  removePDF: (filePaths, intervals, exportPath) => ipcRenderer.invoke('remove-pdfs', filePaths, intervals, exportPath),
  watermarkPDF: (filePaths, text, opacity, position, rotation, size, exportPath) => ipcRenderer.invoke('watermark-pdf', filePaths, text, opacity, position, rotation, size, exportPath),
  summaryPDF: (filePaths, language) => ipcRenderer.invoke('summary-pdf', filePaths, language),
  openExternal: (url) => shell.openExternal(url),
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder')
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
