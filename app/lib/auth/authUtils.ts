import { API_URL } from "../api/settings";
import { makeOptions, handleHttpErrors } from "../api/utils/fetchUtils";
import { LoginResponse, RegisterRequest, RegisterResponse } from "./types";
import { LoginRequest } from "./types";
const LOGIN_URL = API_URL + "/auth/login";
const REGISTER_URL = API_URL + "/auth/register";


export const authProvider = {
  isAuthenticated: false,
  async signIn(user_: LoginRequest): Promise<LoginResponse> {
    const options = await makeOptions("POST", user_);
    const res = await fetch(LOGIN_URL, options);
      return handleHttpErrors(res);
  },

  async register(user_: RegisterRequest): Promise<RegisterResponse> {
    const options = await makeOptions("POST", user_);
    const res = await fetch(REGISTER_URL, options);
    return handleHttpErrors(res);
  }
};


