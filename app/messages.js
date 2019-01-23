import express from "express";
import nanoid from  "nanoid";
import multer from "multer";
import path from "path";

import fsDemo from "../fsDemo";
import config from "../config";

const  storage = multer.diskStorage({
    destination(req,file,cd){
        cd(null, config.uploadPath)
    },
    filename(req,file,cd){
        cd(null,nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage});

const  router = express.Router();

router.get("/", (req, res) => {
    if(!req.query.datatime){
        fsDemo.readFileAll(()=>{res.send(fsDemo.data);
        fsDemo.data = [];
        })
    }else{
        let now = new Date(req.query.datatime);
        if(isNaN(now.getDate())){
            res.status(400).send({error: "Time have bad format"})
        }
        else{
            fsDemo.readFileAll(()=>{res.send(fsDemo.data);
            }, now.toISOString());
            fsDemo.data = [];
        }
    }
});

router.post("/",upload.single("image"),(req, res) => {
    if(req.body.message === "" || req.body.message === undefined){
        res.status(400).send({error: "Author and message must be present in request"});
        return;
    }
    const product = req.body;
    if (req.file) product.image = req.file.filename;
    req.body.id = nanoid(10);
    req.body.datetime = new Date();
    fsDemo.addItem(req.body);
    fsDemo.saveData(()=>res.send({ok: product}),req.body.datetime.toISOString());
    fsDemo.data = [];  //обнуляем data один файл одна запись
});

export default router;