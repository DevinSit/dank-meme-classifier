const fetch = require("node-fetch");
const {cleanPosts} = require("./utils");

const PUSHSHIFT_URL = "https://api.pushshift.io/reddit/submission/search?"
const MAX_SINGLE_REQUEST_SIZE = 500;            // The max number of posts allowed per request from PushShift
const UNREALISTIC_UPVOTE_COUNT = 100000000;     // I think it's safe to assume there won't be a post with 100,000,000 updoots

const getPosts = async (subreddit = "dankmemes", limit = 5, top = true, scoreThreshold = null) => {
    const sort = top ? "desc" : "asc";
    const thresholdOperand = top ? ">" : "<";
    const lastScoreOperand = top ? "<" : ">";
    scoreThreshold = (scoreThreshold) ? scoreThreshold : (top ? -1 : UNREALISTIC_UPVOTE_COUNT);

    const baseUrl = PUSHSHIFT_URL + `subreddit=${subreddit}&filter=url,score,author,id,created_utc,title,subreddit,permalink&sort_type=score&sort=${sort}&score=${thresholdOperand}${scoreThreshold}`;

    let count = limit;
    let allPosts = [];
    let lastScore = top ? UNREALISTIC_UPVOTE_COUNT : -1;  
    let withinThreshold = true;

    while (count > 0 && withinThreshold) {
        const requestUrl = baseUrl + `&score=${lastScoreOperand}${lastScore}&size=${Math.min(count, MAX_SINGLE_REQUEST_SIZE)}`;

        const response = await fetch(requestUrl);
        const posts = normalizePostAttributes((await response.json()).data);

        if (posts.length > 0) {
            const cleanedPosts = cleanPosts(posts);
            allPosts = [...allPosts, ...cleanedPosts];

            // When getting the bottom set of posts, we can't use a return score as the basis
            // for lastScore because of the sheer number of 0 rated posts. It'd stay stuck
            // at 0 and keep returning the same 500 bottom rated posts. Instead, we just increment
            // it by 1 and grab 500 from each score point.
            // Same kind of reasoning for subtracting 1 when getting the top set of posts. Want to make sure
            // that it's always a different score that we're getting.
            lastScore = top ? posts.slice(-1)[0].score - 1 : lastScore + 1;

            count -= cleanedPosts.length;
            withinThreshold = top ? (lastScore > scoreThreshold) : (lastScore < scoreThreshold);
        } else {
            withinThreshold = false;
        }
    }

    return allPosts;
};

const normalizePostAttributes = (posts) => posts.map((post) => ({
    id: post.id,
    url: post.url,
    createdUtc: post.created_utc,
    author: post.author,
    subreddit: post.subreddit,
    title: post.title,
    permalink: post.permalink,
    score: post.score
}));

module.exports = {
    getPosts
};
