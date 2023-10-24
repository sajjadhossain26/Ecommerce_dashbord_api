import multer from 'multer'

const storage = multer.diskStorage({
  
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    },

    destination: function (req, file, cb) {
        cb(null, '/tmp/my-uploads')
      },
  })
  
 export const photoMulter = multer({storage}).array('students', 10)

 export default storage