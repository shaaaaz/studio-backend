const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : String,
    username : String,
    password : String,
    profilePic : String,
    watchlist : Array,
    liked : Array,
    watched : Array,
    bio : String,
    favourites : {
        movies : Array,
        actors : Array,
        directors : Array,
        tvshow : Array
    },
    backdrop : Object,
    googleId : String,
    tv : {
        watchlist : Array,
        watched : Array,
        liked : Array,
    },
    recs : {
        incoming : [
            {
                from : Object,
                data : Object,
                message : String
            }
        ],
        outgoing : [
            {
                to : Object,
                data : Object,
                message : String
            }
        ]
    },
    tvrecs : {
        incoming : [
            {
                from : Object,
                data : Object,  
                message : String
            }
        ],
        outgoing : [
            {
                to : Object,
                data : Object,
                message : String
            }
        ]
    },
    followers : Array,
    following : Array,
    lists : {
        movies : [{
            createdBy : {
                name  :String,
                username : String,
                id : String,
                profilePic : String
            },
            content : Array,
            title : String,
            description : String
        }],
        tvshows : [{
            createdBy : {
                name  :String,
                username : String,
                id : String,
                profilePic : String
            },
            content : Array,
            title : String,
            description : String
        }],
        cast  : [{
            createdBy : {
                name  :String,
                username : String,
                id : String,
                profilePic : String
            },
            content : Array,
            title : String,
            description : String
        }]
    }
})

const userModel = mongoose.model("user",userSchema)

module.exports = userModel