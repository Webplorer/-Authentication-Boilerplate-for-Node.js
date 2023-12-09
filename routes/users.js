import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import passport from "passport";


// User Model




const router = Router();

//Login Page

router.get('/login', (req, res) => {
    res.render('login');
})
//Register page 

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    // Check required feild 
    if (!name || !email || !password || !password2) {
        errors.push({ msj: 'Please fill all the feilds ' });
    }

    // Check Password 

    if (password != password2) {
        errors.push({ msj: 'Password dont match ' });
    }

    // Check Password Length
    if (password.length < 6) {
        errors.push({ msj: 'Password should be at least 6 Characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });

    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({ msj: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    bcrypt.hash(password, 10, (err, hashedPassword) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            const newUser = new User({
                                name,
                                email,
                                password : hashedPassword
                            });
                            

                            // Save the user to MongoDB
                            newUser.save()
                                .then(() => {
                                    req.flash('success_msg','your now registerd and can login')
                                    res.redirect('/users/login');
                                })
                                .catch(error => {
                                    console.error(error);
                                    res.status(500).send('Internal Server Error');
                                });
                        }

                    });
                }
            });
    }


});

// Creating post login reqest router ..

router.post("/login" , (req , res ,next) => {
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req, res , next);


});


// logout handel

router.get('/logout' , (req, res) => {
    req.logout(function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
});


export default router;