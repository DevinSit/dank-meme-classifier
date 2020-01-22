import React from "react";
import axios from "axios";
import {BACKEND_URL} from "config";
import Routes from "routes";
import {Header, IndividualClassification, LatestPosts} from "scenes/";
import {initLogRocket, initGoogleAnalytics, registerGAEvent} from "utils/UserTracking";
import "./App.css";

initLogRocket();
initGoogleAnalytics();

export default class App extends React.Component {
    state = {
        posts: [],
        selectedHeaderTab: Routes.LATEST_POSTS,
        latestPostsLoading: false
    }

    async componentDidMount() {
        const loadingTimeout = setTimeout(() => this.setState({latestPostsLoading: true}), 250);
        const response = await axios.get(`${BACKEND_URL}/api/v1/memes`);

        clearTimeout(loadingTimeout);
        this.setState({posts: response.data.posts, latestPostsLoading: false});
    }

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

        registerGAEvent({
            categoy: "Navigation",
            action: "Clicked navigation tab",
            label: selectedHeaderTab
        });
    }

    render() {
        const {posts, selectedHeaderTab, latestPostsLoading} = this.state;
        let renderedSection;

        if (selectedHeaderTab === Routes.LATEST_POSTS) {
            renderedSection = (
                <LatestPosts
                    posts={posts}
                    onScoreUpdate={this.onScoreUpdate}
                    loading={latestPostsLoading}
                />
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
