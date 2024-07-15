const dataUriParser = require('dataUri');
const path = require("path")

const getDataUri = (file)=>{
    const parser = new dataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
}

// const getDataUri = (file) => {
//     return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
// };

console.log(getDataUri);
