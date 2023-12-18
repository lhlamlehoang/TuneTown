import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { Base_URL } from "../../../api/config";
import axios from "axios";
import UseCookie from "../../../hooks/useCookie";
import { useEffect, useState } from "react";
import EditUserForm from "../../Users/EditUserForm";
import defaultAva from "../../../assets/img/logo/logo.png";
import { useForm } from "antd/es/form/Form";
/* eslint-disable no-unused-vars */
const UserManagement = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [formRole] = useForm();
  const [userList, setUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [userId, setUserId] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [refresh, setRefresh] = useState(false);
  const handSearch = (e) => {
    console.log("value", e.target.value);
    setSearchValue(e.target.value);
  };
  // Call this function when you want to refresh the playlist
  const showModalEdit = (id) => {
    setIsModalOpen(true);
    setUserId(id);
    console.log("id", id);
  };
  const showModalEditRole = (id, role) => {
    setIsModalOpenUpdate(true);
    setUserId(id);
    // set value for the field
    formRole.setFieldsValue({
      role: role,
    });
    console.log("id", id);
  };
  const handleOkRole = () => {
    changeUserRole(userId, formRole.getFieldValue("role"));
    setIsModalOpenUpdate(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenUpdate(false);
  };

  // Change user role by API
  const changeUserRole = async (userId, role) => {
    try {
      const response = await axios.put(
        `${Base_URL}/users/switchUserRole`,
        {
          id: userId,
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("changeUserRole Response", response.data);
      if (response.status === 200) {
        // Return a success flag or any relevant data
        message.success("Change role successfully");
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.log("Error:", error);
      message.error("Change role failed");
      return { success: false, error: error.message };
    }
  };

  // http://localhost:8080/users
  const GetListUser = async () => {
    try {
      console.log("auth", access_token);
      const response = await axios.get(`${Base_URL}/users`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log("UserList Response", response.data.users);
      setUserList(response.data.users);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  // Delete User
  const deleteUser = async (userId) => {
    try {
      if (confirm(`Are you sure you want to delete this User?`) == true) {
        const response = await axios.delete(
          `${Base_URL}/users?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (response.status === 200) {
          message.success("Delete User successfully!");
        }
        // Refresh the component
        setRefresh(false);
        return response.status;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  // Data Test
  // const data = [
  //   {
  //     id: 1,
  //     userName: null,
  //     email: "nam@gmail.com",
  //     password: "$2a$10$N6GkJoW2TfhsSRAW4Z4csOtYLFfGdQcJI0kETDFgrIdP.PEgBjMf.",
  //     role: "USER",
  //     birthDate: "2023-10-23",
  //     userBio: null,
  //     avatar:
  //       "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Flogo.png?alt=media&token=bf46ca20-ec6b-42b6-a330-a77663b450de",
  //     history: [],
  //     favoriteGenres: [],
  //     followingArtists: [],
  //   },
  //   {
  //     id: 2,
  //     userName: null,
  //     email: "test3@gmail.com",
  //     password: "$2a$10$GGZ1GbbSI5a.Ns0OHR.BM.L/U9UHl7BhxhUmRPvOPMU3ZOjiyDAJm",
  //     role: "USER",
  //     birthDate: "2000-08-01",
  //     userBio: null,
  //     avatar: null,
  //     history: [],
  //     favoriteGenres: [],
  //     followingArtists: [],
  //   },
  //   {
  //     id: 504,
  //     userName: "Nguyen Hoang Nhan",
  //     email: "nguyen.hngnhan21@gmail.com",
  //     password: "$2a$10$JUp.tzHb6H816tt1IyICe.hNisd/93uJQPI0LN1PXeorOv/njV.ay",
  //     role: "ARTIST",
  //     birthDate: "2002-07-21",
  //     userBio: null,
  //     avatar: null,
  //     history: [],
  //     favoriteGenres: [],
  //     followingArtists: [],
  //   },
  //   {
  //     id: 505,
  //     userName: "Nguyen Hoang Nhan",
  //     email: "test@gmail.com",
  //     password: "$2a$10$biLULL30K.AT7PFGM3in3OBAfP0HiYClyYOwtxNuNWAwvhv06S10.",
  //     role: "ADMIN",
  //     birthDate: "2002-07-21",
  //     userBio: "asds",
  //     avatar: null,
  //     history: [],
  //     favoriteGenres: [],
  //     followingArtists: [],
  //   },
  // ];
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (avatar) => {
        return (
          <img
            src={avatar ? avatar : defaultAva}
            alt="avatar"
            className="w-11 h-11 rounded-full object-cover"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      align: "center",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Bio",
      dataIndex: "userBio",
      key: "userBio",
      align: "center",
    },
    {
      title: "Birthday",
      dataIndex: "birthDate",
      key: "birthDate",
      align: "center",
      render: (birthDate) => {
        const date = new Date(birthDate);
        return (
          <div>
            {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
          </div>
        );
      },
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      align: "center",
      render: (role) => {
        let color = role.length > 5 ? "geekblue" : "green";
        if (role.toLowerCase() === "user") {
          color = "green";
        }
        if (role.toLowerCase() === "artist") {
          color = "purple";
        }
        if (role.toLowerCase() === "admin") {
          color = "red"; // Correct the color value
        }
        return (
          <Tag color={color} key={role}>
            {role.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space
          size="middle"
          className="
        flex flex-row gap-2
        "
        >
          <button
            className="py-1 px-2 h-8 w-14 bg-[#2e9b42db] hover:bg-[#47c053] text-white rounded-lg"
            onClick={() => showModalEdit(record.id)}
          >
            Edit
          </button>
          <button
            className="py-1 px-2 h-8 w-full border border-solid border-[#955ec9] hover:bg-[#6947c0] hover:text-white rounded-lg"
            onClick={() => showModalEditRole(record.id, record.role)}
          >
            Role
          </button>
          <button
            className="py-1 px-2 h-8 w-14 bg-[#c42323e1] hover:bg-[#ea3f3f] text-white rounded-lg"
            onClick={() => deleteUser(record.id)}
          >
            Delete
          </button>
        </Space>
      ),
    },
    {},
  ];
  useEffect(() => {
    setRefresh(true);
    GetListUser();
  }, [isModalOpen, isModalOpenUpdate, refresh]);
  return (
    <div>
      <div className="text-2xl font-bold">User Management</div>
      <div className=" flex flex-col gap-3">
        <div className=" flex flex-row justify-between mb-5 mt-5">
          <div className="">
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              layout="inline"
              initialValues={{
                remember: true,
              }}
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="" name="userName" className="">
                <Input placeholder="Search User Name" onChange={handSearch} />
              </Form.Item>
            </Form>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={
            searchValue
              ? userList.filter((user) =>
                  user.userName
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                )
              : userList
          }
          pagination={{ pageSize: 8 }}
        />
        <Modal
          title="Edit User"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[]}
        >
          <EditUserForm editUserId={userId} isAdmin={true}></EditUserForm>
        </Modal>
        <Modal
          title="Edit User Role"
          open={isModalOpenUpdate}
          onCancel={handleCancel}
          centered
          footer={[]}
        >
          <Form form={formRole}>
            <Form.Item label="Role" name="role">
              <Select
                placeholder="Role"
                options={[
                  { label: "USER", value: "USER" },
                  { label: "ARTIST", value: "ARTIST" },
                  { label: "ADMIN", value: "ADMIN" },
                ]}
              />
            </Form.Item>
            <Form.Item className="right-0">
              <Button type="default" htmlType="submit" onClick={handleOkRole}>
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
