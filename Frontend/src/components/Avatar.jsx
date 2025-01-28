import React from "react";

const Avatar = ({ name }) => {
  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-300 rounded-full border-2 border-gray-200">
      <span className="font-bold text-lg text-gray-600 uppercase">
        {name[0]}
      </span>
    </div>
  );
};

export default Avatar;
