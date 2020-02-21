// DEMO: Commented-out code are things that are disabled for demo purposes.

import React from "react";
// import axios from "axios";
// import {BACKEND_URL} from "config";
import Routes from "routes";
// import {Header, IndividualClassification, LatestPosts} from "scenes/";
import {Header, IndividualClassification} from "scenes/";
import "./App.scss";

export default class App extends React.Component {
    state = {
        posts: [],
        selectedHeaderTab: Routes.INDIVIDUAL_CLASSIFICATION,
        latestPostsLoading: false
    }

    // async componentDidMount() {
    //     const loadingTimeout = setTimeout(() => this.setState({latestPostsLoading: true}), 250);
    //     const response = await axios.get(`${BACKEND_URL}/api/v1/memes`);

    //     clearTimeout(loadingTimeout);
    //     this.setState({posts: response.data.posts, latestPostsLoading: false});
    // }

    onScoreUpdate = (id, updatedScore) => {
        const posts = this.state.posts.map((post) => {
            if (post.id === id) {
                post.score = updatedScore;
            }

            return post;
        });

        this.setState({posts});
    };

    onHeaderTabClick = (selectedHeaderTab) => () => {
        this.setState({selectedHeaderTab});
    }

    render() {
        // const {posts, selectedHeaderTab, latestPostsLoading} = this.state;
        const {selectedHeaderTab} = this.state;

        let renderedSection;

        if (selectedHeaderTab === Routes.LATEST_POSTS) {
            // renderedSection = (
            //     <LatestPosts
            //         posts={posts}
            //         onScoreUpdate={this.onScoreUpdate}
            //         loading={latestPostsLoading}
            //     />
            // );
            //

            renderedSection = (
                <div className="disabled-latest-posts">Not enabled for demo purposes.</div>
            );
        } else if (selectedHeaderTab === Routes.INDIVIDUAL_CLASSIFICATION) {
            renderedSection = <IndividualClassification />;
        }

        return (
            <div id="app">
                <Header
                    selected={selectedHeaderTab}
                    onTabClick={this.onHeaderTabClick}
                />

                <div id="app-content">
                    {renderedSection}
                </div>
            </div>
        );
    }
}
