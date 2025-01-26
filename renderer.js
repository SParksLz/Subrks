// const { ipcRenderer } = require('electron')

const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');
const ffmpeg = require('fluent-ffmpeg');


document.getElementById('videoSelectFolderButton').addEventListener('click', async () => {
    const folderPath = await ipcRenderer.invoke('dialog:selectFolder');
    if(folderPath && folderPath.length > 0){
        console.log(folderPath[0]);
        document.getElementById('videoPath').value = folderPath[0];
    }else{
        console.log('nothing');
    }
});
document.getElementById('subtitleSelectFolderButton').addEventListener('click', async () => {
    const folderPath = await ipcRenderer.invoke('dialog:selectFolder');
    if(folderPath && folderPath.length > 0){
        document.getElementById('subtitlePath').value = folderPath[0];
    } else {
        console.log('nothing');
    }
});

// run task
document.getElementById('runButton').addEventListener('click', async () => {
    var videoFilePath = document.getElementById('videoPath').value;
    var subtitleFilePath = document.getElementById('subtitlePath').value;

    var videoFileExtName = path.extname(videoFilePath);
    var videoFileName = path.basename(videoFilePath, videoFileExtName);
    var videoDir = path.dirname(videoFilePath);



    var subtitleFileExtName = path.extname(subtitleFilePath);
    var subtitleFileName = path.basename(subtitleFilePath, subtitleFileExtName);
    var subtitleDir = path.dirname(subtitleFilePath);

    var outputDir = path.join(videoDir, 'output');
    // let outputName = '${videoFileName}_Test${videoFileExtName}';
    var outputName = `${videoFileName}_Test${videoFileExtName}`;
    var outputFullPath = path.join(outputDir, outputName);
    console.log(videoFilePath);
    console.log(subtitleFilePath);
    console.log(outputFullPath);

    if(!fs.existsSync(outputDir))
    {
        fs.mkdirSync(outputDir, { recursive: true });
    } else {
        console.log('Output Folder exists ')
    }
    // ffmpeg -i backup.mkv -i sub_chen.ass -codec copy -map 0 -map 1 output_aaa.mkv
    console.log('StartRendering');
    ffmpeg(videoFilePath)
        .input(subtitleFilePath)
        .outputOptions('-c:s', 'srt')
        .outputOptions('-map', '0')
        .outputOptions('-map', '1')
        .on('stdout', (stdout) => {
            console.log(stdout);
        })
        .on('end', () => {
            console.log('soft subtitle added successfully');
        })
        .on('error', (err) => {
            console.error('Error occurred', err.message);
        })
        .save(outputFullPath);



});

