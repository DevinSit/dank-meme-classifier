import React from "react";
import HeaderLayout from "./HeaderLayout";
import "./Header.scss";

const Header = ({selected, onTabClick}) => (
    <HeaderLayout
        selected={selected}
        onTabClick={onTabClick}
    />
);

export default Header;
