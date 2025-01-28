import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import InputField from "../components/InputField";
import Button from "../components/Button";
import SubHeading from "../components/SubHeading";
import Heading from "../components/Heading";
import BottomWarning from "../components/BottomWarning";

const Signin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const verifyUser = async () => {
        try {
          await axios.get("http://localhost:3000/api/v1/user/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          navigate("/dashboard");
        } catch (error) {
          localStorage.removeItem("token");
        }
      };
      verifyUser();
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        form
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("fullname", response.data.fullname);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to sign in";
      toast.error(errorMessage);
    }
  };

  const PasswordIcon = useMemo(() => {
    if (isPasswordVisible) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6 cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    );
  }, [isPasswordVisible]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md shadow-2xl p-8 rounded-lg bg-white">
        <Heading heading="Sign In" />
        <SubHeading subHeading="Enter your credentials to access your account" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <InputField
            label="Email"
            type="email"
            name="username"
            placeholder="johndoe@example.com"
            onChangeHandler={handleInputChange}
            value={form.username}
          />

          <InputField
            label="Password"
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            placeholder=""
            onChangeHandler={handleInputChange}
            value={form.password}
          >
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="text-gray-600 hover:text-black focus:outline-none"
            >
              {PasswordIcon}
            </button>
          </InputField>

          <Button
            name="Sign In"
            bgColor="bg-black"
            hoverColor="hover:bg-slate-800"
          />
        </form>

        <BottomWarning
          label="Don't have an account?"
          buttonText="Sign up"
          to="/signup"
        />
      </div>
    </div>
  );
};

export default Signin;
