import React from "react";

const Button = ({ name, bgColor, hoverColor, onClickHandler }) => {
  return (
    <button
      className={`text-white px-3 py-2 rounded-lg w-full font-semibold cursor-pointer transition-all duration-200 ${bgColor} ${hoverColor}`}
      onClick={onClickHandler ? onClickHandler : null}
    >
      {name}
    </button>
  );
};

export default Button;
