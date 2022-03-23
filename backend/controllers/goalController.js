const asyncHandler = require('express-async-handler')
// const colors = require('colors')  // this is proved to be not required to display colors in sub files of server.js

const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc   Get Goals
// @route  GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
    // console.log(`${req.user.id}`.yellow.underline)
    // const goals = await Goal.find()
    const goals = await Goal.find({user: req.user.id})  // now we want to only return the current users goals , not all the goals created by all the users

    // res.status(200).json({message: 'Get Goals'})
    res.status(200).json(goals)
})

// @desc   Set Goal
// @route  POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
    // console.log(`${req.user.id}`.yellow.underline)
    
    if(!req.body.text){
        // res.status(400).json({message: 'please add a text field'})
        res.status(400)
        throw new Error('please send a text field')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })

    // res.status(200).json({message: 'Create new Goal'})
    res.status(200).json(goal)
})

// @desc   Update Goal
// @route  PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
    // console.log(`${req.user.id}`.yellow.underline)

    const goal = await Goal.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    // const user = await User.findById(req.user.id)

    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // users should not be able to update each others goals
    // make sure the logged in user matches the goal user
    if(goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true})

    // res.status(200).json({message: `Update goal ${req.params.id}`})
    res.status(200).json(updatedGoal)
})

// @desc   Delete Goal
// @route  GET /api/goal/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    // const user = await User.findById(req.user.id)

    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // users should not be able to update each others goals
    // make sure the logged in user matches the goal user
    if(goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }
    await goal.remove()

    // res.status(200).json({message: `Delete goal ${req.params.id}`})
    res.status(200).json({id: req.params.id})
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}