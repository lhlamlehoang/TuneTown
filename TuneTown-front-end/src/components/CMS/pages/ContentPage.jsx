/* eslint-disable no-unused-vars */
import { theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet, useParams } from "react-router-dom";
import EditInfor from "./EditInforCMS";
import RegisterTopic from "./UserManagement";
import BrowserTopic from "./SongManagement";

const ContentPage = () => {
  const params = useParams();
  return (
    <Content
      className="min-h-screen "
      style={{
        background: "#ecf2fd",
      }}
    >
      <div
        style={{
          padding: 24,
          minHeight: 360,
        }}
      >
        <Outlet></Outlet>
      </div>
    </Content>
  );
};

export default ContentPage;
