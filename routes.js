const express = require('express')
const router = express.Router()

router.use(express.json())

const userModel = require('./userSchema')
const movieModel = require('./moviesSchema')
const showModel = require('./showSchema')

const jwt = require('jsonwebtoken')

router.get('/users', async (req, res) => {
    try {
        const test = await userModel.find({})
        res.send(test)
        console.log(test)
    }
    catch (err) {
        console.log("USER ERROR", err)
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await userModel.findOne({ username, password })
        if (!user) {
            return res.status(201).json({ error: 'Invalid username or password' });
        } else {
            return res.status(200).json(user);
        }
    }
    catch (err) {
        console.log("Internal server Error")
        return res.status(401).json({ error: 'Internal Server Error' });
    }
})

router.post('/newUser', async (req, res) => {
    try {
        const data = await userModel.create(req.body)
        console.log(data)
        res.send(data)
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/userExists', async (req, res) => {
    try {
        console.log("REQ BODY", req.body)
        const user = await userModel.findOne({ "username": req.body.username })
        if (!user) {
            return res.status(200).json({ error: 'No Username Exists' });
        } else {
            console.log(user);
            return res.status(201).json({ success: true, message: 'username Exists' });
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/addToWatchlist/:id', async (req, res) => {
    const { id } = req.params
    const movie = req.body

    const user = await userModel.findById(id)
    if(user){
        if (user.watchlist == null) {
            user.watchlist = [];
        }
        const isMoviePresent = user.watchlist.find(item => item.id == movie.id)
        
        if (isMoviePresent) {
            const newWatchlist = user.watchlist.filter(item => item.id != movie.id)
            user.watchlist = newWatchlist
            await user.save()
            return res.status(201).json({ "Status": "Movie removed" })
        }
        else {
            try {
                user.watchlist.push(movie)
                await user.save()
                res.status(200).json(movie)
            }
            catch (err) {
                console.log(err)
            }
        }
    }
    else{
        console.log("no user")
    }
    })
    
router.post('/addToLiked/:id', async (req, res) => {
    const { id } = req.params
    const movie = req.body

    const user = await userModel.findById(id)
    if (user.liked != []) {

        const isMoviePresent = user.liked.find(item => item.id == movie.id)
        if (isMoviePresent) {
            const newliked = user.liked.filter(item => item.id != movie.id)
            user.liked = newliked
            await user.save()
            return res.status(201).json({ "Status": "Movie removed" })
        }
        else {
            try {
                user.liked.push(movie)
                await user.save()
                res.status(200).json(movie)
            }
            catch (err) {
                console.log(err)
            }
        }
    }
    else {
        user.liked.push(movie)
        await user.save()
        res.status(200).json(movie)
    }
})

router.post('/addToWatched/:id', async (req, res) => {
    const { id } = req.params
    const movie = req.body

    const user = await userModel.findById(id)
    if (user.watched != []) {

        const isMoviePresent = user.watched.find(item => item.id == movie.id)
        if (isMoviePresent) {
            const newwatched = user.watched.filter(item => item.id != movie.id)
            user.watched = newwatched
            await user.save()
            console.log(user.watched)
            return res.status(201).json({ "Status": "Movie removed" })
        }
        else {
            try {
                user.watched.push(movie)
                await user.save()
                res.status(200).json(movie)
            }
            catch (err) {
                console.log(err)
            }
        }
    }
    else {
        try {
            user.watched.push(movie)
            await user.save()
            res.status(200).json(movie)
        }
        catch (err) {
            console.log(err)
        }
    }
})

router.get('/movies', async (req, res) => {
    try {
        const test = await movieModel.find({})
        res.send(test)
        console.log(test)
    }
    catch (err) {
        console.log("USER ERROR", err)
    }
})

// router.post('/add',async(req,res) => {
//     try{
//         const user = await movieModel.findOne({"user":"admin"})

//         user.random = user.unique

//         await user.save()
//         console.log(user.unique.length)
//         res.status(200).json(req.body)
//     }
//     catch(err){
//         console.log(err)
//     }id
// })

router.post('/isInWatchlist/:id', async (req, res) => {
    const { id } = req.params
    const movie = req.body

    const user = await userModel.findById(id)
    const isMoviePresent = user.watchlist.find(item => item.id === movie.id)

    if (isMoviePresent) {
        return res.status(200).json("Movie is in Watchlist")
    }
    else {
        return res.status(201).json("Movie is not in Watchlist")
    }
})

router.post('/isInLiked/:id', async (req, res) => {
    const { id } = req.params
    const movie = req.body

    const user = await userModel.findById(id)
    const isMoviePresent = user.liked.find(item => item.id === movie.id)

    if (isMoviePresent) {
        return res.status(200).json("Movie is in Liked")
    }
    else {
        return res.status(201).json("Movie is not in Liked")
    }
})

router.post('/isInWatched/:id', async (req, res) => {
    const { id } = req.params
    const movie = req.body

    const user = await userModel.findById(id)
    const isMoviePresent = user.watched.find(item => item.id === movie.id)

    if (isMoviePresent) {
        return res.status(200).json("Movie is in Watched")
    }
    else {
        return res.status(201).json("Movie is not in Watched")
    }
})

router.get('/user/:username', async (req, res) => {
    const username = req.params.username

    try {
        const user = await userModel.findOne({ username })
        if (user) {
            return res.send(user)
        }
        return res.json("User not found")
    }
    catch (err) {
        console.log(err)
    }

})

router.post('/profileUpdate/:id', async (req, res) => {
    const { id } = req.params
    const imageLink = req.body.imageLink

    try {
        const user = await userModel.findById(id)
        if (user) {
            user.profilePic = imageLink
            await user.save()
        }
        else {
            res.status(400).json("user does not exist")
        }
    }
    catch (err) {
        console.log(err)
    }

})

router.post('/removeFromFavMovies/:username', async (req, res) => {
    const { username } = req.params
    const movie = req.body

    const user = await userModel.findOne({ username })
    const newwatched = user.favourites.movies.filter(item => item.id != movie.id)
    user.favourites.movies = newwatched
    await user.save()
    return res.status(201).json({ "Status": "Movie removed" })
})

router.post('/pushToFav/:username', async (req, res) => {
    const { username } = req.params
    const movie = req.body

    const user = await userModel.findOne({ username })
    try {
        user.favourites.movies.push(movie)
        await user.save()
        res.status(200).json(movie)
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/pushTVShow/:username', async (req, res) => {
    const { username } = req.params
    const movie = req.body

    const user = await userModel.findOne({ username })
    try {
        user.favourites.tvshow.push(movie)
        await user.save()
        res.status(200).json(movie)
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/removeTVShow/:username', async (req, res) => {
    const { username } = req.params
    const show = req.body

    const user = await userModel.findOne({ username })
    const newwatched = user.favourites.tvshow.filter(item => item.id != show.id)
    user.favourites.tvshow = newwatched
    await user.save()
    return res.status(201).json({ "Status": "Show removed" })
})

router.post('/pushToFavActors/:username', async (req, res) => {
    const { username } = req.params
    const actor = req.body

    const user = await userModel.findOne({ username })
    try {
        user.favourites.actors.push(actor)
        await user.save()
        res.status(200).json(actor)
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/removeFromFavActors/:username', async (req, res) => {
    const { username } = req.params
    const actors = req.body

    const user = await userModel.findOne({ username })
    const newwatched = user.favourites.actors.filter(item => item.id != actors.id)
    user.favourites.actors = newwatched
    await user.save()
    return res.status(201).json({ "Status": "Actor removed" })
})

router.post('/pushToFavDirectors/:username', async (req, res) => {
    const { username } = req.params
    const directors = req.body

    const user = await userModel.findOne({ username })
    try {
        user.favourites.directors.push(directors)
        await user.save()
        res.status(200).json(directors)
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/removeFromFavDirectors/:username', async (req, res) => {
    const { username } = req.params
    const directors = req.body

    const user = await userModel.findOne({ username })
    const newwatched = user.favourites.directors.filter(item => item.id != directors.id)
    user.favourites.directors = newwatched
    await user.save()
    return res.status(201).json({ "Status": "Actor removed" })
})

router.get('/recs', async (req, res) => {
    try {
        const results = await movieModel.findOne()
        if (results) {
            return res.send(results)
        }
        return res.json("No recommendations")
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/saveUserChanges/:username', async (req, res) => {
    const { username } = req.params
    const info = req.body
    const user = await userModel.findOne({ username })
    try {
        user.name = info.name
        user.bio = info.bio
        user.profilePic = info.profilePic
        await user.save()
        return res.status(201).json({ "Status": "Updated" })
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/backdrop/:id', async (req, res) => {
    const { id } = req.params
    const movie = req.body

    const user = await userModel.findOne({ "_id": id })
    try {
        user.backdrop = movie
        await user.save()
        res.status(200).json(movie)
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/rmBackdrop/:id', async (req, res) => {
    const { id } = req.params

    const user = await userModel.findOne({ "_id": id })
    const newBackdrop = {}
    user.backdrop = newBackdrop
    await user.save()
    return res.status(201).json({ "Status": "Backdrop removed" })
})

router.post('/addToRec', async (req, res) => {
    const movieDetail = req.body
    try {
        const user = await movieModel.findOne({ "user": "admin" })
        const isExisting = user.random.some(item => item.id === movieDetail.id)

        if (!isExisting) {
            user.random.push(movieDetail)
            await user.save()
            res.status(200).json(req.body)
        } else {
            res.status(400).json({ error: "Movie exists" })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/delete/:id', async (req, res) => {
    // user will only be able to delete if he can click on teh button 
    // button will only be visible when user is on his own userpage

    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.id)
        if (!deletedUser) {
            return res.status(400).json({ "Message": "User not found" })
        }
        return res.status(200).json({ "message": "User deleted succesfully" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.get('/tvshows', async (req, res) => {
    try {
        const data = await showModel.findOne()
        if (data) {
            return res.json(data)
        }
        return res.json("No recommendations")
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/googleAuthID', async (req, res) => {
    try {
        const user = await userModel.findOne({ "googleId": req.body.sub })
        if (!user) {
            return res.status(200).json({ error: 'No User Exists, Signup Please' });
        } else {
            console.log(user);
            return res.status(201).json({ success: true, message: 'User Exists, Login Please' });
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/googleAuthLogin', async (req, res) => {
    try {
        const user = await userModel.findOne({ "googleId": req.body.sub })
        if (user) {
            console.log(user);
            return res.status(201).json(user);
        }
        console.log("User not found")
        return res.status(200).json({ success: true, message: 'No user found.' });
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/googleAuthSignup', async (req, res) => {
    try {
        console.log(req.body)
        if (req.body.name && req.body.imageUrl && req.body.googleId) {
            const data = await userModel.create({
                "name": req.body.name,
                "profilePic": req.body.picture,
                "googleId": req.body.sub,
                "username": req.body.name
            })
            if (data) {
                console.log(data)
                return res.status(201).json(data);
            }
            return res.status(200).send("Internal Error")
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.get('/edit', async (req, res) => {
    try {
        let array = await userModel.find({})
        const nArray = array.filter(el => el.googleId != 108938077188191031827)
        await userModel.deleteMany({});
        await userModel.insertMany(nArray);
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/googleAuthSignup/:username', async (req, res) => {
    try {
        console.log(req.body)
        if (req.body.name && req.body.picture && req.body.sub) {
            const data = await userModel.create({
                "name": req.body.name,
                "profilePic": req.body.picture,
                "googleId": req.body.sub,
                "username": req.params.username
            })
            if (data) {
                console.log(data)
                return res.status(201).json(data);
            }
            return res.status(200).send("Internal Error")
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/addToTVWatchlist/:id', async (req, res) => {
    const { id } = req.params
    const show = req.body

    const user = await userModel.findOne({ _id: id })
    const isPresent = user.tv.watchlist.find(item => item.id == show.id)
    if (isPresent) {
        try {
            const newWatchlist = user.tv.watchlist.filter(item => item.id != show.id)
            user.tv.watchlist = newWatchlist
            await user.save()
            return res.status(201).json({ "Status": "Show removed" })
        }
        catch (err) {
            console.log(err)
        }
    }
    else {
        try {
            user.tv.watchlist.push(show)
            await user.save()
            res.status(200).json(show)
        }
        catch (err) {
            console.log(err)
        }
    }
})

router.put('/addToTVLiked/:id', async (req, res) => {
    const { id } = req.params
    const show = req.body

    const user = await userModel.findOne({ _id: id })
    const isPresent = user.tv.liked.find(item => item.id == show.id)
    if (isPresent) {
        const newWatchlist = user.tv.liked.filter(item => item.id != show.id)
        user.tv.liked = newWatchlist
        await user.save()
        return res.status(201).json({ "Status": "Show removed" })
    }
    else {
        try {
            user.tv.liked.push(show)
            await user.save()
            res.status(200).json(show)
        }
        catch (err) {
            console.log(err)
        }
    }
})

router.put('/addToTVWatched/:id', async (req, res) => {
    const { id } = req.params
    const show = req.body

    const user = await userModel.findOne({ _id: id })
    const isPresent = user.tv.watched.find(item => item.id == show.id)
    if (isPresent) {
        const newWatchlist = user.tv.watched.filter(item => item.id != show.id)
        user.tv.watched = newWatchlist
        await user.save()
        return res.status(201).json({ "Status": "Show removed" })
    }
    else {
        try {
            user.tv.watched.push(show)
            await user.save()
            res.status(200).json(show)
        }
        catch (err) {
            console.log(err)
        }
    }
})

router.post('/isInTVWatchlist/:id', async (req, res) => {
    const { id } = req.params
    const show = req.body

    const user = await userModel.findOne({ _id: id })
    const isPresent = user.tv.watchlist.find(item => item.id === show.id)

    if (isPresent) {
        return res.status(200).json("Show is in Watchlist")
    }
    else {
        return res.status(201).json("Show is not in Watchlist")
    }
})

router.post('/isInTVLiked/:id', async (req, res) => {
    const { id } = req.params
    const show = req.body

    const user = await userModel.findOne({ _id: id })
    const isPresent = user.tv.liked.find(item => item.id === show.id)

    if (isPresent) {
        return res.status(200).json("Show is in Liked")
    }
    else {
        return res.status(201).json("Show is not in Liked")
    }
})

router.post('/isInTVWatched/:id', async (req, res) => {
    const { id } = req.params
    const show = req.body

    const user = await userModel.findOne({ _id: id })
    const isPresent = user.tv.watched.find(item => item.id === show.id)

    if (isPresent) {
        return res.status(200).json("Show is in Watched")
    }
    else {
        return res.status(201).json("Show is not in Watched")
    }
})

router.post('/addToTVRec', async (req, res) => {
    const show = req.body

    try {
        const user = await showModel.findOne()
        const isExisting = user.random.some(item => item.id === show.id)

        if (!isExisting) {
            user.random.push(show)
            await user.save()
            res.status(200).json(req.body)
        } else {
            res.status(409).json({ error: "Show exists" })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/auth', (req, res) => {
    try {
        const accessToken = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({ "AT": accessToken })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "Message": "Internal Server Error" })
    }
})

router.get('/userByID/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user) {
            return res.json(user)
        }
        return res.send("User not found")
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
})

router.put('/userMovieRec/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            res.status(400).send("User not found")
        }
        else {
            user.recs.incoming.push(req.body)
            await user.save()
            res.status(200).send(req.body)
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
})

router.put('/userMovieOwnRec/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            res.status(400).send("User not found")
        }
        else {
            user.recs.outgoing.push(req.body)
            await user.save()
            res.status(200).send(req.body)
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
})

router.put('/userTvRec/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            res.status(400).send("User not found")
        }
        else {
            user.tvrecs.incoming.push(req.body)
            await user.save()
            res.status(200).send(req.body)
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).send("Server error")
    }
})

router.put('/userTvOwnRec/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            res.status(400).send("User not found")
        }
        else {
            user.tvrecs.outgoing.push(req.body)
            await user.save()
            res.status(200).send(req.body)
        }
    }
    catch (err) {
        // removed sending a respomnse to the user
        console.log(err)
        res.status(400).send("Server error")
    }
})

router.put('/recMovieEveryone/:id', async (req, res) => {
    const { id } = req.params
    try {
        const users = await userModel.find()
        const updatePromises = users.map(async (user) => {
            if (user._id != id) {
                user.recs.incoming.push(req.body)
                return user.save()
            }
        })

        await Promise.all(updatePromises)
        return res.send(users)
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/recTvEveryone/:id', async (req, res) => {
    const { id } = req.params
    try {
        const users = await userModel.find()
        const updatePromises = users.map(async (user) => {
            if (user._id != id) {
                user.tvrecs.incoming.push(req.body)
                return user.save()
            }
        })

        await Promise.all(updatePromises)
        return res.send(users)
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/addToFollower/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user && !user.followers.some(item => item._id == id)) {
            user.followers.push(req.body)
            await user.save()
            return res.status(200).send(user)
        }
        else {
            return res.status(201).send("User not found")
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/addToFollowing/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user && !user.following.some(item => item._id == id)) {
            user.following.push(req.body)
            await user.save()
            return res.status(200).send(user)
        }
        else {
            return res.status(201).send("User not found")
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/removeFollower/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user && !user.followers.some(item => item._id == id)) {
            console.log(req.body)
            const arr = user.followers.filter(item => item.id != req.body.id)
            user.followers = arr
            console.log(user.followers.length)
            await user.save()
            return res.status(200).send(user)
        }
        else {
            return res.status(201).send("User not found")
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/removeFollowing/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user && !user.following.some(item => item._id == id)) {
            console.log(req.body)
            const arr = user.following.filter(item => item.id != req.body.id)
            user.following = arr
            console.log(user.following.length)
            await user.save()
            return res.status(200).send(user)
        }
        else {
            return res.status(201).send("User not found")
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/createNewList/:id', async (req, res) => {
    const { id } = req.params
    const data = req.body
    const field = data.listDetails.category
    console.log(data)
    try {
        let user = await userModel.findById(id)
        if (!user) {
            return res.status(400).send("User Not Found")
        }
        const newList = {
            "createdBy": data.userDetails,
            "content": [],
            "title": data.listDetails.title,
            "description": data.listDetails.description
        }
        if (field == 'movies') {
            if (!user.lists) {
                user.lists = {}
            }
            if (!Array.isArray(user.lists.movies)) {
                user.lists.movies = []
            }
            user.lists.movies.push(newList)
        }
        else if (field == 'tvshows') {
            if (!user.lists) {
                user.lists = {}
            }
            if (!Array.isArray(user.lists.tvshows)) {
                user.lists.tvshows = []
            }
            user.lists.tvshows.push(newList)
        }
        else if (field == 'cast') {
            if (!user.lists) {
                user.lists = {}
            }
            if (!Array.isArray(user.lists.cast)) {
                user.lists.cast = []
            }
            user.lists.cast.push(newList)
        }
        await user.save()
        const list = user.lists[field]
        const lI = list.length - 1
        const element = list[lI]
        console.log(element)
        return res.send(element)
    }
    catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})

router.get('/getList/:id/:category/:listid', async (req, res) => {
    const { id } = req.params
    const { category } = req.params
    const { listid } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(400).send("User not found")
        }
        const item = user.lists[category].find(element => element._id == listid);
        return res.json(item)
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/addItemList/:id/:category/:listid', async (req, res) => {
    const { id } = req.params
    const { category } = req.params
    const { listid } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(400).send("User not found")
        }
        user.lists[category].find(element => element._id == listid).content.push(req.body)
        await user.save()
        return res.json(user)
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/removeItem/:id/:category/:listid', async (req, res) => {
    const { id } = req.params
    const { category } = req.params
    const { listid } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(400).send("User not found")
        }
        const arr = user.lists[category].find(element => element._id == listid).content.filter(item => item.id != req.body.id)
        user.lists[category].find(element => element._id == listid).content = arr
        await user.save()
        return res.json(user)
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/saveList/:id/:category/:listid', async (req, res) => {
    const { id } = req.params
    const { category } = req.params
    const { listid } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(400).send("User not found")
        }
        user.lists[category].find(element => element._id == listid).title = req.body.title
        user.lists[category].find(element => element._id == listid).description = req.body.description
        await user.save()
        return res.json(user)
    }
    catch (err) {
        console.log(err)
    }
})

router.delete('/deleteList/:id/:category/:listid', async (req, res) => {
    const { id } = req.params
    const { category } = req.params
    const { listid } = req.params
    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(400).send("User not found")
        }
        const arr = user.lists[category].filter(item => item.id != listid)
        user.lists[category] = arr
        await user.save()
        return res.json(user)
    }
    catch (err) {
        console.log(err)
    }
})

router.get('/users2', async(req,res) => {
    console.log("here")
    try{
        const usersList = await userModel.find({}, '_id name username profilePic')
        if(!usersList){
            res.send("No Users Found")
            return
        }
        res.send(usersList)
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router