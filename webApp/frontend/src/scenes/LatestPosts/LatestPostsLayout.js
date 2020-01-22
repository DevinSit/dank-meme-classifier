import React from "react";
import classNames from "classnames";
import Spinner from "images/loading.gif";
import ImagePrediction from "components/ImagePrediction";

const LatestPostsLayout = ({
    loading, posts, selectedPost, selectedPostIndex, alreadyScoredSelectedPost,
    onPostCardClick, onScoreClick
}) => (
    <div className="latest-posts">
        {
            loading ? (
                <img
                    className="loading-spinner"
                    src={Spinner}
                    alt="loading spinner"
                />
            ) : (
                <React.Fragment>
                    <div className="post-card-list">
                        {
                            posts.map((post, index) => (
                                <PostCard
                                    key={post.id}
                                    selected={index === selectedPostIndex}
                                    title={post.title}
                                    author={post.author}
                                    createdUtc={post.createdUtc}
                                    imageUrl={post.url}
                                    score={post.score}
                                    onClick={onPostCardClick(index)}
                                />
                            ))
                        }
                    </div>

                    <div className="post-details-container">
                        {
                            posts.length > 0 && (
                                <PostDetails
                                    title={selectedPost.title}
                                    author={selectedPost.author}
                                    createdUtc={selectedPost.createdUtc}
                                    permalink={selectedPost.permalink}
                                    imageUrl={selectedPost.url}
                                    kerasPrediction={selectedPost.kerasPrediction}
                                    autoMLPrediction={selectedPost.autoMLPrediction}
                                    alreadyScored={alreadyScoredSelectedPost}
                                    onScoreClick={onScoreClick(selectedPost.id)}
                                />
                            )
                        }
                    </div>
                </React.Fragment>
            )
        }
    </div>
);

const PostCard = ({
    selected = false,
    title = "This is the title",
    author = "author",
    createdUtc = "10",
    imageUrl = "",
    score = 0,
    onClick
}) => (
    <div className={classNames("post-card", {"post-card--selected": selected})} onClick={onClick}>
        <img className="post-card__image" src={imageUrl} alt={imageUrl} />

        <div className="post-card__content">
            <h4 className="post-card__title">{title}</h4>
            <PostCreationInfo author={author} createdUtc={createdUtc} />

            <ScoreBubble score={score} />
        </div>
    </div>
);

const PostDetails = ({
    title = "This is the title",
    author = "author",
    createdUtc = "10 mins ago",
    permalink = "",
    imageUrl = "",
    kerasPrediction = 0,
    autoMLPrediction = 0,
    alreadyScored = false,
    onScoreClick
}) => (
    <div className="post-details">
        <img className="post-details__image" src={imageUrl} alt={imageUrl} />

        <div className="post-details__content">
            <a className="post-details__title" href={`https://www.reddit.com${permalink}`}>{title}</a>
            <PostCreationInfo author={author} createdUtc={createdUtc} alt={imageUrl} />
        </div>

        <div className="post-details__predictions">
            <ImagePrediction prediction={kerasPrediction} predictionType="Keras" />
            <ImagePrediction prediction={autoMLPrediction} predictionType="AutoML" />
        </div>

        <div className="post-details__dank-upvote">
            <p>Dank?</p>
            <ScoreBubble
                score={1}
                notFilled={!alreadyScored}
                onClick={!alreadyScored ? onScoreClick : undefined}
            />
        </div>
    </div>
);

const PostCreationInfo = ({author, createdUtc}) => (
    <h4 className="post-creation-info">
        Posted by {author} <span className="post-time">{getCreatedTimeAgo(createdUtc)}</span>
    </h4>
);

const ScoreBubble = ({score, notFilled = false, onClick}) => (
    <button
        className={classNames("score-bubble", {"score-bubble--not-filled": notFilled})}
        onClick={onClick}
    >
        +{score}
    </button>
);

const getCreatedTimeAgo = (createdUtc) => {
    const now = Math.floor(new Date().getTime() / 1000);
    const diff = now - createdUtc;
    const minutes = Math.floor(diff / 60);

    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
        // Floor to the nearest 5 minutes
        const floored10Minutes = Math.floor(minutes / 5) * 5;
        return `${floored10Minutes} minute${floored10Minutes !== 1 ? "s" : ""} ago`;
    }
};

export default LatestPostsLayout;
