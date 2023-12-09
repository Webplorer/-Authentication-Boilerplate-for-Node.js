import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import passport from "passport";


const LocalStrategy = Strategy;


export default function (passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' }, (email, password, done) => {
                User.findOne({ email: email })
                    .then(user => {
                        if (!user) {
                            return done(null, false, 'That email is not registered');
                        }

                        // match the password
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (err) throw err;

                            if (isMatch) {
                                return done(null, user);
                            } else {
                                return done(null, false, 'Password Incorrect');
                            }
                        });
                    })
                    .catch(err => console.log(err));

            }

        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })


    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
    

};

export const passportInstance = passport;
