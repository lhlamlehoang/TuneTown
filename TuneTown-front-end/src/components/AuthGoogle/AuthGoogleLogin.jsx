import axios from "axios";
import { Base_URL } from "../../api/config";
import { useNavigate } from "react-router-dom";
import UseCookie from "../../hooks/useCookie";
import { useDispatch } from "react-redux";
import { setUserInfor } from "../../redux/slice/account";
import { message } from "antd";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { cliendId } from "../../api/config";
import { jwtDecode } from "jwt-decode";

function LoginGoogle() {
  const { saveToken } = UseCookie();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const handleUserData = async (usersData) => {
    console.log("Data", usersData);
    dispatch(setUserInfor(usersData));
    localStorage.setItem("userId", usersData.id);
    localStorage.setItem("userName", usersData.userName);
    localStorage.setItem("userRole", usersData.role);
    console.log("User infor", usersData);
  };

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
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  }

  async function Register(usn, email, password, avatar) {
    try {
      await axios.post(`${Base_URL}/auth/register`, {
        userName: usn,
        email: email,
        password: password,
        avatar: avatar,
        method: "GOOGLE",
      });
    } catch (error) {
      console.log("Error Post Data function:", error);
      throw error;
    }
  }

  // Check email
  async function checkEmailExisted(userEmail) {
    const response = await axios.post(
      `${Base_URL}/auth/checkEmailExisted?userEmail=${userEmail}`
    );
    return response.data;
  }

  // Edit user to update avatar and name from google to the header
  async function editUser(values, access_token) {
    try {
      const response = await axios.put(
        `${Base_URL}/users`,
        {
          id: userId,
          userName: values.name,
          avatar: values.picture,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("editUser", response.data, response.status);
    } catch (error) {
      console.error("Error update user:", error.message);
    }
  }

  const onSuccess = async (res) => {
    console.log("Login Success: currentUser:", res);
    const account = jwtDecode(res.credential);
    console.log("value", account);
    // const values = res.profileObj;
    const isEmailExisted = await checkEmailExisted(account.email);
    if (!isEmailExisted) {
      await Register(account.name, account.email, "GOOGLE", account.picture);
    }
    const getAccessToken = await GetAccessToken(account.email, "GOOGLE");
    // await editUser(account, getAccessToken.access_token);
    message.success("Login Successfully");
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };
  const onFailure = (res) => {
    console.log("Login failed! res:", res);
    message.error("Login Failed");
  };

  return (
    <div id="btn-auth-google-login" className="rounded-lg px-2 py-1">
      <GoogleOAuthProvider clientId={cliendId}>
        <GoogleLogin onSuccess={onSuccess} locale="en" onFailure={onFailure} />
      </GoogleOAuthProvider>
    </div>
  );
}

export default LoginGoogle;
