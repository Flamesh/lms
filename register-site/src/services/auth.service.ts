import axiosClient from "./axiosClient";
// import { IPassword } from 'views/admin/main/account/settings/components/Password';
import { REACT_APP_API_URL } from "../app-constants";

export enum LoginType {
  Normal = 0,
  Google = 1,
  Apple = 2,
}
export interface ILogin {
  username: string;
  password: string;
  loginType: LoginType;
}

export interface ILoginSocial {
  idToken: string;
  loginType: LoginType;
}

export const login = async (data: ILogin) => {
  const { username, password } = data;
  const url = REACT_APP_API_URL + "api/login";
  const res = await axiosClient.post(url, {
    username,
    password,
  });
  if (res?.data) {
    if (res.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(res.data));
    }
    return res.data;
  }
};

export const loginByGoogle = async (data: ILoginSocial) => {
  const { loginType, idToken } = data;
  const url = REACT_APP_API_URL + "api/login";
  const res = await axiosClient.post(url, {
    idToken,
    loginType,
  });
  if (res?.data) {
    if (res.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(res.data));
    }
    return res.data;
  }
}

export const loginByApple = async (data: ILoginSocial) => { 
  const { loginType, idToken } = data;
  const url = REACT_APP_API_URL + "api/login";
  const res = await axiosClient.post(url, {
    idToken,
    loginType,
  });
  if (res?.data) {
    if (res.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(res.data));
    }
    return res.data;
  }
}
const api_url = process.env.REACT_APP_API_URL;
interface IRegister {
  username: string;
  password: string;
  email: string;
  program_name: string;
}

export const registerApi = async (data: IRegister) => {
  const response = await axiosClient.post(
		api_url + "/api/method/lms.lms.custom_api.sign_up.sign_up.signup_student",
		data
	);
  return response?.data;
}