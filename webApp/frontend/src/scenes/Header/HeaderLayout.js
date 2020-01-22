import React from "react";
import classNames from "classnames";
import Routes from "routes";

const HeaderLayout = ({selected, onTabClick}) => (
    <header id="header">
        <h2 className="header-logo">Dank Meme Classifier</h2>
        <Navbar selected={selected} onTabClick={onTabClick} />
        <div className="header-empty" />
    </header>
);

const Navbar = ({selected, onTabClick}) => (
    <nav className="header-navbar">
        <button
            className={classNames(
                "navbar-tab",
                {"navbar-tab--selected": selected === Routes.INDIVIDUAL_CLASSIFICATION}
            )}
            onClick={onTabClick(Routes.INDIVIDUAL_CLASSIFICATION)}
        >
            Classify your own
        </button>

        <button
            className={classNames(
                "navbar-tab",
                {"navbar-tab--selected": selected === Routes.LATEST_POSTS}
            )}
            onClick={onTabClick(Routes.LATEST_POSTS)}
        >
            Latest from r/dankmemes
        </button>
    </nav>
);

export default HeaderLayout;
