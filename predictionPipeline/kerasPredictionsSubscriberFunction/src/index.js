const {KerasPrediction} = require("models");

const kerasPredictionsSubscriberFunction = async (data, context, callback) => {
    const posts = data.data ? JSON.parse(Buffer.from(data.data, "base64").toString()) : [];
    console.log(posts, "posts");

    const postsWithImageHashes = posts.filter((post) => post.imageHash != "");
    const predictions = await KerasPrediction.getPredictions(postsWithImageHashes);
    console.log(predictions, "predictions");

    predictions.forEach((prediction) => prediction.save());
    callback();
};

const kerasPredictionsSubscriberFunctionTest = async (req, res) => {
    const {posts} = req.body;

    // Background pub/sub functions are passed messages in a
    // json object {data: "message", ...}, where "message" is a base64 encoded string
    kerasPredictionsSubscriberFunction({data: Buffer.from(JSON.stringify(posts))}, {}, () => res.send("Finished processing."));
};

module.exports = {
    kerasPredictionsSubscriberFunction,
    kerasPredictionsSubscriberFunctionTest
};
