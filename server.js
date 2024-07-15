const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary');
const bodyParser = require('body-parser')

// dot env config
dotenv.config();

// database connect
connectDB();

// cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

// rest object
const app = express();

// middleware
app.use(morgan('dev'));
app.use(express.json(),bodyParser.urlencoded({extended:true}))
app.use(cors());
app.use(cookieParser());



// route
const testRoutes = require('./routes/testRoutes');
const userRoutes = require('./routes/userRoutes');


app.use('/api/v1', testRoutes);
app.use('/api/v1/user', userRoutes);



app.get('/', (req, res) => {
    return res.status(200).send('Hello World');
});


// port
const PORT = process.env.PORT || 3000;

// listen
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT} on ${process.env.NODE_ENV}`.bgMagenta.white);
});
