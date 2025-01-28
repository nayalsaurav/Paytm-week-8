import React from "react";
import { Link } from "react-router";
const BottomWarning = ({ label, buttonText, to }) => {
  return (
    <div className="flex gap-2 justify-center items-center mt-3 text-lg font-semibold">
      <p className="text-center">{label}</p>
      <Link to={to} className="underline">
        {buttonText}
      </Link>
    </div>
  );
};

export default BottomWarning;
