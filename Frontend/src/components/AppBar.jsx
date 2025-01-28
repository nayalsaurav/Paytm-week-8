import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router";
import Dropdown from "./Dropdown";

const AppBar = () => {
  return (
    <nav className="flex justify-between items-center p-5 bg-gray-800 text-white">
      <Link to="/dashboard" className="text-2xl font-bold">
        Payments App
      </Link>
      <div className="flex gap-5 items-center">
        <span>Hello, {localStorage.getItem("fullname")}!</span>
        <Dropdown />
      </div>
    </nav>
  );
};

export default AppBar;
