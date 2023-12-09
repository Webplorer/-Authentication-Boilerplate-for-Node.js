import { Router } from "express";
import { ensureAuthenticated } from "../config/auth.js";

const router = Router();
 //Welcome page 
router.get('/', (req,res) => {
    res.render('welcom');
});


router.get('/dashboard', ensureAuthenticated, (req,res) => {
    res.render('dashboard', {
        user : req.user
    });
});



export default router;