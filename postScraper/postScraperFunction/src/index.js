const {PushShift, Reddit} = require("./services");

/** Scrapes Reddit for image URLs based on the given query parameters.
 *
 *  Possible query params:
 *
 *  - historic (bool, default: false) -> whether to use the up-to-date Reddit API or historic PushShift API
 *  - subreddit (string, default: dankmemes) -> which subreddit to scrape
 *  - top (bool, default: true) -> whether to scrape the top or bottom posts by score
 *  - limit (int, default: 5) -> max number of records to return
 *  - scoreThreshold (int, default: null) -> score threshold to take posts till (above for top = true, below for top = false)
 *  - hot (bool, default: false) -> Whether to get hot or new posts (defaults to new)
 */
exports.postScraperFunction = async (req, res) => {
    const params = req.query;
    console.log(params, "query params");

    const {subreddit, top, limit, scoreThreshold, hot, historic} = parseQueryParams(params);
    let posts;

    try {
        if (historic) {
            posts = await PushShift.getPosts(subreddit, limit, top, scoreThreshold);
        } else {
            posts = await Reddit.getPosts(subreddit, limit, hot);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({message: "Error when trying to get image URLs. See logs for more details.", status: "error"});
        return;
    }

    res.send({posts, status: "success"});
};

const parseQueryParams = (params) => {
    const {subreddit = "dankmemes"} = params;
    const top = (params.top == undefined) ? true : (params.top == "true");  // Convert top to a boolean
    const limit = parseInt(params.limit) || 5;
    const scoreThreshold = parseInt(params.scoreThreshold);
    const hot = (params.hot == undefined) ? false : (params.hot == "true");  // Convert hot to a boolean
    const historic = (params.historic == undefined) ? false : (params.historic == "true")  // Convert historic to a boolean

    return {
        subreddit,
        top,
        limit,
        scoreThreshold,
        hot,
        historic
    };
};

