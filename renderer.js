const fs = require('fs');
const path = require('path');
const { ipcRenderer, dialog } = require('electron');

let uiContainer = [];

const taskContainer = document.getElementById('taskContainer');
taskContainer.style.display = 'flex';
taskContainer.style.flexDirection = 'column';
taskContainer.style.gap = '10px';
taskContainer.style.padding = '5px';
taskContainer.style.border = '1px solid #ccc';
taskContainer.style.borderRadius = '10px';

// debug value : index
function createInputGroup(folderPath, fileName, isSub, index)
{
    const inputGroup = document.createElement('div');
    inputGroup.style.display = 'flex';
    inputGroup.style.flexDirection = 'row';
    inputGroup.style.gap = '3px';
    inputGroup.style.padding = '1px';

    const inputText = document.createElement('input');
    inputText.style.width = "1300px";
    if(!isSub){
        inputText.value = path.join(folderPath, fileName);
    }
    const inputSelectButton = document.createElement('button');
    inputSelectButton.innerText = '...';
    inputSelectButton.addEventListener('click', async () => {
        const folderPath = await ipcRenderer.invoke('dialog:selectSubtitle');
        inputText.value = folderPath;
        ipcRenderer.invoke('setSubtitle', folderPath, index);
        // if(folderPath && folderPath.length > 0){
        //     console.log(folderPath[0]);
        //     inputText.value = folderPath[0];
        //     // ipcRenderer.invoke('updateTask', folderPath[0], isSub, index);
        //     ipcRenderer.invoke('setSubtitle', folderPath[0], index);
        // } else {
        //     console.log('nothing');
        // }
    });
    inputGroup.appendChild(inputText);
    inputGroup.appendChild(inputSelectButton);
    return inputGroup;
}

function dualInputGroup()
{
    const currentTaskGroup = document.createElement('div');
    currentTaskGroup.style.display = 'flex';
    currentTaskGroup.style.flexDirection = 'column';
    currentTaskGroup.style.gap = '10px';
    currentTaskGroup.style.padding = '10px';
    currentTaskGroup.style.border = '1px solid #ccc';
    currentTaskGroup.style.borderRadius = '10px';
    return currentTaskGroup;
}



async function addTask(filePath, subtitlePath, index){
    const uniqueTaskBlock = document.createElement('div');
    uniqueTaskBlock.id = `taskBlock_${index}`;
    uniqueTaskBlock.style.display = 'flex';
    uniqueTaskBlock.style.flexDirection = 'row';
    uniqueTaskBlock.style.gap = '3px';
    uniqueTaskBlock.style.padding = '3px';
    uniqueTaskBlock.innerHTML = `TaskBlock ${index}`;
    uniqueTaskBlock.dataset.index = index;

    const uniqueTaskButton = document.createElement('button');
    uniqueTaskButton.innerText = 'Remove Task';
    uniqueTaskButton.style.color = 'red';
    uniqueTaskButton.addEventListener('click', async ()=>{
        console.log(`remove ${index}`);
        await ipcRenderer.invoke('removeTask', index);
    });

    const currentTask = dualInputGroup();
    //video path
    var videoFileExtName = path.extname(filePath);
    var videoFileName = path.basename(filePath, videoFileExtName);
    var videoDir = path.dirname(filePath);
    const videoGroup = createInputGroup(videoDir,  `${videoFileName}${videoFileExtName}`, false, index);

    //subtitle path
    let subtitleGroup;
    if(fs.existsSync(subtitlePath))
    {
        var subFileExtName = path.extname(subtitlePath);
        var subFileName = path.basename(subtitlePath, subFileExtName);
        var subDir = path.dirname(subtitlePath);
        subtitleGroup = createInputGroup(subDir,  `${subFileName}${subFileExtName}`, false, index);
    } else {
        subtitleGroup = createInputGroup('', '', true, index);
    }

    currentTask.appendChild(videoGroup);
    currentTask.appendChild(subtitleGroup);

    uniqueTaskBlock.appendChild(currentTask);
    uniqueTaskBlock.appendChild(uniqueTaskButton);
    uiContainer.push(uniqueTaskBlock);
    document.getElementById('taskContainer').appendChild(uniqueTaskBlock);

}
ipcRenderer.on('update-tasks', (event, tasks) => {
    // addTask(filePath, index);
    for(var i = 0 ; i < uiContainer.length; i++){
        uiContainer[i].remove();
        // uiContainer.splice(i, 1);
    }
    for(var i = 0 ; i < tasks.length; i++){
        addTask(tasks[i].videoFile,tasks[i].subFile, i);
    }
});

ipcRenderer.on('task-finish', (event, index) => {
    var test = uiContainer[index];
    test;
    uiContainer[index].style.backgroundColor = 'green';
});

document.getElementById('selectByFolder').addEventListener('click', async () => {
    await ipcRenderer.invoke('dialog:selectFolder');
});

document.getElementById('addTasks').addEventListener('click', async () =>{
    await ipcRenderer.invoke('dialog:selectFile');
});

document.getElementById('clearAll').addEventListener('click', async() => {
    await ipcRenderer.invoke('clearAll');
});

// run task
document.getElementById('runButton').addEventListener('click', async () => {
    await ipcRenderer.invoke('runTasks');
    // for(var i = 0; i < tasks.length; i++) {
    //     console.log('current_video : ', tasks[i].video);
    //     console.log('current_subtitle : ', tasks[i].subtitle);
    //     console.log('finished !!');
    //     // tasks[i].setFinish();
    //     tasks[i].isFinished = true;
    //     await ipcRenderer.invoke('containerUpdate');
    //     console.log('---------------------------------------------------------------------');
    // }

    // getAllTask();
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

