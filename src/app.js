
import express from 'express';
import { connection } from './module/db/db.js';
import authRouter from './module/auth/controller.js'
import bodyParser from 'body-parser';

const PORT=3000;
const HOSTNAME='localhost'

const app = express();
app.use(bodyParser.json())

connection();

app.get('/', (req, res)=>{
    res.json({
        message: "api is running."
    })
})

app.use(authRouter)


app.listen(PORT,HOSTNAME,()=>{
    console.log("Server is running on PORT", PORT);
})
