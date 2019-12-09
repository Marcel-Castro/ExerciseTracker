const router = require('express').Router()
let Exercise = require('../models/exercise.model')

// Get all exercises for a user
router.route('/byUser/:id').get((req, res) => {
    Exercise.find({userID: req.params.id})
        .then(exercises => res.json(exercises))
        .catch(err => res.status(400).json('Error: ' + err))
})

// Get ONE specific exercise by it's id
router.route('/:id').get((req, res) => {
    Exercise.findById(req.params.id)
        .then(exercises => res.json(exercises))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/add').post((req, res) => {
    const userID = req.body.userID
    const exerciseName = req.body.exerciseName
    const notes = req.body.notes
    const sets = req.body.sets
    const date = req.body.date

    const newExercise = new Exercise({
        userID,
        exerciseName,
        notes,
        sets,
        date
    })

    newExercise.save()
        .then(() => res.json('Exercise added!'))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update/:id').post((req, res) => {
    Exercise.findById(req.params.id)
        .then(exercise => {
            if (req.body.exerciseName !== undefined)
            {
                exercise.exerciseName = req.body.exerciseName
            }
            if (req.body.notes !== undefined)
            {
                exercise.notes = req.body.notes
            }
            if (req.body.sets !== undefined)
            {
                exercise.sets = req.body.sets
            }
            if (req.body.date !== undefined)
            {
                exercise.date = req.body.date
            }

            exercise.save()
                .then(() => res.json('Exercise updated!'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:id').delete((req, res) => {
    Exercise.findByIdAndDelete(req.params.id)
        .then(() => res.json('Exercise deleted.'))
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router