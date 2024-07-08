// file upload using multer

const multer=require('multer')
const fs=require('fs')
const path=require('path')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        let fileDestination='public/uploads/'
        // check if directory exists
        if(!fs.existsSync(fileDestination)){
            fs.mkdirSync(fileDestination,{recursive:true})
            cb(null,fileDestination)
        }
        else{
            cb(null,fileDestination)
        }
    },
    filename:(req,file,cb)=>{
        let filename=path.basename(file.originalname,path.extname(file.originalname))
        //  filename only gives the name of file
        // eg,   path.basename('images/foo/abc.jpg',.jpg)
        // filename is abc

        let ext=path.extname(file.originalname)
        // ext gives the extension 
        // .jpg
        cb(null,filename+'_'+Date.now()+ext)
        // Date.now() generate random different number every second

    }
})

  let imageFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|png|jpeg|svg|jfif|gif|JPG|PNG|JPEG|SVG|JFIF|GIF)$/))
        {
            return cb(new Error('You can upload image file only'),false)
        }
        else{
            cb(null,true)
        }
    }

    const upload=multer({
        storage:storage,
        fileFilter:imageFilter,
        limits:{
            fileSize:3000000 //3MB
        }
    })
    module.exports=upload