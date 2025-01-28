import React from "react";

const InputField = ({
  children,
  type,
  placeholder,
  name,
  label,
  onChangeHandler,
  value,
}) => {
  return (
    <div className="flex flex-col gap-2 mb-3 relative">
      <label htmlFor={name} className="font-semibold">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        id={name}
        onChange={(e) => onChangeHandler(e)}
        value={value}
        className="px-3 py-2 border border-gray-400 rounded-md font-semibold"
      />
      {children && (
        <div className="absolute inset-y-1 right-2 top-1/2 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default InputField;
