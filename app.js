const express = require('express')
const app = express()
const port = 3000
const mongoDB = "mongodb://127.0.0.1:27017/testdb";
const mongoose = require("mongoose");
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { check, validationResult } = require('express-validator');
const Todo = require('./models/todo.js');
const path = require('path');
dotenv.config();

var indexRouter = require('./routes/index');

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
};

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        console.log("Passport user")
        const user = await User.findOne({email: jwt_payload.email})
        if (user) {
            console.log("Passport Found User")
            return done(null, user);
        } else {
            console.log("Passport NOT User")
            return done(null, false);
        }
    } catch (error) {
        console.log("Passport ERROR")
        return done(error, false);
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once('open', async () => {
    console.log('Connected to MongoDB');
});

app.use(passport.initialize());

app.use('/', indexRouter);

app.listen(port, () => {
    console.log("Server is up and running at http://localhost:" + port)
})
