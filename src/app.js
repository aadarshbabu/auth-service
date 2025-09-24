
import express from 'express';
import { closeConnection, connection } from './module/db/db.js';
import authRouter from './module/auth/controller.js'
import bodyParser from 'body-parser';
import { MongooseError } from 'mongoose';

    const app = express();
    app.use(bodyParser.json())

    app.get('/', (req, res)=>{
        res.json({
            message: "api is running."
        })
    })
    app.use(authRouter)


    const start = async () => {
        try {
            await connection()
            const port = process.env.PORT || 3000
            app.listen(port, () => console.log(`Server listening on ${port}`))
        } catch (err) {
            if(err instanceof MongooseError){
                console.error('Failed to start app due to DB error', err)
            }else{
                await closeConnection()
            }
            process.exit(1)
        }
    }

start()
