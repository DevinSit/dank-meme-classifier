import React from "react";
import axios from "axios";
import {BACKEND_URL} from "config";
import {registerGAEvent} from "utils/UserTracking";
import LatestPostsLayout from "./LatestPostsLayout";
import "./LatestPosts.css";

const SCORED_POSTS_KEY = "scoredPosts";

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

        registerGAEvent({
            category: "Interaction",
            action: "Clicked on a post",
            label: index
        });
    }

    onScoreClick = (id) => async () => {
        const {scoredPosts} = this.state;

        if (!scoredPosts.includes(id)) {
            const response = await axios.post(`${BACKEND_URL}/api/v1/memes/${id}/score`);
            const updatedScoredPosts = [...scoredPosts, id];
            this.setState({scoredPosts: updatedScoredPosts});

            localStorage.setItem(SCORED_POSTS_KEY, JSON.stringify(updatedScoredPosts));
            this.props.onScoreUpdate(id, response.data.updated_score);

            registerGAEvent({
                category: "Interaction",
                action: "Clicked score button",
                label: id
            });
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
