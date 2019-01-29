const express = require('express');
const monk = require('monk');
const cors = require('cors');

const port = 3000;

const app = express();
const db = monk('localhost/tweets');
const tweets = db.get("tweets");


app.use(cors());
app.use(express.json());

const validatedTweet = (tweet) => {
    return tweet.name && tweet.name.trim() !== "" && tweet.content && tweet.content.trim() !== ""

}


app.get("/", (req, res) => {
    res.json({
        title: "Hello",
        content: "Hello World"
    });
});

app.get("/tweets", (req, res) => {
    tweets.find()
        .then(tweets => {
            res.json(tweets);
        });
})

app.post("/tweets", (req, res) => {
    if (validatedTweet(req.body)) {
        const tweet = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            date: new Date()
        };
        tweets.insert(tweet)
            .then(createdTweet => {
                res.json(createdTweet);
            })

    } else {
        res.status(422);
        res.json({
            error: "Unsatisfied Tweet",
            message: "Name and content required"
        });
    }
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is running");
});