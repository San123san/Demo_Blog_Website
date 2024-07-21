import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: 'https://demo-blog-website-dwt4.onrender.com',
    credentials: true
}))

app.use(express.json({limit: "16kb"}))   //data take when fill form in the format of json
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// routes import
import userRouter  from './routes/users.routes.js'
import uploadRouter  from './routes/cardCreateEditDelete.routes.js';
import shareRouter from './routes/cardShare.routes.js'
import totalRouter from './routes/totalCount.routes.js'

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/upload", uploadRouter)
app.use("/api/v1/share", shareRouter)
app.use("/api/v1/total", totalRouter)

export {app}
