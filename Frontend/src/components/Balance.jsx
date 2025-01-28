import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
const Balance = () => {
  const [balance, setBalance] = React.useState("");
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/account/balance`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBalance(response.data.balance);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error Getting Balance");
        setBalance("");
      }
    };
    fetchBalance();
  }, []);
  return (
    <div className="flex gap-3 items-center font-bold text-xl">
      <h2>Your Balance </h2>
      <p>{balance}</p>
    </div>
  );
};

export default Balance;
