// console.log('Hello from Electron 👋')
const { app, BrowserWindow, dialog } = require('electron/main');

if(process.platform === 'win32')
{
    process.env.FFMPEG_PATH = 'E:/Tools/ffmpeg-master-latest-win64-gpl/ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe';
    process.env.FFPROBE_PATH = 'E:/Tools/ffmpeg-master-latest-win64-gpl/ffmpeg-master-latest-win64-gpl/bin/ffprobe.exe';
}

const createWindow = () =>{
    const win = new BrowserWindow({
        width : 800,
        height : 300,
        webPreferences : {
            nodeIntegration: true,  // 启用 Node.js 集成
            contextIsolation: false
        }
    })
    win.loadFile('index.html')
}

// 目前按钮点多少下会showopendialog多少次 得就出来一次
const { ipcMain } = require('electron');
ipcMain.handle('dialog:selectFolder', async () => {
    const result = await dialog.showOpenDialog({
        properties : ['openDirectory', 'multiSelections'],
    });
    return result.filePaths;
});

ipcMain.handle('dialog:selectFile', async ()=> {
    const result = await dialog.showOpenDialog({
        properties : ['openFile', 'multiSelections'],
    })
    return result.filePaths;
});

app.whenReady().then(()=>{
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            createWindow();
        }
    })
})

app.on('window-all-closed', () =>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})
