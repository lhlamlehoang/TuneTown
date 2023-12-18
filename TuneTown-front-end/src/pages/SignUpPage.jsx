/* eslint-disable no-unused-vars */
import { DatePicker, Form, Input, message } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UseCookie from "../hooks/useCookie";
import { Base_URL } from "../api/config";

const SignUpPage = () => {
  // Fetch data from API
  const [data, setData] = useState([]);
  const [errorDetail, setErrorDetail] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const passwordRef = useRef();
  const repasswordRef = useRef();
  const navigate = useNavigate();
  const { removeToken } = UseCookie();

  async function PostData(usn, email, password, bdate, method) {
    try {
      const response = await axios.post(`${Base_URL}/auth/register`, {
        userName: usn,
        email: email,
        password: password,
        birthDate: bdate,
        method: "REGISTER",
      });
      setData(response.data);
      if (response.data) {
        messageApi.open({
          type: "success",
          content: "Sign Up Successfully",
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
      console.log("Respone Data Sign Up", response.data);
    } catch (error) {
      console.log("Error Post Data function:", error);
      const errorName = error.response.data.detail;
      setErrorDetail(errorName);
      messageApi.open({
        type: "error",
        content: errorName,
        duration: 1,
      });
      throw error;
    }
  }

  // post data to API
  const onFinish = (values) => {
    console.log("Data inputed:", values);
    const { username, email, password, birthDate, method } = values;

    PostData(username, email, password, birthDate, method);
  };
  // const onCheckPassword = () => {
  //   const password = passwordRef.current.value;
  //   const repassword = repasswordRef.current.value;
  //   if (password !== repassword) {
  //     messageApi.open({
  //       type: "error",
  //       content: "Password not match",
  //       duration: 1,
  //     });
  //   }
  // };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    removeToken();
  }, []);
  return (
    <div className="flex flex-col justify-center bg-[#FFFFFFCC]">
      {contextHolder}
      <div className="flex flex-row flex-1 relative">
        <div className="hidden xl:block xl:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            className="h-screen w-auto object-cover"
            alt=""
          />
        </div>

        <div className="flex flex-col justify-center items-center min-h-screen xl:w-1/2">
          <div className="mb-20">
            <h1 className="font-bold text-[#2E3271] text-3xl">Sign up</h1>
          </div>
          <Form
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
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Birthday"
              name="birthDate"
              rules={[
                { required: true, message: "Please input your date of birth!" },
              ]}
            >
              <DatePicker />
            </Form.Item>
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
              <Input.Password ref={passwordRef} />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            ></Form.Item>

            <Form.Item
              className="flex flex-row justify-center items-center"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <button className="bg-[#38a870] text-white hover:bg-[#54ce91] hover:text-[#fff] py-2 px-3 w-max rounded-lg font-semibold">
                Sign Up
              </button>
            </Form.Item>
          </Form>
          <div>
            <p className="text-[#2E3271]">
              Have an account?
              <NavLink to="/" className="text-[#34a56d] ml-1 text-sm">
                Login
              </NavLink>
            </p>
          </div>
          <footer className="bottom-5 absolute ">
            <p className="text-[#8d8d8d]">© 2023 TuneTown</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
