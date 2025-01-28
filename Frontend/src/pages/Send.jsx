import React, { useEffect } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import AppBar from "../components/AppBar";

const Send = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/user/verify",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    };
    verifyUser();
  }, []);
  const [amount, setAmount] = React.useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const onChangeHandler = (e) => {
    setAmount(e.target.value);
  };
  const friendName = searchParams.get("friendName");
  const to = searchParams.get("to");
  const onClickHandler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        { to, amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  return (
    <>
      <AppBar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-1/2 shadow-2xl px-7 py-10 rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-10">Send Money</h1>
          <div>
            <div className="flex gap-3 items-center mb-3">
              <Avatar name={friendName} />
              <div className="text-lg font-semibold capitalize">
                {friendName}
              </div>
            </div>
            <div>
              <InputField
                label="Amount (in Rs)"
                type="number"
                name="amount"
                placeholder="Enter amount"
                onChangeHandler={onChangeHandler}
                value={amount}
              />
              <Button
                name={"Send"}
                bgColor={"bg-green-500"}
                hoverColor={"hover:bg-green-600"}
                onClickHandler={onClickHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Send;
