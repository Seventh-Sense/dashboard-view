const fs = require('fs');
const path = require('path');
const liblinkinfo = require('./liblinkinfo.cjs');
sourceList = liblinkinfo.sourceList;
destinationList = liblinkinfo.destinationList;

destinationList.forEach((destination, idx) => {
    Promise.all([checkDirExists(sourceList[idx]), checkDirExists(destination)]).then(([sourceExists, destinationExists]) => {
        if (sourceExists) {
            if(destinationExists){
                console.log('about to delete node_modules: ' + destination);
                deleteDirPromise(destination).then(()=>{
                    console.log('deleted node_modules: ' + destination);
                    createLink(path.resolve(sourceList[idx]), path.resolve(destination));
                });
            }else{
                createLink(path.resolve(sourceList[idx]), path.resolve(destination));
            }
        }else{
            console.log(sourceList[idx] + ' not exists');
        }
    });
    function createLink(src, dest){
        fs.symlinkSync(src, dest, 'junction');
        console.log(`${dest} linked to ${src}`);
    }
});

function checkDirExists(dirPath){
    return new Promise((resolve)=>{
        fs.stat(dirPath, (err, stats) => {
            if(err){
                resolve(false);
            }else{
                resolve(stats.isDirectory());
            }
        });
    });
}

function deleteDirPromise(path){
    return new Promise((resolve)=>{
        fs.rm(path, { recursive: true }, (err) => {
            resolve();
        });
    })
}

