import fs from "fs";
const path = "./messages/";

export default {
    data: [],
    readFileAll(callback,isodata){
            if(!isodata){
                fs.readdir(path, (err, files) => {
                    if (err) {
                        throw err;
                    }
                    let control=0;
                    let file = [];
                    let thirtyFiles = files.reverse();
                    for(let i=0; i<30; i++) {
                        file.push(thirtyFiles[i]);
                    }
                    file.sort((a,b) => (a > b) ? 1 : ((b> a) ? -1 : 0));
                    file.forEach(file => {
                        fs.readFile(path + file, "utf8", (err, res) => {
                            if (err) {
                                throw err;
                            }
                            this.data.push(JSON.parse(res)[0]);
                            ++control;
                            if (control === 30) {  //читаем 30 файлов
                                callback();
                            }
                        });
                    });
                });
            }else{
                fs.readdir(path, (err, files) => {
                    if (err) {
                        throw err;
                    }
                    let control=0;
                    let filebyData = [];
                    let dateFiles = files.reverse();
                    for(let i=0; i<dateFiles.length; i++) {
                        if(Date.parse(dateFiles[i].split('.t')[0]) > Date.parse(isodata)){
                            filebyData.push(dateFiles[i]);
                        }else{
                            i=dateFiles.length;
                        }
                    }
                    filebyData.sort((a,b) => (a > b) ? 1 : ((b> a) ? -1 : 0));
                    if(filebyData[0] != null){
                        filebyData.forEach(file => {
                            fs.readFile(path + file, "utf8", (err, res) => {
                                if (err) {
                                    throw err;
                                }
                                this.data.push(JSON.parse(res)[0]);
                                ++control;
                                if (control === filebyData.length) {
                                    callback();
                                }
                            });
                        });
                    }else {
                        this.data = [];
                        callback();
                    }
                });
            }
    },
    addItem(item){
        this.data.push(item);
    },
    saveData(callback){
        let now = new Date();
        fs.writeFile(path + now.toISOString() + ".txt", JSON.stringify(this.data), err => {
            if (err) throw err;
        });
        callback();
    }
};