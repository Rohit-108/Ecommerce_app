const dataUriParser = require('dataUri');
const path = require("path")

const getDataUri = (file)=>{
    const parser = new dataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
}

console.log(getDataUri);
