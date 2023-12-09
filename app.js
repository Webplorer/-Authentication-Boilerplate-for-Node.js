import express from "express";
import indexRoute from "./routes/index.js";
import expressEjsLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import { mongoURI } from "./config/keys.js";
import userRoute from "./routes/users.js";
import flash from "connect-flash";
import session from "express-session";
import customPassport, { passportInstance } from "./config/passport.js";


const app = express();
const port = process.env.PORT || 3000;


// DB Config
mongoose.connect(mongoURI);

// Connect to MongoDB
mongoose.connection
  .once('open', () => console.log('MongoDB connected ...'))
  .on('error', (error) => console.log('Error connecting to MongoDB:', error));

// EJS

app.use(expressEjsLayouts);
app.set('view engine', 'ejs');

// bodyParser

// Middleware to parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }));

// Express Session 
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,

}));

// Passport middleware 
customPassport(passportInstance);
app.use(passportInstance.initialize());
app.use(passportInstance.session());

//Connect flash

app.use(flash());

//Global Vars 
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  next();
});


//Routes
app.use("/", indexRoute);
app.use("/users", userRoute);



app.listen(port, () => {
  console.log(`Starting Server in port ${port}`);
});