const PubSub = require("@google-cloud/pubsub");

const pubsub = new PubSub();
const TOPIC = "dank-meme-classifier-posts-topic";
const CHUNK_SIZE = 5;

exports.ingestionPublisherFunction = async (req, res) => {
    const {posts} = req.body;
    console.log(posts, "posts");

    if (!posts) {
        res.status(400).send({message: "Missing posts. JSON body should be {posts: []}.", status: "error"});
        return;
    }

    const chunkedPosts = chunkPosts(posts);

    try {
        await Promise.all(chunkedPosts.map(async (chunk) => {
            const message = Buffer.from(JSON.stringify(chunk));
            const publisher = pubsub.topic(TOPIC).publisher();

            await publisher.publish(message);
        }));
    } catch (err) {
        console.log(err);
        res.status(500).send({message: "Error while publishing message: " + err, status: "error"});
        return;
    }

    res.send({message: "Published posts for processing.", status: "success"});
};

const chunkPosts = (posts) => {
    let clonedPosts = posts.slice(0);
    let chunkedPosts = [];

    while (clonedPosts.length) {
        chunkedPosts.push(clonedPosts.splice(0, CHUNK_SIZE));
    }

    return chunkedPosts;
};
