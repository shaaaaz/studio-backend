const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
    thriller : Array,
    comedy : Array,
    horror : Array,
    action : Array,
    animated : Array,
    romcom : Array,
    scifi : Array,
    crime : Array,
    sports : Array,
    random : Array,
    user : String,
    unique : [Object]
})

const movieModel = mongoose.model("recommendation",movieSchema)

module.exports = movieModel