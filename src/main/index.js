import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Import dei moduli PDF
import { handleMerge } from './pdf/merge.js'
import { handleSplitFixedInterval } from './pdf/splitFixed.js'
import { handleSplitPersonalizedIntervals } from './pdf/splitPersonalized.js'
import { handleExtraction } from './pdf/extraction.js'
import { handleRemove } from './pdf/remove.js'
import { handleWatermark } from './pdf/watermark.js'
import { handleSummary } from './pdf/summary.js'


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id
  electronApp.setAppUserModelId('com.electron')

  // Watch shortcuts
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test di base
  ipcMain.on('ping', () => console.log('pong'))

  // ✅ Qui aggiungiamo le tue API reali:
  ipcMain.handle('merge-pdfs', handleMerge)
  ipcMain.handle('split-fixed-pdfs', handleSplitFixedInterval)
  ipcMain.handle('split-personalized-pdfs', handleSplitPersonalizedIntervals)
  ipcMain.handle('extraction-pdfs', handleExtraction)
  ipcMain.handle('remove-pdfs', handleRemove)
  ipcMain.handle('watermark-pdf', handleWatermark)
  ipcMain.handle('summary-pdf', handleSummary)


  ipcMain.handle('dialog:openFiles', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    })
    return result.canceled ? [] : result.filePaths
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
