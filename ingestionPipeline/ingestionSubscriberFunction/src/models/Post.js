const Datastore = require("@google-cloud/datastore");
const config = require("config");

const datastore = new Datastore({projectId: config.PROJECT_ID}) ;

class Post {
    constructor({id = "", url = "", createdUtc = 0, author = "", subreddit = "", title = "", permalink = "", imageHash = ""}) {
        this.id = id;
        this.url = url;
        this.createdUtc = createdUtc;
        this.author = author;
        this.subreddit = subreddit;
        this.title = title;
        this.permalink = permalink;
        this.imageHash = imageHash;
    }

    entity() {
        const kind = "RedditPost";
        const key = datastore.key([kind, this.id]);

        return {
            key,
            data: {
                id: this.id,
                url: this.url,
                createdUtc: this.createdUtc,
                author: this.author,
                subreddit: this.subreddit,
                title: this.title,
                permalink: this.permalink,
                imageHash: this.imageHash,
            },
            excludeFromIndexes: ["url", "author", "title", "permalink"]
        }
    }

    save() {
        datastore.upsert(this.entity());
    }
}

module.exports = Post
