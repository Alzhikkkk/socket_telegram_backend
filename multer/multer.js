const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
      cb(null, '../frontend/src/img/avatar')
    },
    filename: function (req, file, cb) {
       const filename = file.originalname;
       let fileExt = filename.split(".")
       fileExt = fileExt[fileExt.length - 1];
    
      const uniqueSuffix = Date.now() + '.' + fileExt; 
      cb(null, uniqueSuffix)
    }
  })

const upload = multer({storage})

module.exports = {upload}