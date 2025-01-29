// const fs = require('fs');


export function createFileInputGroup(){
    const group = document.createElement('div');
    group.style.display = 'flex';
    group.style.flexDirection = 'row';
    group.style.gap = '3px';
    group.style.padding = '20px';
    group.style.border = '1px solid #ccc';
    group.style.borderRadius = '10px';

    const inputText = document.createElement('input');
    const selectButton = document.createElement('button').addEventListener('click', async () => {
        const folderPath = await ipcRenderer.invoke('dialog:selectFolder');
        if(folderPath && folderPath.length > 0){
            console.log(folderPath[0]);
            inputText.value = folderPath[0];
        } else {
            console.log('nothing');
        }
    });

    group.appendChild(input);
    group.appendChild(selectButton);

    return group;
}