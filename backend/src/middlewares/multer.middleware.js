import multer from 'multer';

const storage = multer.diskStorage({
  // 1. Destination: Where to save the file
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },

  // 2. Filename: What to call the file
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({
    storage: storage,
})

export {upload};