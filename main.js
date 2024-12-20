// console.log('Hello from Electron 👋')
const { app, BrowserWindow } = require('electron/main')

const createWindow = () =>{
    const win = new BrowserWindow({
        width : 800,
        height : 600
    })
    win.loadFile('index.html')
    // win.loadURL('https://github.com')
}

app.whenReady().then(()=>{
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    })
})

app.on('window-all-closed', () =>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})
// const path = require('node:path')
// const createWindow = () => {
//     const win = new BrowserWindow({
//       width: 800,
//       height: 600,
//     //   webPreferences: {
//     //     preload : path.join(__dirname, 'preload.js')
//     //   }
//     })
  
//     win.loadFile('index.html')
//   }

//   app.whenReady().then(() => {
//     createWindow()
//     app.on('activate', () =>{
//         if (BrowserWindow.getAllWindows().length === 0) createWindow()
//     })
//   })