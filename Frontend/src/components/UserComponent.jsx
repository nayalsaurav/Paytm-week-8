import React, { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import Button from "./Button";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";

const UserComponent = () => {
  const [searchValue, setSearchValue] = React.useState("");
  const onChangeHandler = (e) => {
    setSearchValue(e.target.value);
  };
  const [allUsers, setAllUsers] = React.useState([]);
  const timeoutRef = React.useRef(null); //for debouncing
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/bulk?filter=${searchValue}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // if(response.data.length>0){
        //   // setAllUsers(
        //   //   allUsers.filter((user)=>{
        //   //     return user._id !==
        //   //   })
        //   // )
        // }
        setAllUsers(response.data.users);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };
    timeoutRef.current = setTimeout(() => {
      fetchUsers();
    }, 300);
  }, [searchValue]);

  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl mb-3">Users</h2>
      <div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchValue}
          onChange={(e) => onChangeHandler(e)}
          name="searchValue"
          className="border border-gray-400 rounded-md px-3 py-2 w-full"
        />
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {allUsers.length > 0 ? (
          allUsers.map((user) => <User key={user._id} user={user} />)
        ) : (
          <div className="text-center font-bold">No users found</div>
        )}
      </div>
    </div>
  );
};

function User({ user }) {
  const navigate = useNavigate();
  const onClickHandler = () => {
    navigate(
      `/send?friendName=${user.firstname} ${user.lastname}&&to=${user._id}`
    );
  };
  return (
    <div className="flex justify-between items-center mt-3">
      <div className="flex items-center gap-3">
        <Avatar name={user.firstname} />
        <div>
          <div className="font-semibold capitalize">{`${user.firstname} ${user.lastname}`}</div>
          <div className="font-semibold lowercase">{user.username}</div>
        </div>
      </div>
      <div>
        <Button
          name="Send Money"
          bgColor={"bg-black"}
          hoverColor={"hover:bg-slate-800"}
          onClickHandler={onClickHandler}
        />
      </div>
    </div>
  );
}

export default UserComponent;
