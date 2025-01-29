const fs = require('fs');
const path = require('path');
const { ipcRenderer, dialog } = require('electron');
const ffmpeg = require('fluent-ffmpeg');


const taskContainer = document.getElementById('taskContainer');
taskContainer.style.display = 'flex';
taskContainer.style.flexDirection = 'column';
taskContainer.style.gap = '10px';
taskContainer.style.padding = '5px';
taskContainer.style.border = '1px solid #ccc';
taskContainer.style.borderRadius = '10px';


function dualInputGroup()
{
    const currentTaskGroup = document.createElement('div');
    currentTaskGroup.style.display = 'flex';
    currentTaskGroup.style.flexDirection = 'column';
    currentTaskGroup.style.gap = '1px';
    currentTaskGroup.style.padding = '1px';
    currentTaskGroup.style.border = '1px solid #ccc';
    currentTaskGroup.style.borderRadius = '10px';
    return currentTaskGroup;
}

function createInputGroup(folderPath, fileName, isSub)
{
    const inputGroup = document.createElement('div');
    inputGroup.style.display = 'flex';
    inputGroup.style.flexDirection = 'row';
    inputGroup.style.gap = '3px';
    inputGroup.style.padding = '1px';

    const inputText = document.createElement('input');
    inputText.style.width = "500px";
    if(!isSub){
        inputText.value = path.join(folderPath, fileName);
    }
    const inputSelectButton = document.createElement('button');
    inputSelectButton.innerText = '...';
    inputSelectButton.addEventListener('click', async () => {
        const folderPath = await ipcRenderer.invoke('dialog:selectFolder');
        if(folderPath && folderPath.length > 0){
            console.log(folderPath[0]);
            inputText.value = folderPath[0];
        } else {
            console.log('nothing');
        }
    });
    inputGroup.appendChild(inputText);
    inputGroup.appendChild(inputSelectButton);
    return inputGroup;

}

function addTask(filePath){
    console.log(filePath);
    const uniqueTaskBlock = document.createElement('div');
    uniqueTaskBlock.style.display = 'flex';
    uniqueTaskBlock.style.flexDirection = 'row';
    uniqueTaskBlock.style.gap = '3px';
    uniqueTaskBlock.style.padding = '3px';
    const uniqueTaskButton = document.createElement('button');
    uniqueTaskButton.innerText = 'Remove Task';
    uniqueTaskButton.style.color = 'red';

    var videoFileExtName = path.extname(filePath);
    var videoFileName = path.basename(filePath, videoFileExtName);
    var videoDir = path.dirname(filePath);

    const currentTask = dualInputGroup();
    const videoGroup = createInputGroup(videoDir,  `${videoFileName}${videoFileExtName}`, false);
    const subtitleGroup = createInputGroup('', '', true);
    currentTask.appendChild(videoGroup);
    currentTask.appendChild(subtitleGroup);

    uniqueTaskBlock.appendChild(currentTask);
    uniqueTaskBlock.appendChild(uniqueTaskButton);

    document.getElementById('taskContainer').appendChild(uniqueTaskBlock);

}

function scanFolder(folderPath){
    fs.readdir(folderPath, (err, files) =>{

        for(var i = 0 ; i < files.length; i++)
        {
            // console.log(files[i]);
            var currentFolderPath = folderPath;
            var fileName = files[i];
            var extName = path.extname(fileName);
            if( extName === '.mkv' || 
                extName === '.mp4' ||
                extName === '.avi'){
                var fullPath = path.join(folderPath, fileName);
                addTask(fullPath);
            }
        }
    });
}

function getAllTask(){
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.children
}


document.getElementById('selectByFolder').addEventListener('click', async () => {
    const path = await ipcRenderer.invoke('dialog:selectFolder');
    if(path && path.length > 0){
        for(var i = 0 ; i < path.length; i++){
            // console.log(folderPath[i]);
            // scanFolder(folderPath[i]);
            const stats = fs.lstatSync(path[i]);
            if(stats.isDirectory()){
                console.log(`current path is directory ${path[i]}`)
                scanFolder(path[i]);
            } else if(stats.isFile()){
                console.log(`current path is file ${path[i]}`);
                var extName = path.extname(path[i]);
                if( extName === '.mkv' || 
                    extName === '.mp4' ||
                    extName === '.avi'){
                    var fullPath = path.join(folderPath, fileName);
                    addTask(fullPath);
                }
            }
        }
    }
});

document.getElementById('addTasks').addEventListener('click', async () =>{
    const filePath = await ipcRenderer.invoke('dialog:selectFile');
    if(filePath && filePath.length > 0){
        for(var i = 0 ; i < filePath.length; i++){
            addTask(filePath[i]);
        }
    }
});



// run task
document.getElementById('runButton').addEventListener('click', async () => {
    getAllTask();
    // var videoFilePath = document.getElementById('videoPath').value;
    // var subtitleFilePath = document.getElementById('subtitlePath').value;

    // var videoFileExtName = path.extname(videoFilePath);
    // var videoFileName = path.basename(videoFilePath, videoFileExtName);
    // var videoDir = path.dirname(videoFilePath);



    // var subtitleFileExtName = path.extname(subtitleFilePath);
    // var subtitleFileName = path.basename(subtitleFilePath, subtitleFileExtName);
    // var subtitleDir = path.dirname(subtitleFilePath);

    // var outputDir = path.join(videoDir, 'output');
    // // let outputName = '${videoFileName}_Test${videoFileExtName}';
    // var outputName = `${videoFileName}_Test${videoFileExtName}`;
    // var outputFullPath = path.join(outputDir, outputName);
    // console.log(videoFilePath);
    // console.log(subtitleFilePath);
    // console.log(outputFullPath);

    // if(!fs.existsSync(outputDir))
    // {
    //     fs.mkdirSync(outputDir, { recursive: true });
    // } else {
    //     console.log('Output Folder exists ')
    // }
    // // ffmpeg -i backup.mkv -i sub_chen.ass -codec copy -map 0 -map 1 output_aaa.mkv
    // console.log('StartRendering');

    // const ffTest = ffmpeg(videoFilePath);
    // ffTest.input(subtitleFilePath);
    // if(subtitleFileExtName === 'ass'){
    //     ffTest.outputOptions('-codec', 'copy');
    // } else {
    //     ffTest.outputOptions('-c:s', 'srt');
    // }
    // ffTest.outputOptions('-map', '0');
    // ffTest.outputOptions('-map', '1');


    // ffTest.on('end', () => {
    //     console.log('soft subtitle added successfully');
    // })
    // .on('error', (err) => {
    //     console.log('Error occurred', err.message);
    // })
    // .save(outputFullPath);


    // ffmpeg(videoFilePath)
    //     .input(subtitleFilePath)
    //     .outputOptions('-c:s', 'srt')
    //     .outputOptions('-map', '0')
    //     .outputOptions('-map', '1')
    //     .on('stdout', (stdout) => {
    //         console.log(stdout);
    //     })
    //     .on('end', () => {
    //         console.log('soft subtitle added successfully');
    //     })
    //     .on('error', (err) => {
    //         console.error('Error occurred', err.message);
    //     })
    //     .save(outputFullPath);



});

