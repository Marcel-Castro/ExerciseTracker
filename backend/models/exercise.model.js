const mongoose = require('mongoose')
const Schema = mongoose.Schema

const setSchema = new Schema({
    reps: { type: Number, required: true },
    intensity: { type: String, required: true },
    rpe: { type: Number, min: 1, max: 10},
    showRPE: {type: Boolean, default: false}
})

const exerciseSchema = new Schema({
    userID: { type: String, required: true },
    exerciseName : {
        type: String,
        trim: true,
        required: true
    },
    notes: { type: String },
    sets: [setSchema],
    date: { type: Date, default: Date.now}
}, {
    timestamps: true
})

const Exercise = mongoose.model('Exercise', exerciseSchema)
module.exports = Exercise