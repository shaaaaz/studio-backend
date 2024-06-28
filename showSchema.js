const mongoose = require("mongoose")

const showSchema = mongoose.Schema({
    animated : Array,
    horror : Array,
    action : Array,
    drama : Array,
    sitcoms : Array,
    comedy : Array,
    scifi : Array,
    random : Array,
    user : String
})

const showModel = mongoose.model("tvshow",showSchema)

module.exports = showModel