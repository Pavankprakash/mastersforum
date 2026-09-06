const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();


const port = process.env.PORT

require('./db')

const allowedOrigins = [process.env.FRONTEND_URL]; // Add more origins as needed

app.use(
    cors({
        origin: function (origin, callback){
            if(!origin || allowedOrigins.includes(origin)){
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow cookies to be sent
    })
);

app.use(bodyParser.json());
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes')
const classroomRoutes =require('./routes/classroomRoutes')

app.use('/auth', authRoutes);
app.use('/classrooms', classroomRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/getuserdata', (req, res) => {
    res.send('harshith kumar, 25, male')
})

app.listen(port, () => {
    console.log(`Mastergang backend app listening on port ${port}`)
})