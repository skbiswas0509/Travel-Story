const multer = require("multer")
const path = require("path")

//storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "./uploads/"); //destination folder for sharing uploaded files
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname)); //uniquefilename
    }
})

//file filter to accept only images
const filefilter = (req, res, cb)=>{
    if(file.mimetype.startswith("images/")){
        cb(null, true)
    }else{
        cb(new Error("Only image files are allowed"))
    }
}

//initialize multer instance
const upload = multer({storage, filefilter});

module.exports = upload;