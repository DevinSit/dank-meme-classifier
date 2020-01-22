const cleanPosts = (posts) => (
    posts.filter(({url}) => (                   // Keep only png, jpg, and redditupload links
        url.includes(".png") ||
        url.includes(".jpg") ||
        url.includes("reddituploads")
    ))
    .map((post) => ({                           // Fix redditupload links
        ...post,
        url: post.url.replace(/&amp;/g, "&")
    }))
);

module.exports = {
    cleanPosts
};
