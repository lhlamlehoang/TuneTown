import { useEffect } from "react";
import axios from "axios";
import { Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { NavLink, useNavigate } from "react-router-dom";
import UseCookie from "../hooks/useCookie";
import { Base_URL, auth } from "../api/config";
import { useDispatch } from "react-redux";
import { setUserInfor } from "../redux/slice/account";
import GoogleLoginButton from "../components/AuthGoogle/AuthGoogleLogin";
import { gapi } from "gapi-script";

const clientId =
  "382112670726-viic3uvlj5420j60ajveandtb8j4p0sk.apps.googleusercontent.com";

const LoginPage = () => {
  const { removeToken } = UseCookie();
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saveToken } = UseCookie();

  const handleUserData = async (usersData) => {
    console.log("Data", usersData);
    dispatch(setUserInfor(usersData));
    localStorage.setItem("userId", usersData.id);
    localStorage.setItem("userName", usersData.userName);
    localStorage.setItem("userRole", usersData.role);
    console.log("User infor", usersData);
  };
  // Get access to the API
  async function GetAccessToken(emailInput, passwordInput) {
    try {
      const response = await axios.post(`${Base_URL}/auth/authenticate`, {
        email: emailInput,
        password: passwordInput,
      });
      console.log("Respone Data Sign in", response.data);
      if ((response.data && response.data.access_token) || response.data) {
        // Save cookies and token
        saveToken(response.data.access_token);
        handleUserData(response.data);
        console.log("Token", response.data.access_token);
        // Notifactaion when login successfully
        message.success("Login Successfully");
        setTimeout(() => {
          if (response.data.role === "ADMIN") {
            navigate("/cms/usermanagement");
          } else if (
            response.data.role === "USER" ||
            response.data.role === "ARTIST"
          ) {
            // window.location.href = "/home";
            navigate("/home");
          }
        }, 1000);
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
      // Notifactaion when login failed
      message.error("Login Failed");
      throw error;
    }
  }
  // Login
  const onFinish = async (values) => {
    const { email, password } = values;
    await GetAccessToken(email, password);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    console.log("Token removed", auth.access_token);
    removeToken();
  }, []);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }

    gapi.load("client:auth2", start);
  });

  return (
    <div className="flex flex-col justify-center bg-[#FFFFFFCC]">
      <div className="flex flex-row flex-1 relative">
        <div className="flex flex-col justify-center items-center min-h-screen xl:w-1/2">
          <div className="mb-20">
            <h1 className="font-bold text-[#2E3271] text-3xl">Login</h1>
          </div>
          <Form
            form={form}
            className="w-full"
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              className="flex flex-row justify-center items-center"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <button className="bg-[#38a870] text-white hover:bg-[#54ce91] hover:text-[#fff] py-2 px-3 w-max rounded-lg font-semibold">
                Submit
              </button>
            </Form.Item>
          </Form>

          <div className="flex flex-col items-center">
            <p className="text-[#2E3271]">
              Don&apos;t have account?
              <NavLink to="/signup" className="text-[#34a56d] ml-1 text-sm">
                Sign up
              </NavLink>
            </p>
            <p className="text-[#2E3271] mb-3">
              Forget Your Password?
              <NavLink to="/forgotpass" className="text-[#34a56d] ml-1 text-sm">
                Forget Password
              </NavLink>
            </p>
            <div className="">
              <GoogleLoginButton />
            </div>
          </div>
          <footer className="bottom-5 absolute ">
            <p className="text-[#8d8d8d]">© 2023 TuneTown</p>
          </footer>
        </div>
        <div className="hidden xl:block xl:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            className="h-screen w-auto object-cover"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
