import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js'
import permisionRouter from './routes/permission.js'
import roleRouter from './routes/role.js'
import mongoDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'


// express init
const app = express()

// dotenv config and init
dotenv.config()
const PORT = process.env.SERVER_PORT || 5000

// static folder
app.use(express.static("public"))

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))

// router setup
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/permission', permisionRouter)
app.use('/api/role', roleRouter)

//custom error handler
app.use(errorHandler)

app.listen(PORT, ()=> {
    mongoDB()
    console.log(`Server is running on port ${PORT}`.bgGreen.black);
})