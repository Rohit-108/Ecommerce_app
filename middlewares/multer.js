// const multer = require('multer')

// const storage = multer.memoryStorage()
// const singleUpload = multer({storage:storage}).single("file");


const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const singleUpload = (req, res, next) => {
        upload.single("file")(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                        return res.status(400).json({ message: "File upload error" });
                    } else if (err) {
                            return res.status(500).json({ message: "Server error" });
                        }
                        next();
                    });
                };
                
module.exports = singleUpload;