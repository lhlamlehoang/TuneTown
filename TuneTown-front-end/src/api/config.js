import UseCookie from "../hooks/useCookie";
import axios from "axios";
const { getToken } = UseCookie();

export const Base_URL = "https://tunetown-production.up.railway.app";
export const Base_Ava =
  "https://i.pinimg.com/564x/08/e4/58/08e458a736a3c0365612771772fa4904.jpg";
// token return an object {access_token, refress_Token}
export const cliendId =
  "295516651084-5baqm2houfs6u6voha4a8s66j8ga6fru.apps.googleusercontent.com";
const token = getToken();
export const auth = {
  access_token: token.access_token,
  refresh_token: token.refresh_token,
};

export const instance = axios.create({
  Base_URL,
  headers: {
    "Content-Type": "application/json",
  },
  params: {},
});
instance.interceptors.response.use(
  function (response) {
    if (response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
