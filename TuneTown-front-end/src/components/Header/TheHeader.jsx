import { useEffect, useState } from "react";
import { Avatar, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UseCookie from "../../hooks/useCookie";
import { Base_URL } from "../../api/config";
import { setUserId } from "../../redux/slice/account";
import { useDispatch } from "react-redux";
import axios from "axios";

const TheHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { removeToken, getToken } = UseCookie();
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const { access_token } = getToken();
  const [modalOpen, setModalOpen] = useState(false);
  const [userInfor, setUserInfor] = useState({});
  dispatch(setUserId(userId));

  // Get user information from API
  const getUserInfor = async () => {
    try {
      const response = await axios.get(`${Base_URL}/users?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: {},
      });
      console.log("TheHeader || GetUserInfor", response.data, response.status);
      return response.data;
      // setUserName(response.data.user.userName);
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
    }
  };

  const handleOnclick = (direction) => {
    navigate(`/${direction}`);
    setModalOpen(false);
  };
  // Log Out
  const LogOut = () => {
    removeToken();
    localStorage.clear();
    navigate("/");
  };
  useEffect(() => {
    getUserInfor().then((res) => {
      setUserInfor(res.user);
      localStorage.setItem("userName", res.user.userName);
      console.log("The Header || UserInfor", res.user);
    });
    // HandleUserData(userIdReduce, userNameReduce, userRoleReduce);
  }, [userId]);
  return (
    <header className="w-full h-[60px] xl:w-full xl:h-[60px] py-1 gap-x-7 flex justify-center items-center font-bold bg-[#ecf2fd]">
      <div className="xl:right-5 xl:mt-5 right-3 absolute flex flex-row justify-center items-center">
        {
          <div>
            {userRole === "ADMIN" && (
              <div className="text-[#f24e4e] font-bold flex flex-row justify-center items-center p-1 border border-[#f24e4e] border-solid rounded-md mr-3">
                Admin
              </div>
            )}
            {userRole === "USER" && (
              <div className="text-[#359254] font-bold flex flex-row justify-center items-center p-1 border border-[#359254] border-solid rounded-md mr-3">
                User
              </div>
            )}
            {userRole === "ARTIST" && (
              <div className="text-[#3f3ca0] font-bold flex flex-row justify-center items-center p-1 border border-[#3f3ca0] border-solid rounded-md mr-3">
                Artist
              </div>
            )}
          </div>
        }
        <span className="xl:block hidden mr-3 text-[#505050] cursor-default">
          {userInfor.userName ? userInfor.userName : "Unknown User"}
        </span>

        {userInfor.avatar && (
          <button className="cursor-pointer" onClick={() => setModalOpen(true)}>
            <Avatar
              icon={<UserOutlined />}
              className="border-[3px] border-[#2c2a2a] "
              size="large"
              src={<img src={userInfor.avatar} alt="avatar" />}
            />
          </button>
        )}
        {!userInfor.avatar && (
          <button className="cursor-pointer" onClick={() => setModalOpen(true)}>
            <Avatar icon={<UserOutlined />} size="large" />
          </button>
        )}
      </div>
      <Modal
        title="Options"
        centered
        style={{ top: 20 }}
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        okButtonProps={{ style: { backgroundColor: "#45cc79" } }}
        onCancel={() => setModalOpen(false)}
        footer={null}
        className="text-[#359254] font-bold flex flex-row justify-center items-center"
      >
        {userRole != "ADMIN" && (
          <div
            onClick={() => handleOnclick("editUser")}
            className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10"
          >
            <button>Edit User Information</button>
          </div>
        )}
        {userRole == "ARTIST" && (
          <div>
            <div
              onClick={() => handleOnclick("upload")}
              className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10 "
            >
              <button>Upload Song</button>
            </div>
            <div
              onClick={() => handleOnclick("artistCMS")}
              className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10 "
            >
              <button>Song Management</button>
            </div>
          </div>
        )}

        {userRole != "ADMIN" && (
          <div
            onClick={() => handleOnclick("history")}
            className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10"
          >
            <button>Listen History</button>
          </div>
        )}
        <div
          onClick={LogOut}
          className="flex justify-center items-center text-blue-950 hover:text-white font-semibold hover:bg-[#45cc79] bg-[#f1f1ef] rounded-lg mt-3 h-10"
        >
          <button>Log Out</button>
        </div>
      </Modal>
    </header>
  );
};

export default TheHeader;
