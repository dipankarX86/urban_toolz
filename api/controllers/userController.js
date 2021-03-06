const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

// @desc   Register new user
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body  // remember this? js array and object 'DEStructuring'

    // validate the input
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // check if the user exists
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    // Now Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // and finally now create the user into the database
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('User creation fdailed, Invalid user data')
    }
    // res.json({message: 'register user'})
})

// @desc   Authenticate an user
// @route  POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const {email, password} = req.body
    
    // find the user for the email
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('User login fdailed, Invalid credentials')
    }
    // res.json({message: 'Login user'})
})

// @desc   Get user data
// @route  GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    // res.json({message: 'User data'})
    // const {_id, name, email} = await User.findById(req.user.id)  // this is not really required to do, bec it is already done inside auth middleware
    // res.status(200).json({
    //     id: _id,
    //     name,
    //     email
    // })

    res.status(200).json(req.user)
})

// Generate a token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '30d'})  // this jubble will create the jwt web token
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}