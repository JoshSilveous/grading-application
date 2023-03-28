// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    // An example of a function that uses the ipc context bridge.
    // The contextBridge.exposeInMainWorld will make these functions accessible to the renderer.
    // The ipcRenderer.invoke grabs the function from the main file (index.ts).
    example: () => ipcRenderer.invoke('example')
} as Window['api'])