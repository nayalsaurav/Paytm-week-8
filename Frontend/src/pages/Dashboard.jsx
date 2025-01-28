import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import AppBar from "../components/AppBar";
import Balance from "../components/Balance";
import UserComponent from "../components/UserComponent";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await axios.get("http://localhost:3000/api/v1/user/verify", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/signin", { replace: true });
      }
    };

    if (!localStorage.getItem("token")) {
      navigate("/signin", { replace: true });
      return;
    }

    verifyUser();
  }, [navigate]);

  return (
    <main className="min-h-screen bg-gray-50">
      <AppBar />
      <section className="max-w-7xl mx-auto p-5">
        <div className="space-y-6">
          <Balance />
          <UserComponent />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
