import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Base_URL } from "../../api/config";
import { Button, DatePicker, Form, Input, message } from "antd";
import UseCookie from "../../hooks/useCookie";
import UploadAvatar from "./UploadAvatar";
import dayjs from "dayjs";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

// eslint-disable-next-line react/prop-types
const EditUserForm = ({ editUserId, isAdmin }) => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const userId = editUserId || localStorage.getItem("userId");
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [userInfor, setUserInfor] = useState({});
  const [fileIMG, setFileIMG] = useState();

  // Get user information from API
  const getUserInfor = async () => {
    try {
      const response = await axios.get(`${Base_URL}/users?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log(response.data, response.status);
      setUserInfor(response.data.user);
      // setUserName(response.data.user.userName);
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
    }
  };

  // Update user infor to API
  const editUser = async (values) => {
    try {
      const response = await axios.put(`${Base_URL}/users`, values, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (response.status === 200) {
        // Handle success
        console.log("User edited successfully:", response.data);
        message.success("User edited successfully");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
      message.error(`Error edited user ${error.message}`);
    }
  };

  const onFinish = (values) => {
    console.log("Received values:", values);
    console.log("FileIMG", fileIMG);
    // Value in Inpurt
    const { userName, userBio, email, birthDate } = values;
    if (fileIMG === null || fileIMG === undefined) {
      message.error("Please upload jpg, jpeg or png");
      return;
    }
    const postData = {
      id: userId,
      avatar: fileIMG,
      userName: userName,
      userBio: userBio,
      email: email,
      birthDate: birthDate.format("YYYY-MM-DD"),
    };
    console.log("Token", access_token);
    console.log("Posting Data", postData);
    editUser(postData); // Call the function to post the song data
  };

  //Upload

  useEffect(() => {
    if (access_token == null) {
      window.location.href = "/";
    }
    getUserInfor();
    form.setFieldsValue({
      userName: userInfor.userName,
      email: userInfor.email,
      ...(userInfor.birthDate && { birthDate: dayjs(userInfor.birthDate) }),
      userBio: userInfor.userBio,
    });

    console.log("userName", userInfor);
  }, [
    access_token,
    userInfor.userName,
    userInfor.email,
    userInfor.userBio,
    editUserId,
    userId,
  ]);
  return (
    <section
      className={`${
        isAdmin ? "justify-center" : " pt-10 w-full min-h-screen"
      } relative flex flex-col  items-center bg-[#ecf2fd]`}
    >
      <Form
        {...layout}
        ref={formRef}
        name="control-ref"
        form={form}
        onFinish={onFinish}
        className={`relative  border ${
          isAdmin ? "mx-auto w-full rounded-md" : ""
        } p-5 bg-[#f9f9f9]`}
      >
        <div className="w-full text-center mb-5">
          <h2 className="text-3xl uppercase font-monserrat font-bold text-[#312f2f]">
            Edit User Information
          </h2>
        </div>
        {/* Avatar Image */}
        <Form.Item
          name="avatar"
          label="Upload Avatar"
          valuePropName="fileList"
          extra="Upload your cover image png, jpg, jpeg"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <UploadAvatar
            setFileIMG={setFileIMG}
            accept="image/jpeg, image/png"
          ></UploadAvatar>
        </Form.Item>
        <Form.Item
          name="userName"
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
          // initialValue={userInfor.userName}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="userBio"
          label="Bio"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
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

        <Form.Item {...tailLayout} className="left-0">
          <Button type="primary" htmlType="submit" className="bg-[green] ">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default EditUserForm;
