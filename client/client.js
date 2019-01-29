const form = document.querySelector("form");
const loading = document.querySelector(".loading");
const tweetContainer = document.querySelector(".tweets-container");
const API_URL = "http://192.168.1.242:3000/tweets";

displayAllTweets();
setInterval(() => {
    displayAllTweets();
    console.log("tweets refreshed");
}, 30 * 1000);
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const tweet = {
        name,
        content
    };

    console.log(tweet);
    form.style.display = "none";
    loading.style.display = "";

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(tweet),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(createdTweet => {
            if (createdTweet.error) throw createdTweet;
            console.log(createdTweet)
            form.reset();
        }).catch((err) => {
            console.error(err);
            alert(err.message);
        });
    form.style.display = "";
    loading.style.display = "none";
    displayAllTweets();
});

function displayAllTweets() {
    tweetContainer.innerHTML = "";
    try {
        fetch(API_URL)
            .then(response => response.json())
            .then(tweets => {
                console.log(tweets);
                loading.style.display = "none";
                tweets.reverse();
                tweets.forEach(tweet => {
                    const li = document.createElement("li");
                    const span = document.createElement("span");
                    const p = document.createElement("p");
                    const small = document.createElement("small");

                    li.classList = "collection-item avatar";
                    span.classList = "title";

                    p.textContent = tweet.content;
                    span.textContent = tweet.name;
                    small.textContent = "Created: " + new Date(tweet.date);

                    li.appendChild(span);
                    li.appendChild(p);
                    li.appendChild(small);

                    tweetContainer.appendChild(li);
                });
            });
    } catch (error) {
        document.querySelector("body").innerHTML = "<h1>There was an error in loading the database</h1>";
    }
}
