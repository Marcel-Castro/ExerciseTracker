const router = require('express').Router()
let User = require('../models/user.model')

// Get all users
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err))
})

// Get specific user
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/add').post((req, res) => {
    const email = req.body.email
    const password = req.body.password
    const displayName = req.body.displayName

    const newUser = new User({
        email,
        password,
        displayName
    })

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update/:id').post((req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user.email = req.body.email,
            user.password = req.body.password
            user.displayName = req.body.displayName

            user.save()
                .then(() => res.json('User updated!'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router