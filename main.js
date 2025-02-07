// console.log('Hello from Electron 👋')
const { app, BrowserWindow, dialog } = require('electron/main');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const TaskDescription = require('./taskmodule.js');
// import { TaskObject } from './task.js'
// import TaskObject from './taskDescription.js';
// const taskObject = require('./taskDescription.js');


if(process.platform === 'win32')
{
    process.env.FFMPEG_PATH = 'E:/Tools/ffmpeg-master-latest-win64-gpl/ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe';
    process.env.FFPROBE_PATH = 'E:/Tools/ffmpeg-master-latest-win64-gpl/ffmpeg-master-latest-win64-gpl/bin/ffprobe.exe';
}

let taskArray = [];


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

ipcMain.handle('addNewTask', (event, newTask) => {
    // taskArray = taskArray.push(newTask);
    taskArray.push(newTask);
    return taskArray;
});

ipcMain.handle('removeTask', (event, index) => {
    console.log('remove_index:', index);
    taskArray.splice(index, 1);
});
ipcMain.handle('updateTask', (event, path, isSub, index) => {
    console.log(index)
    if(isSub){
        taskArray[index].subtitle = path;
    } else {
        taskArray[index].video = path;
    }
});
ipcMain.handle('getTaskNum', ()=>{
    return taskArray.length;
});
ipcMain.handle('getAllTask', ()=>{
    return taskArray;
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
