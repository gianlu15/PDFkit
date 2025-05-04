import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const fs = require('fs');


// ✅ Custom APIs che vuoi esporre tu:
const api = {
  selectPDFs: () => ipcRenderer.invoke('dialog:openFiles'),
  readFileAsArrayBuffer: (filePath) => fs.promises.readFile(filePath),
  mergePDFs: (filePaths, fileName) => ipcRenderer.invoke('merge-pdfs', filePaths, fileName),
  splitPDF: (filePaths, intervals) => ipcRenderer.invoke('split-pdfs', filePaths, intervals),
  splitIntervalPDF: (filePaths, interval) => ipcRenderer.invoke('split-interval-pdfs', filePaths, interval),
  extractionPDF: (filePaths, intervals) => ipcRenderer.invoke('extraction-pdfs', filePaths, intervals),
  removePDF: (filePaths, intervals) => ipcRenderer.invoke('remove-pdfs', filePaths, intervals)
}

// 📦 Esponiamo sia electronAPI (di toolkit) sia api (tua)
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // In fallback senza context isolation
  window.electron = electronAPI
  window.api = api
}
