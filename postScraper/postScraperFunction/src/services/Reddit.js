const fetch = require("node-fetch");
const runtimeConfig = require("gcf-runtime-config");
const snoowrap = require("snoowrap");
const {cleanPosts} = require("./utils");

const CONFIG_NAME = "dank-meme-classifier-post-scraper-config";

const getPosts = async (subreddit = "dankmemes", limit = 5, hot = false) => {
    const {CLIENT_ID, CLIENT_SECRET, USER_AGENT, REDDIT_USERNAME, REDDIT_PASSWORD} = await getConfig();

    const redditClient = new snoowrap({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        userAgent: USER_AGENT,
        username: REDDIT_USERNAME,
        password: REDDIT_PASSWORD
    });

    const method = (hot) ? "getNew" : "getNew";
    const rawPosts = await redditClient[method](subreddit, {limit});
    const posts = normalizePostAttributes(rawPosts);

    return cleanPosts(posts);
};

const getConfig = async () => await runtimeConfig.getVariables(CONFIG_NAME);

const normalizePostAttributes = (posts) => posts.map((post) => ({
    id: post.id,
    url: post.url,
    createdUtc: post.created_utc,
    author: post.author.name,
    subreddit: post.subreddit.display_name,
    title: post.title,
    permalink: post.permalink,
    score: post.score
}));

module.exports = {
    getPosts
};
