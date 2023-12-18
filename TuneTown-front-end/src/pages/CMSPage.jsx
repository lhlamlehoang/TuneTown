import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import LeftSideBar from "../components/CMS/LeftSideBar";
import FooterSection from "../components/CMS/FooterSection";
import ContentPage from "../components/CMS/pages/ContentPage";
import TheHeader from "../components/Header/TheHeader";

const CMSPage = () => {
  return (
    <div className="">
      <Layout className="">
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          className=""
        >
          <div className="demo-logo-vertical" />

          <LeftSideBar></LeftSideBar>
        </Sider>
        <Layout>
          {/* <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          /> */}
          <TheHeader></TheHeader>
          <ContentPage></ContentPage>
          <FooterSection></FooterSection>
        </Layout>
      </Layout>
    </div>
  );
};

export default CMSPage;
