const express = require('express')
var router = express.Router();
const User = require('../models/user.js');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const Todo = require('../models/todo.js');
router.use(express.json())
dotenv.config();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login.html', (req, res, next) => {
  res.render('login');
});

router.get('/register.html', (req, res, next) => {
  res.render('register');
});

router.post('/addTodos', async (req, res) => {
    console.log("Adding todos")
    try {
        const newTodo = req.body.data.todo;
        const email = req.body.data.email;
        const user = await User.findOne({ email });
        const existingTodos = await Todo.findOne({ user });
        
        if(existingTodos) {
            console.log("Existing todos");
            existingTodos.items.push(newTodo);
            await existingTodos.save();
            console.log("Existing todos saved");
            return res.json({success: true, todo: existingTodos})
        } else {
            console.log("New todos");
            const newTodos = new Todo({ user, items: newTodo });
            await newTodos.save();
            return res.json({success: true, todo: newTodos})
        }
    } catch {
        return res.status(500).json("An error has occurred")
    }  
});

router.post('/email', (req, res, next) => {
    const token =  req.body.token;
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const userEmail = decoded.email;
        return res.json(userEmail)
    } catch (error) {
    console.error("Error decoding JWT token:", error.message);
    }
});

router.post('/login.html', async (req, res) => {
    console.log("logging in")
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: 'Invalid credentials' });
        } else {
            console.log("User found")

            try {
                if (await bcrypt.compare(password, user.password)) {
                    console.log("password matched")
                    const token = jwt.sign({id: user._id, email: user.email }, process.env.SECRET, { expiresIn: '1h' }); 
                    return res.json({success: true, token: token });
                } else {
                    console.log("Invalid credentials");
                    return res.status(403).json({ message: 'Invalid credentials' });
                }
            } catch {
                return res.status(404).json("An error has occurred")
            }
        }
    } catch {
        return res.status(500).json("An error has occurred")
    }    
});

router.post('/register.html', [
    check('email').isEmail(),
    check('password').isStrongPassword().withMessage("Password is not strong enough"),
    ], async (req, res) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Password is not strong enough" });
    }

    console.log("registering")
    try {
        const email = req.body.email;
        const password = req.body.password;
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const newUser = new User({success: false, email, password });
        await newUser.save();
        return res.json({success: true, token: "nam"});
    } catch {
        return res.status(500).json({ success: false, error: 'An error occurred' })
    }    
});

module.exports = router;
