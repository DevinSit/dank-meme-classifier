import React from "react";
import axios from "axios";
import {BACKEND_URL} from "config";
import LatestPostsLayout from "./LatestPostsLayout";
import "./LatestPosts.scss";

// The local storage key for the 'posts which have been scored by the current user'.
// We have to store them in local storage to persist between browser refreshes since
// there are no user accounts (user's wouldn't otherwise know which posts they themselves have scored).
//
// FYI, 'scored' here means "+1".
const SCORED_POSTS_KEY = "scoredPosts";

/* The scene component that is shown under the 'Latest from r/dankmemes' tab. */
export default class LatestPosts extends React.Component {
    state = {
        selectedPostIndex: 0,
        scoredPosts: []
    }

    componentDidMount() {
        const scoredPosts = JSON.parse(localStorage.getItem(SCORED_POSTS_KEY));

        if (scoredPosts) {
            this.setState({scoredPosts});
        }
    }

    onPostCardClick = (index) => () => {
        this.setState({selectedPostIndex: index});
    }

    onScoreClick = (id) => async () => {
        const {scoredPosts} = this.state;

        if (!scoredPosts.includes(id)) {
            // Notify the Backend that a user scored a post
            const response = await axios.post(`${BACKEND_URL}/api/v1/memes/${id}/score`);
            const updatedScoredPosts = [...scoredPosts, id];
            this.setState({scoredPosts: updatedScoredPosts});

            // Update local storage in case the user refreshes the page
            localStorage.setItem(SCORED_POSTS_KEY, JSON.stringify(updatedScoredPosts));
            this.props.onScoreUpdate(id, response.data.updated_score);
        }
    }

    render() {
        const {posts, loading} = this.props;
        const {selectedPostIndex, scoredPosts} = this.state;

        const selectedPost = posts[selectedPostIndex];
        const alreadyScoredSelectedPost = selectedPost && scoredPosts.includes(selectedPost.id);

        return (
            <LatestPostsLayout
                loading={loading}
                posts={posts}
                selectedPost={selectedPost}
                selectedPostIndex={selectedPostIndex}
                alreadyScoredSelectedPost={alreadyScoredSelectedPost}
                onPostCardClick={this.onPostCardClick}
                onScoreClick={this.onScoreClick}
            />
        );
    }
}
