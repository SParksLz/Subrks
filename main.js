// console.log('Hello from Electron 👋')
const { app, BrowserWindow, dialog, ipcMain } = require('electron/main');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const {TaskDescription} = require('./taskmodule.js');


if(process.platform === 'win32')
{
    process.env.FFMPEG_PATH = 'E:/Tools/ffmpeg-master-latest-win64-gpl/ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe';
    process.env.FFPROBE_PATH = 'E:/Tools/ffmpeg-master-latest-win64-gpl/ffmpeg-master-latest-win64-gpl/bin/ffprobe.exe';
}

// var taskContainer = new TaskContainer();
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
    win.loadFile('index.html');
    ipcMain.handle('createTask', (event, filePath)=>{
        // var newTask = new TaskDescription(filePath);
        const newTask = {
            id : taskArray.length,
            videoFile : filePath,
            subFile : ''
        };
        taskArray.push(newTask);
        // console.log(newTask.video);
        console.log(newTask);
        win.webContents.send('update-tasks', taskArray);
    });
    ipcMain.handle('removeTask', async (event, index)=>{
        // taskArray = taskArray.filter(task => task.id !== index);
        console.log(taskArray[index]);
        // taskArray.pop(index);
        await taskArray.splice(index, 1);
        // console.log(taskArray);
        win.webContents.send('update-tasks', taskArray);
    });
    ipcMain.handle('clearAll', async () => {
        await taskArray.splice(0, taskArray.length);
        win.webContents.send('update-tasks', taskArray);
    });
    ipcMain.handle('setSubtitle', (event, subtitlePath, index) => {
        taskArray[index].subFile = subtitlePath;
    });

    ipcMain.handle('dialog:selectFile', async () => {
        const result = await dialog.showOpenDialog({
            properties : ['openFile', 'multiSelections'],
        });
        // return result.filePaths;
        if(result.filePaths && result.filePaths.length > 0){
            for(var i = 0 ; i < result.filePaths.length; i++){
                const newTask = {
                    id : taskArray.length,
                    videoFile : result.filePaths[i],
                    subFile : ''
                };
                taskArray.push(newTask);
            }
            win.webContents.send('update-tasks', taskArray);
        }
    });

    ipcMain.handle('dialog:selectSubtitle', async () => {
        const result = await dialog.showOpenDialog({
            properties : ['openFile'],
        });
        // return result.filePaths;
        if(result.filePaths && result.filePaths.length > 0){
            return result.filePaths[0];
        } else {
            console.log('null');
        }
    });

    ipcMain.handle('dialog:selectFolder', async () => {
        const result = await dialog.showOpenDialog({
            properties : ['openDirectory', 'multiSelections'],
        });
        if(result.filePaths && result.filePaths.length > 0){
            fs.readdir(result.filePaths[0], (err, files) =>{
                for(var i = 0 ; i < files.length; i++){
                    // var currentFolderPath = folderPath;
                    var fileName = files[i];
                    var extName = path.extname(fileName);
                    if( extName === '.mkv' ||
                        extName === '.mp4' ||
                        extName === '.avi'){
                        var fullPath = path.join(result.filePaths[0], fileName);
                        const newTask = {
                            id : taskArray.length,
                            videoFile : fullPath,
                            subFile : ''
                        };
                        taskArray.push(newTask);
                    }
                }
                win.webContents.send('update-tasks', taskArray);
            });
        }
    });

    ipcMain.handle('runTasks', async ()=>{
        for(var i = 0 ; i < taskArray.length; i++){
            const currentTask = taskArray[i];
            console.log(currentTask.videoFile);
            console.log(currentTask.subFile);
            console.log('----------------------------------');
            win.webContents.send('task-finish', i);
        }
    });
}


// ipcMain.handle('getAllTask', ()=>{
//     return taskContainer.taskArray;
// });
ipcMain.handle('containerUpdate', ()=>{
    taskContainer.update();
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
