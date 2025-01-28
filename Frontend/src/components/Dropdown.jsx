import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import Avatar from "./Avatar";

const Dropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        id="dropdownUserAvatarButton"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        className="flex text-sm bg-gray-800 rounded-full"
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        <div className="cursor-pointer">
          <Avatar name={localStorage.getItem("fullname")} />
        </div>
      </button>
      {isOpen && (
        <div
          id="dropdownAvatar"
          className="absolute right-0 z-10 bg-gray-700 divide-y divide-gray-600 rounded-lg shadow-sm w-44"
        >
          <div className="px-4 py-3 text-sm text-white">
            <div className="capitalize">{localStorage.getItem("fullname")}</div>
          </div>
          <ul
            className="py-2 text-sm text-gray-200"
            aria-labelledby="dropdownUserAvatarButton"
          >
            <li>
              <Link
                to={"/dashboard"}
                className="block px-4 py-2 hover:bg-gray-600 hover:text-white"
              >
                Dashboard
              </Link>
            </li>
          </ul>
          <div className="py-2">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/signin");
              }}
              className="block cursor-pointer w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
