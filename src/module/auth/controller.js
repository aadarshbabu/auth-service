
import { Router } from "express";
import {login, userRegistration} from './service.js'

const router = Router();


router.post('/register', (req, res)=>{

    try {
        userRegistration(req,res)
    } catch (error) {
        res.status(500).json({message: error.message})
    }

})


router.post('/login', async(req, res)=>{
    
    try {
        const payload =  req.body;
       const userRes =  await login(payload);
        res.status(userRes.status).json(userRes)
    } catch (error) {
         res.status(500).json({message: error.message})
    }

})




export default router
