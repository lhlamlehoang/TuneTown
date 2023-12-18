/* eslint-disable no-unused-vars */
import React from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import UseCookie from "../../hooks/useCookie";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { removeToken, getToken } = UseCookie();

  function getItem(label, key, icon, children) {
    return { label, key, icon, children };
  }
  const siderItems = [
    getItem("Profile Edit", "profile", <UploadOutlined />),
    getItem("User Management", "usermanagement", <UserOutlined />),
    getItem("Song Management", "songmanagement", <UserOutlined />),
  ];
  const handleContents = (data) => {
    switch (data.key) {
      case "profile":
        navigate(`/cms/${data.key}`);
        break;
      case "usermanagement":
        navigate(`/cms/${data.key}`);
        break;

      case "songmanagement":
        navigate(`/cms/${data.key}`);
        break;
      case "logout":
        removeToken();
        navigate("/");
        break;
      default:
        break;
    }
  };
  return (
    <Menu
      theme="dark"
      className="mt-14 "
      mode="inline"
      defaultSelectedKeys={["0"]}
      items={siderItems}
      onClick={(e) => handleContents(e)}
    />
  );
};

export default LeftSideBar;
